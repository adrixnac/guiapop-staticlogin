import { Action } from '@ngrx/store';
import { UsuarioAsignacion } from '../common/model/local/usuarioSesion';


export const SET_ASIGNACION_USUARIO = '[UsuarioAsignacion] Actualizar Mensajes';
export const DELETE_ASIGNACION_USUARIO = '[UsuarioAsignacion] Borrar Mensajes';


export class AsignacionUpdate implements Action {
    readonly type = SET_ASIGNACION_USUARIO;
    constructor( public asignacion:UsuarioAsignacion){}
}

export class AsignacionDelete implements Action {
    readonly type = DELETE_ASIGNACION_USUARIO;
}

export type actions =  AsignacionUpdate | AsignacionDelete ;