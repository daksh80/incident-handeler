import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Incident } from '../../models/incident.model';
import { IncidentApiService } from '../../services/incident-api.service';
import { IncidentUiService } from '../../services/incident-ui.service';

type SortBy = 'createdAt' | 'severity' | 'status' | 'title';

@Component({
  selector: 'app-incident-dashboard',
  templateUrl: './incident-dashboard.component.html',
  styleUrl: './incident-dashboard.component.scss',
  standalone: false
})
export class IncidentDashboardComponent implements OnInit, OnDestroy {
  handlers: Incident[] = [];

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  displayPages: number[] = [];

  searchText = '';
  selectedStatus = '';
  selectedServices: string[] = [];

  sortBy: SortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  isLoading = false;
  errorMessage = '';

  readonly statusOptions: string[];

  private readonly destroy$ = new Subject<void>();
  private readonly searchDebounce$ = new Subject<string>();

  constructor(
    private readonly incidentApiService: IncidentApiService,
    private readonly incidentUiService: IncidentUiService,
    private readonly router: Router
  ) {
    this.statusOptions = this.incidentUiService.statusOptions;
  }

  ngOnInit(): void {
    this.searchDebounce$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadIncidents();
      });

    this.loadIncidents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchTextChange(searchText: string): void {
    this.searchText = searchText;
    this.searchDebounce$.next(this.searchText.trim());
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }

  onServiceChange(services: string[]): void {
    this.selectedServices = services;
    this.currentPage = 1;
    this.loadIncidents();
  }

  onFilterClick(): void {
    this.currentPage = 1;
    this.loadIncidents();
  }

  onSortChanged(column: string): void {
    const sortColumn = this.normalizeSortColumn(column);
    if (!sortColumn) {
      return;
    }

    if (this.sortBy === sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortColumn;
      this.sortOrder = sortColumn === 'createdAt' ? 'desc' : 'asc';
    }

    this.loadIncidents();
  }

  onPageChanged(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadIncidents();
    }
  }

  onIncidentSelected(incidentId: string): void {
    this.router.navigate(['/incidents/incident-tracker', incidentId]);
  }

  private loadIncidents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.incidentApiService
      .getIncidents({
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchText.trim(),
        status: this.selectedStatus,
        severity: this.getSelectedSeverity(),
        sortBy: this.sortBy,
        order: this.sortOrder,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handlers = response.data;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.totalPages;
          this.displayPages = this.getPageRange();
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to load incidents. Ensure backend is running on port 3000.';
          this.handlers = [];
          this.totalItems = 0;
          this.totalPages = 1;
          this.displayPages = [1];
          this.isLoading = false;
        },
      });
  }

  private normalizeSortColumn(column: string): SortBy | null {
    if (column === 'createdAt' || column === 'severity' || column === 'status' || column === 'title') {
      return column;
    }

    return null;
  }

  private getSelectedSeverity(): string {
    const selectedSeverity = this.selectedServices.find((service) => /^SEV[1-4]$/.test(service));
    return selectedSeverity ?? '';
  }

  private getPageRange(): number[] {
    const pages: number[] = [];
    const maxPages = 3;
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, this.currentPage + 2);

    if (endPage - startPage < maxPages - 1) {
      if (startPage === 1) {
        endPage = Math.min(this.totalPages, startPage + maxPages - 1);
      } else {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return pages;
  }
}
