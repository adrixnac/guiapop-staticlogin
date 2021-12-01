
import { ActionReducerMap } from '@ngrx/store';

// reducers
import * as fromUI from './redux/ui.reducer';
import * as fromAsignacionUsuario from './redux/usuarioAsignacion.reducer';


export interface AppState {
    ui: fromUI.State,
    asignacionUsuario : fromAsignacionUsuario.AsignacionState,

}

export const appReducer: ActionReducerMap<AppState> = {
    ui: fromUI.uiReducer,
    asignacionUsuario : fromAsignacionUsuario.asignacionReducer,
}