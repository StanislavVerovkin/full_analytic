import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Chart} from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit {

  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending = true;

  constructor(
    private analyticsService: AnalyticsService
  ) {
  }

  ngAfterViewInit() {

    const gainSetting: any = {
      label: 'Прибыль',
      color: 'rgb(255, 99, 132)'
    };

    const orderSetting: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };

    this.analyticsService.getAnalytics()
      .subscribe((data: AnalyticsPage) => {
        this.average = data.average;

        gainSetting.labels = data.chart.map(item => item.label);
        gainSetting.data = data.chart.map(item => item.gain);

        orderSetting.labels = data.chart.map(item => item.label);
        orderSetting.data = data.chart.map(item => item.order);

        const gainContext = this.gainRef.nativeElement.getContext('2d');
        const orderContext = this.orderRef.nativeElement.getContext('2d');

        gainContext.canvas.height = '300px';
        orderContext.canvas.height = '300px';

        new Chart(gainContext, createChartConfig(gainSetting));
        new Chart(orderContext, createChartConfig(orderSetting));

        this.pending = false;
      })
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false,
        }
      ]
    }
  }
}
