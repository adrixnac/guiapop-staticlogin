import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UsuarioSesion } from 'src/app/common/model/local/usuarioSesion';
import { APIs } from '../config/endpoints';
import { Router } from '@angular/router';
import { NAVIGATION } from '../config/navigations';
import jwt_decode from 'jwt-decode';
import * as GLOBALS from '../config/global';
import {UsuarioAsignacion} from 'src/app/common/model/local/usuarioSesion';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { AsignacionDelete, AsignacionUpdate } from 'src/app/redux/usuarioAsignacion.actions';
import { query } from '@angular/animations';



@Injectable({
  providedIn: 'root'
})

export class AutenticacionService {

  private _token : string;
  private _refresh : string;
  private _usuarioSesion : UsuarioSesion;
  ambiente = GLOBALS.GLOBAL.ambiente;
  private usuarioAsignacion : UsuarioAsignacion;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(private http: HttpClient, private router: Router,
    private store:Store<AppState>,) { }

  public get usuarioSesion(): UsuarioSesion {
    if (this._usuarioSesion != null) {
      return this._usuarioSesion;
    } else if (this._usuarioSesion == null && sessionStorage.getItem('usuarioSesion') != null) {
      this._usuarioSesion = JSON.parse(sessionStorage.getItem('usuarioSesion')) as UsuarioSesion;
      return this._usuarioSesion;
    }
    return new UsuarioSesion();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public get refresh(): string {
    if (this._refresh != null) {
      return this._refresh;
    } else if (this._refresh == null && sessionStorage.getItem('refresh_token') != null) {
      this._refresh = sessionStorage.getItem('refresh_token');
      return this._refresh;
    }
    return null;
  }

  fastLogin(cveUsuario,refPassword){
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let url = `https://apostatic${this.ambiente}.cloudapps.imss.gob.mx/msapop-staticlogin/v1/credenciales`;
    let user = {
      cveUsuario,
      refPassword
    }
    return this.http.post(url,user, { headers: httpHeaders });
  } 

  autenticacion(usuario: string, password: string): Observable<any> {

    const credenciales = btoa('guiapop' + ':' + '1M55*APOP');
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Authorization': 'Basic ' + credenciales });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('cveUsuario', `${usuario}|ECE`);
    params.set('refPassword', `${password}|${usuario}`);
    params.set('scope', 'read');
    let url = `https://apostatic${this.ambiente}.cloudapps.imss.gob.mx/msapop-staticlogin/v1/credenciales`;

    return this.http.post<any>(url, params.toString(), { headers: httpHeaders }).pipe(map((response: any) => {
      this.guardarUsuario(response.access_token, "APO");
      this.guardarToken(response.access_token);
      return response;
    },
    catchError(e => {
      return throwError(e);
    })));
  }

  refreshSession() : Observable<any> {

    this._token = null;
    const credenciales = btoa('infocovid' + ':' + '1mss1nf0Covid*01');
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Authorization': 'Basic ' + credenciales });

    let params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', this.refresh.replace("\"", "").replace("\"", ""));

    return this.http.post<any>(APIs.autenticacion.login, params.toString(), { headers: httpHeaders });
  }


  public guardarUsuario(accessToken: string, tipoIngreso,paciente?:any): void {
    let payload = this.obtenerDatosToken(accessToken);
    console.log(payload)
    this._usuarioSesion = this.usuarioSesion;
    this._usuarioSesion.nombrePersonal = payload.nombrePersonal;
    this._usuarioSesion.cveMatricula = payload.cveMatricula;
    this._usuarioSesion.roles = payload.authorities;
    this._usuarioSesion.listaAsignacionUnidadMedica = payload.asignaciones;
    this._usuarioSesion.iniciales = payload.iniciales;
    if(tipoIngreso == "ECE"){
      this.obtenerAsignacionUsuario( paciente.cvePresupuestalAtiende,this._usuarioSesion.cveMatricula,tipoIngreso);
    }
    sessionStorage.setItem('usuarioSesion', JSON.stringify(this._usuarioSesion));
  }


  obtenerAsignacionUsuario(cvePres, matricula, tipoIngreso){
    this.store.dispatch(new AsignacionDelete);
    let usuarioAsignacion : UsuarioAsignacion = new UsuarioAsignacion();
    let response : any;
      this.getUserDataECE(cvePres, matricula ).subscribe((resp:any)=>{        
        response = resp;
        if(response!=null){
          usuarioAsignacion.clavePresupuestal = response.cvePresupuestal;
          usuarioAsignacion.desDelegacion = response.desDelegacion;
          usuarioAsignacion.desUnidadMedica = response.desUnidadMedica;
          usuarioAsignacion.iniciales = response.iniciales;
          this.store.dispatch(new AsignacionUpdate(usuarioAsignacion));
          sessionStorage.setItem('asignacionUsuario',JSON.stringify(usuarioAsignacion));
        }
      });
  }


  public guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  guardarRefresh(token: string): void {
    this._refresh = token;
    sessionStorage.setItem('refresh_token', JSON.stringify(this._refresh));
  }

  obtenerDatosToken(accessToken: string): any {
    
      if (accessToken != null) {
        try{
          return jwt_decode(accessToken); 
  
        }catch(error){
          return jwt_decode(accessToken); 
        }
        
      }
      return null;  
  }
  getDataFromToken(accessToken: string): any {
    if (accessToken != null) {
      return jwt_decode(accessToken);
    }
    return null;
  }


  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    this.router.navigate([NAVIGATION.login]);
    return false;
  }
  isAuthenticated2(): boolean {
    let payload = this.obtenerDatosToken(sessionStorage.getItem('token'));
    if ( payload!=null ) {
      return true;
    }
    return false;
  }

  hasRole(roles: string[]): boolean {
    let hasRole = false;

    roles.forEach(role => {
      if (this.usuarioSesion.roles.includes(role)) {
        hasRole = true;
      }
    });
    return hasRole;
  }

  getUserDataECE(cvePresupuestal, matricula){
    let url = `https://msapop-catalogos${this.ambiente}.cloudapps.imss.gob.mx/msapop-catalogos/v2/medicos?cvePresupuestal=${cvePresupuestal}&cveMatricula=${matricula}`;
    return this.http.get(url, { headers: this.headers })
  }

  getSubRol(rolIngresa){
    let url = `https://msapop-catalogos${this.ambiente}.cloudapps.imss.gob.mx/msapop-catalogos/v2/roles/${rolIngresa}/subRoles`;
    return this.http.get(url, { headers: this.headers })
  }

  redirect(sistema, parametro){
    let url;
    if(sistema == 'APO'){
      //pruebas en local
      //url = 'http://localhost:4401'+NAVIGATION.accesoGral;   
      url = NAVIGATION.apoTratamiento+this.ambiente+NAVIGATION.tratamientoSistema;
    }
    if(sistema=='CAMA'){
      //Pruebas en local
      url = 'http://localhost:4401'+'/camagral'+NAVIGATION.accesoGral;   
      //url = NAVIGATION.apoBase+this.ambiente+NAVIGATION.camaSistema;
    }
    let param = JSON.stringify(parametro);
    window.location.href = url+encodeURIComponent(param);
    
     if(window.Error){
       NAVIGATION.login;
     }
  }

  cleanData(){
    this._token = null;
    this._refresh = null;
    this._usuarioSesion = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuarioSesion');
    sessionStorage.removeItem('asignacionUsuario');
  }

  logout(): void {
    this.cleanData();
    this.router.navigate([NAVIGATION.login]);
  }


}
