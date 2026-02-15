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

  readonly severityOptions: string[] = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
  readonly statusOptions: string[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly incidentDataService: IncidentDataService
  ) {}

  ngOnInit(): void {
    const incidentId = this.route.snapshot.paramMap.get('id');

    if (!incidentId || incidentId === 'new') {
      this.incident = this.incidentDataService.createEmptyIncident();
      return;
    }

    this.incident =
      this.incidentDataService.getIncidentById(incidentId) ??
      this.incidentDataService.createEmptyIncident();
  }

  saveChanges(): void {
    this.router.navigate(['/incidents/incident-dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/incidents/incident-dashboard']);
  }
}
