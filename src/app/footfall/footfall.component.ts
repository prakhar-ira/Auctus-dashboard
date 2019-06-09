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

  showhHourlyData() {
    const date = this.hourlyData.map(result => {
      return result.month_start_date;
    });
    const footfall = this.hourlyData.map(result => {
      return result.footfall;
    });
    this.HourlyChart = new Chart('hourlyChart ', {
      type: 'line',
      data: {
          labels: date,
          datasets: [{
              label: '',
              data: footfall,
              fill: false,
              lineTension: 0.2,
              borderColor: 'red',
              borderWidth: 1,
          }]
        },
      options: {
        title: {
          text: 'Foot fall hourly data',
          display: true
        },
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

  }

  changeSelection(event: any) {
      console.log(event);
    if (event.startDate && event.endDate) {
      this.selected.startDate = event.startDate.format('YYYY-MM-DD');
      this.selected.endDate = event.endDate.format('YYYY-MM-DD');
      console.log(this.selected.startDate, this.selected.endDate, event);
      // this.isLoading = true;
  //     const footfall = {
  //       'from': this.selected.startDate,
  //       'to': this.selected.endDate,
  //     };
  //     this.auth
  //  .postDailyFootFall(footfall)
  //  .pipe(
  //   takeWhile(() => this.alive),
  // )
  //  .subscribe(
  //     (results: any) => {
  //       this.isLoading = false;
  //       this.results = results;
  //       this.showMetricsData();
  //     },
  //     res => {
  //       console.log(res);
  //       this.router.navigate(['/']);
  //     }
    // );
    // }
    }
    //  this.changedRows = date.slice(startIndex, (endIndex + 1));
    //  this.showMetricsData();
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
// this.isLoading = true;
//       this.auth
//    .postDailyFootFall(footfall)
//    .pipe(
//     takeWhile(() => this.alive),
//   )
//    .subscribe(
//       (results: any) => {
//         this.isLoading = false;
//         this.compareToResults = results;
//         this.showCompareTo();
//       },
//       res => {
//         console.log(res);
//         this.router.navigate(['/']);
//       }
//     );
//   }
    }
}

changeTab(e) {
  console.log('hi', e, e.target.value, this.period);
}

changeVsMetrics(event) {
  if (!this.selected.startDate && !this.selected.endDate) {
    return this.toastr.error('Please select primary date range');
  }
console.log(event.target.value, this.secondaryMetrics);
const postData = {
  'from':  this.selected.startDate,
  'to': this.selected.endDate,
  'metric': this.primaryMetrics,
  'compare_flag': `${this.compareTo}`,
  'compare_from': this.compareToCustomDate.startDate,
  'compare_to': this.compareToCustomDate.endDate,
  'vs_metric_flag': `${this.vsMetric}`,
  'vs_metric': event.target.value,
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
    console.log(results);
    this.isLoading = false;
    this.showVsMetricData(results);
   },
   res => {
     console.log(res);
     this.router.navigate(['/']);
   }
 );
}

applyDateRange() {
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
              results.data.metric.compare_date.footfall, this.secondaryMetrics, results.data.vs_metric.compare_date);
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
    if (this.compareTo === true && this.vsMetric === true) {
      return this.showCompareVsMetricWeeklyData(results);
    } else if (this.compareTo === true && this.vsMetric === false) {
      return this.showCompareToWeeklyData(results);
    } else if (this.compareTo === false && this.vsMetric === true) {
      return this.showMetricsWeeklyData(results);
    } else if (this.compareTo === false && this.vsMetric === false) {
      return this.showWeeklyData(results);
    }
   },
   res => {
     console.log(res);
     this.router.navigate(['/']);
   }
 );
  console.log(period);
}

showCompareVsMetricWeeklyData(results) {

}

