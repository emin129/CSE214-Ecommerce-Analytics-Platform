import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { StoreReportDTO } from '../../../storeDTO';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: false
})
export class SettingsComponent implements OnInit {

  reports: StoreReportDTO[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  searchTerm: string = '';

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.storeService.getStoreReports(
      this.currentPage,
      this.pageSize,
      this.searchTerm
    ).subscribe({
      next: (data: any) => {
        this.reports = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadReports();
  }

  changePage(step: number): void {
    const nextPage = this.currentPage + step;
    if (nextPage >= 0 && nextPage < this.totalPages) {
      this.currentPage = nextPage;
      this.loadReports();
    }
  }

  toggleStoreStatus(report: StoreReportDTO): void {
    const newStatus = report.storeStatus === 'open' ? 'closed' : 'open';
    this.storeService.updateStoreStatus(report.storeId, newStatus)
      .subscribe({
        next: () => {
          report.storeStatus = newStatus;
        }
      });
  }


}
