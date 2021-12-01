export interface ConfirmModal{
    title:string;
    message:string;
    submessage?:string;
    cancelBtn:string;
    confirmBtn:string;
}

export interface SubRolModal{
    title: string;
      message: string;
      cancelBtn: string;
      confirmBtn: string;
      subroles : [],
      rol: string
}