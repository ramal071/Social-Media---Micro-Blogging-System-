import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  socket: any;
  user: any;
  notification = [] ;

  constructor(private tokenService: TokenService, private usersService: UsersService) { 
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
   // console.log(this.user);  may be.check it
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }
  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
     // console.log(data);
     this.notification = data.result.notification.reverse();
    });                
  /*
    this.usersService.GetUserByName(this.user.username).subscribe(data => {
      console.log(data);
    });        */
  }
  MarkNotication(data){
    this.usersService.MarkNotification(data._id).subscribe(value => {
      this.socket.emit('refresh', {});
    });
    
  }
  DeleteNotication(data) {
    this.usersService.MarkNotification(data._id, true).subscribe(value => {
      this.socket.emit('refresh', {});
    });
  }
  TimeFromNow(time) {
    return moment(time).fromNow();
  }

}
