import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from './shared/services/auth.service';
// import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Dashboard - Retail Atlas';

  ngOnInit() {

  }
}
