import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DatosService } from '../../servicios/datos.service';

import { ParametrosService } from '../../servicios/parametros.service';
import { GeneralService } from '../../servicios/general.service';
import { ArraysDatosService } from '../../servicios/arrays-datos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit,OnDestroy {

  user:string;
  password:string;
  traduccion:string; //propiedad que guardda las traducciones que pueda haber
  formularioEnviado:boolean = false; //propiedad que indica si el formulario se ha enviado ya. Sirve para sber cuando mostrar los errores
  subscripcionDatos:Subscription;// propiedad que guarda la subscripción al observable
  subscripcionTraducciones:Subscription;// propiedad que guarda la subscripción al observable de traducciones

  constructor(
    public parametrosService: ParametrosService,
    public arraysDatosService : ArraysDatosService,
    public datosService: DatosService,
    public generalService: GeneralService,
    public translate : TranslateService,
    public router: Router
  ){}

  ngOnInit() {
  }

  // ----------------------------------------------------------
  // Método que detecta la pulsación del enter en el formulario y llama al método para guardar
  // ----------------------------------------------------------
  onKeyup($event:any,datosForm:any):boolean{
    if($event.keyCode==13){
      this.enviar(datosForm);
      return false;
    }
  }

  // --------------------------------
  // Método para enviar el formulario
  // --------------------------------
  enviar(datosForm:any):void{

    this.formularioEnviado = true;

    var valores:any = datosForm.value;

    // Si el formulario es inválido
    if(datosForm.form.invalid){

      this.subscripcionTraducciones = this.translate.get('errores.errorComplete').subscribe((res: string) => {
        this.traduccion = res;
      });
      this.generalService.showNotif(this.traduccion,"danger",5000);

    }
    // si el formulario es válido
    else{

      //se construyen los datos para enviar
      let dataSend = {
        "username": this.user,
        "password": this.password
      }

      //Aquí se hace la conexión a la api para el login
      this.subscripcionDatos = this.datosService.sendPost(this.parametrosService.baseUrlApi+'login',dataSend,this.generalService.apiToken).subscribe(data => {
        
        if(this.parametrosService.debugMode){
          console.log(data);
        }

        //Sólo nos logueamos si el usuario tiene el role administrador
        if(data.status == "success" && data.data.rol[0] == "ROLE_ADMIN"){

          //se establece el usuario como logueado
          this.generalService.logueado = true;
          this.generalService.nombreUsuario = data.data.username;
          this.generalService.apiToken = data.data.apiToken;

          //Se guarda el apitoken en el browser storage
          sessionStorage.setItem("foodieToken", this.generalService.apiToken);          

          //se cargan los datos generales necsarios para la app, provincias, municipios,situaciones laborales,ingresos, procedencia de ingresos y relaciones
          if(this.arraysDatosService.provincias.length < 1) this.arraysDatosService.fillProvincias(); //Se cargan las provincias
          if(this.arraysDatosService.municipios.length < 1)this.arraysDatosService.fillMunicipios(); //Se cargan los municipios
          if(this.arraysDatosService.situacionesLaborales.length < 1) this.arraysDatosService.fillSitLaborales(); //Se cargan las situaciones laborales
          if(this.arraysDatosService.ingresos.length < 1) this.arraysDatosService.fillIngresos(); //Se cargan los ingresos
          if(this.arraysDatosService.procIngresos.length < 1) this.arraysDatosService.fillProcIngresos(); //Se cargan las procedencias de ingresos
          if(this.arraysDatosService.relaciones.length < 1) this.arraysDatosService.fillRelaciones(); //Se cargan las relaciones
          
          if(this.parametrosService.debugMode){
            console.log("****************************************");
            console.log("****************************************");
            console.log("LOGIN NORMAL");
            console.log(this.generalService.logueado);
            console.log(this.generalService.nombreUsuario);
            console.log(this.generalService.apiToken);
            console.log("****************************************");
            console.log("****************************************");
          }

          //se redirige a la página deseada
          this.router.navigate(["/administradores"]);


        }// Cierra if(data.status == "success"){
        else{

          this.subscripcionTraducciones = this.translate.get('errores.errorLogin').subscribe((res: string) => {
            this.traduccion = res;
          });
          this.generalService.showNotif(this.traduccion,"danger",3000);

        }// Cierraelse if(data.status == "error"){

      },
      error => {

        //403_usuario o contraseña incorrectos
        this.subscripcionTraducciones = this.translate.get('errores.errorLogin').subscribe((res: string) => {
          this.traduccion = res;
        });
        //404_página no encontrada - error al conectar al servidor
        /*
        this.subscripcionTraducciones = this.translate.get('errores.errorServer').subscribe((res: string) => {
          this.traduccion = res;
        });
        */
        this.generalService.showNotif(this.traduccion,"danger",3000);
        //this.generalService.showNotif(error,"danger",3000); //se muestra notifiación de error

      });


    }

  }

  // ----------------------------------------------------------
  // Método que determina si se puede salir de la página
  // se usa dentro de DeactivateLoginGuard
  // Sólo permite salir de la página de login si el usuario se ha logueado correctamente
  // ----------------------------------------------------------
  canDeactivate():boolean{

    //si el usuario está logueado permite salir de el componente login
    if(this.generalService.logueado){
      return true;
    }
    //si no está logueado no permite salir del componente
    else{
      //se conecta al servidor para comporbar si el usuario está efectivamente logueado, o ha recargado la página
      this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"login",this.generalService.apiToken).subscribe(data => {
        if(data.status == "success" && data.data.rol[0] == "ROLE_ADMIN"){
          return true;
        }
        else if(data.status == "error"){
          return false;
        }// Cierraelse if(data.status == "error"){
      });
      return false;
    }


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
