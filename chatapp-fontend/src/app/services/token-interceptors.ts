import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class TokenInterceptors implements HttpInterceptor {
    constructor(private tokenService: TokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
   // return next.handle(req);

   const headersConfig = {
       'Content-Type': 'application/json',
       'Accept': 'application/json'
   };
   const token = this.tokenService.GetToken();
   if(token) {
    headersConfig['Authorization'] = `beader ${token}`;
      // headersConfig['Authorization'] = 'beader ${token}'; 86 video
   }
   const _req = req.clone({ setHeaders: headersConfig});
   return next.handle(_req);
  }
}

