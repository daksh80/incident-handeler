import { Injectable } from '@angular/core';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentDataService {
  private readonly incidents: Incident[] = [
    {
      id: '1',
      title: 'Login Failure',
      service: 'Auth',
      severity: 'SEV2',
      status: 'Open',
      createdAt: '04/15/2024',
      occurredAt: 'April 15, 2024',
      owner: 'jason@tea...',
      assignedTo: 'jason@team',
      summary: 'Login requests are failing for a subset of users due to invalid session state.'
    },
    {
      id: '2',
      title: 'Payment Delay',
      service: 'Payments',
      severity: 'SEV2',
      status: 'In Progress',
      createdAt: '04/14/2024',
      occurredAt: 'April 14, 2024',
      owner: 'amy@team',
      assignedTo: 'amy@team',
      summary: 'Payment processing is delayed because of intermittent third-party gateway timeouts.'
    },
    {
      id: '3',
      title: 'API Timeout',
      service: 'Backend',
      severity: 'SEV1',
      status: 'Resolved',
      createdAt: '04/13/2024',
      occurredAt: 'April 13, 2024',
      owner: 'dev@team',
      assignedTo: 'dev@team',
      summary: 'API requests to the backend service were timing out, causing disruptions for users.'
    },
    {
      id: '4',
      title: 'UI Bug on Dashboard',
      service: 'Frontend',
      severity: 'SEV3',
      status: 'Open',
      createdAt: '04/12/2024',
      occurredAt: 'April 12, 2024',
      owner: '...',
      assignedTo: 'ui@team',
      summary: 'Widgets are overlapping on dashboard resize in tablet layouts.'
    },
    {
      id: '5',
      title: 'Database Issue',
      service: 'Database',
      severity: 'SEV2',
      status: 'Open',
      createdAt: '04/11/2024',
      occurredAt: 'April 11, 2024',
      owner: 'ops@team',
      assignedTo: 'ops@team',
      summary: 'Replica lag increased and caused stale reads for analytics queries.'
    },
    {
      id: '6',
      title: 'Email Service Down',
      service: 'Services',
      severity: 'SEV3',
      status: 'Resolved',
      createdAt: '04/10/2024',
      occurredAt: 'April 10, 2024',
      owner: 'infra@team',
      assignedTo: 'infra@team',
      summary: 'Outbound email jobs failed due to a misconfigured provider credential rotation.'
    },
    {
      id: '7',
      title: 'Memory Leak Detection',
      service: 'Backend',
      severity: 'SEV2',
      status: 'In Progress',
      createdAt: '04/09/2024',
      occurredAt: 'April 09, 2024',
      owner: 'dev@team',
      assignedTo: 'dev@team',
      summary: 'Memory utilization grows continuously in one API pod under heavy traffic.'
    },
    {
      id: '8',
      title: 'CDN Performance',
      service: 'Infrastructure',
      severity: 'SEV3',
      status: 'Open',
      createdAt: '04/08/2024',
      occurredAt: 'April 08, 2024',
      owner: 'ops@team',
      assignedTo: 'ops@team',
      summary: 'High edge latency observed in APAC due to missing cache rules.'
    },
    {
      id: '9',
      title: 'SSL Certificate Expiry',
      service: 'Security',
      severity: 'SEV1',
      status: 'Closed',
      createdAt: '04/07/2024',
      occurredAt: 'April 07, 2024',
      owner: 'security@team',
      assignedTo: 'security@team',
      summary: 'Certificate near-expiry alert triggered and was remediated with automated renewal.'
    },
    {
      id: '10',
      title: 'Cache Invalidation Issue',
      service: 'Backend',
      severity: 'SEV2',
      status: 'Resolved',
      createdAt: '04/06/2024',
      occurredAt: 'April 06, 2024',
      owner: 'dev@team',
      assignedTo: 'dev@team',
      summary: 'Stale content appeared after deploy because invalidation events were dropped.'
    }
  ];

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
    const createdAt = this.formatShortDate(today);
    const occurredAt = this.formatLongDate(today);

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
    return {
      id: 'new',
      title: '',
      service: '',
      severity: 'SEV1',
      status: '',
      createdAt: '',
      occurredAt: '',
      owner: 'unassigned',
      assignedTo: '',
      summary: ''
    };
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

  private formatShortDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  private formatLongDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
