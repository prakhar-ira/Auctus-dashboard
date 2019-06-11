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


@Component({
  selector: 'app-footfall',
  templateUrl: './footfall.component.html',
  styleUrls: ['./footfall.component.scss']
})
export class FootfallComponent implements OnInit, OnDestroy {

  LineChart: any;
  data: any[] = [];
  MonthlyChart: any;
  WeeklyChart: any;
  period: any;
  HourlyChart: any;
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
  selected = {startDate: moment, endDate: moment};
  dateRange: any = 'range';
  compareto = false;
  compareToCustomDate = {startDate: moment, endDate: moment};
  compareToSelect: any = 'range';
  isLoading: boolean;
  primaryMetrics = 'footfall';
  secondaryMetrics = '';
  showHiearchy: false;
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

changeTab(e) {
  console.log('hi', e, e.target.value, this.period);
}


applyDateRange(e?) {
  const postData = {
    'from':  this.selected.startDate,
    'to': this.selected.endDate,
    'metric': this.primaryMetrics,
    'compare_flag': `${this.compareTo}`,
    'compare_from': this.compareToCustomDate.startDate,
    'compare_to': this.compareToCustomDate.endDate,
    'vs_metric_flag': `${this.vsMetric}`,
    'vs_metric': this.secondaryMetrics,
    'period': 'Daily'
  };
  this.isLoading = true;
  this.auth
 .postDailyFootFall(postData)
 .pipe(
  takeWhile(() => this.alive),
)
 .subscribe(
    (results: any) => {
      this.isLoading = false;
            this.showChart(results.data.metric.primary_date.date, results.data.metric.compare_date.date, this.primaryMetrics,
              results.data.metric.primary_date[results.metrics[0]], this.secondaryMetrics,
              results.data.vs_metric.primary_date[results.metrics[1]],
              results.data.metric.compare_date[results.metrics[0]], results.data.vs_metric.compare_date[results.metrics[1]]);
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
    'from':  this.selected.startDate,
    'to': this.selected.endDate,
    'metric': this.primaryMetrics,
    'compare_flag': `${this.compareTo}`,
    'compare_from': this.compareToCustomDate.startDate,
    'compare_to': this.compareToCustomDate.endDate,
    'vs_metric_flag': `${this.vsMetric}`,
    'vs_metric': this.secondaryMetrics,
    'period': this.period
  };

this.isLoading = true;
this.auth
.postDailyFootFall(postData)
.pipe(
 takeWhile(() => this.alive),
)
.subscribe(
   (results: any) => {
    console.log(results);
    this.isLoading = false;
    this.showChart(results.data.metric.primary_date.date, results.data.metric.compare_date.date, this.primaryMetrics,
      results.data.metric.primary_date[results.metrics[0]], this.secondaryMetrics,
      results.data.vs_metric.primary_date[results.metrics[1]],
      results.data.metric.compare_date[results.metrics[0]], results.data.vs_metric.compare_date[results.metrics[1]]);
   },
   res => {
     console.log(res);
     this.router.navigate(['/']);
   }
 );
}


showChart(primary_date, compare_to, metric1, metric, metric2, vs_metric, metric_date_compare, vs_metric_date_compare) {
  Chart.defaults.global.elements.line.fill = false;
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

const color_metric1 = '#0000ff';
const color_metric1_compare = '#b2b2ff';
const color_metric2 = '#7f0019';
const color_metric2_compare = '#ff99ad';

const data1 = {
  datasets: [
    {
      type: 'line',
      fillOpacity: 100,
      label: metric1,
      yAxisID: 'y-axis-0',
      xAxisID: 'x-axis-0',
      backgroundColor: color_metric1,
      borderColor: color_metric1,
      borderWidth: 1.5,
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
  borderWidth: 1.5,
  data: metric_date_compare,
  lineTension: 0
};

const dataset3 = {
  type: 'line',
  label: metric2,
  fillOpacity: 100,
  yAxisID: 'y-axis-1',
  xAxisID: 'x-axis-0',
  backgroundColor: color_metric2,
  borderColor: color_metric2,
  borderWidth: 1.5,
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
  borderWidth: 1.5,
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
  }
};
const config = {
  type: 'line',
  data: data1,
  options: {
    over: {
      mode: 'index',
      intersect: false
    },
    tooltips: {
      mode: 'label',
      intersect: false,
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
        // remove title
        title: function(tooltipItem, data) {
          return;
        }
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
        <p style='text-align: left;'>` +
        ts +
        '&nbsp;-&nbsp;' +
        te +
        `:&emsp;<span style= 'color:`  +
        color_metric1 +
        `;'> &#x25CF;&emsp;</span>` +
        metric1
      );
    },
    title: {
      display: false
    },

    responsive: true,
    scales: {
      xAxes: [
        {
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
      `:&emsp;<span style='color: ` +
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
this.LineChart = new Chart('lineChart', config);
this.LineChart.generateLegend();
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

  showMetricsData() {
    Chart.defaults.global.elements.line.fill = false;
    const primary_date = this.results.date.map(function(date) {
      const new_date = new Date(date);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new_date.toLocaleDateString('en-US', options);
    });
    const color_metric1 = '#0000ff';
    const ts = primary_date[0];
    const te = primary_date[primary_date.length - 1];
    const data1 = {
      datasets: [
        {
          type: 'line',
          fillOpacity: 100,
          label: 'Footfall',
          yAxisID: 'y-axis-0',
          xAxisID: 'x-axis-0',
          backgroundColor: color_metric1,
          borderColor: color_metric1,
          borderWidth: 1.5,
          data: this.results.footfall,
          lineTension: 0
        }
      ]
    };
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: data1,
      options: {
        over: {
          mode: 'index',
          intersect: false
        },
        tooltips: {
          mode: 'label',
          intersect: false,
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
            }
          },
          backgroundColor: '#fff',
          borderColor: '#DCDCDC',
          bodyFontColor: '#000000',
          borderWidth: 1,
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
            <p style='text-align: left;'>` +
            ts +
            '&nbsp;-&nbsp;' +
            te +
            `:&emsp;<span style= 'color:`  +
            color_metric1 +
            `;'> &#x25CF;&emsp;</span>` +
            'Footfall'
          );
        },
        title: {
          display: false
        },
        responsive: true,
        scales: {
          xAxes: [
            {
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
              }
            }
          ],
          yAxes: [
            {
              stacked: false,
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Footfall',
                fontColor: 'black',
                fontFamily: 'Roboto'
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      } }
      );
  }

 ngOnInit() {
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
        this.showMetricsData();
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
