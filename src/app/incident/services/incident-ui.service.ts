import { Injectable } from '@angular/core';
import { Incident } from '../models/incident.model';
import {
  INCIDENT_DRAFT_TEMPLATE,
  INCIDENT_SEVERITY_OPTIONS,
  INCIDENT_SERVICE_OPTIONS,
  INCIDENT_STATUS_OPTIONS
} from '../constants/incident.constants';

@Injectable({
  providedIn: 'root'
})
export class IncidentUiService {
  readonly serviceOptions: string[] = INCIDENT_SERVICE_OPTIONS;
  readonly severityOptions: string[] = INCIDENT_SEVERITY_OPTIONS;
  readonly statusOptions: string[] = INCIDENT_STATUS_OPTIONS;

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\//g, '').replace(/\s+/g, '');
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  formatShortDate(date: Date): string {
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  formatLongDate(date: Date): string {
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  createIncidentDraft(): Incident {
    return { ...INCIDENT_DRAFT_TEMPLATE };
  }
}
