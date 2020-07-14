import { Component, OnInit } from '@angular/core';

import { GeneralService } from './../../servicios/general.service';
import { ArraysDatosService } from './../../servicios/arrays-datos.service';

import { Administrador } from '../../interfaces/administrador';

declare var $:any;

@Component({
  selector: 'app-modal-borrar-administrador',
  templateUrl: './modal-borrar-administrador.component.html',
  styleUrls: ['./modal-borrar-administrador.component.less']
})
export class ModalBorrarAdministradorComponent implements OnInit {

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService
  ){}

  ngOnInit() {
  }

  borrar():void{

    let administradoresResult:Administrador[];

    //se elimina el elemento seleccionado del array de administradores filtrados
    administradoresResult = [];
    administradoresResult = this.arraysDatosService.administradoresFiltrados.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });

    this.arraysDatosService.administradoresFiltrados = administradoresResult;

    //se elimina el elemento seleccionado del array de administradores
    administradoresResult = [];
    administradoresResult = this.arraysDatosService.administradores.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });
    this.arraysDatosService.administradores = administradoresResult;

    //se oculta el modal
    $('#modalFoodieAngels').modal('hide');


  }

}
