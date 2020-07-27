import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMsg = '';
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }
  onSubmit(data) {
    if (data.password1 == data.password2) {
      this.errorMsg = 'Creating User Please Wait';
      this.http.post('api/create-user', { email_id: data.email, password: data.password1, 
        first_name: data.first_name, last_name: data.last_name, address: data.address, 
        dob: data.dob, company: data.company }).subscribe(res => {
        window.alert('User Created. Redirecting To Login Page.');
        this.router.navigate(['login']);
      }, error => {
        window.alert(error.error.msg);
      });
    }
    else {
      window.alert('Password Is Not Matching');
    }
  }
}
