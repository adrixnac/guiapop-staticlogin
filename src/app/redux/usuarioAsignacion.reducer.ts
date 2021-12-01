import { UsuarioAsignacion } from '../common/model/local/usuarioSesion';
import * as fromAsignacion from './usuarioAsignacion.actions';


export interface AsignacionState  {
    asignacion: UsuarioAsignacion;
}

const initState: AsignacionState = {
    asignacion: null
}

export function asignacionReducer( state = initState, action: fromAsignacion.actions ): AsignacionState{
    switch(action.type){
        case fromAsignacion.SET_ASIGNACION_USUARIO:
            return {...state, asignacion : action.asignacion };
        case fromAsignacion.DELETE_ASIGNACION_USUARIO:
            return initState;
        default:
            return state;
    }
}