import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Incident } from '../models/incident.model';
import { IncidentApiRecord, IncidentListResponse } from '../models/incident-api.model';
import { IncidentUiService } from './incident-ui.service';
import { environment } from '../../../environments/environment';

interface IncidentQuery {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  severity?: string;
  service?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class IncidentApiService {
  private readonly apiBase = environment.apiBaseUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly incidentUiService: IncidentUiService
  ) {}

  getIncidents(query: IncidentQuery): Observable<{ data: Incident[]; pagination: IncidentListResponse['pagination'] }> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.limit)
      .set('sortBy', query.sortBy ?? 'createdAt')
      .set('order', query.order ?? 'desc');

    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.status) {
      params = params.set('status', query.status);
    }
    if (query.severity) {
      params = params.set('severity', query.severity);
    }
    if (query.service) {
      params = params.set('service', query.service);
    }

    return this.http
      .get<IncidentListResponse>(this.apiBase, { params })
      .pipe(map((response) => ({ data: response.data.map((item) => this.toIncident(item)), pagination: response.pagination })));
  }

  getIncidentById(id: string): Observable<Incident> {
    return this.http.get<IncidentApiRecord>(`${this.apiBase}/${id}`).pipe(map((record) => this.toIncident(record)));
  }

  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<IncidentApiRecord>(this.apiBase, this.toCreatePayload(incident)).pipe(map((record) => this.toIncident(record)));
  }

  updateIncident(id: string, incident: Incident): Observable<Incident> {
    return this.http
      .patch<IncidentApiRecord>(`${this.apiBase}/${id}`, {
        title: incident.title,
        service: incident.service,
        severity: incident.severity,
        status: incident.status,
        owner: incident.assignedTo || null,
        summary: incident.summary || null
      })
      .pipe(map((record) => this.toIncident(record)));
  }

  private toIncident(record: IncidentApiRecord): Incident {
    const createdDate = new Date(record.createdAt);

    return {
      id: String(record.id),
      title: record.title,
      service: record.service,
      severity: record.severity,
      status: record.status,
      createdAt: this.incidentUiService.formatShortDate(createdDate),
      occurredAt: this.incidentUiService.formatLongDate(createdDate),
      owner: record.owner ?? 'unassigned',
      assignedTo: record.owner ?? '',
      summary: record.summary ?? ''
    };
  }

  private toCreatePayload(incident: Incident) {
    return {
      title: incident.title,
      service: incident.service,
      severity: incident.severity,
      status: incident.status,
      owner: incident.assignedTo || null,
      summary: incident.summary || null
    };
  }
}
