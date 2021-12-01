import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Input, Output} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit,OnChanges {

  @Input() titulo: string;
  @Input() mensaje: string;
  @Input() boton: string;
  @Input() showDialog: boolean;
  @Input() idModal: string;
  @Input() botonEvento: string;

  @Output() cerrarDialog = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.idModal = (this.idModal == null ? "idModalInfo" : this.idModal);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let atributo in changes) {
      if (atributo === 'showDialog') {
        if (this.showDialog) {
          this.showModal();
        }
      }
    }
  }

  public showModal() {
    $('#' + this.idModal).modal({backdrop: 'static', keyboard: false});
  }

  public cerrarModal() {
    $('#' + this.idModal).modal('hide');
    this.cerrarDialog.emit(false);
  }

  public dispararEvento() {
    this.cerrarDialog.emit(true);
  }
}
