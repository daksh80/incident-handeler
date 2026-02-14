import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface Handler {
  id?: string;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
  owner: string;
}

@Component({
  selector: 'app-handel-list',
  templateUrl: './handel-list.component.html',
  styleUrl: './handel-list.component.scss',
})
export class HandelListComponent implements OnInit {
  handlers: Handler[] = [];
  filteredHandlers: Handler[] = [];
  allHandlers: Handler[] = [];
  
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  displayPages: number[] = [];

  searchText: string = '';
  selectedStatus: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    this.allHandlers = [
      {
        id: '1',
        title: 'Login Failure',
        severity: 'Auth',
        status: 'Open',
        createdAt: '04/15/2024',
        owner: 'jason@tea...'
      },
      {
        id: '2',
        title: 'Payment Delay',
        severity: 'Payments',
        status: 'Miz/4',
        createdAt: '04/14/2024',
        owner: 'amy@team'
      },
      {
        id: '3',
        title: 'API Timeout',
        severity: 'Backend',
        status: 'Resolved',
        createdAt: '04/13/2024',
        owner: 'dev@team'
      },
      {
        id: '4',
        title: 'UI Bug on Dashboard',
        severity: 'Frontend',
        status: 'Open',
        createdAt: '04/12/2024',
        owner: '...'
      },
      {
        id: '5',
        title: 'Database Issue',
        severity: 'Database',
        status: 'Open',
        createdAt: '04/11/2024',
        owner: 'ops@team'
      },
      {
        id: '6',
        title: 'Email Service Down',
        severity: 'Services',
        status: 'Resolved',
        createdAt: '04/10/2024',
        owner: 'infra@team'
      },
      {
        id: '7',
        title: 'Memory Leak Detection',
        severity: 'Backend',
        status: 'In Progress',
        createdAt: '04/09/2024',
        owner: 'dev@team'
      },
      {
        id: '8',
        title: 'CDN Performance',
        severity: 'Infrastructure',
        status: 'Open',
        createdAt: '04/08/2024',
        owner: 'ops@team'
      },
      {
        id: '9',
        title: 'SSL Certificate Expiry',
        severity: 'Security',
        status: 'Closed',
        createdAt: '04/07/2024',
        owner: 'security@team'
      },
      {
        id: '10',
        title: 'Cache Invalidation Issue',
        severity: 'Backend',
        status: 'Resolved',
        createdAt: '04/06/2024',
        owner: 'dev@team'
      }
    ];

    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allHandlers];

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(handler => 
        handler.status === this.selectedStatus
      );
    }

    // Filter by search text
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(handler => 
        handler.title.toLowerCase().includes(searchLower) ||
        handler.severity.toLowerCase().includes(searchLower) ||
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

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\//g, '').replace(/\s+/g, '');
  }
}