import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';
import { AuthService } from './../../services/auth.service';
//import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;
  showSpinner = false;  

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private tokenService: TokenService) { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.loginForm = this.fb.group({
    username: ['', Validators.required ],
    password: ['', Validators.required ]
  });
  }
  loginUser(){ 
    this.showSpinner = true;
    this.authService.loginUser(this.loginForm.value)
    .subscribe(data => {
      this.tokenService.SetToken(data.token);
      this.loginForm.reset(); 
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
    }, err => {
      this.showSpinner = false;
      
      if(err.error.message) {
        this.errorMessage = err.error.message;      
      }
    });
  }
 
}
