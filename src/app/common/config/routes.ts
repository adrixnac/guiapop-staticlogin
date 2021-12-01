import { Routes } from '@angular/router';
import { NAVIGATION } from './navigations';
import { AutenticacionComponent } from 'src/app/view/login/autenticacion/autenticacion.component';
import { AsignacionesComponent } from 'src/app/view/login/asignaciones/asignaciones.component';
import { AuthguardService } from '../services/authguard.service';
import { MainMenuComponent } from 'src/app/view/main-menu/main-menu.component';
import {SystemSelectionComponent} from 'src/app/view/system-selection/system-selection.component';


export const appRoutes: Routes = [
  {
    path: NAVIGATION.login,
    pathMatch: 'full',
    component: AutenticacionComponent,
  },
  {
    path: NAVIGATION.apo,
    component: MainMenuComponent,
    canActivate: [AuthguardService],
    children :[
      {
        path: NAVIGATION.asignaciones,
        component: AsignacionesComponent
      },{
        path: NAVIGATION.seleccionSistema,
        component: SystemSelectionComponent
      }
      
    ]
  },
  {
    path: '**',
    redirectTo: NAVIGATION.login,
  },
];
