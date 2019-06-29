import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

loginForm: FormGroup = this.fb.group({
  username: ['', Validators.required],
  password: ['', Validators.required]
});
  constructor(
    private _userService: AuthService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  login(value, valid) {
    console.log(value);
    this._userService.login(value);
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
    this.router.navigate(['/']);
  }

  getdata() {
    this._userService.getdata();
  }


}
