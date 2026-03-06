import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  standalone: false
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly apiUrl = 'http://localhost:8081/api/admin/dashboard';

  displayStats: any[] = [];
  public areaChartOptions: any;
  public donutChartOptions: any;
  isLoading = true;

  constructor(private http: HttpClient) {
    this.areaChartOptions = this.initAreaChart();
    this.donutChartOptions = this.initDonutChart();
  }

  ngOnInit(): void {
    this.loadFullAnalytics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportReport() {
    const data = document.getElementById('reportArea');
    if (!data) return;

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('analytics-report.pdf');
    });
  }

  private loadFullAnalytics() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<any>(`${this.apiUrl}/stats`, { headers })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.displayStats = [
            {
              label: 'Monthly Revenue',
              value: '$' + (data.totalRevenue?.toLocaleString() || '0'),
              icon: 'bi-graph-up-arrow',
              color: 'green'
            },
            {
              label: 'Conversion Rate',
              value: (data.conversionRate?.toFixed(2) || '0.00') + '%',
              icon: 'bi-crosshair',
              color: 'blue'
            },
            {
              label: 'Avg Order Value',
              value: '$' + (data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders).toFixed(2) : '0'),
              icon: 'bi-cash-coin',
              color: 'yellow'
            },
            {
              label: 'Return Rate',
              value: (data.returnRate?.toFixed(2) || '0.00') + '%',
              icon: 'bi-arrow-left-right',
              color: 'red'
            }
          ];
        }
      });

    this.http.get<any[]>(`${this.apiUrl}/category-stats`, { headers })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            const counts = res.map(x => x.orderCount);
            const names = res.map(x => x.categoryName);

            this.areaChartOptions.series = [{ name: 'Orders', data: counts }];
            this.areaChartOptions.xaxis = { ...this.areaChartOptions.xaxis, categories: names };

            this.donutChartOptions.series = counts;
            this.donutChartOptions.labels = names;

            this.isLoading = false;
          }
        }
      });
  }

  private initAreaChart() {
    return {
      series: [],
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: "'Inter', sans-serif",
        foreColor: '#8b949e'
      },
      colors: ['#10b981'],
      stroke: { curve: 'smooth', width: 4 },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1 }
      },
      grid: { borderColor: '#21262d', strokeDashArray: 4 },
      xaxis: {
        labels: { style: { colors: '#8b949e' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { labels: { style: { colors: '#8b949e' } } },
      dataLabels: { enabled: false },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val: number) => val + " Orders" }
      }
    };
  }

  private initDonutChart() {
    return {
      series: [],
      labels: [],
      chart: {
        type: 'donut',
        height: 380,
        fontFamily: "'Inter', sans-serif"
      },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'],
      stroke: { show: false },
      legend: {
        position: 'bottom',
        labels: { colors: '#8b949e' },
        fontSize: '13px'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Top 7 Sales',
                color: '#8b949e',
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                }
              }
            }
          }
        }
      },
      tooltip: { theme: 'dark' }
    };
  }
}
