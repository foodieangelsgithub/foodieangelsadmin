import { Component, OnInit } from '@angular/core';

import { GeneralService } from '../../servicios/general.service';

@Component({
  selector: 'app-visor',
  host: {
    '(window:resize)': 'onResize($event)',
    '(window:keyup)': 'onKeyup($event)'
  },
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.less']
})
export class VisorComponent implements OnInit {

  constructor(
    public generalService : GeneralService
  ){}

  // ----------------------------------------------------------
  // Método que se ejecuta al iniciarse el componente y que da dimensiones a la foto
  // ----------------------------------------------------------
  ngOnInit(){    
    //reseteamos los valores de ancho y alto
    this.generalService.visorAnchoImagen = 0;
    this.generalService.visorAltoImagen = 0;
    //dimensionamos la imagen
    this.generalService.tamFotoVisor(this.generalService.visorImagen);
  }

  // ----------------------------------------------------------
  // Método que se ejecuta en el resize para redimensionar la imagen
  // ----------------------------------------------------------
  onResize($event:any):void{
    //dimensionamos la imagen
    this.generalService.tamFotoVisor(this.generalService.visorImagen);
  }

  // -------------------------------------------
  // Método para cerrar el visor al pulsar escape
  // --------------------------------------------
  onKeyup($event:any):void{
    if($event.keyCode == 27){
      this.cerrar();
    }
  }

  // ---------------------------
  // Método para cerrar el visor
  // ---------------------------
  cerrar():void{
    this.generalService.visorVisible = false;
    this.generalService.visorImagen = "";
  }

}
