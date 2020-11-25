import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { Chart } from 'chart.js';
import * as Chart from 'chart.js';

@Component({
  selector: 'ohs-audiometry-result',
  templateUrl: './audiometry-result.component.html',
  styleUrls: ['./audiometry-result.component.scss']
})
export class AudiometryResultComponent implements OnInit, OnDestroy {
  // @ViewChild('monthPatientsChart', { static: true }) monthPatientsChart!: ElementRef;
  // @ViewChild('monthSalesChart', { static: true }) monthSalesChart!: ElementRef;
  @ViewChild('yearSalesChart', { static: true }) yearSalesChart!: ElementRef;
  @ViewChild('yearPatientsChart', { static: true }) yearPatientsChart!: ElementRef;
  @ViewChild('frequencyChart', { static: true }) frequencyChart!: ElementRef;


  private onDestroyUnSubscribe = new Subject<void>();
  public canvas: any;
  public ctx: any;
  // private months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public noDataText: string = `Please wait while we're fetching your data...`;
  public barChartOption = {
    responsive: true,
    legend: {
      display: false
    },
  };
  public lineChartOption = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        // type: 'linear',
        position: 'bottom',
        scaleLabel: {
          labelString: 'Hz',
          display: true,
        }
        // ticks: {
        //   userCallback: (tick: any) => {
        //     if (tick >= 8) {
        //       // return (tick / 1000).toString() + 'km';
        //       return (tick / 8).toString();
        //     }
        //     // return tick.toString() + 'm';
        //     return tick.toString();
        //   }
        // },
        // scaleLabel: {
        //   labelString: 'Hz',
        //   display: true,
        // }
      }],
      yAxes: [{
        // type: 'linear',
        // ticks: {
        //   userCallback: (tick: any) => {
        //     // return tick.toString() + 'm';
        //     return tick.toString();
        //   }
        // },
        stacked: true,
        scaleLabel: {
          labelString: 'dB',
          display: true
        }
      }]
    }
  };

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.noDataCanvas(this.monthPatientsChart);
    // this.noDataCanvas(this.monthSalesChart);
    this.noDataCanvas(this.yearSalesChart);
    this.noDataCanvas(this.yearPatientsChart);
    this.viewBarChart();

    this.noDataCanvas(this.frequencyChart);
    this.viewLineChart();
  }

  noDataCanvas(element: ElementRef) {
    const dpi = window.devicePixelRatio;
    const canvasLeft = ((element.nativeElement.parentElement.clientWidth / 2) - (element.nativeElement.width / 2)) * dpi;
    const canvasTop = (element.nativeElement.height / 2) * dpi;
    this.ctx = element.nativeElement.getContext('2d');
    element.nativeElement.width = element.nativeElement.parentElement.clientWidth * dpi;
    element.nativeElement.height = element.nativeElement.height * dpi;
    this.ctx.font = '18px Montserrat, sans-serif';
    this.ctx.fillText(this.noDataText, canvasLeft, canvasTop);
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  createBarChart(element: ElementRef, chartData: any, chartOption: any) {
    this.ctx = element.nativeElement.getContext('2d');
    const barChart = new Chart(this.ctx, {
      type: 'bar',
      data: chartData,
      options: chartOption
    });
  }
  viewBarChart() {
    // const monthlyPatients = {
    //   labels: testitem.map(x => x.id),
    //   // labels: this.clinicMetrics.DailyMetric.map((item: any) => item.DayOfMonth),
    //   datasets: [{
    //     label: 'Daily Patient Count',
    //     // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalPatient),
    //     data: testitem.map(x => x.value),
    //     backgroundColor: '#007bff',
    //     borderWidth: 1,
    //     borderColor: '#007bff'
    //   }]
    // };
    // const monthlySales = {
    //   // labels: this.clinicMetrics.DailyMetric.map((item: any) => item.DayOfMonth),
    //   labels: testitem.map(x => x.id),
    //   datasets: [{
    //     label: 'Daily Sales',
    //     // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalSales),
    //     data: testitem.map(x => x.value),
    //     backgroundColor: '#28a745',
    //     borderWidth: 1,
    //     borderColor: '#28a745'
    //   }]
    // };
    const yearlyPatients = {
      // labels: this.clinicMetrics.MonthlyMetric.map((item: any) => this.months[item.MonthOfYear - 1]),
      // labels: testitem.map(x => this.months[x.id]),
      labels: testitem.map(x => x.id),
      datasets: [{
        label: 'Monthly Patient Count',
        // data: this.clinicMetrics.MonthlyMetric.map((item: any) => item.TotalPatient),
        data: testitem.map(x => x.value),
        backgroundColor: '#FCE15D',
        borderWidth: 1,
        borderColor: '#FCE15D',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2
      }]
    };
    const yearlySales = {
      // labels: this.clinicMetrics.MonthlyMetric.map((item: any) => this.months[item.MonthOfYear - 1]),
      // labels: testitem.map(x => this.months[x.id]),
      labels: testitem.map(x => x.id),
      datasets: [{
        label: 'Monthly Sales',
        // data: this.clinicMetrics.MonthlyMetric.map((item: any) => item.TotalSales),
        data: testitem.map(x => x.value),
        backgroundColor: '#FCE15D',
        borderWidth: 1,
        borderColor: '#FCE15D',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2
      }]
    };
    // this.createBarChart(this.monthPatientsChart, monthlyPatients, this.chartOption);
    // this.createBarChart(this.monthSalesChart, monthlySales, this.chartOption);
    this.createBarChart(this.yearSalesChart, yearlySales, this.barChartOption);
    this.createBarChart(this.yearPatientsChart, yearlyPatients, this.barChartOption);
  }
  createLineChart(element: ElementRef, chartData: any, chartOption: any) {
    this.ctx = element.nativeElement.getContext('2d');
    const lineChart = new Chart(this.ctx, {
      type: 'line',
      data: chartData,
      options: chartOption
    });
  }
  viewLineChart() {
    const frequencyData = {
      labels: dataItem1.map(x => x.x),
      // labels: this.clinicMetrics.DailyMetric.map((item: any) => item.DayOfMonth),
      datasets: [
        {
        label: 'Daily Frequency',
        // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalPatient),
        data: dataItem1.map(x => x.y),
        backgroundColor: '#ff638466',
        borderWidth: 1,
        borderColor: '#ff6384',
        fill: true,
      },
      {
        label: 'Daily Frequency',
        // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalPatient),
        data: dataItem2.map(x => x.y),
        backgroundColor: '#21cf3c66',
        borderWidth: 1,
        borderColor: '#21cf3c',
        fill: true,
      }
    ]
    };
    this.createLineChart(this.frequencyChart, frequencyData, this.lineChartOption);
  }

  onSubmit() { }

}

