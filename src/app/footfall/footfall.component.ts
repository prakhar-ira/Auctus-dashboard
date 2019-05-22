import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { takeWhile, finalize, map } from 'rxjs/operators';
import { Moment } from 'moment';
import { ChartService } from 'src/app/shared/services/chart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

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
  compareToSelect: any = 'previousPeriod';
  isLoading: boolean;


  private alive = true;


  constructor(
    private http: HttpClient,
    private router: Router,
    private chart: ChartService,
    private auth: AuthService
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

  change(event: any) {
    if (event.startDate && event.endDate) {
      this.selected.startDate = event.startDate.format('M/D/YYYY');
      this.selected.endDate = event.endDate.format('M/D/YYYY');
      console.log(this.selected.startDate, this.selected.endDate, event);
      this.isLoading = true;
      const footfall = {
        'from': Date.parse(this.selected.startDate) / 1000,
        'to': Date.parse(this.selected.endDate) / 1000
      };
      this.auth
   .postDailyFootFall(footfall)
   .pipe(
    takeWhile(() => this.alive),
  )
   .subscribe(
      (results: any) => {
        this.isLoading = false;
       console.log(results);
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
    console.log(ev);
  }

  compareToDateRange(event: any) {
    if (event.startDate && event.endDate) {
      this.selected.startDate = event.startDate.format('M/D/YYYY');
      this.selected.endDate = event.endDate.format('M/D/YYYY');
      console.log(this.selected.startDate, this.selected.endDate, event);
      const date = this.results.map(result => {
        return result.date;
      });
     const startIndex = date.indexOf(this.selected.startDate);
     const endIndex = date.indexOf(this.selected.endDate);
     this.changedRows = date.slice(startIndex, (endIndex + 1));
     this.showCompareTo(this.typeMetrics);
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
      this.selected.startDate = event.startDate.format('M/D/YYYY');
      this.selected.endDate = event.endDate.format('M/D/YYYY');
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

 showCompareTo(type) {
  this.typeMetrics = type;
  if (type === 'Foot fall') {
     this.data = this.results.map(result => {
      return result.footfall;
    });
  } else {
     this.data = this.results.map(result => {
      return result.dwell_time;
    });
  }
  const date = this.results.map(result => {
    return result.date;
  });
  const value = this.monthlyData.map(result => {
    return result.footfall;
  });
  console.log(this.data, value);

  this.compareTo = new Chart('compareTo', {
    type: 'line',
    data: {
      labels: date,
  datasets: [{
              data: this.data,
              backgroundColor: 'rgba(102, 187, 158,0.2)',
              borderColor: 'rgb(102,187,158)',
              pointBackgroundColor: 'rgb(67, 122, 103)',
              xAxisID: 'x-axis-1'
            },
            {
              backgroundColor: 'rgba(188,101,47,0.2)',
              borderColor: 'rgb(168,101,47)',
              pointBackgroundColor: 'rgb(155, 21, 6)',
              data: value,
              xAxisID: 'x-axis-2'
            }]
          },
          options: {
            legend: {
              position: 'top',
              display: false
            },
            scales: {
              yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
              xAxes: [{
                display: true,
                position: 'top',
                id: 'x-axis-1'
              },
              {
                display: true,
                position: 'bottom',
                id: 'x-axis-2'
              }]
            },
            responsive: true,
            maintainAspectRatio: true,
          }
        });
 }

  changeDateRange(ev: any) {
    console.log(ev.target.value);
    switch (ev.target.value) {
      case 'lastMonth': this.showLastMonthdata();
                        break;
      case 'lastWeek' : this.showLastWeekdata();
                        break;
      case 'last30Days' : this.showLast30Daysdata();
                        break;
      case 'last7Days' : this.showLast7Daysdata();
                        break;
      default: return;
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
