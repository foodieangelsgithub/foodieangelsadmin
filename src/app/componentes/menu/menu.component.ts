import { Component, OnInit } from '@angular/core';

import { GeneralService } from '../../servicios/general.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  constructor(
    public generalService : GeneralService
  ){}

  ngOnInit() {
  }

  // -----------------------------------------------------------------------
  // Método que guarda en generalService.menuSelected la sección 
  // seleccionada y que sirve para realtar la opción seleccionada en el menú
  // -----------------------------------------------------------------------
  seleccionar(seccion:string):void{
    this.generalService.menuSelected = seccion;
    setTimeout(() => {
      this.generalService.hideMenu();  
    }, 10);
  }

}