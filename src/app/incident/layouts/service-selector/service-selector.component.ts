import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-service-selector',
  templateUrl: './service-selector.component.html',
  styleUrl: './service-selector.component.scss',
  standalone: false
})
export class ServiceSelectorComponent implements OnInit {
  @Input() selectedServices: string[] = [];
  @Output() serviceChange = new EventEmitter<string[]>();

  availableServices: string[] = ['SEV1', 'SERV', 'SEV2', 'SEV3', 'SEV4'];

  constructor() { }

  ngOnInit(): void {
  }

  onServiceChange(service: string): void {
    const index = this.selectedServices.indexOf(service);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
    this.serviceChange.emit(this.selectedServices);
  }

  isServiceSelected(service: string): boolean {
    return this.selectedServices.includes(service);
  }
}