import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Incident } from '../../models/incident.model';

export interface IncidentFieldChangeEvent {
  field: keyof Incident;
  value: string;
}

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
  @Input() disableCreate = false;

  @Output() fieldChange = new EventEmitter<IncidentFieldChangeEvent>();
  @Output() createClicked = new EventEmitter<void>();
  @Output() cancelClicked = new EventEmitter<void>();

  onFieldChange(field: keyof Incident, value: string): void {
    this.fieldChange.emit({ field, value });
  }

  onCreateClick(): void {
    this.createClicked.emit();
  }

  onCancelClick(): void {
    this.cancelClicked.emit();
  }
}
