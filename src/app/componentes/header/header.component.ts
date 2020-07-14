import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DatosService } from '../../servicios/datos.service';
import { ParametrosService } from '../../servicios/parametros.service';

import { GeneralService } from '../../servicios/general.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  traduccion:string; //propiedad que guardda las traducciones que pueda haber
  subscripcionDatos:Subscription;// propiedad que guarda la subscripción al observable
  subscripcionTraducciones:Subscription;// propiedad que guarda la subscripción al observable de traducciones

  constructor(
    public generalService : GeneralService,
    public datosService: DatosService,
    public parametrosService: ParametrosService,
    public translate : TranslateService,
  ){}

  ngOnInit() {
  }

  // ------------------------------------------------------------------------
  // MÉTODO PARA DESLOGUEARSE
  // ------------------------------------------------------------------------
  logout():void{

    //Aquí se hace la conexión a la api para el logout
    this.subscripcionDatos = this.datosService.getCall(this.parametrosService.baseUrlApi+"logout").subscribe(data => {
      
      if(this.parametrosService.debugMode){
        console.log(data);
      }

      if(data.status == "error"){

        //se borran el usuario como logueado
        this.generalService.logueado = false;
        this.generalService.nombreUsuario = "";
        this.generalService.apiToken = "";

        //Se elimina el apitoken del browser storage
        sessionStorage.setItem("foodieToken", "");

        //Se redirige de nuevo al login
        window.location.href="login";

      }

    },
    error => {

      this.subscripcionTraducciones = this.translate.get('errores.errorServer').subscribe((res: string) => {
        this.traduccion = res;
      });
      this.generalService.showNotif(this.traduccion,"danger",3000);
      //this.generalService.showNotif(error,"danger",3000); //se muestra notifiación de error

    });



  }


  // ----------------------------------------------------------
  // Método que se ejecuta al cerrarse el componente
  // ----------------------------------------------------------
  ngOnDestroy(){

    if(this.subscripcionDatos != undefined){
      this.subscripcionDatos.unsubscribe();
    }

    if(this.subscripcionTraducciones != undefined){
      this.subscripcionTraducciones.unsubscribe();
    }

  }

}
