import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { AuthService } from '../services/auth.service';
//import { from } from 'rxjs';
 
@NgModule({
  declarations: 
  [AuthTabsComponent, SignupComponent,LoginComponent],
  imports: [
    CommonModule, HttpClientModule, FormsModule, 
    ReactiveFormsModule 
  ],

 // providers :[ AuthService],
    providers :[ AuthService, AuthTabsComponent, LoginComponent, 
    SignupComponent], 
  exports:[SignupComponent, AuthTabsComponent, LoginComponent]
})
export class AuthModule {
  //Your module is not yet loaded by the Angular Server in node ng serve, so restart your server so the server loads the module that you just added in @NgModule app.module.ts
 } 