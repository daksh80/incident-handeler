import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Incident } from '../../models/incident.model';
import { IncidentDataService } from '../../services/incident-data.service';

export type Handler = Incident;

@Component({
  selector: 'app-handel-list',
  templateUrl: './handel-list.component.html',
  styleUrl: './handel-list.component.scss',
})
export class HandelListComponent implements OnInit {
  handlers: Handler[] = [];
  filteredHandlers: Handler[] = [];
  allHandlers: Handler[] = [];

  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  displayPages: number[] = [];

  searchText = '';
  selectedStatus = '';

  constructor(
    private readonly incidentDataService: IncidentDataService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    this.allHandlers = this.incidentDataService.getIncidents();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allHandlers];

    if (this.selectedStatus) {
      filtered = filtered.filter((handler) => handler.status === this.selectedStatus);
    }

    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (handler) =>
          handler.title.toLowerCase().includes(searchLower) ||
          handler.service.toLowerCase().includes(searchLower) ||
          handler.owner.toLowerCase().includes(searchLower)
      );
    }

    this.filteredHandlers = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
    this.calculatePagination();
    this.updatePageData();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.displayPages = this.getPageRange();
  }

  getPageRange(): number[] {
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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  updatePageData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.handlers = this.filteredHandlers.slice(startIndex, endIndex);
    this.calculatePagination();
  }

  onFilter(): void {
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageData();
    }
  }

  openIncident(incidentId: string): void {
    this.router.navigate(['/incidents/incident-tracker', incidentId]);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\//g, '').replace(/\s+/g, '');
  }
}
