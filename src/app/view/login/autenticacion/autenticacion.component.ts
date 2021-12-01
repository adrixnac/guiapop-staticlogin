import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GLOBAL, MENSAJES_ERROR } from 'src/app/common/config/global';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { NAVIGATION } from 'src/app/common/config/navigations';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ActivarLoadingAction, DesActivarLoadingAction } from 'src/app/redux/ui.actions';
import { UsuarioAsignacion } from 'src/app/common/model/local/usuarioSesion';
import { AsignacionDelete, AsignacionUpdate } from 'src/app/redux/usuarioAsignacion.actions';
import { ConfirmModal } from 'src/app/common/model/shared/confirmModal.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/common/shared/confirm-modal/confirm-modal.component';
import jwtDecode from 'jwt-decode';


@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.scss']
})
export class AutenticacionComponent implements OnInit, AfterViewInit {

  @ViewChildren('pcaptcha')
  captchaComponent: any;
  autenticacionForm: FormGroup;
  validarFormulario = false;
  captcha: boolean = false;
  tituloDialogo: string;
  mensajeDialogo: string;
  botonDialogo: string;
  showDialog: boolean;
  botonEvento: string;
  smallRequerido = 'Este campo es obligatorio';
  capacitacion = window.location.hostname === GLOBAL.hostnameProd ? false : true;
  asignaciones: any[];
  public User = {
    nombrePersonal:'',
    listaAsignacionUnidadMedica:[{desUnidadMedica:''}],
    cveMatricula:'',
    roles: [],
    iniciales : ''
  };

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private store:Store<AppState>) { }

  ngOnInit(): void {
    this.autenticacionService.logout();
    this.createFormGroup();
  }

  ngAfterViewInit() {
    this.captchaComponent.reset;
  }

  public createFormGroup() {
    this.autenticacionForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formulario() {
    return this.autenticacionForm.controls;
  }

  public captchaResponse($event) {
    this.captcha = true;
  }

  public captchaExpired($event) {
    this.captcha = !$event;
  }

  public showModal(titulo: string, mensaje: string, boton: string, mostrar: boolean) {
    this.tituloDialogo = titulo;
    this.mensajeDialogo = mensaje;
    this.botonDialogo = boton;
    this.showDialog = mostrar;
  }

  public autenticar(): void {
    this.validarFormulario = true;
    console.log(this.autenticacionForm.value, this.autenticacionForm.valid)
    // if (this.autenticacionForm.invalid || !this.captcha) return;
    this.store.dispatch( new ActivarLoadingAction() );

    this.autenticacionService.fastLogin(this.autenticacionForm.value.usuario, this.autenticacionForm.value.password).subscribe(d => {
      console.log(d)
    }, err =>{
      console.log(err)
    })
    return;
    this.autenticacionService.autenticacion(this.autenticacionForm.value.usuario, this.autenticacionForm.value.password)
      .subscribe((response: any) => {
        console.log(response);
        this.store.dispatch( new DesActivarLoadingAction() );

        if(response.status == 400 || response.status == 401){
            this.showModal('Error Autenticación', 'El usuario y/o la clave son incorrectas. Favor de verificar.', 'Aceptar', true);
            return;
        }
        this.autenticacionService.guardarUsuario(response.access_token, "APO");
        this.autenticacionService.guardarToken(response.access_token);
        this.autenticacionService.guardarRefresh(response.refresh_token);
        this.asignaciones = response.asignaciones;

        if(this.autenticacionService.usuarioSesion.roles.length==0){
          this.modalErrorAsignaciones('Error de autentificación');
          return;
        }else{
          this.asignaciones.length > 1? this.router.navigate([NAVIGATION.ingresaAsignacion]):this.guardarDatosUsuario();
        }
      },
        err => {
          if (err.status == 400 || err.status == 401) {
            this.store.dispatch( new DesActivarLoadingAction() );
            this.showModal('Error Autenticación', 'El usuario y/o la clave son incorrectas. Favor de verificar.', 'Aceptar', true);
          } else {
            console.log(err);
            this.store.dispatch( new DesActivarLoadingAction() );
            this.showModal('Atención', MENSAJES_ERROR.http500, 'Aceptar', true);
          }
        }
      )
  }


  guardarDatosUsuario(){
    if(this.asignaciones.length==0&&this.autenticacionService.usuarioSesion.roles[0] == "ROLE_MEDICO"){
      this.modalErrorAsignaciones('No cuentas con asignaciones configuradas');
      return;
    }
    this.User = JSON.parse(sessionStorage.getItem('usuarioSesion'));
    let usuarioAsignacion : UsuarioAsignacion = new UsuarioAsignacion();

    usuarioAsignacion.clavePresupuestal = this.asignaciones.length>0?this.asignaciones[0].cvePresupuestal:null;
    usuarioAsignacion.desDelegacion =  this.asignaciones.length>0?this.asignaciones[0].desDelegacion:null; 
    usuarioAsignacion.desUnidadMedica =   this.asignaciones.length>0?this.asignaciones[0].desUnidadMedica:null;  
    usuarioAsignacion.iniciales = this.User.iniciales;
    this.store.dispatch(new AsignacionDelete);
    this.store.dispatch(new AsignacionUpdate(usuarioAsignacion));
    sessionStorage.setItem('asignacionUsuario',JSON.stringify(usuarioAsignacion));
    this.router.navigate([NAVIGATION.ingresaSeleccion]);
  }

  modalErrorAsignaciones(mensaje){
    let dataModal: ConfirmModal = {
      title: 'Atención',
      message: mensaje,
      submessage: "",
      cancelBtn: '',
      confirmBtn: 'Aceptar'
    }
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: { ...dataModal },
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe(result => {
     this.validarFormulario = false;
     this.autenticacionForm.reset();   
     Object.keys(this.autenticacionForm.controls).forEach(key=>{
       this.autenticacionForm.get(key).setErrors(null);
     });   
    });
  }


}