showChart(primary_date, compare_to, metric1, metric, metric2, vs_metric) {
  const vs_metric_date_compare = [];
  const metric_date_compare  = [];
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
      data: metric
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
  data: metric_date_compare
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
  data: vs_metric
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
  data: vs_metric_date_compare
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
    tooltips: {
      mode: 'label',
      callbacks: {
        label: function(tooltipItem, data) {
          return (
            tooltipItem.xLabel +
            ' ' +
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
        primary_date[0] +
        '&nbsp;-&nbsp;' +
        primary_date[primary_date.length - 1] +
        `:&emsp;<span style= color:`  +
        color_metric1 +
        `;> &#x25CF;&emsp;</span>` +
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
      font-size: 14px;color:'#666'}</style </head><p style='text-align: left;'>` +
      primary_date[0] +
      '&nbsp;-&nbsp;' +
      primary_date[primary_date.length - 1] +
      `:&emsp;<span style='color:` +
      color_metric1 +
      `';>&#x25CF;&emsp;</span>` +
      metric1 +
      `&emsp;<span style='color: ` +
      color_metric1_compare +
      `';>&#x25CF;&emsp;</span>` +
      metric2 +
      '<br>' +
      compare_to[0] +
      ' - ' +
      compare_to[compare_to.length - 1] +
      `:&emsp;<span style='color:` +
      color_metric2 +
      `';>&#x25CF;&emsp;</span>` +
      metric1 +
      `&emsp;<span style='color: ` +
      color_metric2_compare +
      `';>&#x25CF;&emsp;</span>` +
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
       color:'#666'}</style </head><p style='text-align: left;'>` +
      primary_date[0] +
      '&nbsp;-&nbsp;' +
      primary_date[primary_date.length - 1] +
      `:&emsp;<span style='color: ` +
      color_metric1 +
      `';>&#x25CF;&ensp;</span>` +
      metric1 +
      '<br>' +
      compare_to[0] +
      '&nbsp;-&nbsp;' +
      compare_to[compare_to.length - 1] +
      `:&emsp;<span style='color: ` +
      color_metric1_compare +
      `';>&#x25CF;</span>` +
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
      primary_date[0] +
      '&nbsp;-&nbsp;' +
      primary_date[primary_date.length - 1] +
      `:&emsp;<span style='color: ` +
      color_metric1 +
      `';>&#x25CF;&emsp;</span>` +
      metric1 +
      `'&emsp;<span style='color: ` +
      color_metric2 +
      `';> &#x25CF;</span>&emsp;` +
      metric2
    );
  };
}
// allocate and initialize a chart
// this.LineChart = new Chart('lineChart', config);
}

showCompareToWeeklyData(results) {
  this.WeeklyChart = new Chart('weeklyChart', {
    type: 'line',
    data: {
      labels: results.data.metric.primary_date.date,
      datasets: [{
              label: 'Primary range',
              data: results.data.metric.primary_date.footfall,
              lineTension: 0.2,
              borderColor: '#cc181f',
              borderWidth: 1,
              pointBackgroundColor: '#ce4532',
              fill: false
            },
            {
              label: 'Secondary range',
              lineTension: 0.2,
              borderWidth: 1,
              borderColor: 'rgb(30, 95, 236)',
              pointBackgroundColor: '#134fcf',
              data:  results.data.metric.compare_date.footfall,
              fill: false
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Foorfall data'
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            legend: {
              position: 'top',
              display: false
            },
            scales: {
              yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Footfall'
                },
            }],
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: 'Date'
                },
              },
        ]
            },
            maintainAspectRatio: true,
          }
        });
      }
showMetricsWeeklyData(results) {

}

