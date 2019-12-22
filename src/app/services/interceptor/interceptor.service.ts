import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpUserEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    const shared = this.injector.get(SharedService);
    
    const token = localStorage.getItem('_cap_token');
    
    if (token) {
      if (!request.url.includes('http')) {
        request = request.clone({
          url: `http://192.168.0.107:3000/${request.urlWithParams}`,
          headers: request.headers.set('x-access-token', token)
        });
      }
    } else {
      if (!request.url.includes('http')) {
        request = request.clone({
          url: `http://192.168.0.107:3000/${request.urlWithParams}`,
        });
      }
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => { }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            console.log('Authentication Error');
            localStorage.clear();
            const router = this.injector.get(Router);
            router.navigate(['/login']);
          }
        }
      })
    );
  }

  

}
