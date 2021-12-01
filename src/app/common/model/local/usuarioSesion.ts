export class UsuarioSesion {
  nombrePersonal?: string;
  cveMatricula?: string;
  password?: string;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  cveDelegacion?: string;
  desDelegacion?: string;
  cveUnidadMedica?: string;
  desUnidadMedica?: string;
  roles?: string[] = [];
  listaAsignacionUnidadMedica?: any[];
  cvePacienteEnfermeria: any;
  iniciales: string;

}


export class UsuarioAsignacion{
  clavePresupuestal: string;
  desUnidadMedica : string;
  iniciales: string;
  desDelegacion : string;
}