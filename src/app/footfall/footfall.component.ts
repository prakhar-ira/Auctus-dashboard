import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { takeWhile, finalize, map } from 'rxjs/operators';
import { Moment } from 'moment';
import { ChartService } from 'src/app/shared/services/chart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { TreeModel, TreeNode } from 'angular-tree-component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { transpose } from 'mathjs';
import { saveAs } from 'file-saver';
import { TouchSequence } from 'selenium-webdriver';




@Component({
  selector: 'app-footfall',
  templateUrl: './footfall.component.html',
  styleUrls: ['./footfall.component.scss']
})
export class FootfallComponent implements OnInit, OnDestroy {
  DailyChart: any;
  data: any[] = [];
  MonthlyChart: any;
  WeeklyChart: any;
  period: any;
  compareTo = false;
  showCompareToGraph = false;
  results: any;
  compareToResults: any;
  monthlyData: any;
  weeklyData: any;
  vsMetric = false;
  hourlyData: any;
  changedRows: any;
  typeMetrics: string;
  selected = {startDate: moment, endDate: moment };
  dateRange: any = 'range';
  compareto = false;
  compareToCustomDate = {startDate: moment, endDate: moment};
  compareToSelect: any = 'range';
  isLoading: boolean;
  primaryMetrics = 'footfall';
  secondaryMetrics = '';
  showHiearchy: false;
  buttonDiasbled = true;
  nodes: any;
  isPreviousPeriodSelected: boolean;
  options = {
    useCheckbox: true
  };
  private alive = true;


  constructor(
    private http: HttpClient,
    private router: Router,
    private chart: ChartService,
    private auth: AuthService,
    private toastr: ToastrService
    ) {}

  changeSelection(event: any) {
      console.log(event);
    if (event.startDate && event.endDate) {
      this.selected.startDate = event.startDate.format('YYYY-MM-DD');
      this.selected.endDate = event.endDate.format('YYYY-MM-DD');
    }
  }

  compareToDateRange(event: any) {
    if (event.startDate && event.endDate) {
      this.compareToCustomDate.startDate = event.startDate.format('YYYY-MM-DD');
      this.compareToCustomDate.endDate = event.endDate.format('YYYY-MM-DD');
    }
  }

