import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { String } from 'typescript-string-operations';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NAVIGATION } from '../config/navigations';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

   constructor(private auth : AutenticacionService, private router : Router, private location : Location) { }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const emptyAuthHeader = String.IsNullOrWhiteSpace(request.headers.get('Authorization'));

      /* Para servicio de restablecer password, no contiene token y se excluye de autorización */
      if (request.headers.get('Anonymous') != undefined) {
          const newHeaders = request.headers.delete('Anonymous')
          const newRequest = request.clone({ headers: newHeaders });
          return next.handle(newRequest);
      }

      if (this.auth.isAuthenticated && this.auth.token != '' && emptyAuthHeader) {
         request = request.clone({
            setHeaders: {
               Authorization: ('Bearer ' + this.auth.token).replace("\"", "").replace("\"", "")
            }
         });
      }


      return next.handle(request).pipe(
         catchError(err => {
            if (err.status == 401) {
               if (request.url.includes("monitor") && err.error.error_description.includes("token expired")) {
                  this.auth.refreshSession().subscribe((resp : any) => {
                     this.auth.guardarToken(resp.access_token);
                     this.auth.guardarRefresh(resp.refresh_token);
                     location.reload();
                  }, (err : any) => {
                     //window.alert("Su sesión ha finalizado");
                     this.router.navigate([NAVIGATION.login]);
                  });
               } else if (!request.url.includes("oauth")) {
                  //window.alert("Su sesión ha finalizado");
                  this.router.navigate([NAVIGATION.login]);
               }
            }
            if (err.status == 403) {
               //window.alert("No cuenta con autorización para consultar este recurso");
               this.location.back();
            }
            if (err.status == 500) {
               //window.alert("Ocurrió un error interno en el Servidor");
            }
            return throwError(err);
         })
      );
   }

}
