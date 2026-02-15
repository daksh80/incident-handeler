import { Incident } from '../models/incident.model';

export const INCIDENT_SERVICE_OPTIONS: string[] = [
  'Backend',
  'Auth',
  'Payments',
  'Frontend',
  'Database',
  'Services',
  'Infrastructure',
  'Security'
];

export const INCIDENT_SEVERITY_OPTIONS: string[] = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];

export const INCIDENT_STATUS_OPTIONS: string[] = ['OPEN', 'MITIGATED', 'RESOLVED'];

export const INCIDENT_DRAFT_TEMPLATE: Incident = {
  id: 'new',
  title: '',
  service: '',
  severity: 'SEV1',
  status: 'OPEN',
  createdAt: '',
  occurredAt: '',
  owner: 'unassigned',
  assignedTo: '',
  summary: ''
};
