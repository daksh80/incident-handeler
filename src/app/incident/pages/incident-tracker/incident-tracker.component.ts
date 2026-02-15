import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Incident } from '../../models/incident.model';
import { IncidentFieldChangeEvent } from '../../layouts/incident-create-form/incident-create-form.component';
import { IncidentApiService } from '../../services/incident-api.service';

@Component({
  selector: 'app-incident-tracker',
  templateUrl: './incident-tracker.component.html',
  styleUrl: './incident-tracker.component.scss'
})
export class IncidentTrackerComponent implements OnInit {
  incident: Incident = {
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
  isCreateMode = false;

  readonly serviceOptions: string[] = ['Backend', 'Auth', 'Payments', 'Frontend', 'Database', 'Services', 'Infrastructure', 'Security'];
  readonly severityOptions: string[] = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
  readonly statusOptions: string[] = ['OPEN', 'MITIGATED', 'RESOLVED'];
  errorMessage = '';
  private incidentId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly incidentApiService: IncidentApiService
  ) {}

  ngOnInit(): void {
    const incidentId = this.route.snapshot.paramMap.get('id');
    const resolvedIncidentId = incidentId ?? '';
    const currentPath = this.route.snapshot.routeConfig?.path ?? '';
    this.isCreateMode = currentPath === 'incident-tracker/new' || resolvedIncidentId === 'new';

    if (this.isCreateMode) {
      this.incident = this.createIncidentDraft();
      return;
    }

    this.incidentId = resolvedIncidentId;
    this.loadIncidentById(resolvedIncidentId);
  }

  get isCreateFormValid(): boolean {
    if (!this.isCreateMode) {
      return true;
    }

    return Boolean(this.incident.title.trim() && this.incident.service && this.incident.status);
  }

  onDraftFieldChange(event: IncidentFieldChangeEvent): void {
    this.incident = { ...this.incident, [event.field]: event.value };
  }

  createIncident(): void {
    if (!this.isCreateFormValid) {
      return;
    }

    this.incidentApiService.createIncident(this.incident).subscribe({
      next: () => {
        this.router.navigate(['/incidents/incident-dashboard']);
      },
      error: () => {
        this.errorMessage = 'Unable to create incident. Please verify backend is running.';
      }
    });
  }

  saveChanges(): void {
    this.incidentApiService.updateIncident(this.incidentId, this.incident).subscribe({
      next: () => {
        this.router.navigate(['/incidents/incident-dashboard']);
      },
      error: () => {
        this.errorMessage = 'Unable to update incident. Please verify backend is running.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/incidents/incident-dashboard']);
  }

  private loadIncidentById(id: string): void {
    this.incidentApiService.getIncidentById(id).subscribe({
      next: (incident) => {
        this.incident = incident;
      },
      error: () => {
        this.errorMessage = 'Unable to load incident details.';
        this.incident = this.createIncidentDraft();
      }
    });
  }

  private createIncidentDraft(): Incident {
    return {
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
  }
}
