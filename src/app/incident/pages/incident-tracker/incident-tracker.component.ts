import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Incident } from '../../models/incident.model';
import { IncidentDataService } from '../../services/incident-data.service';

@Component({
  selector: 'app-incident-tracker',
  templateUrl: './incident-tracker.component.html',
  styleUrl: './incident-tracker.component.scss'
})
export class IncidentTrackerComponent implements OnInit {
  incident!: Incident;
  isCreateMode = false;

  readonly serviceOptions: string[] = ['Backend', 'Auth', 'Payments', 'Frontend', 'Database', 'Services', 'Infrastructure', 'Security'];
  readonly severityOptions: string[] = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
  readonly statusOptions: string[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly incidentDataService: IncidentDataService
  ) {}

  ngOnInit(): void {
    const incidentId = this.route.snapshot.paramMap.get('id');
    const resolvedIncidentId = incidentId ?? '';
    const currentPath = this.route.snapshot.routeConfig?.path ?? '';
    this.isCreateMode = currentPath === 'incident-tracker/new' || resolvedIncidentId === 'new';

    if (this.isCreateMode) {
      this.incident = this.incidentDataService.createNewIncidentDraft();
      return;
    }

    this.incident =
      this.incidentDataService.getIncidentById(resolvedIncidentId) ??
      this.incidentDataService.createEmptyIncident();
  }

  onIncidentDraftChange(updatedIncident: Incident): void {
    this.incident = updatedIncident;
  }

  createIncident(): void {
    this.incidentDataService.createIncident(this.incident);
    this.router.navigate(['/incidents/incident-dashboard']);
  }

  saveChanges(): void {
    this.router.navigate(['/incidents/incident-dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/incidents/incident-dashboard']);
  }
}
