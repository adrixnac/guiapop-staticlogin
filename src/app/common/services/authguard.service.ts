import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AutenticacionService } from './autenticacion.service';


@Injectable({
  providedIn: 'root'
})

export class AuthguardService  implements CanActivate {

  constructor( private authService: AutenticacionService ) { }

  canActivate(){
    return this.authService.isAuthenticated();
  }
}