  changeCompareTo(ev: any) {
    console.log(this.compareToSelect, this.dateRange);
    if (this.compareToSelect === 'previousPeriod') {
      const footfall = {};
      switch (this.dateRange) {
        case 'last7Days': footfall['to'] = moment().subtract(7, 'days').format('YYYY-MM-DD');
                          footfall['from'] = moment().subtract(14, 'days').format('YYYY-MM-DD');
                          break;
        case 'last30Days' : footfall['to'] = moment().subtract(1, 'months').format('YYYY-MM-DD');
                            footfall['from'] = moment().subtract(2, 'months').format('YYYY-MM-DD');
                          break;
        case 'thisWeek' : footfall['from'] = moment().startOf('week').subtract(7, 'days').format('YYYY-MM-DD');
                          footfall['to'] = moment().startOf('week').format('YYYY-MM-DD');
                          break;
        case 'lastWeek' : footfall['from'] = moment().startOf('week').subtract(14, 'days').format('YYYY-MM-DD');
                          footfall['to'] = moment().startOf('week').subtract(7, 'days').format('YYYY-MM-DD');
                          break;
        case 'thisMonth' : footfall['from'] = moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD');
                          footfall['to'] = moment().startOf('month').format('YYYY-MM-DD');
                          break;
        case 'lastMonth' : footfall['to'] = moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD');
                          footfall['from'] = moment().startOf('month').subtract(2, 'months').format('YYYY-MM-DD');
                          break;
        case 'yearToDate' : footfall['to'] = moment().subtract(1, 'years').format('YYYY-MM-DD');
                          footfall['from'] = moment().startOf('year').subtract(1, 'years').format('YYYY-MM-DD');
                          break;
        default: return this.toastr.error('Please select primary date range');
      }
      this.compareToCustomDate.startDate = footfall['from'];
      this.compareToCustomDate.endDate = footfall['to'];
    }
}



applyDateRange(e?) {
  const postData = {
    'metric': this.primaryMetrics,
    'compare_flag': `${this.compareTo}`,
    'compare_from': this.compareToCustomDate.startDate,
    'compare_to': this.compareToCustomDate.endDate,
    'vs_metric_flag': `${this.vsMetric}`,
    'vs_metric': this.secondaryMetrics,
    'period': 'Daily'
  };
    if (typeof this.selected.startDate === 'function' && typeof this.selected.endDate === 'function') {
      postData['from'] = moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD');
      postData['to'] = moment().format('YYYY-MM-DD');
    } else {
      postData['from'] = this.selected.startDate;
      postData['to'] = this.selected.endDate;
    }
  this.isLoading = true;
  this.auth
 .postDailyFootFall(postData)
 .pipe(
  takeWhile(() => this.alive),
)
 .subscribe(
    (results: any) => {
      this.isLoading = false;
      this.buttonDiasbled = false;
      this.results = results;
            this.showChart('line', 'dailyChart', 'daily-legend', results.data.metric.primary_date.date,
            results.data.metric.compare_date.date, this.primaryMetrics,
              results.data.metric.primary_date[results.metrics[0]], this.secondaryMetrics,
              results.data.vs_metric.primary_date[results.metrics[1]],
              results.data.metric.compare_date[results.metrics[0]], results.data.vs_metric.compare_date[results.metrics[1]],
              results.ticks);
        },
    res => {
      console.log(res);
      this.router.navigate(['/']);
    }
  );
}

toggleTab(period) {
  this.period = period;
  const postData = {
    'metric': this.primaryMetrics,
    'compare_flag': `${this.compareTo}`,
    'compare_from': this.compareToCustomDate.startDate,
    'compare_to': this.compareToCustomDate.endDate,
    'vs_metric_flag': `${this.vsMetric}`,
    'vs_metric': this.secondaryMetrics,
    'period': period
  };
  console.log(this.selected.startDate);
  if (typeof this.selected.startDate === 'function' && typeof this.selected.endDate === 'function') {
    postData['from'] = moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD');
    postData['to'] = moment().format('YYYY-MM-DD');
  } else {
    postData['from'] = this.selected.startDate;
    postData['to'] = this.selected.endDate;
  }

this.isLoading = true;
this.auth
.postDailyFootFall(postData)
.pipe(
 takeWhile(() => this.alive),
)
.subscribe(
   (results: any) => {
    console.log(results);
    this.results = results;
    this.buttonDiasbled = false;
    this.isLoading = false;
    switch (period) {
      case 'Daily':
      this.showChart('line', 'dailyChart', 'daily-legend', results.data.metric.primary_date.date,
      results.data.metric.compare_date.date, this.primaryMetrics,
        results.data.metric.primary_date[results.metrics[0]], this.secondaryMetrics,
        results.data.vs_metric.primary_date[results.metrics[1]],
        results.data.metric.compare_date[results.metrics[0]], results.data.vs_metric.compare_date[results.metrics[1]],
        results.ticks);
        break;
      case 'Weekly':
      this.showChart('bar', 'weeklyChart', 'weekly-legend', results.data.metric.primary_date.date,
      results.data.metric.compare_date.date, this.primaryMetrics,
        results.data.metric.primary_date[results.metrics[0]], this.secondaryMetrics,
        results.data.vs_metric.primary_date[results.metrics[1]],
        results.data.metric.compare_date[results.metrics[0]], results.data.vs_metric.compare_date[results.metrics[1]],
        results.ticks);
        break;
    case 'Monthly':
    this.showChart('bar', 'monthlyChart', 'monthly-legend', results.data.metric.primary_date.date,
    results.data.metric.compare_date.date, this.primaryMetrics,
      results.data.metric.primary_date[results.metrics[0]], this.secondaryMetrics,
      results.data.vs_metric.primary_date[results.metrics[1]],
      results.data.metric.compare_date[results.metrics[0]], results.data.vs_metric.compare_date[results.metrics[1]],
      results.ticks);
      break;
    default: return this.toastr.error('Select tab');
    }
    },
   res => {
     console.log(res);
     this.router.navigate(['/']);
   }
 );
}


showChart(chartType, name, legendId, primary_date, compare_to, metric1, metric,
   metric2, vs_metric, metric_date_compare, vs_metric_date_compare, ticks) {
     if (this.DailyChart) {
       this.DailyChart.destroy();
     }
  Chart.defaults.global.elements.line.fill = false;


  const y0_min = ticks.y0[0];
  const y0_max = ticks.y0[1];
  const y1_min = ticks.y1[0];
  const y1_max = ticks.y1[1];
  const color_metric1 = '#004f73';
  const color_metric1_compare = '#008ccc';
  const color_metric2 = '#255c13';
  const color_metric2_compare = '#ffa600';
  if (primary_date.length > 0) {
    primary_date = primary_date.map(function(date) {
    const new_date = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new_date.toLocaleDateString('en-US', options);
  });
  }

if (compare_to.length > 0) {
  compare_to = compare_to.map(function(date) {
    const new_date = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new_date.toLocaleDateString('en-US', options);
  });
}

const del = compare_to.length - primary_date.length;
if (del > 0) {
  compare_to = compare_to.slice(0, -del);
  metric_date_compare = metric_date_compare.slice(0, -del);

  if (vs_metric_date_compare.length > 0) {
    vs_metric_date_compare = vs_metric_date_compare.slice(0, -del);
  }
}
const ts = primary_date[0];
const te = primary_date[primary_date.length - 1];
const ts_c = compare_to[0];
const te_c = compare_to[compare_to.length - 1];

if (compare_to.length > 0) {
  if (compare_to.length < primary_date.length) {
    const del1 = primary_date.length - compare_to.length;
    for (let i = 0; i < del1; i++) {
      compare_to.push('');
      metric_date_compare.push(null);
    }
    if (vs_metric.length > 0) {
      for (let i = 0; i < del1; i++) {
        vs_metric_date_compare.push(null);
      }
    }
  }
}

const data1 = {
  datasets: [
    {
      type: chartType,
      fillOpacity: 100,
      label: metric1,
      yAxisID: 'y-axis-0',
      xAxisID: 'x-axis-0',
      backgroundColor: color_metric1,
      borderColor: color_metric1,
      borderWidth: 2.5,
      data: metric,
      lineTension: 0
    }
  ]
};

const dataset2 = {
  type: 'line',
  label: metric1,
  fillOpacity: 100,
  yAxisID: 'y-axis-0',
  xAxisID: 'x-axis-1',
  backgroundColor: color_metric1_compare,
  borderColor: color_metric1_compare,
  borderWidth: 2.5,
  data: metric_date_compare,
  lineTension: 0
};

const dataset3 = {
  type: chartType,
  label: metric2,
  fillOpacity: 100,
  yAxisID: 'y-axis-1',
  xAxisID: 'x-axis-0',
  backgroundColor: color_metric2,
  borderColor: color_metric2,
  borderWidth: 2.5,
  data: vs_metric,
  lineTension: 0
};
const dataset4 = {
  type: 'line',
  label: metric2,
  yAxisID: 'y-axis-1',
  fillOpacity: 100,
  xAxisID: 'x-axis-1',
  backgroundColor: color_metric2_compare,
  borderColor: color_metric2_compare,
  borderWidth: 2.5,
  data: vs_metric_date_compare,
  lineTension: 0
};

if (compare_to.length > 0 && vs_metric.length > 0) {
  data1.datasets.push(dataset2, dataset3, dataset4);
}

if (compare_to.length > 0 && vs_metric.length === 0) {
  data1.datasets.push(dataset2);
}

if (compare_to.length === 0 && vs_metric.length > 0) {
  data1.datasets.push(dataset3);
}
const xaxis2 = {
  offset: true,
  stacked: false,
  labels: compare_to,
  labelString: 'Comparison Date',
  xAxisID: 'x-axis-1',
  scaleLabel: {
    display: true,
    labelString: 'Comparison Date',
    fontColor: 'black',
    fontFamily: 'Roboto'
  },
  gridLines: {
    display: false
  },
  ticks: {
    autoSkip: true,
    maxTicksLimit: 5,
    fontSize: 10,
    maxRotation: 0,
    minRotation: 0
  },
  position: 'top'
};

const yaxis2 = {
  stacked: false,
  position: 'right',
  yAxisID: 'y-axis-1',
  scaleLabel: {
    display: true,
    labelString: metric2,
    fontColor: 'black',
    fontFamily: 'Roboto'
  },
  gridLines: {
    display: false
  },
  ticks: {
    autoSkip: true,
    maxTicksLimit: 2,
    min: y1_min,
    max: y1_max
  }
};
const config = {
  type: chartType,
  data: data1,
  options: {
    over: {
      mode: 'index',
      intersect: false
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          const options1 = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          };
          return (
            new Date(tooltipItem.xLabel).toLocaleDateString('en-US', options1) +
            ' | ' +
            data.datasets[tooltipItem.datasetIndex].label +
            ' : ' +
            tooltipItem.yLabel
            );
          },
        },
      backgroundColor: '#fff',
      borderColor: '#DCDCDC',
      bodyFontColor: '#000000',
      borderWidth: 1,
      opacity: 20,
      caretSize: 12,
      caretPadding: 12,
      cornerRadius: 12,
      bodyFontFamily: 'Roboto',
      bodySpacing: 12,
      xPadding: 12,
      yPadding: 12
    },

