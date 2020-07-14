import { Component, OnInit } from '@angular/core';

import { GeneralService } from './../../servicios/general.service';
import { ArraysDatosService } from './../../servicios/arrays-datos.service';

import { Proveedor } from '../../interfaces/proveedor';

declare var $:any;

@Component({
  selector: 'app-modal-borrar-proveedor',
  templateUrl: './modal-borrar-proveedor.component.html',
  styleUrls: ['./modal-borrar-proveedor.component.less']
})
export class ModalBorrarProveedorComponent implements OnInit {

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService
  ){}

  ngOnInit() {
  }

  borrar():void{

    let proveedoresResult:Proveedor[];

    //se elimina el elemento seleccionado del array de proveedores filtrados
    proveedoresResult = [];
    proveedoresResult = this.arraysDatosService.proveedoresFiltrados.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });

    this.arraysDatosService.proveedoresFiltrados = proveedoresResult;

    //se elimina el elemento seleccionado del array de proveedores
    proveedoresResult = [];
    proveedoresResult = this.arraysDatosService.proveedores.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });
    this.arraysDatosService.proveedores = proveedoresResult;

    //se oculta el modal
    $('#modalFoodieAngels').modal('hide');

  }


}