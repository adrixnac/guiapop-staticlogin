import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { NAVIGATION } from 'src/app/common/config/navigations';
import { UsuarioAsignacion } from 'src/app/common/model/local/usuarioSesion';
import { AsignacionDelete, AsignacionUpdate } from 'src/app/redux/usuarioAsignacion.actions';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.scss']
})
export class AsignacionesComponent implements OnInit {

  public User = {
    nombrePersonal:'',
    listaAsignacionUnidadMedica:[{desUnidadMedica:''}],
    cveMatricula:'',
    roles: [],
    iniciales : ''
  };

  autenticacionSub : Subscription;

  constructor(private router: Router,
    private store:Store<AppState>) { }

  ngOnInit(): void {
    this.User = JSON.parse(sessionStorage.getItem('usuarioSesion'));
  }

  unidadSeleccionada(asignacion){
    let usuarioAsignacion : UsuarioAsignacion = new UsuarioAsignacion();
    usuarioAsignacion.clavePresupuestal = asignacion.cvePresupuestal;
    usuarioAsignacion.desDelegacion = asignacion.desDelegacion;
    usuarioAsignacion.desUnidadMedica = asignacion.desUnidadMedica;
    usuarioAsignacion.iniciales = this.User.iniciales;
    this.store.dispatch(new AsignacionDelete);
    this.store.dispatch(new AsignacionUpdate(usuarioAsignacion));
    sessionStorage.setItem('asignacionUsuario',JSON.stringify(usuarioAsignacion));    
    this.router.navigate([NAVIGATION.ingresaSeleccion]);
  }



}