    legend: { display: false },
    legendCallback: function(ch) {
      return (
        `<head> <link href='https://fonts.googleapis.com/css?family=Roboto' rel ='stylesheet' >
        <style> body {font-family: 'Roboto';font-size: 14px;color:'#C8C2C2'}</style </head>
        <p style='text-align: left;'> ${ts} &nbsp;-&nbsp; ${te} :&emsp;<span style= 'color: ${color_metric1};'> &#x25CF;&emsp;</span>
        ${metric1}`
        );
    },
    title: {
      display: false
    },

    responsive: true,
    scales: {
      xAxes: [
        {
          offset: true,
          stacked: false,
          labels: primary_date,
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontColor: 'black',
            fontFamily: 'Roboto'
          },
          xAxisID: 'x-axis-0',
          gridLines: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 5,
            fontSize: 10,
            maxRotation: 0,
            minRotation: 0
          }
        }
      ],
      yAxes: [
        {
          stacked: false,
          position: 'left',
          yAxisID: 'y-axis-0',
          scaleLabel: {
            display: true,
            labelString: metric1,
            fontColor: 'black',
            fontFamily: 'Roboto'
          },
          gridLines: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 2,
            min: y0_min,
            max: y0_max
          }
        }
      ]
    }
  }
};

if (compare_to.length > 0 && vs_metric.length > 0) {
  config.options.scales.xAxes.push(xaxis2);
  config.options.scales.yAxes.push(yaxis2);
  config.options.legendCallback = function(ch) {
    return (
      `<head> <link href='https://fonts.googleapis.com/css?family=Roboto'
      rel ='stylesheet' > <style> body {font-family: 'Roboto';
      font-size: 14px;color:'#666' }</style </head><p style='text-align: left;'>` +
      ts +
      '&nbsp;-&nbsp;' +
      te +
      `:&emsp;<span style='color:` +
      color_metric1 +
      `;'>&#x25CF;&emsp;</span>` +
      metric1 +
      `&emsp;<span style='color: ` +
      color_metric2 +
      `;'>&#x25CF;&emsp;</span>` +
      metric2 +
      '<br>' +
      ts_c +
      ' - ' +
      te_c +
      `:&emsp;<span style='color:` +
      color_metric2 +
      `;'>&#x25CF;&emsp;</span>` +
      metric1 +
      `&emsp;<span style='color: ` +
      color_metric2_compare +
      `;'>&#x25CF;&emsp;</span>` +
      metric2 +
      '</p>'
    );
  };
}

