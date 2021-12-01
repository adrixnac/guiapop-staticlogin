import { Action } from '@ngrx/store';

export const ACTIVAR_LOADING = '[UI Loading] Loading';
export const DESACTIVAR_LOADING = '[UI Loading] End';

export class ActivarLoadingAction implements Action {
    readonly type = ACTIVAR_LOADING
}

export class DesActivarLoadingAction implements Action {
    readonly type = DESACTIVAR_LOADING;
}

export type actions =  ActivarLoadingAction | DesActivarLoadingAction;