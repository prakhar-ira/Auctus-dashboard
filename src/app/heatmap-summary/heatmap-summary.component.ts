import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import { AuthService } from '../shared/services/auth.service';
import { takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';


@Component({
  selector: 'app-heatmap-summary',
  templateUrl: './heatmap-summary.component.html',
  styleUrls: ['./heatmap-summary.component.scss']
})
export class HeatmapSummaryComponent implements OnInit {

  primaryMetrics = 'footfall';
  dateRange: any = 'range';
  selected = {startDate: moment, endDate: moment};
  floors = '';
  compareToSelect: any = 'range';
  compareToCustomDate = {startDate: moment, endDate: moment};
  isLoading: boolean;
  private alive = true;

  constructor(
    private auth: AuthService,
    private router: Router,

  ) { }

  showHeatMap(response) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const color_bar = response.legend['footfall_hex'];
    const color_bar_value = response.legend['Index'];
    for (let i = 0; i < color_bar.length; i++) {
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('id', `${i}`);
        rect.setAttribute('x', `${20 + 5 * i}`);
        rect.setAttribute('y', '5');
        rect.setAttribute('width', '5');
        rect.setAttribute('height', '20');
        rect.setAttribute('fill', color_bar[i]);
        rect.setAttribute('stroke', color_bar[i]);
        document.getElementById('mySVG').appendChild(rect);
    }


    const lg_data = response.data.lower_ground;
    const metric = response.metric;

    const id = [];
    for (const key of Object.keys(lg_data)) {
      id.push(key);
    }

    id.map(_id => {
        $(`#${_id}`).css({ fill: lg_data[_id][metric + '_hex'], stroke: 'white' });

    });

    const lg = document.querySelectorAll('#LG');
    console.log(lg);
    for (let i = 0; i < lg.length; i++) {
      lg[i]['style']['fill'] = 'grey';
      lg[i]['style']['stroke'] = 'white';
    }


    $('rect').on('mouseover', function (evt) {
        const sid = this.id;
        $(this).css('cursor', 'pointer');
        if (sid !== 'LG') {
            const brand_name = lg_data[sid]['brand_name_display'];
            const color_index = lg_data[sid]['color_index'];
            const hex = lg_data[sid][metric + '_hex'];
            const json = {
                'footfall':
                {
                    'name': 'Footfall',
                    'value': lg_data[sid]['footfall'],
                    'change': lg_data[sid]['d_footfall']
                },
                'new_customer':
                {
                    'name': 'New Customers',
                    'value': lg_data[sid]['new_footfall'],
                    'change': lg_data[sid]['d_new_footfall']
                },
                'returning_customer':
                {
                    'name': 'Returning Customers',
                    'value': lg_data[sid]['repeat_footfall'],
                    'change': lg_data[sid]['d_repeat_footfall']
                },
                'footfall_hours':
                {
                    'name': 'Footfall hours',
                    'value': lg_data[sid]['footfall_hours'],
                    'change': lg_data[sid]['d_footfall_hours']
                },
                'avg_dwell_time':
                {
                    'name': 'Avg. Dwell Time (mins)',
                    'value': lg_data[sid]['avg_dwell_time'],
                    'change': lg_data[sid]['d_avg_dwell_time']
                },
                'sale':
                {
                    'name': 'Sales (INR)',
                    'value': '--',
                    'change': '--'
                }
            };
            const values = ['footfall', 'returning_customer', 'new_customer', 'footfall_hours', 'avg_dwell_time', 'sale'];
            document.getElementById(sid).style.stroke = 'white';
            document.getElementById(sid).style.strokeWidth = '3';
            const tooltip = document.getElementById('tooltip');
            const marker = document.getElementById('marker');
            const marker_range = document.getElementById('marker_range');
            marker_range.innerHTML = color_bar_value[color_index] + ' - ' + color_bar_value[color_index + 1];
            marker_range.setAttribute('x', String(20 + 5 * color_index));
            marker_range.setAttribute('y', '65');
            const marker_pos = 20 + 5 * color_index;
            marker.setAttribute('transform', 'translate(' + marker_pos + ',25)');

            marker.style.fill = hex;
            tooltip.style.background = 'white';
            document.getElementById('tooltip').style.boxShadow = '0 4px 8px 0 ' + hex;
            document.getElementById('card-header').innerHTML = brand_name;
            document.getElementById('card-header').style.color = hex;
            values.forEach(value => {
                document.getElementById(`${value}-name`).innerHTML = json[value]['name'];
                document.getElementById(`${value}-value`).innerHTML = json[value].value;
                document.getElementById(`${value}-color`).innerHTML = (json[value].change > 0)
                ? `&#129033; ${json[value].change}%` : `&#129035; ${Math.abs(json[value].change)}%`;
                document.getElementById(`${value}-color`).style.color = (json[value].change > 0) ? 'green' : 'red';
            });
            tooltip.style.display = 'block';
            const width = $(this).width();
            const height = $(this).height();
            const parentOffset = $(this).parent().offset();
            const { top, left } = $(this).position();
            const relX = 1100 - (left - parentOffset.left) - (width * 0.35);
            const relY = 500 - (top - parentOffset.top) - (height * 0.35);
            if (relX > 800) {
              const leftX = left - parentOffset.left + (width * 0.35);
              tooltip.style.left = `${leftX}px`;
              tooltip.style.right = 'auto';
            } else {
              tooltip.style.left = 'auto';
              tooltip.style.right = `${relX}px`;
            }
            tooltip.style.bottom = `${relY}px`;
        }
    });

    $('#tooltip').on('mousein', function () {
      $(this).css('display', 'block');
    });

    $('rect').on('mouseout', function () {
      const sid = this.id;
      if (sid !== 'LG' && isNaN(parseInt(sid, 10)) === true) {
          const marker = document.getElementById('marker');
          const marker_range = document.getElementById('marker_range');
          marker.style.fill = 'none';
          document.getElementById(sid).style.fill = lg_data[sid][metric + '_hex'];
          document.getElementById(sid).style.stroke = lg_data[sid][metric + '_hex'];
          const tooltip = document.getElementById('tooltip');
          tooltip.style.display = 'none';
          marker_range.innerHTML = '';
      }
    });
  }

  changeMetrics(ev) {
  }
  selectFloors(ev) {
  }
  changeCompareTo(ev) {
  }
  compareToDateRange(ev) {
  }
  changeSelection(ev) {
  }

  ngOnInit() {
  this.isLoading = true;
   this.auth.getHeatMapData()
   .pipe(
    takeWhile(() => this.alive),
  )
   .subscribe(
      (results: any) => {
        this.isLoading = false;
        this.showHeatMap(results);
        console.log(results);
      },
      res => {
        console.log(res);
        this.router.navigate(['/']);
      }
   );
}
}