if (compare_to.length > 0 && vs_metric.length === 0) {
  config.options.scales.xAxes.push(xaxis2);
  config.options.legendCallback = function(ch) {
    return (
      `<head> <link href='https://fonts.googleapis.com/css?family=Roboto'
       rel ='stylesheet' > <style> body {font-family: 'Roboto';font-size: 14px;
       color: '#666'}</style </head><p style='text-align: left;'>` +
       ts +
      '&nbsp;-&nbsp;' +
      te +
      `:&emsp;<span style='color: ` +
      color_metric1 +
      `;'>&#x25CF;&ensp;</span>` +
      metric1 +
      '<br>' +
      ts_c +
      '&nbsp;-&nbsp;' +
      te_c +
      `:&emsp;<span style='color:` +
      color_metric1_compare +
      `;'>&#x25CF;</span>` +
      metric1 +
      '</p>'
      );
    };
}

if (compare_to.length === 0 && vs_metric.length > 0) {
  config.options.scales.yAxes.push(yaxis2);
  config.options.legendCallback = function(ch) {
    return (
      `<head> <link href='https://fonts.googleapis.com/css?family=Roboto'
      rel ='stylesheet' > <style> body {font-family: 'Roboto';font-size: 14px;color:'#666'}
      </style </head><p style='text-align: left;'>` +
      ts +
      '&nbsp;-&nbsp;' +
      te +
      `:&emsp;<span style='color: ` +
      color_metric1 +
      `';>&#x25CF;&emsp;</span>` +
      metric1 +
      `&emsp;<span style='color: ` +
      color_metric2 +
      `;'> &#x25CF;</span>&emsp;` +
      metric2
    );
  };
}
// allocate and initialize a chart
const chart = (<any>document.getElementById(name)).getContext('2d');
this.DailyChart = new Chart(chart, config);
document.getElementById(legendId).innerHTML = this.DailyChart.generateLegend();
}

  changeDateRange(ev: any) {
    if (this.compareToSelect === 'previousPeriod') {
      return this.changeCompareTo(ev);
    } else {
      const footfall = {};
      switch (ev.target.value) {
      case 'last7Days': footfall['to'] = moment().format('YYYY-MM-DD');
      footfall['from'] = moment().subtract(7, 'days').format('YYYY-MM-DD');
                        break;
                        case 'last30Days' : footfall['to'] = moment().format('YYYY-MM-DD');
                          footfall['from'] = moment().subtract(1, 'months').format('YYYY-MM-DD');
                          break;
      case 'thisWeek' : footfall['from'] = moment().startOf('week').format('YYYY-MM-DD');
                        footfall['to'] = moment().format('YYYY-MM-DD');
                        break;
      case 'lastWeek' : footfall['from'] = moment().startOf('week').subtract(7, 'days').format('YYYY-MM-DD');
                        footfall['to'] = moment().startOf('week').format('YYYY-MM-DD');
                        break;
      case 'thisMonth' : footfall['from'] = moment().startOf('month').format('YYYY-MM-DD');
      footfall['to'] = moment().format('YYYY-MM-DD');
                        break;
      case 'lastMonth' : footfall['to'] = moment().startOf('month').format('YYYY-MM-DD');
                        footfall['from'] = moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD');
                        break;
      case 'yearToDate' : footfall['to'] = moment().format('YYYY-MM-DD');
                          footfall['from'] = moment().startOf('year').format('YYYY-MM-DD');
                        break;
      default: return;
    }

    this.selected.startDate = footfall['from'];
    this.selected.endDate = footfall['to'];
    }
  }


  download() {
    const metric = this.results.metrics[0];
    const vs_metric = this.results.metrics[1];

    const primary_date = this.results.data.metric.primary_date.date;
    const metric_data = this.results.data.metric.primary_date[metric];
    const vs_metric_data = this.results.data.vs_metric.primary_date[vs_metric];

    const compare_date = this.results.data.metric.compare_date.date;
    const c_metric_data = this.results.data.metric.compare_date[metric];
    const c_vs_metric_data = this.results.data.vs_metric.compare_date[vs_metric];
    let headers, y;
    if (this.results.flag.compare_data_flag === 'true' && this.results.flag.vs_metric_flag === 'true') {

      if (primary_date.length > compare_date.length) {

          const len = primary_date.length - compare_date.length;

          for (let i = 0; i < len; i++) {

              compare_date.push('');
              c_metric_data.push('');
              c_vs_metric_data.push('');

          }
      }

      if (primary_date.length < compare_date.length) {

          const len = primary_date.length - compare_date.length;

          compare_date.slice(0, len);
          c_metric_data.slice(0, len);
          c_vs_metric_data.slice(0, len);


      }


      let data: any = [primary_date, metric_data, vs_metric_data, compare_date, c_metric_data, c_vs_metric_data];
      data = transpose(data);
      y = '';
      for (let i = 0; i < data.length; i++) {
         y = y + data[i].toString() + `\r\n`;
        }

      headers = 'Primary Date Range,,,Comparison Date Range,,\r\n\r\nDate,'
      + metric + ',' + vs_metric + ',Date,' + metric + ',' + vs_metric + '\r\n';


  }

  if (this.results.flag.compare_data_flag === 'true' && this.results.flag.vs_metric_flag === 'false') {

      if (primary_date.length > compare_date.length) {

          const len = primary_date.length - compare_date.length;

          for (let i = 0; i < len; i++) {

              compare_date.push('');
              c_metric_data.push('');


          }
      }

      if (primary_date.length < compare_date.length) {

          const len = primary_date.length - compare_date.length;

          compare_date.slice(0, len);
          c_metric_data.slice(0, len);

      }

      let data: any = [primary_date, metric_data, compare_date, c_metric_data];
      data = transpose(data);
      y = '';
      for (let i = 0; i < data.length; i++) {
         y = y + data[i].toString() + '\r\n';
    }

      headers = 'Primary Date Range,,Comparison Date Range,\r\n\r\nDate,' + metric + ',Date,' + metric + '\r\n';
  }


  if (this.results.flag.compare_data_flag === 'false' && this.results.flag.vs_metric_flag === 'true') {

      let data: any = [primary_date, metric_data, vs_metric_data];
      data = transpose(data);
      y = '';
      for (let i = 0; i < data.length; i++) {
        y = y + data[i].toString() + '\r\n';
    }

      headers = 'Primary Date Range,,\r\n\r\nDate,' + metric + ',' + vs_metric + '\r\n';
  }

  if (this.results.flag.compare_data_flag === 'false' && this.results.flag.vs_metric_flag === 'false') {

      let data: any = [primary_date, metric_data];
      data = transpose(data);
      y = '';
      for (let i = 0; i < data.length; i++) {
        y = y + data[i].toString() + '\r\n';
      }
      headers = 'Primary Date Range,\r\n\r\nDate,' + metric + '\r\n';

  }
  const blob = new Blob([headers + y], { type: 'text/plain;charset=utf-8' });
  return saveAs(blob, 'result.csv');
  }

 ngOnInit() {
   const token = localStorage.getItem('userInfo');
   this.auth.refreshToken(token);
  this.isLoading = true;
   this.auth
   .getDailyFootFall()
   .pipe(
    takeWhile(() => this.alive),
  )
   .subscribe(
      (results: any) => {
        this.isLoading = false;
        this.results = results;
        this.applyDateRange();
      },
      res => {
        console.log(res);
        this.router.navigate(['/']);
      }
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
