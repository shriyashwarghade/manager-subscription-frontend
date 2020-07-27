import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMsg = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  onSubmit(data) {

    if (data.email == '' || data.password == '') {
      this.errorMsg = 'Email Or Password Can Not Be Blank';
    }
    else {
      this.errorMsg = 'Please Wait Login You Into The Portal....'
      this.http.post('api/login-request', { email_id: data.email, password: data.password }).subscribe(res => {
        this.errorMsg = '';
        localStorage.removeItem('data-user');
        localStorage.removeItem('data-user-subscription');
        localStorage.setItem('data-auth-key', res.session_id);
        this.router.navigate(['index']);
      }, error => {
        this.errorMsg = error.error.msg;
      });
    }
  }

}
