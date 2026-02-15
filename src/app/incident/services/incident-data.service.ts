import { Injectable } from '@angular/core';
import { INCIDENT_MOCK_DATA } from '../constants/incident-mock.constants';
import { Incident } from '../models/incident.model';
import { IncidentUiService } from './incident-ui.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentDataService {
  private readonly incidents: Incident[] = INCIDENT_MOCK_DATA.map((incident) => ({ ...incident }));

  constructor(private readonly incidentUiService: IncidentUiService) {}

  getIncidents(): Incident[] {
    return this.incidents.map((incident) => ({ ...incident }));
  }

  getIncidentById(id: string): Incident | undefined {
    const incident = this.incidents.find((item) => item.id === id);
    return incident ? { ...incident } : undefined;
  }

  createIncident(incident: Incident): Incident {
    const nextId = String(this.incidents.length + 1);
    const today = new Date();
    const createdAt = this.incidentUiService.formatShortDate(today);
    const occurredAt = this.incidentUiService.formatLongDate(today);

    const newIncident: Incident = {
      ...incident,
      id: nextId,
      createdAt,
      occurredAt,
      owner: incident.assignedTo || 'unassigned'
    };

    this.incidents.unshift(newIncident);
    return { ...newIncident };
  }

  createNewIncidentDraft(): Incident {
    return this.incidentUiService.createIncidentDraft();
  }

  createEmptyIncident(): Incident {
    return {
      id: 'new',
      title: 'New Incident',
      service: 'Backend',
      severity: 'SEV3',
      status: 'Open',
      createdAt: '02/15/2026',
      occurredAt: 'February 15, 2026',
      owner: 'unassigned',
      assignedTo: '',
      summary: ''
    };
  }
}
