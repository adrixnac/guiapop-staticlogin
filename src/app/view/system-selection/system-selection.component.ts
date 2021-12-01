import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppState } from 'src/app/app.reducer';
import { SubRolModal } from 'src/app/common/model/shared/confirmModal.model';
import { AutenticacionService } from 'src/app/common/services/autenticacion.service';
import { SelectionRolModalComponent } from 'src/app/common/shared/selection-rol-modal/selection-rol-modal.component';
import { ActivarLoadingAction, DesActivarLoadingAction } from 'src/app/redux/ui.actions';
import * as GLOBALS from '../../common/config/global';

@Component({
  selector: 'app-system-selection',
  templateUrl: './system-selection.component.html',
  styleUrls: ['./system-selection.component.scss']
})
export class SystemSelectionComponent implements OnInit {

  ambiente = GLOBALS.GLOBAL.ambiente;
  mostrarTercerSistema : boolean = false;
  listaRoles = [];
  medico:boolean =false;
  enfermera:boolean=false;
  trabajadorSocial:boolean=false;
  subRolSeleccionado;
  cveSubRol:string;
  constructor(public dialog: MatDialog,
    private autenticacionService: AutenticacionService,
    private toastr: ToastrService,
    private store:Store<AppState>
    ) { }

  ngOnInit(): void {
    this.obtenerSubroles(this.autenticacionService.usuarioSesion.roles[0]);
    this.medico = this.autenticacionService.usuarioSesion.roles[0] == "ROLE_MEDICO"? true:false;
    this.enfermera= this.autenticacionService.usuarioSesion.roles[0] == "ROLE_ENFERMERA"? true:false;
    this.trabajadorSocial= this.autenticacionService.usuarioSesion.roles[0] == "ROLE_TRABAJADOR_SOCIAL"? true:false;
  }


  
  redireccionaAPO(){
    let usuarioAsignacion = JSON.parse(sessionStorage.getItem('asignacionUsuario'));
    usuarioAsignacion.desDelegacion = "";
    usuarioAsignacion.desUnidadMedica = "";
    let param = this.generaToken(usuarioAsignacion);
    this.autenticacionService.cleanData();
    this.autenticacionService.redirect('APO',param);
  }

  redireccionaCAMA(){
      let usuarioAsignacion = JSON.parse(sessionStorage.getItem('asignacionUsuario'));
      usuarioAsignacion.subrol = this.subRolSeleccionado;
      usuarioAsignacion.cveSubRol =parseInt(this.cveSubRol);
      usuarioAsignacion.desDelegacion = "";
      usuarioAsignacion.desUnidadMedica = "";
      let param = this.generaToken(usuarioAsignacion);
      this.autenticacionService.cleanData();
      this.autenticacionService.redirect('CAMA',param);
      return false;
  }

  generaToken(asignacionUsuario) {
    let token = {
      iniciales : this.autenticacionService.usuarioSesion.iniciales,
      asignacion : asignacionUsuario,
      accessToken : sessionStorage.getItem('token')
    }
    console.log(token);
    return token;
  }

  obtenerSubroles(rolIngresa){
    this.store.dispatch( new ActivarLoadingAction() );
    this.autenticacionService.getSubRol(rolIngresa).subscribe(resp=>{
      this.listaRoles.push(resp);
      this.store.dispatch( new DesActivarLoadingAction());
    });
  }

  
  modalSeleccionSubrol(){
    if(this.medico||this.enfermera){
      let dataModal :SubRolModal= {
        title: 'Información complementaria',
        message: 'Ingresa tu Sub-Rol',
        cancelBtn: 'Cancelar',
        confirmBtn: 'Siguiente',
        subroles : this.listaRoles[0],
        rol : this.medico?"Médico":"Enfermería"
      }
      const dialogRef = this.dialog.open(SelectionRolModalComponent, {
        disableClose:true,
        data: { ...dataModal },
        panelClass: 'custom-dialog-container',
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.subRolSeleccionado = result.data.desRol;
          this.cveSubRol = result.data.cveRol;
          this.redireccionaCAMA();
        }
      });
    }else{
      this.toastr.warning("Sistema no disponible para el rol asignado");
    }
  }

  ngOnDestroy(){
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuarioSesion');
    sessionStorage.removeItem('asignacionUsuario');
  }

}
