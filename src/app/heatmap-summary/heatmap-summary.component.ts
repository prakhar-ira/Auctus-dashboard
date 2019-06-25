import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-heatmap-summary',
  templateUrl: './heatmap-summary.component.html',
  styleUrls: ['./heatmap-summary.component.scss']
})
export class HeatmapSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const data = {
      splash: 10,
      pantaloons: 20,
      madame: 5,
      lifestyle: 15,
      lenskart: 18
    };
    const color = {
      splash: 'red',
      pantaloons: 'blue',
      madame: 'green',
      lifestyle: 'yellow',
      lenskart: 'grey'
    };
    const id = ['madame', 'lenskart', 'lifestyle', 'pantaloons', 'splash'];
    id.map(_id => {
      $(`#${_id}`).css({ fill: color[_id], stroke: color[_id] });
    });
    $('rect').mouseover(function(evt) {
      const sid = this.id;
      const footfall = data[sid];
      document.getElementById(sid).style.stroke = 'black';
      const tooltip = document.getElementById('tooltip');
      tooltip.innerHTML = 'Footfall: ' + footfall;
      tooltip.style.display = 'block';
      const x = parseInt($(this).attr('x'), 10);
      const y = parseInt($(this).attr('y'), 10);
      const H = parseInt($(this).attr('height'), 10) * 0.5;
      const W = parseInt($(this).attr('width'), 10) * 0.5;
      tooltip.style.left = x + W + 'px';
      tooltip.style.top = y - 30 + 'px';
    });
    $('rect').mouseout(function() {
      const sid = this.id;
      document.getElementById(sid).style.stroke = color[sid];
      const tooltip = document.getElementById('tooltip');
      tooltip.style.display = 'none';
    });
  }

}
