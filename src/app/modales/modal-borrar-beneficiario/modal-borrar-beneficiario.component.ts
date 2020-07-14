import { Component, OnInit } from '@angular/core';

import { GeneralService } from './../../servicios/general.service';
import { ArraysDatosService } from './../../servicios/arrays-datos.service';

import { Beneficiario } from '../../interfaces/beneficiario';

declare var $:any;

@Component({
  selector: 'app-modal-borrar-beneficiario',
  templateUrl: './modal-borrar-beneficiario.component.html',
  styleUrls: ['./modal-borrar-beneficiario.component.less']
})
export class ModalBorrarBeneficiarioComponent implements OnInit {

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService
  ){}

  ngOnInit() {
  }

  borrar():void{

    let beneficiariosResult:Beneficiario[];

    //se elimina el elemento seleccionado del array de beneficiarios filtrados
    beneficiariosResult = [];
    beneficiariosResult = this.arraysDatosService.beneficiariosFiltrados.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });

    this.arraysDatosService.beneficiariosFiltrados = beneficiariosResult;

    //se elimina el elemento seleccionado del array de beneficiarios
    beneficiariosResult = [];
    beneficiariosResult = this.arraysDatosService.beneficiarios.filter((el) => {
      if(el.id == this.generalService.modalIdElemento) return false;
      else return true;
    });
    this.arraysDatosService.beneficiarios = beneficiariosResult;

    //se oculta el modal
    $('#modalFoodieAngels').modal('hide');


  }

}