const dataItem1 = [
  { x: 0.5, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 4 },
  { x: 3.4, y: -4.25 },
  { x: 3.6, y: -1.76 },
  { x: 4, y: -5.75 },
  { x: 4.2, y: -2.65 },
  { x: 4.4, y: -1.75 },
  { x: 6, y: 6 },
  { x: 8, y: 12 }
];
const dataItem2 = [
  { x: 0.5, y: 2 },
  { x: 1, y: 4 },
  { x: 2, y: 6 },
  { x: 3, y: 5 },
  { x: 3.4, y: 5.25 },
  { x: 3.6, y: -2.76 },
  { x: 4, y: -6.75 },
  { x: 4.2, y: 3.65 },
  { x: 4.4, y: -1.55 },
  { x: 6, y: 7 },
  { x: 8, y: 9 }
];


const testitem = [
  {
    "id": 0,
    "value": -1200
  },
  {
    "id": 1,
    "value": 883
  },
  {
    "id": 2,
    "value": 5925
  },
  {
    "id": 3,
    "value": 17119
  },
  {
    "id": 4,
    "value": 27144
  },
  {
    "id": 5,
    "value": 2758
  },
  {
    "id": 6,
    "value": -900
  },
  {
    "id": 7,
    "value": 19000
  },
  {
    "id": 8,
    "value": -27150
  }
];
