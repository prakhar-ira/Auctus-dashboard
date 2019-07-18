import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }


  ngOnInit() {
    $(function () {
      $('a.dropdownList').on('click', function (e) {
          const menuItem = $( e.currentTarget );
          if (menuItem.attr( 'aria-expanded') === 'true') {
              $(this).attr( 'aria-expanded', 'false');
          } else {
              $(this).attr( 'aria-expanded', 'true');
          }
      });
  });
  }

}
