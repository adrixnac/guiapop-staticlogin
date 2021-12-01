import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubRolModal } from '../../model/shared/confirmModal.model';

declare var $: any;

@Component({
  selector: 'app-selection-rol-modal',
  templateUrl: './selection-rol-modal.component.html',
  styleUrls: ['./selection-rol-modal.component.scss']
})
export class SelectionRolModalComponent implements OnInit {
  rolSeleccionado=null;
  
  constructor( public dialogRef: MatDialogRef<SelectionRolModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubRolModal ) {
     }

  ngOnInit(): void {
  }

  guardaSubRol(){
    this.dialogRef.close({data:this.rolSeleccionado});
  }
  
}
