import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { PostsComponent } from '../components/posts/posts.component';
import { PostService } from '../services/post.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from '../components/comments/comments.component';
import { RouterModule } from '@angular/router';
import { PeopleComponent } from '../components/people/people.component';
import { UsersService } from '../services/users.service';
import { FollowingComponent } from '../components/following/following.component';
import { FollowersComponent } from '../components/followers/followers.component';
import { NotificationComponent } from '../components/notification/notification.component';
import { TopStreamsComponent } from '../components/top-streams/top-streams.component';
import { ChatComponent } from '../components/chat/chat.component';
import { MessageComponent } from '../components/message/message.component';
import { MessageService } from '../services/message.service';
// import { BrowserModule } from '@angular/platform-browser'
import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { ImagesComponent } from '../components/images/images.component';
// import {EmojiPickerModule} from 'ng2-emoji-picker';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
//import {  ElementRef, Renderer2 } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { ViewUserComponent } from '../components/view-user/view-user.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
//import { from } from 'rxjs'; 


@NgModule({
  declarations: [StreamsComponent, ToolbarComponent, 
    SideComponent, PostFormComponent, PostsComponent,
     CommentsComponent, PeopleComponent, FollowingComponent, 
     FollowersComponent, NotificationComponent, TopStreamsComponent, ChatComponent,
      MessageComponent,
      ImagesComponent,
      ViewUserComponent,
      ChangePasswordComponent,    
  ], 
  imports: [  
    CommonModule, FormsModule, ReactiveFormsModule, 
    HttpClientModule, RouterModule, NgxAutoScrollModule,FileUploadModule, NgxEmojiPickerModule
   // EmojiPickerModule.forRoot(), 
    
  ],    
  exports: [    
    StreamsComponent, ToolbarComponent    
  ], 
  providers: [TokenService, PostService, UsersService, MessageService]
})    
export class StreamsModule { } 
        // npm install  --save rxjs-compat 