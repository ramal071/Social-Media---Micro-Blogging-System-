import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  addPost(body): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/post/add-post', body);
  }

  getAllPosts(): Observable<any> {
    return this.http.get('http://localhost:3000/api/chatapp/posts');
  }

  addLike(body): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/post/add-like', body);
  }

  addComment(postId, comment): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/post/add-comment', {
      postId,
      comment
    });
  }
  getPost(id): Observable<any> {
    return this.http.get(`${BASEURL}/post/${id}`);
  }
}
