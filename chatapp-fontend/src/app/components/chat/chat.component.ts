import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  tabElement: any;
  online_users = [];

  constructor() { }

  ngOnInit(): void {
    this.tabElement = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    this.tabElement.style.display = 'none';
  }

  online(event) {
    // console.log(event);  lession 228
    this.online_users = event;
  }

}
