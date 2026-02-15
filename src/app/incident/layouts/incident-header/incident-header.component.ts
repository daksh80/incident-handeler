import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incident-header',
  templateUrl: './incident-header.component.html',
  styleUrl: './incident-header.component.scss',
  standalone: false
})
export class IncidentHeaderComponent {
  @Input() title = 'Incident Management';
  @Input() showActions = true;

  constructor(private readonly router: Router) {}

  onOptionSelected(option: string): void {
    if (option === 'Create Incident') {
      this.router.navigate(['/incidents/incident-tracker/new']);
    }
  }

}
