import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private localStorageService: LocalStorageService) {}

  isLoggedIn() {
    return !!this.localStorageService.get('token');
  }
}
