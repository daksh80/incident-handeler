import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-incident-create-form',
  templateUrl: './incident-create-form.component.html',
  styleUrl: './incident-create-form.component.scss'
})
export class IncidentCreateFormComponent {
  @Input({ required: true }) incident!: Incident;
  @Input() serviceOptions: string[] = [];
  @Input() severityOptions: string[] = [];
  @Input() statusOptions: string[] = [];

  @Output() incidentChange = new EventEmitter<Incident>();
  @Output() createIncident = new EventEmitter<void>();
  @Output() cancelIncident = new EventEmitter<void>();

  get isFormValid(): boolean {
    return Boolean(this.incident.title.trim() && this.incident.service && this.incident.status);
  }

  updateField<K extends keyof Incident>(field: K, value: Incident[K]): void {
    this.incidentChange.emit({ ...this.incident, [field]: value });
  }

  onCreate(): void {
    if (!this.isFormValid) {
      return;
    }

    this.createIncident.emit();
  }

  onCancel(): void {
    this.cancelIncident.emit();
  }
}
