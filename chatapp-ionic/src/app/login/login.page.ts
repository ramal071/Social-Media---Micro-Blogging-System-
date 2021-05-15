import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';  

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit { 

  constructor(public navCtrl:NavController, public navParam ) { }

/*  ionViewDidLoad() =  ngOnInit()  { // added
    console.log('ionViewDidLoad LoginPage');
  }*/

  ngOnInit() { 
    
  }

  RegisterPage() {
  // this.navCtrl.push('RegisterPage')
  }

}
