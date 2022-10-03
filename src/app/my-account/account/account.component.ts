import { Component, OnDestroy, OnInit } from '@angular/core';
import { FetchDataService } from 'src/app/shared/fetch-data.service';
import { Endpoints } from 'src/app/shared/endpoints';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { User } from 'src/app/shared/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  userId: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  username: string = '';
  userInitials: string = '';

  city: string = '';
  street: string = '';
  number: number = 0;
  zipcode: string = '';

  constructor(
    private fetchData: FetchDataService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.userDataToRender();
  }

  userDataToRender() {
    this.subscription.add(
      this.getUserData().subscribe((response: User): void => {
        if (response) {
          this.userId = response.id;
          this.firstName = response.name.firstname;
          this.lastName = response.name.lastname;
          this.email = response.email;
          this.phone = response.phone;
          this.username = response.username;
          this.userInitials =
            response.name.firstname[0] + response.name.lastname[0];

          this.city = response.address.city;
          this.street = response.address.street;
          this.number = response.address.number;
          this.zipcode = response.address.zipcode;
        }
      })
    );
  }

  getUserData() {
    return this.fetchData.fetchData<User>(
      Endpoints.USERS + `/${this.localStorage.get('userId')}`
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
