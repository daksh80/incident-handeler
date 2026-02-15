const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, '..', 'data', 'incidents.db');
const db = new Database(dbPath);

app.use(cors());
app.use(express.json());

const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];
const SERVICES = ['Backend', 'Frontend', 'Auth', 'Payments', 'Database', 'Infrastructure', 'Security'];

function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      service TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      owner TEXT,
      summary TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_incidents_createdAt ON incidents(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
    CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
    CREATE INDEX IF NOT EXISTS idx_incidents_service ON incidents(service);
    CREATE INDEX IF NOT EXISTS idx_incidents_title ON incidents(title);
  `);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function seedIncidentsIfNeeded() {
  const count = db.prepare('SELECT COUNT(*) as count FROM incidents').get().count;
  if (count >= 200) {
    return;
  }

  const now = Date.now();
  const insert = db.prepare(`
    INSERT INTO incidents (title, service, severity, status, owner, summary, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const titles = [
    'API timeout spikes',
    'Checkout failure',
    'Login service degraded',
    'Dashboard render issue',
    'Database replica lag',
    'Worker queue backlog',
    'Webhook delivery delay',
    'Auth token validation failure',
    'Search latency increase',
    'Payment retries elevated'
  ];

  const owners = ['alice@team.com', 'bob@team.com', 'charlie@team.com', 'ops@team.com', 'sre@team.com', null];

  const tx = db.transaction(() => {
    for (let i = count + 1; i <= 220; i += 1) {
      const dayOffset = randomInt(0, 120);
      const ts = new Date(now - dayOffset * 24 * 60 * 60 * 1000);
      const iso = ts.toISOString();
      const title = `${titles[randomInt(0, titles.length - 1)]} #${i}`;
      const service = SERVICES[randomInt(0, SERVICES.length - 1)];
      const severity = SEVERITIES[randomInt(0, SEVERITIES.length - 1)];
      const status = STATUSES[randomInt(0, STATUSES.length - 1)];
      const owner = owners[randomInt(0, owners.length - 1)];
      const summary = `Auto-seeded incident ${i} for ${service}.`;

      insert.run(title, service, severity, status, owner, summary, iso, iso);
    }
  });

  tx();
}

function mapIncidentRow(row) {
  return {
    id: String(row.id),
    title: row.title,
    service: row.service,
    severity: row.severity,
    status: row.status,
    owner: row.owner,
    summary: row.summary,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function validateCreatePayload(body) {
  const errors = [];
  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    errors.push('title is required');
  }
  if (!body.service || typeof body.service !== 'string' || !body.service.trim()) {
    errors.push('service is required');
  }
  if (!SEVERITIES.includes(body.severity)) {
    errors.push('severity must be one of SEV1-SEV4');
  }
  if (!STATUSES.includes(body.status)) {
    errors.push('status must be one of OPEN, MITIGATED, RESOLVED');
  }
  return errors;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/incidents', (req, res) => {
  const errors = validateCreatePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation error', errors });
  }

  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO incidents (title, service, severity, status, owner, summary, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    req.body.title.trim(),
    req.body.service.trim(),
    req.body.severity,
    req.body.status,
    req.body.owner?.trim() || null,
    req.body.summary?.trim() || null,
    now,
    now
  );

  const created = db.prepare('SELECT * FROM incidents WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(mapIncidentRow(created));
});

app.get('/api/incidents', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const search = (req.query.search || '').toString().trim();
  const status = (req.query.status || '').toString().trim();
  const severity = (req.query.severity || '').toString().trim();
  const service = (req.query.service || '').toString().trim();

  const sortableColumns = new Set(['createdAt', 'updatedAt', 'severity', 'status', 'title', 'service']);
  const sortBy = sortableColumns.has(req.query.sortBy) ? req.query.sortBy : 'createdAt';
  const order = (req.query.order || 'desc').toString().toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const whereClauses = [];
  const params = {};

  if (search) {
    whereClauses.push("(title LIKE @search OR service LIKE @search OR IFNULL(owner, '') LIKE @search)");
    params.search = `%${search}%`;
  }
  if (status) {
    whereClauses.push('status = @status');
    params.status = status;
  }
  if (severity) {
    whereClauses.push('severity = @severity');
    params.severity = severity;
  }
  if (service) {
    whereClauses.push('service = @service');
    params.service = service;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const totalQuery = `SELECT COUNT(*) as count FROM incidents ${whereSql}`;
  const total = db.prepare(totalQuery).get(params).count;

  const listQuery = `
    SELECT * FROM incidents
    ${whereSql}
    ORDER BY ${sortBy} ${order}
    LIMIT @limit OFFSET @offset
  `;

  const rows = db.prepare(listQuery).all({ ...params, limit, offset });

  return res.json({
    data: rows.map(mapIncidentRow),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  });
});

app.get('/api/incidents/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const row = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
  if (!row) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  return res.json(mapIncidentRow(row));
});

app.patch('/api/incidents/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const existing = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ message: 'Incident not found' });
  }

  const updates = [];
  const params = { id };

  if (typeof req.body.title === 'string' && req.body.title.trim()) {
    updates.push('title = @title');
    params.title = req.body.title.trim();
  }
  if (typeof req.body.service === 'string' && req.body.service.trim()) {
    updates.push('service = @service');
    params.service = req.body.service.trim();
  }
  if (typeof req.body.severity === 'string') {
    if (!SEVERITIES.includes(req.body.severity)) {
      return res.status(400).json({ message: 'Invalid severity' });
    }
    updates.push('severity = @severity');
    params.severity = req.body.severity;
  }
  if (typeof req.body.status === 'string') {
    if (!STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    updates.push('status = @status');
    params.status = req.body.status;
  }
  if (req.body.owner === null || typeof req.body.owner === 'string') {
    updates.push('owner = @owner');
    params.owner = req.body.owner?.trim() || null;
  }
  if (req.body.summary === null || typeof req.body.summary === 'string') {
    updates.push('summary = @summary');
    params.summary = req.body.summary?.trim() || null;
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  params.updatedAt = new Date().toISOString();
  updates.push('updatedAt = @updatedAt');

  const query = `UPDATE incidents SET ${updates.join(', ')} WHERE id = @id`;
  db.prepare(query).run(params);

  const updated = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
  return res.json(mapIncidentRow(updated));
});

runMigrations();
seedIncidentsIfNeeded();

app.listen(PORT, () => {
  console.log(`Incident API running on http://localhost:${PORT}`);
});
