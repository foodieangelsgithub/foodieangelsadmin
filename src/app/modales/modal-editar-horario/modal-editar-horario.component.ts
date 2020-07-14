import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import { GeneralService } from '../../servicios/general.service';
import { ArraysDatosService } from '../../servicios/arrays-datos.service';

declare var $:any;

@Component({
  selector: 'app-modal-editar-horario',
  templateUrl: './modal-editar-horario.component.html',
  styleUrls: ['./modal-editar-horario.component.less']
})
export class ModalEditarHorarioComponent implements OnInit,OnDestroy {

  traduccion:string; //propiedad que guardda las traducciones que pueda haber
  subscripcionDatos:Subscription;// propiedad que guarda la subscripción al observable
  subscripcionTraducciones:Subscription;// propiedad que guarda la subscripción al observable de traducciones

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService,
    public translate : TranslateService
  ){}

  ngOnInit(){}

  // ----------------------------------------------------------
  // Método para guardar los cambios de horario
  // coge los datos de edición temporales y los guarda en el array de datos correspondiente
  // ----------------------------------------------------------
  guardar():void{

    // si el horario es correcto se guardan los datos
    if(this.generalService.checkSchedule()){

      this.arraysDatosService.datosEditProveedor.horario = [];
      this.arraysDatosService.datosEditProveedor.horario = JSON.parse(JSON.stringify(this.generalService.horarioEdit));
      
      //se reinicia el componente del visor de horarios
      this.generalService.horarioShowing = false;
      setTimeout(() => {
        this.generalService.horarioShowing = true;
      }, 10);
  
      //se oculta el modal
      $('#modalFoodieAngels').modal('hide');

    }
    // si el horario no es correcto muestra mensaje de error
    else{

      this.subscripcionTraducciones = this.translate.get('errores.errorValidSchedule').subscribe((res: string) => {
        this.traduccion = res;
      });
      this.generalService.showNotif(this.traduccion,"danger",5000);

    }

  }


  // ----------------------------------------------------------
  // Método que se ejecuta al cerrarse el componente
  // ----------------------------------------------------------
  ngOnDestroy(){
    if(this.subscripcionTraducciones != undefined){
      this.subscripcionTraducciones.unsubscribe();
    }
  }

}
