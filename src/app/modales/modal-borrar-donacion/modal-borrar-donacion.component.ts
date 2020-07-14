import { Component, OnInit } from '@angular/core';

import { GeneralService } from './../../servicios/general.service';
import { ArraysDatosService } from './../../servicios/arrays-datos.service';

import { Donacion } from '../../interfaces/donacion';

declare var $:any;

@Component({
  selector: 'app-modal-borrar-donacion',
  templateUrl: './modal-borrar-donacion.component.html',
  styleUrls: ['./modal-borrar-donacion.component.less']
})
export class ModalBorrarDonacionComponent implements OnInit {

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService
  ){}

  ngOnInit() {
  }

  borrar():void{

    let donacionesResult:Donacion[];

    //se elimina el elemento seleccionado del array de donaciones filtradas
    donacionesResult = [];
    donacionesResult = this.arraysDatosService.donacionesFiltradas.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });

    this.arraysDatosService.donacionesFiltradas = donacionesResult;

    //se elimina el elemento seleccionado del array de donaciones
    donacionesResult = [];
    donacionesResult = this.arraysDatosService.donacionesFiltradas.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });
    this.arraysDatosService.donacionesFiltradas = donacionesResult;

    //se oculta el modal
    $('#modalFoodieAngels').modal('hide');

  }

}