showWeeklyData(results) {
  this.WeeklyChart = new Chart('weeklyChart', {
    type: 'line',
    data: {
        labels: results.data.metric.primary_date.date,
        datasets: [{
            label: `${this.primaryMetrics} weekly data`,
            data: results.data.metric.primary_date.footfall,
            lineTension: 0.2,
            borderColor: '#cc181f',
            borderWidth: 1,
            pointBackgroundColor: '#ce4532',
            fill: false
        }]
      },
    options: {
      title: {
        display: true,
        text: 'Foorfall data'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      legend: {
        position: 'top',
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
              beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: `${this.primaryMetrics}`
          },
      }],
        xAxes: [{
          display: true,
          scaleLabel: {
            display: false,
            labelString: 'Date'
          },
        },
  ]
      },
      maintainAspectRatio: true,
    }
});

}


  compareToDateRange(event: any) {
    if (event.startDate && event.endDate) {
      this.compareToCustomDate.startDate = event.startDate.format('YYYY-MM-DD');
      this.compareToCustomDate.endDate = event.endDate.format('YYYY-MM-DD');
      console.log(this.compareToCustomDate.startDate, this.compareToCustomDate.endDate, event);
      // this.isLoading = true;
  //     const footfall = {
  //       'from': this.selected.startDate,
  //       'to': this.selected.endDate
  //     };
  //     this.auth
  //  .postDailyFootFall(footfall)
  //  .pipe(
  //   takeWhile(() => this.alive),
  // )
  //  .subscribe(
  //     (results: any) => {
  //       this.isLoading = false;
  //       this.compareToResults = results;
  //       this.showCompareTo();
  //     },
  //     res => {
  //       console.log(res);
  //       this.router.navigate(['/']);
  //     }
  //   );
  }
  }

  showVsMetricData(results) {
    Chart.defaults.global.elements.line.fill = false;
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: results.data.metric.primary_date.date,
        datasets: [{
                type: 'line',
                label: 'Primary range',
                yAxisID: 'y-axis-0',
                data: results.data.metric.primary_date.footfall,
                lineTension: 0.2,
                borderColor: '#cc181f',
                borderWidth: 1,
                pointBackgroundColor: '#ce4532',
                fill: false
              },
              {
                type: 'line',
                label: 'Primary compare to range',
                yAxisID: 'y-axis-0',
                lineTension: 0.2,
                borderWidth: 1,
                borderColor: 'rgb(30, 95, 236)',
                pointBackgroundColor: '#134fcf',
                data: results.data.metric.compare_date.footfall,
                fill: false
              },
              {
                type: 'line',
                label: 'Secondary date range',
                lineTension: 0.2,
                yAxisID: 'y-axis-0',
                borderWidth: 1,
                borderColor: '#cc181f',
                pointBackgroundColor: '#ce4532',
                data: results.data.vs_metric.primary_date.footfall,
                fill: false
              },
              {
                type: 'line',
                label: 'Secondary compare to range',
                yAxisID: 'y-axis-1',
                lineTension: 0.2,
                borderWidth: 1,
                borderColor: 'rgb(30, 95, 236)',
                pointBackgroundColor: '#134fcf',
                data: results.data.vs_metric.compare_date.footfall,
                fill: false
              }]
            },
            options: {
              title: {
                display: true,
                text: 'Foorfall data'
              },
              tooltips: {
                mode: 'index',
                intersect: false,
              },
              hover: {
                mode: 'nearest',
                intersect: true
              },
              legend: {
                position: 'top',
                display: true
              },
              scales: {
                yAxes: [{
                  stacked: false,
                  position: 'left',
                  id: 'y-axis-0',
                  ticks: {
                      beginAtZero: true
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Footfall'
                  },
              },
              {
                stacked: false,
                position: 'right',
                id: 'y-axis-1',
                ticks: {
                  beginAtZero: true,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Footfall'
                },
              }],
                xAxes: [{
                  display: true,
                  stacked: false,
                  scaleLabel: {
                    display: true,
                    labelString: 'Date'
                  },
                },
          ]
              },
              maintainAspectRatio: true,
            }
          });
  }

  showMonthlyData() {
    const date = this.monthlyData.map(result => {
      return result.timestamp_hour;
    });
    const footfall = this.monthlyData.map(result => {
      return result.footfall;
    });
    this.MonthlyChart = new Chart('monthlyChart', {
      type: 'line',
      data: {
          labels: date,
          datasets: [{
              label: '',
              data: footfall,
              fill: false,
              lineTension: 0.2,
              borderColor: 'red',
              borderWidth: 1,
          }]
        },
      options: {
        title: {
          text: 'Foot fall monthly data',
          display: true
        },
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

  }

  changeMetrics(ev: any) {
  }

 showCompareTo() {
  this.LineChart = new Chart('lineChart', {
    type: 'line',
    data: {
      labels: this.results.date,
      datasets: [{
              label: 'Primary range',
              data: this.results.footfall,
              lineTension: 0.2,
              borderColor: '#cc181f',
              borderWidth: 1,
              pointBackgroundColor: '#ce4532',
              fill: false
            },
            {
              label: 'Secondary range',
              lineTension: 0.2,
              borderWidth: 1,
              borderColor: 'rgb(30, 95, 236)',
              pointBackgroundColor: '#134fcf',
              data: this.compareToResults.footfall,
              fill: false
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Foorfall data'
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            legend: {
              position: 'top',
              display: false
            },
            scales: {
              yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Footfall'
                },
            }],
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: 'Date'
                },
              },
        ]
            },
            maintainAspectRatio: true,
          }
        });
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
  //   this.isLoading = true;
  //     this.auth
  //  .postDailyFootFall(footfall)
  //  .pipe(
  //   takeWhile(() => this.alive),
  // )
  //  .subscribe(
  //     (results: any) => {
  //       this.isLoading = false;
  //       this.results = results;
  //       this.showMetricsData();
  //     },
  //     res => {
  //       console.log(res);
  //       this.router.navigate(['/']);
  //     }
  //   );
    }
  }


  showLastMonthdata() {
    const date = this.results.map(result => {
      return result.date;
    });
    const lastMonthStartIndex = date.indexOf('2/1/2019');
    const lastMonthEndIndex = date.indexOf('2/28/2019');
    this.changedRows = date.slice(lastMonthStartIndex, (lastMonthEndIndex + 1));
    this.showMetricsData();
  }

  showLastWeekdata() {
  const date = this.results.map(result => {
    return result.date;
  });
  const lastMonthStartIndex = date.indexOf('2/1/2019');
  const lastMonthEndIndex = date.indexOf('2/8/2019');
  this.changedRows = date.slice(lastMonthStartIndex, (lastMonthEndIndex + 1));
  this.showMetricsData();
}

  showLast30Daysdata() {
  const date = this.results.map(result => {
    return result.date;
  });
  const lastMonthStartIndex = date.indexOf('2/19/2019');
  const lastMonthEndIndex = date.indexOf('3/19/2019');
  this.changedRows = date.slice(lastMonthStartIndex, (lastMonthEndIndex + 1));
  this.showMetricsData();
}

  showLast7Daysdata() {
  const date = this.results.map(result => {
    return result.date;
  });
  const lastMonthStartIndex = date.indexOf('3/12/2019');
  const lastMonthEndIndex = date.indexOf('3/19/2019');
  this.changedRows = date.slice(lastMonthStartIndex, (lastMonthEndIndex + 1));
   this.showMetricsData();
  }

  showCustomDaysdata() {
  const date = this.results.map(result => {
    return result.date;
  });
  const lastMonthStartIndex = date.indexOf('3/12/2019');
  const lastMonthEndIndex = date.indexOf('3/19/2019');
  this.changedRows = date.slice(lastMonthStartIndex, (lastMonthEndIndex + 1));
  this.showMetricsData();
  }


  showMetricsData() {
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
          labels: this.results.date,
          datasets: [{
              label: '',
              data: this.results.footfall,
              fill: false,
              lineTension: 0.2,
              borderColor: '#cc181f',
              borderWidth: 1,
          }]
        },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
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

  // this.http.get('../assets/store_hierarchy_modified.json')
  //     .pipe(
  //        takeWhile(() => this.alive),
  //     )
  //     .subscribe(
  //       (results: any) => {
  //         console.log(results, this.nodes);
  //          this.nodes = results;
  //       },
  //       res => {
  //         console.log(res);        }
  //     );
  //  this.monthlyData =  await this.http.get('../assets/monthly.json').toPromise();
  //  this.weeklyData =  await this.http.get('../assets/weekly.json').toPromise();
  //  this.hourlyData =  await this.http.get('../assets/hourly.json').toPromise();
  //  this.showMonthlyData();
  //  this.showWeeklyData();
  //  this.showhHourlyData();
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
