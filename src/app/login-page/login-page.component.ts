import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { Login, UserLoginData } from './login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  inputsValid: boolean = false;
  isFormValid: boolean | null = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private login: Login,
    private route: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/product-list-page']);
    }
  }

  onSubmit(form: NgForm) {
    this.isFormValid = form.valid;
    if (form.value) this.subscription.add(this.onUserLogin(form.value));
  }

  onUserLogin(userData: UserLoginData): void {
    this.login
      .authenticateUser(userData)
      .pipe(
        map((response: any) => {
          this.localStorageService.set('token', response.token);
          return response;
        }),
        catchError((error) => {
          return throwError(() => {
            this.isFormValid = false;
            return new Error(error.error);
          });
        })
      )
      .subscribe((response) => {
        if (response) {
          this.isFormValid = true;
          this.route.navigate(['/product-list-page']);
          this.localStorageService.set('username', this.username);
          this.route.navigate(['/product-list-page']);
          this.login.getUserId();
        }
      });
  }

  inputsValidation() {
    this.username.length >= 5 && this.password.length >= 6
      ? (this.inputsValid = true)
      : (this.inputsValid = false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
