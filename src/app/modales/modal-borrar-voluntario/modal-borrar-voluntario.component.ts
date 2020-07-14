import { Component, OnInit } from '@angular/core';

import { GeneralService } from './../../servicios/general.service';
import { ArraysDatosService } from './../../servicios/arrays-datos.service';

import { Voluntario } from '../../interfaces/voluntario';

declare var $:any;

@Component({
  selector: 'app-modal-borrar-voluntario',
  templateUrl: './modal-borrar-voluntario.component.html',
  styleUrls: ['./modal-borrar-voluntario.component.less']
})
export class ModalBorrarVoluntarioComponent implements OnInit {

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService
  ){}

  ngOnInit() {
  }

  borrar():void{

    let voluntariosResult:Voluntario[];

    //se elimina el elemento seleccionado del array de voluntarios filtrados
    voluntariosResult = [];
    voluntariosResult = this.arraysDatosService.voluntariosFiltrados.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });

    this.arraysDatosService.voluntariosFiltrados = voluntariosResult;

    //se elimina el elemento seleccionado del array de voluntarios
    voluntariosResult = [];
    voluntariosResult = this.arraysDatosService.voluntarios.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });
    this.arraysDatosService.voluntarios = voluntariosResult;

    //se oculta el modal
    $('#modalFoodieAngels').modal('hide');

  }

}