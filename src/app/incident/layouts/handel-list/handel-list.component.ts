import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Incident } from '../../models/incident.model';
import { IncidentApiService } from '../../services/incident-api.service';

export type Handler = Incident;

type SortBy = 'createdAt' | 'severity' | 'status' | 'title';

@Component({
  selector: 'app-handel-list',
  templateUrl: './handel-list.component.html',
  styleUrl: './handel-list.component.scss',
})
export class HandelListComponent implements OnInit, OnDestroy {
  handlers: Handler[] = [];

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  displayPages: number[] = [];

  searchText = '';
  selectedStatus = '';
  selectedSeverity = '';
  readonly statusOptions = ['OPEN', 'MITIGATED', 'RESOLVED'];
  readonly severityOptions = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];

  sortBy: SortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  isLoading = false;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();
  private readonly searchDebounce$ = new Subject<string>();

  constructor(
    private readonly incidentApiService: IncidentApiService,
    private readonly router: Router
  ) {}

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

  onSearchChange(): void {
    this.searchDebounce$.next(this.searchText.trim());
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadIncidents();
  }

  onSort(column: SortBy): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = column === 'createdAt' ? 'desc' : 'asc';
    }

    this.loadIncidents();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadIncidents();
    }
  }

  openIncident(incidentId: string): void {
    this.router.navigate(['/incidents/incident-tracker', incidentId]);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\//g, '').replace(/\s+/g, '');
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
        severity: this.selectedSeverity,
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

  private getPageRange(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
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
