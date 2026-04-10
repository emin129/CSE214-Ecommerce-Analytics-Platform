import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.component.html',
  styleUrls: ['./analytic.component.css'],
  standalone: false
})
export class AnalyticComponent implements OnInit {
  @ViewChild('topProductsChart') chartCanvas!: ElementRef;
  @ViewChild('salesTrendChart') trendCanvas!: ElementRef;

  private productChart: Chart | undefined;
  private trendChart: Chart | undefined;

  totalRevenue: number = 0;
  totalOrders: number = 0;
  totalProducts: number = 0;
  returnRate: number = 0;
  averageOrderValue: number = 0;
  isLoading: boolean = true;
  orderList: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;

    this.productService.getSellerProducts().subscribe({
      next: (products: any) => {
        const list = products.content || products;
        this.totalProducts = list.length;
      }
    });

    this.productService.getSellerOrders().subscribe({
      next: (orders: any) => {
        this.orderList = orders.content || orders;
        this.calculateStats();
        this.isLoading = false;
        setTimeout(() => {
          this.prepareCharts(this.orderList);
        }, 150);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalOrders = this.orderList.length;
    this.totalRevenue = this.orderList.reduce((acc, o) => acc + (o.totalPrice || o.grandTotal || 0), 0);

    if (this.totalOrders > 0) {
      this.averageOrderValue = this.totalRevenue / this.totalOrders;
      const cancelled = this.orderList.filter(o => {
        const status = o.status?.toUpperCase();
        return ['CANCELED', 'CANCELLED', 'CANCELED_BY_SELLER', 'REFUNDED', 'RETURNED'].includes(status);
      }).length;
      this.returnRate = Math.round((cancelled / this.totalOrders) * 100 * 10) / 10;
    }
  }

  prepareCharts(orders: any[]): void {
    if (!this.chartCanvas || !this.trendCanvas) return;

    const productCounts: { [key: string]: number } = {};
    const dailySales: { [key: string]: number } = {};

    orders.forEach(order => {
      const items = order.orderItems || order.items;
      if (items) {
        items.forEach((item: any) => {
          const name = item.product?.name || item.productName || 'Unknown Product';
          productCounts[name] = (productCounts[name] || 0) + (item.quantity || 0);
        });
      }

      if (order.orderDate || order.orderPurchaseTimestamp) {
        const dateObj = new Date(order.orderDate || order.orderPurchaseTimestamp);
        if (!isNaN(dateObj.getTime())) {
          const dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dailySales[dateKey] = (dailySales[dateKey] || 0) + (order.totalPrice || order.grandTotal || 0);
        }
      }
    });

    const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    this.drawProductChart(topProducts.map(p => p[0]), topProducts.map(p => p[1]));

    const sortedDates = Object.keys(dailySales).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    this.drawTrendChart(sortedDates, sortedDates.map(d => dailySales[d]));
  }

  drawProductChart(labels: string[], data: number[]): void {
    if (this.productChart) this.productChart.destroy();
    this.productChart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#2979ff', '#00e676', '#ffa726', '#ef5350', '#5c6bc0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#ffffff', usePointStyle: true, padding: 20 } } }
      }
    });
  }

  drawTrendChart(labels: string[], data: number[]): void {
    if (this.trendChart) this.trendChart.destroy();
    this.trendChart = new Chart(this.trendCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue',
          data: data,
          borderColor: '#2979ff',
          backgroundColor: 'rgba(41, 121, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2979ff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a0b0' } },
          x: { grid: { display: false }, ticks: { color: '#a0a0b0' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  exportReport(): void {
    const doc = new jsPDF();
    const date = new Date().toLocaleString('en-US');
    const timestamp = new Date().getTime();

    doc.setFillColor(41, 121, 255);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('STORE PERFORMANCE REPORT', 14, 25);
    doc.setFontSize(10);
    doc.text(`Report Generated: ${date}`, 14, 33);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Summary Metrics', 14, 55);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 58, 196, 58);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Revenue: $${this.totalRevenue.toFixed(2)}`, 14, 68);
    doc.text(`Total Orders: ${this.totalOrders} Units`, 110, 68);
    doc.text(`Avg. Order Value: $${this.averageOrderValue.toFixed(2)}`, 14, 76);
    doc.text(`Cancellation Rate: %${this.returnRate}`, 110, 76);

    const productCounts: { [key: string]: number } = {};
    this.orderList.forEach(order => {
      const items = order.orderItems || order.items;
      if (items) {
        items.forEach((item: any) => {
          const name = item.product?.name || item.productName || 'Unknown Product';
          productCounts[name] = (productCounts[name] || 0) + (item.quantity || 0);
        });
      }
    });

    const productRows = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, qty]) => [name, `${qty} Qty`]);

    autoTable(doc, {
      startY: 95,
      head: [['Product Name', 'Quantity Sold']],
      body: productRows.slice(0, 5),
      theme: 'striped',
      headStyles: { fillColor: [56, 189, 248] }
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Order ID', 'Date', 'Amount', 'Status']],
      body: this.orderList.map(o => [
        o.id,
        new Date(o.orderDate || o.orderPurchaseTimestamp).toLocaleDateString('en-US'),
        `$${(o.totalPrice || o.grandTotal || 0).toFixed(2)}`,
        o.status || 'UNDEFINED'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 121, 255] },
      styles: { fontSize: 9 }
    });

    doc.save(`Store_Performance_Report_${timestamp}.pdf`);
  }
}
