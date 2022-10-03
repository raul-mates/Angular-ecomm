import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Endpoints } from '../shared/endpoints';
import { FetchDataService } from '../shared/fetch-data.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { User } from '../shared/user.model';

export interface UserLoginData {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Login implements OnInit {
  isUserValid!: boolean | null;
  userId = new BehaviorSubject<string | null>(localStorage.getItem('USER_ID'));

  constructor(
    private fetchDataService: FetchDataService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {}

  authenticateUser(userData: UserLoginData): Observable<Object> {
    return this.fetchDataService.postData(Endpoints.LOGIN, userData);
  }

  getUsers(): Observable<User[]> {
    return this.fetchDataService.fetchData<User[]>(Endpoints.USERS);
  }

  getUserId() {
    this.fetchDataService
      .fetchData<User[]>(Endpoints.USERS)
      .subscribe((response) => {
        response.forEach((user) => {
          if (user.username === this.localStorageService.get('username')) {
            this.localStorageService.set('userId', String(user.id));
          }
        });
      });
  }
}
