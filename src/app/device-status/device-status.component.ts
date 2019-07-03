import { Component, OnInit } from '@angular/core';
import { takeWhile, finalize, map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { interval } from 'rxjs';





@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss']
})
export class DeviceStatusComponent implements OnInit {

  results: any;
  newResults: any;
  isLoading: boolean;
  private alive = true;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  fetchResults() {
    this.isLoading = true;
    this.auth
    .getDeviceStatus()
    .pipe(
     takeWhile(() => this.alive),
   )
    .subscribe(
       (results: any) => {
        this.isLoading = false;
         this.results = JSON.parse(results);
         this.newResults = this.results.map(result => {
           return {
              device_down_status: result['Device Down Status'],
              floor: result['Floor'],
              last_checkin: result['Last Checkin'],
              mac_id: result['MAC ID'],
              node: result['Node'],
              zone: result['Zone'],
           };
         });
       },
       res => {
         console.log(res);
         this.router.navigate(['/']);
       }
     );
  }

  ngOnInit() {
    const token = localStorage.getItem('userInfo');
    this.auth.refreshToken(token);
    this.fetchResults();
    interval(8000 * 60).subscribe(x => {
      this.fetchResults();
    });

  }

}
