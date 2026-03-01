import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {

  stats: any = {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgRating: 0,
  };

  public chartOptions: any;
  isLoading = false;
  private destroy$ = new Subject<void>();
  private readonly apiUrl = 'http://localhost:8081/api/admin/dashboard';

  constructor(private http: HttpClient) {
    this.chartOptions = this.buildDefaultChartOptions();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Tek bir istekte tüm istatistikleri ve genel rating ortalamasını çekiyoruz
    this.http.get<any>(`${this.apiUrl}/stats`, { headers: this.getHeaders() })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.stats.totalRevenue = data.totalRevenue || 0;
            this.stats.totalOrders = data.totalOrders || 0;
            this.stats.totalCustomers = data.totalUsers || 0;
            this.stats.avgRating = data.avgRating || 0;
          }
        },
        error: (err) => console.error('Stats yükleme hatası:', err)
      });

    // Grafik Verileri (Kategori Analizi)
    this.http.get<any[]>(`${this.apiUrl}/category-stats`, { headers: this.getHeaders() })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            const counts = res.map(x => x.orderCount);
            const names = res.map(x => x.categoryName);
            this.chartOptions.series = [{ name: 'Orders per Category', data: counts }];
            this.chartOptions.xaxis = { ...this.chartOptions.xaxis, categories: names };
          }
        }
      });
  }

  private buildDefaultChartOptions(): any {
    return {
      series: [{ name: 'Orders', data: [] }],
      chart: { type: 'area', height: 350, toolbar: { show: false }, fontFamily: "'Inter', sans-serif" },
      colors: ['#6366f1'],
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: [], labels: { style: { colors: '#64748b' } } },
      yaxis: { labels: { formatter: (val: any) => Math.floor(val).toString() } },
      tooltip: { theme: 'dark' }
    };
  }
}
