import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import * as moment from 'moment'; 

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  socket: any;

  commentForm: FormGroup;
  postId: any;
  commentsArray = [];
  post: string;

  constructor( private fb: FormBuilder, private postService: PostService,
    private route: ActivatedRoute) { 
      this.socket = io('http://localhost:3000');
     }

  ngOnInit(): void {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');
    this.init();
    this.GetPost();
    this.socket.on('refreshPage', data =>{
      this.GetPost();
    });
  }
  init(){
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }
  
  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  } 
  AddComment() {
   // console.log(this.commentForm.value);
   this.postService.addComment(this.postId, this.commentForm.value.comment)
   .subscribe(data => {
     this.socket.emit('refresh', {});
    // console.log(data);
     this.commentForm.reset(); // commment eka dammama textarea eka empty wenawa
   });
  }

  GetPost() {
    this.postService.getPost(this.postId).subscribe(data => {
     //  console.log(data);
      this.post = data.post.post;
     
      this.commentsArray = data.post.comments.reverse();
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow(); 
  }
}
  