import { Component, OnInit } from '@angular/core';
//import { from } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import { resolve } from 'url';

const URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile: any;
  user: any;
  images = [];
  socket: any;

  constructor(private usersService: UsersService,
    private tokenService: TokenService) {
      this.socket = io('http://localhost:3000');
     }
 
  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.GetUser(); 

    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe( data => {
      this.images = data.result.images;
    }, 
    err => console.log(err)
    );
  }

  OnFileSelected(event) {
    //console.log(event);  L 240 
    const file: File = event[0];

    this.ReadAsBase64(file) 
    .then(result => {
      this.selectedFile = result;
    })
    .catch(err => console.log(err));
  }

  Upload() {
   /*   const filePath = <HTMLInputElement>document.getElementById('filePath');
    filePath.value = '';   L 241   */
   // console.log(this.selectedFile)  L241
  
   if (this.selectedFile) {
     this.usersService.AddImage(this.selectedFile).subscribe(
       data => {
      // console.log(data); L 246
      this.socket.emit('refresh', {});
      const filePath = <HTMLInputElement>document.getElementById('filePath');
      filePath.value= '';
     },
     err => console.log(err)
     );
   } 
  }

  SetProfileImage(image) {
    //  console.log(image); L 247
    this.usersService.SetDefaultImage(image.imgId, image.imgVersion).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }
 
  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) =>{
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', (event) => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }

}
 