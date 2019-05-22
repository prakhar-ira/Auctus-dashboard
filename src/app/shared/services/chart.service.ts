import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }

  getDailyFootFall() {
    return this.http.get(`${environment.API_URL}/dailyfootfall`);
  }

  postDailyFootFall(dailyfootfall) {
    return this.http.post(`${environment.API_URL}/dailyfootfall`, dailyfootfall);
  }
}
