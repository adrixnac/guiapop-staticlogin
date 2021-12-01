export const GLOBAL = {
    ambiente : 'QA',
    baseURL: 'https://apop.cloudapps.imss.gob.mx',
    baseURLPacientes : 'https://msapop-paciente-qa.cloudapps.imss.gob.mx/',
    baseURLECE: 'https://msapop-ece-qa.cloudapps.imss.gob.mx/',
    baseURLseguimiento:'https://msapop-seguimiento-qa.cloudapps.imss.gob.mx/',
    contexto: '',
    appNombre: 'PAO',
    appVersion: '1.0.0',
    timeout: 60000,
    scalingTimeout: 1500,
    retryTimes: 1,
    paginationLimit: 30,
    hostnameProd: ''
 };


 export const MENSAJES_ERROR = {

    http500: 'El servidor no esta disponible temporalmente. Favor de intentar más tarde.',
    http403: 'La información no esta disponible temporalmente. Favor de intentar más tarde.',
    http204: 'No existen datos para la consulta solicitada.',
    requerido: 'Este campo es obligatorio',
    cambioContrasenaError: 'El servicio de cambio de contraseña no esta disponible temporalmente. Favor de intentar más tarde.',
    contraseñaCorta: 'Elige una contraseña más larga',
    contraseñaNoCoinciden: 'Las contraseñas no coinciden',
    contraseñaUserCoinciden: 'La contraseña no puede ser igual al usuario',
    sasdsdasda:'sdasdasda'
 };

 export const MENSAJES = {
    cancelacionExitosa: 'Actualización realizada con éxito',
    correoExitoso: 'Correo electrónico enviado con éxito'
 }


 export const ROLES = {
    ASISTENTE_MEDICO: 'ASISTENTE MEDICO',
    MEDICO: 'ROLE_MEDICO',
    ADMINISTRADOR: 'ADMINISTRADOR',
    ADMINISTRADOR_DELEGACIONAL: 'ADMINISTRADOR DELEGACIONAL',
    ADMINISTRADOR_CENTRAL: 'ADMINISTRADOR CENTRAL'
 };

 export const TIPO_OPERACION = {

    datosActuales: "datosActuales",
    accesoVascular: "accesoVascular"

 };

 export const AMBIENTES ={
   QA : '-qa',
   UAT : '-uat',
   PROD : ''
}
