import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { UsuarioAsignacion } from 'src/app/common/model/local/usuarioSesion';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { AsignacionDelete } from 'src/app/redux/usuarioAsignacion.actions';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  usuarioAsignacionSubs : Subscription = new Subscription();

  public User = {
    nombrePersonal:'',
    listaAsignacionUnidadMedica:[{desUnidadMedica:''}],
    cveMatricula:'',
    iniciales: ''
  };
  public usuarioAsignacion : UsuarioAsignacion = new UsuarioAsignacion();
  public interval : any;
  public numMensajes : number;
  currentLink = '';

  public isHover : boolean = false;
  public secondHover : boolean = false;
  public dentroDropdownDatos : boolean = false;
  public medico : boolean;
  public enfermera: boolean;
  public trabajadorSocial:boolean;
  public asignacionSeleccionada : boolean = false;
  public mostrarDatosAsignacion : boolean = false;
 

  constructor( private router: Router, 
    private authService: AutenticacionService,
    private store:Store<AppState>,
    @Inject(DOCUMENT) private document: Document) {
      this.inicializarAsignacion();
      this.usuarioAsignacionSubs = store.select('asignacionUsuario').subscribe(asignacion =>{
        if(asignacion.asignacion != null){
          this.usuarioAsignacion = asignacion.asignacion;
          this.asignacionSeleccionada = true;
          this.mostrarDatosAsignacion = this.usuarioAsignacion.clavePresupuestal?true:false;
        }
      });
     }

  ngOnInit(): void {
    this.User = JSON.parse(sessionStorage.getItem('usuarioSesion'));
    this.currentLink = this.router.url.split('/')[2];
    this.medico = this.authService.usuarioSesion.roles[0] == "ROLE_MEDICO"? true:false;
    this.enfermera= this.authService.usuarioSesion.roles[0] == "ROLE_ENFERMERA"? true:false;
    this.trabajadorSocial= this.authService.usuarioSesion.roles[0] == "ROLE_TRABAJADOR_SOCIAL"? true:false;
    this.validaAsignacion();
  }

  validaAsignacion(){
    let auxAsignacion = JSON.parse(sessionStorage.getItem('asignacionUsuario'));
    if(auxAsignacion){
      this.usuarioAsignacion = auxAsignacion;
      this.asignacionSeleccionada = true;
      this.mostrarDatosAsignacion = this.usuarioAsignacion.clavePresupuestal?true:false;
    }
  }

  redirectExternal(){
    window.open(' http://www.imss.gob.mx/oncologia-pediatrica/');
  }
  
  checkUrl(){
    console.log(this.trabajadorSocial)
    this.currentLink = this.router.url.split('/')[2];
  }


  enableHover(){
    this.dentroDropdownDatos = true;
  }

  disableHover(){
    if(this.dentroDropdownDatos){
      this.secondHover = false;
      this.dentroDropdownDatos = false;
    }
  }

  cambiaPrimerHover(){
    this.isHover = true;
    this.secondHover = false;
  }

  inicializarAsignacion(){
    this.usuarioAsignacion.clavePresupuestal = "";
    this.usuarioAsignacion.desDelegacion = "";
    this.usuarioAsignacion.desUnidadMedica ="";
    this.usuarioAsignacion.iniciales = "";
  }

  logout(){
    this.store.dispatch(new AsignacionDelete);
    clearInterval(this.interval);
    this.usuarioAsignacionSubs.unsubscribe();
    this.authService.logout();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.usuarioAsignacionSubs.unsubscribe();
  }

}
