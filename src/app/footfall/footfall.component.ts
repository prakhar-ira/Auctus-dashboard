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
  HourlyChart: any;
  compareTo: any;
  showCompareToGraph = false;
  results: any;
  compareToResults: any;
  monthlyData: any;
  weeklyData: any;
  hourlyData: any;
  changedRows: any;
  typeMetrics: string;
  selected: {startDate: string, endDate: string};
  dateRange: any = 'range';
  customSelected: {startDate: Moment, endDate: Moment};
  compareto = false;
  compareToCustomDate: {startDate: Moment, endDate: Moment};
  compareToSelect: any = 'range';
  isLoading: boolean;
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

  showWeeklyData() {
    const date = this.weeklyData.map(result => {
      return result.week_start_date;
    });
    const footfall = this.weeklyData.map(result => {
      return result.footfall;
    });
    this.WeeklyChart = new Chart('weeklyChart', {
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
          text: 'Foot fall weekly data',
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
      this.isLoading = true;
      const footfall = {
        'from': this.selected.startDate,
        'to': this.selected.endDate
      };
      this.auth
   .postDailyFootFall(footfall)
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
                          footfall['from'] = moment().subtract(2, 'years').format('YYYY-MM-DD');
                          break;
        default: return this.toastr.error('Please select primary date range');
      }
this.isLoading = true;
      this.auth
   .postDailyFootFall(footfall)
   .pipe(
    takeWhile(() => this.alive),
  )
   .subscribe(
      (results: any) => {
        this.isLoading = false;
        this.compareToResults = results;
        this.showCompareTo();
      },
      res => {
        console.log(res);
        this.router.navigate(['/']);
      }
    );
  }
}

  compareToDateRange(event: any) {
    if (event.startDate && event.endDate) {
      this.selected.startDate = event.startDate.format('YYYY-MM-DD');
      this.selected.endDate = event.endDate.format('YYYY-MM-DD');
      console.log(this.selected.startDate, this.selected.endDate, event);
      this.isLoading = true;
      const footfall = {
        'from': this.selected.startDate,
        'to': this.selected.endDate
      };
      this.auth
   .postDailyFootFall(footfall)
   .pipe(
    takeWhile(() => this.alive),
  )
   .subscribe(
      (results: any) => {
        this.isLoading = false;
        this.compareToResults = results;
        this.showCompareTo();
      },
      res => {
        console.log(res);
        this.router.navigate(['/']);
      }
    );
  }
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

  changeCustomDate(event: any) {
    if (event.startDate && event.endDate) {
      this.selected.startDate = event.startDate.format('YYYY-MM-DD');
      this.selected.endDate = event.endDate.format('YYYY-MM-DD');
      console.log(this.selected.startDate, this.selected.endDate, event);
      const date = this.results.map(result => {
        return result.date;
      });
     const startIndex = date.indexOf(this.selected.startDate);
     const endIndex = date.indexOf(this.selected.endDate);
     this.changedRows = date.slice(startIndex, (endIndex + 1));
     this.showMetricsData();
    }
 }

 showCompareTo() {
  this.LineChart = new Chart('lineChart', {
    type: 'line',
    data: {
      labels: this.results.date,
      datasets: [{
              label: 'Primary range',
              data: this.results.daily_footfall,
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
              data: this.compareToResults.daily_footfall,
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
                        footfall['from'] = moment().subtract(1, 'years').format('YYYY-MM-DD');
                        break;
      default: return;
    }
    this.isLoading = true;
      this.auth
   .postDailyFootFall(footfall)
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
              data: this.results.daily_footfall,
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

  this.http.get('../assets/store_hierarchy_modified.json')
      .pipe(
         takeWhile(() => this.alive),
      )
      .subscribe(
        (results: any) => {
          console.log(results, this.nodes);
           this.nodes = results;
        },
        res => {
          console.log(res);        }
      );
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
