import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
  import io from 'socket.io-client';
  
import { tick } from '@angular/core/testing';
import _ from 'lodash';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() users;
  receiver: string;
  user: any;
  //message: string;
  receiverData: any;
  messagesArray = [];
  socket: any;
  typingMessage;
  typing = false;
  // usersArray = [];   l 229
  isOnline = false;

  /*   emoji L 213  */ 

  title = "ngx-emoji-mart";
  toggled: boolean;
   message: String = "";

  /************** */

  constructor(private tokenService: TokenService, 
    private msgService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
    ) {
      this.socket = io('http://localhost:3000');
     /*   }    */

  /*   emoji L 213  */

  
    this.toggled = false;
  }
  HandleSelection(event) {
    this.message = this.message + "" + event.char;
    this.toggled = false;

    this.toggled = !this.toggled ; 
  }
  Toggled() {
    this.toggled = !this.toggled ;   
  }
/* **************/

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.route.params.subscribe(params => {
      this.receiver = params.name;
      this.GetUserByUsername(this.receiver);

      this.socket.on('refreshPage', () => {
        this.GetUserByUsername(this.receiver);
      });
    });  

    /*
    this.usersArray = this.users;
    console.log(this.usersArray);   lesson 229 */ 

    this.socket.on('is_typing', data => {
     // console.log(data);
     if(data.sender === this.receiver) {
      // console.log(data);
      this.typing = true;
     }
    });

    this.socket.on('has_stopped_typing', data => {
      if(data.sender === this.receiver) {
        this.typing = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const title = document.querySelector('.nameCol')
   // console.log(this.users);   L 229
   if(changes.users.currentValue.length > 0) {
   // console.log(changes.users.currentValue);  L 230
   const result = _.indexOf(changes.users.currentValue, this.receiver);
   if(result > -1) {
    this.isOnline = true;
    (title as HTMLElement).style.marginTop = '10px';
   } else {
    this.isOnline = false;
    (title as HTMLElement).style.marginTop = '20px';
   }
   }
   // console.log(changes);
  } 

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver
    };

    this.socket.emit('join chat', params);
  }

  GetUserByUsername(name) {
    this.usersService.GetUserByName(name).subscribe(data => {
      //console.log(data);
     this.receiverData = data.result;

     this.GetMessages(this.user._id, data.result._id);
    });
  }

  GetMessages(senderId, receiverId) {
    this.msgService.GetAllMessages(senderId, receiverId)
    .subscribe(data =>{
    //  console.log(data);
      this.messagesArray = data.messages.message;
    });         
  }   

  SendMessage() {
    if(this.message) {
      this.msgService
      .SendMessage(this.user._id, this.receiverData._id,
        this.receiverData.username, this.message)
        .subscribe(data => {
       //   console.log(data);
          this.socket.emit('refresh', {});
          this.message = '';
        });
    }
  }
  IsTyping() {
    //  console.log('Typing a message');
    this.socket.emit('start_typing', {
      sender: this.user.username, 
      receiver: this.receiver
    });

    if(this.typingMessage)
      clearTimeout(this.typingMessage);

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing' , {
        sender: this.user.username,
        receiver: this.receiver
      });
    }, 500);
  }
}
  