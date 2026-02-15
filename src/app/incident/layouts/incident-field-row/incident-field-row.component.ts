import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-incident-field-row',
  templateUrl: './incident-field-row.component.html',
  styleUrl: './incident-field-row.component.scss'
})
export class IncidentFieldRowComponent {
  @Input({ required: true }) label!: string;
  @Input() stacked = false;
}
