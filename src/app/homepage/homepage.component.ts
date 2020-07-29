import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  heading = 'Loading User Deatils.....';
  loadingComplted = false;
  onSubcribeErrorMsg = '';
  errorInPurchase = '';
  errorInDelete = '';
  newService :any;
  userData :any;
  subscriptionData = [];
  products = [];
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }



  ngOnInit(): void {
    if (localStorage.getItem('data-auth-key')) {
      this.loadProductsList();
      if (localStorage.getItem('data-user')) {
        this.userData = JSON.parse(localStorage.getItem('data-user'));
        this.heading = 'Hello ' + this.userData.first_name;
      }
      else {
        this.http.get('api/user-info', { headers: { Authorization: localStorage.getItem('data-auth-key') } }).subscribe((res:any) => {
          this.userData = res.user;
          localStorage.setItem('data-user', JSON.stringify(res.user));
          this.heading = 'Hello ' + this.userData.first_name;
        }, error => {
          if (error.status == 403) {
            this.router.navigate(['login']);
          }
          this.heading = 'Error: ' + error.message;
        });
      }
      if (localStorage.getItem('data-user-subscription')) {
        this.subscriptionData = JSON.parse(localStorage.getItem('data-user-subscription'));
      }
      else {
        this.http.get('api/subscription', { headers: { Authorization: localStorage.getItem('data-auth-key') } }).subscribe((res:any) => {
          localStorage.setItem('data-user-subscription', JSON.stringify(res.subscription));
          this.subscriptionData = res.subscription;

        }, error => {
          if (error.status == 403) {
            this.router.navigate(['login']);
          }
          this.heading = 'Error: ' + error.message;
        });
      }

    }
    else {
      this.router.navigate(['login']);
    }
  }

  loadProductsList() {
    this.http.get('api/products', { headers: { Authorization: localStorage.getItem('data-auth-key') } }).subscribe((res:any) => {
      this.products = res.msg;
      this.loadingComplted = true;
    }, error => {
      if (error.status == 403) {
        this.router.navigate(['login']);
      }
      this.heading = 'Error: ' + error.message;
    });
  }

  onSubscribeClick(data) {
    if (this.userData.product_id) {
      this.onSubcribeErrorMsg = 'You Are Already Subcribed To Another Pack. Kindly Cancel Older Subcribtion First.';
    }
    else {
      this.newService = data;

    }

  }

  confirmPurchase(data) {
    if (data.cardNumber.length == 16) {
      this.errorInPurchase = 'Connecting To Server. Please Wait....';
      this.http.post('api/subscription', {
        card_number: data.cardNumber,
        exp_month: data.expireMM,
        exp_year: data.expireYY,
        cvv: data.cvv,
        product_id: this.newService.id,
        product_name: this.newService.nickname,
        headers:
          { Authorization: localStorage.getItem('data-auth-key') }
      }).subscribe(
        res => {
          localStorage.removeItem('data-user');
          localStorage.removeItem('data-user-subscription');
          window.alert('Subscription Created.');
          window.location.reload();

        },
        error => {
          this.errorInPurchase = error.error.msg;
        });

    }
    else {
      this.errorInPurchase = 'Invalid Card Number';
    }



  }
  onCancelClick() {
    this.errorInDelete = 'Connecting To Server. Please Wait....';
    this.http.delete('api/subscription', {
      headers:
        { Authorization: localStorage.getItem('data-auth-key') }
    }).subscribe(
      res => {
        localStorage.removeItem('data-user');
        localStorage.removeItem('data-user-subscription');
        window.alert('Subscription Deleted.');
        window.location.reload();
      },
      error => {
        this.errorInDelete = error.error.msg;
      });
  }

  logoutUser() {
    this.http.get('api/logout-request', { headers: { Authorization: localStorage.getItem('data-auth-key') } }).subscribe(res => {
    });
    localStorage.removeItem('data-user');
    localStorage.removeItem('data-auth-key');
    this.router.navigate(['login']);

  }

}
