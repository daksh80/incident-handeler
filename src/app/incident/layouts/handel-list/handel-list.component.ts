import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Incident } from '../../models/incident.model';
import { IncidentUiService } from '../../services/incident-ui.service';

export type Handler = Incident;

@Component({
  selector: 'app-handel-list',
  templateUrl: './handel-list.component.html',
  styleUrl: './handel-list.component.scss',
})
export class HandelListComponent {
  @Input() handlers: Handler[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() displayPages: number[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() searchText = '';
  @Input() selectedStatus = '';
  @Input() statusOptions: string[] = [];

  @Output() searchTextChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() filterClicked = new EventEmitter<void>();
  @Output() sortChanged = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() incidentSelected = new EventEmitter<string>();

  constructor(private readonly incidentUiService: IncidentUiService) {}

  onSearchChange(value: string): void {
    this.searchTextChange.emit(value);
  }

  onStatusChange(value: string): void {
    this.statusChange.emit(value);
  }

  onFilterClick(): void {
    this.filterClicked.emit();
  }

  onSort(column: string): void {
    this.sortChanged.emit(column);
  }

  onGoToPage(page: number): void {
    this.pageChanged.emit(page);
  }

  onOpenIncident(incidentId: string): void {
    this.incidentSelected.emit(incidentId);
  }

  getStatusClass(status: string): string {
    return this.incidentUiService.getStatusClass(status);
  }

  getStatusLabel(status: string): string {
    return this.incidentUiService.getStatusLabel(status);
  }
}
