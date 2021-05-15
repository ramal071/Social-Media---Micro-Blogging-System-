import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user:any;
  notification = [];
  socket: any;
  count = [];
  chatList = [];
  msgNumber = 0;
  imageId: any;
  //imgId: any;
  imageVersion: any;
  //imgVersion:any;

  constructor(private tokenService: TokenService, 
    private router: Router,
    private usersService: UsersService,
    private msgService: MessageService
     ) { 
      this.socket = io('http://localhost:3000')
    }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
 
    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',  // notification drop down eka dakunata
      hover: true,
      coverTrigger: false
    });
    this.socket.emit('online', {room: 'global', user: this.user.username});

    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'right', // bell drop down eka dakunata
      hover: true,
      coverTrigger: false
    });

    this.GetUser();
   this.socket.on('refreshPage', () => {
     this.GetUser(); 
   })
  }  

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      // console.log(data);   lesson 227
      this.onlineUsers.emit(data);
    });
  }
  GetUser() { 
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      this.imageId = data.result.picId;
      this.imageVersion = data.result.picVersion;
      /**** */
      //L 259
     // console.log(data );
      this.notification = data.result.notification.reverse();
      const value = _.filter(this.notification, ['read' , false]);
      // console.log(value);
      this.count = value;
      this.chatList = data.result.chatList;
      //console.log(this.chatList); 
      this.CheckIfread(this.chatList);
      //console.log(this.msgNumber);

    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
    }
    });
  }

  CheckIfread(arr) {
    const checkArr = [];
    for(let i = 0; i < arr.length; i++) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length -1 ];
      if (this.router.url !== `/chat/${receiver.sendername}`) {
        if(receiver.isRead === false && receiver.receivername === this.user.username) {
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    } 
  } 

  MarkAll() {
    this.usersService.MarkAllAsRead() .subscribe(data => {
      //console.log(data);
      this.socket.emit('refresh', {});
     // this.notification = data.result.notification
    });
  }

  logout(){ 
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

  GoToHome(){
    this.router.navigate(['streams']); //chat app icon eka click klama home page ekata yanawa
  }

  GoToChatPage(name){
    this.router.navigate(['chat', name]);
    this.msgService.MarkMessages(this.user.username, name).subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }

  MarkAllMessages() {
    this.msgService.MarkAllMessages().subscribe( data => {
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  MessageData(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY',
    })
  }

}
