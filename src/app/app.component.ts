import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { takeWhile, finalize, map } from 'rxjs/operators';
import { Moment } from 'moment';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Auctus-Dashboard';
  LineChart: any;
  data: any[] = [];
  MonthlyChart: any;
  WeeklyChart: any;
  HourlyChart: any;
  results: any;
  monthlyData: any;
  weeklyData: any;
  hourlyData: any;
  changedRows: any;
  typeMetrics: string;
  selected: {startDate: Moment, endDate: Moment};

  private alive = true;


  constructor(private http: HttpClient) {}

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
      const date = this.results.map(result => {
        return result.date;
      });
     const startIndex = date.indexOf(this.selected.startDate);
     const endIndex = date.indexOf(this.selected.endDate);
     this.changedRows = date.slice(startIndex, (endIndex + 1));
     this.showMetricsData(this.typeMetrics, this.changedRows);
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
    ev.target.value === 'Footfall'
    ? this.showMetricsData('Foot fall')
    : this.showMetricsData('Dwell time');
  }


  showMetricsData(type, dateRangeArray?) {
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
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
          labels: dateRangeArray || date,
          datasets: [{
              label: '',
              data: this.data,
              fill: false,
              lineTension: 0.2,
              borderColor: 'red',
              borderWidth: 1,
          }]
        },
      options: {
        title: {
          text: `${type} daily data`,
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

 async ngOnInit() {
   this.results =  await this.http.get('../assets/convertcsv.json').toPromise();
   this.monthlyData =  await this.http.get('../assets/monthly.json').toPromise();
   this.weeklyData =  await this.http.get('../assets/weekly.json').toPromise();
   this.hourlyData =  await this.http.get('../assets/hourly.json').toPromise();
   this.showMetricsData('Foot fall');
   this.showMonthlyData();
   this.showWeeklyData();
   this.showhHourlyData();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
