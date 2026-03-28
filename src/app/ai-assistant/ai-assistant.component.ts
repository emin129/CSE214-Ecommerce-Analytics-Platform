import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { AIService } from '../ai.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css'],
  standalone: false
})
export class AiAssistantComponent implements OnInit {

  userQuery: string = '';
  isLoading: boolean = false;
  currentChartLabel: string = 'Data Quantity';

  messages: Array<{
    text: string;
    isUser: boolean;
    hasChart?: boolean;
    logs?: boolean;
  }> = [];

  agentLogs: Array<{agent: string, action: string}> = [];

  @ViewChildren('aiChart') chartCanvases!: QueryList<ElementRef>;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  charts: Map<number, any> = new Map();

  constructor(private aiService: AIService) { }

  ngOnInit(): void {
  }

  askAI() {
    if (!this.userQuery.trim()) return;

    const currentPrompt = this.userQuery;
    const lowerQuery = currentPrompt.toLowerCase();

    if (lowerQuery.includes('ignore') && (lowerQuery.includes('rule') || lowerQuery.includes('safety'))) {
      this.messages.push({ text: currentPrompt, isUser: true });
      this.userQuery = '';
      this.isLoading = true;
      this.scrollToBottom();

      setTimeout(() => {
        this.isLoading = false;
        this.messages.push({
          text: "🚨 SECURITY ALERT: Prompt injection or restricted pattern detected! Access denied.",
          isUser: false
        });
        this.agentLogs = [];
        this.agentLogs.push({ agent: 'Guardrail Agent', action: 'Malicious prompt blocked before sending!' });
        this.scrollToBottom();
      }, 1000);

      return;
    }

    this.messages.push({ text: this.userQuery, isUser: true });
    this.isLoading = true;
    this.agentLogs = [];

    let apiPrompt = this.userQuery;

    this.userQuery = '';

    this.scrollToBottom();
    this.simulateAgentLogs();

    this.aiService.queryProductAI(apiPrompt, '').subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.isLoading = false;

          let botReply = res.response || "AI could not generate a response.";
          this.currentChartLabel = res.chartLabel || 'Quantity';

          const isMaliciousQuery = apiPrompt.toUpperCase().includes('DELETE') ||
                                   apiPrompt.toUpperCase().includes('DROP') ||
                                   apiPrompt.toUpperCase().includes('UPDATE');

          if (botReply === "AI could not generate a response." && isMaliciousQuery) {
            botReply = "🚨 SECURITY ALERT: You do not have permission to perform modification or deletion operations on the database!";
          } else if (botReply === "AI could not generate a response.") {
            botReply = "I couldn't process this query. Please ensure you are asking for valid e-commerce data.";
          }

          const shouldShowChart = res.data && res.data.length > 0;

          this.messages.push({
            text: botReply,
            isUser: false,
            hasChart: shouldShowChart,
            logs: true
          });

          this.agentLogs.push({ agent: res.agent || 'Summarizer Agent', action: 'Final response generated.' });

          if (shouldShowChart) {
            setTimeout(() => {
              const lastMsgIndex = this.messages.length - 1;
              this.drawChart(res.data, lastMsgIndex);
            }, 500);
          }

          this.scrollToBottom();
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.messages.push({
          text: "🚨 SECURITY ALERT: Unauthorized access or restricted operations detected!",
          isUser: false
        });
        this.agentLogs.push({ agent: 'System', action: 'Request blocked or failed!' });
        this.scrollToBottom();
      }
    });
  }

  simulateAgentLogs() {
    setTimeout(() => this.agentLogs.push({ agent: 'Guardrail Agent', action: 'Checking query security...' }), 200);
    setTimeout(() => this.agentLogs.push({ agent: 'Guardrail Agent', action: 'Query in-scope. Proceeding...' }), 500);
    setTimeout(() => this.agentLogs.push({ agent: 'SQL Generator Agent', action: 'Converting English to SQL...' }), 900);
    setTimeout(() => this.agentLogs.push({ agent: 'SQL Executor Agent', action: 'Executing secure query on database...' }), 1300);
  }

  drawChart(data: any[], messageIndex: number) {
    if (this.charts.has(messageIndex)) {
      this.charts.get(messageIndex).destroy();
    }

    const canvasArray = this.chartCanvases.toArray();
    if (canvasArray.length === 0) return;

    const nativeCanvas = canvasArray[canvasArray.length - 1].nativeElement;
    const ctx = nativeCanvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.05)');

    const labels = data.map(item => item.name || item.NAME || item.username || item.category || item.day || Object.values(item)[0]);
    const values = data.map(item => {
      const val = item.revenue || item.total_revenue || item.total_spent || item.stock || item.quantity || item.unit_price || item.count || Object.values(item)[1];
      return typeof val === 'number' ? val : parseFloat(val) || 0;
    });

    const isTimeSeries = labels.some(l => /week|month|day|year/i.test(String(l)));

    const newChart = new Chart(ctx, {
      type: isTimeSeries ? 'line' : 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.currentChartLabel,
          data: values,
          backgroundColor: isTimeSeries ? 'transparent' : gradient,
          borderColor: '#38bdf8',
          borderWidth: 3,
          borderRadius: 8,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              font: { size: 11 }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: { size: 10 },
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            bodyColor: '#38bdf8'
          }
        }
      }
    });

    this.charts.set(messageIndex, newChart);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }, 100);
  }
}
