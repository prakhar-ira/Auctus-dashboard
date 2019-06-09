import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment as ENV } from '../../../environments/environment';
import { takeWhile } from 'rxjs/operators';
import {Router} from '@angular/router';



@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  token: string;
  token_expires: Date;
  username: string;
  errors: any = [];
  private httpOptions: any;
  private alive = true;
  constructor( private  httpClient:  HttpClient,
    private router: Router
    ) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  data: any[] = [];
  month: string[] = [];
  sales: number[] = [];
  chart: any = [];

  getFirstPage() {
      const newHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const httpOptions = {
        headers: newHeaders
      };
      return this.httpClient.get(`${ENV.API_URL}/hello/`, httpOptions);
  }

   getdata() {
    const newHeaders = new HttpHeaders().set('Authorization', 'JWT' + this.token);
    const httpOptions = {
      headers: newHeaders
    };
   this.httpClient.get(`${ENV.API_URL}/hello/`, httpOptions).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }



    login(user: any) {
     this.httpClient.post(`${ENV.API_URL}/api-token-auth/`, JSON.stringify(user), this.httpOptions)
     .pipe(
      takeWhile(() => this.alive)
     ).subscribe(
      data => {
        this.updateData(data['token']);
        this.router.navigate(['/dashboard']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  // Refreshes the JWT token, to extend the time the user is logged in
   refreshToken() {
    this.httpClient.post(`${ENV.API_URL}/api-token-refresh/`, JSON.stringify({token: this.token}), this.httpOptions)
    .pipe(
      takeWhile(() => this.alive)
     ).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

 logout() {
    this.token = null;
    this.token_expires = null;
  }


  getDailyFootFall() {
    const headers = new HttpHeaders().set('Authorization', `JWT ${this.token}`);
    return this.httpClient.get(`${ENV.API_URL}/analytics/`, { headers });
  }

  postDailyFootFall(dailyfootfall) {
    const headers = new HttpHeaders().set('Authorization', `JWT ${this.token}`);
    return this.httpClient.post(`${ENV.API_URL}/analytics/`, dailyfootfall, { headers });
  }

  private updateData(token: string) {
    this.token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
