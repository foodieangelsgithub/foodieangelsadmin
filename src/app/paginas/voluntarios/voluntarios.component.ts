import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import { GeneralService } from '../../servicios/general.service';
import { ParametrosService } from '../../servicios/parametros.service';
import { ArraysDatosService } from '../../servicios/arrays-datos.service';
import { DatosService } from '../../servicios/datos.service';

import { Voluntario } from '../../interfaces/voluntario';

declare var $:any;

@Component({
  selector: 'app-voluntarios',
  templateUrl: './voluntarios.component.html',
  styleUrls: ['./voluntarios.component.less']
})
export class VoluntariosComponent implements OnInit,OnDestroy{

  //propiedades generales
  //----------------------
  iniciado:boolean = false; //propiedad que indica si ya se han inicializado los datos al cargar el componente. Sirve para saber si mostrar el spinner o la caja de no resultados cuando el array de datos se queda vacío
  filtersCollapsed:boolean = true; //propiedad que indica si el acordeón de los filtros está plegado o desplegado. Sirve para establecer si la flecita apunta hacia arriba o hacia abajo
  edicion:boolean = false; //propiedad que indica si estamos en modo edición y que establece si se muestra la zona de tabla o la de edición
  visualizacion:boolean = false; //propiedad que indica si estamos en modo visualización y que establece si se muestra la zona de tabla o la de visualización
  formularioEnviado:boolean = false; //propiedad que indica si el formulario se ha enviado ya. Sirve para sber cuando mostrar los errores
  volverDonaciones:boolean = false; //propiedad que indica si se tiene que volver a las pantalla de donaciones al pulsar en el botón de volver de la pantalla de edición y visualización
  traduccion:string; //propiedad que guardda las traducciones que pueda haber
  subscripcionDatos:Subscription;// propiedad que guarda la subscripción al observable
  subscripcionTraducciones:Subscription;// propiedad que guarda la subscripción al observable de traducciones

  //propiedades de datos
  //--------------------
  editando:boolean[] = []; //array que indica si estamos activando o desactivando un elemento, se usa para mostrar y ocultar el spinner mientras el servidor responde
  filtros:any; //propiedad que guarda los datos de las cajas de filtros

  constructor(
    public generalService : GeneralService,
    public parametrosService : ParametrosService,
    public arraysDatosService : ArraysDatosService,
    public datosService : DatosService,
    public translate : TranslateService,
    public router: Router
  ){}

  /* **************************************** */
  /* MÉTODOS GENERALES
  /* **************************************** */

  // ----------------------------------------------------------
  // Método que se ejecuta al iniciarse el componente y que carga los datos
  // ----------------------------------------------------------
  ngOnInit(){

    //se marca la sección del menú
    this.generalService.menuSelected = "voluntarios";

    //se resetea el array de voluntarios filtrados
    this.arraysDatosService.voluntariosFiltrados = [];

    //se inicializan los datos de las cajas de filtros
    this.filtros = {
      "nombre": "",
      "apellidos": "",
      "nombreUsuario": "",
      "telefono": "",
      "email": "",
      "active": -1,
      "lopd": -1,
      "fechaDesde":{
        "year": null,
        "month": null,
        "day": null
      },
      "fechaHasta":{
        "year": null,
        "month": null,
        "day": null
      }
    }

    //se inicializan los datos de las cajas de edición
    this.arraysDatosService.datosEditVoluntario = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "telefono": "",
      "email": "",
      "ambitoRecogida": [],
      "ambitoEntrega": [],
      "lopd": null,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1
    };

    //Se cargan los datos
    setTimeout(() => {



      this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"voluntario",this.generalService.apiToken).subscribe(data => {

        if(this.parametrosService.debugMode){
          console.log(data);
        }

        if(data.status == "success" ){

          //se resetean los voluntarios y los voluntarios filtrados
          this.arraysDatosService.voluntarios = [];
          this.arraysDatosService.voluntariosFiltrados = [];

          //se cargan los datos en el array de voluntarios
          this.arraysDatosService.voluntarios = this.buildData(data.data);

          //se cargan los datos en el array de voluntarios filtrados (que son los que finalmente se muestran en la tabla)
          this.arraysDatosService.voluntariosFiltrados = this.arraysDatosService.voluntarios;

          //Si se ha pasado un id para mostrar directamente un voluntario
          if(this.arraysDatosService.voluntarioDirectView != null){
            this.volverDonaciones = true; //Se marca que se tiene que volver a la pantalla de donaciones al pulsar el botón volver
            this.editarVisualizar(this.arraysDatosService.voluntarioDirectView,2); //Se muestra la pantalla de visualizar
            this.arraysDatosService.voluntarioDirectView = null; //se resetea a null voluntarioDirectView
          }
          else{
            this.iniciado = true;
          }


        }
        else{
          this.subscripcionTraducciones = this.translate.get('errores.errorGettingData').subscribe((res: string) => {
            this.traduccion = res;
          });
          this.generalService.showNotif(this.traduccion,"danger",3000);
        }
      },
      error => {
        this.subscripcionTraducciones = this.translate.get('errores.errorServer').subscribe((res: string) => {
          this.traduccion = res;
        });
        this.generalService.showNotif(this.traduccion,"danger",3000);
      });


    }, 1000);

  }


  /* **************************************** */
  /* MÉTODOS DE VISUALIZACIÓN Y FILTRADO
  /* **************************************** */

  // ----------------------------------------------------------
  // Método para activar y deasctivar un elemento
  // ----------------------------------------------------------
  onChangeActivate(event:any,id:number):void{

    //se muestra el spinner
    this.editando[id] = true;

    //Se hace el toggle entre activar y desactivar
    //---------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"user/disabled/"+id,this.generalService.apiToken).subscribe(data => {

      if(this.parametrosService.debugMode){
        console.log(data);
      }

      if(data.status == "success" ){

        //obtenemos el índice del elemento modificado en el array de voluntarios
        var indexVolModif = this.arraysDatosService.voluntarios.findIndex((el)=>{
          return el.id == id;
        });

        //se modifica el dato en el array de voluntarios
        if(this.arraysDatosService.voluntarios[indexVolModif].active === 1){
          this.arraysDatosService.voluntarios[indexVolModif].active = 0;
        }
        else{
          this.arraysDatosService.voluntarios[indexVolModif].active = 1;
        }

        //obtenemos el índice del elemento modificado en el array de voluntarios filtrados
        var indexVolFiltModif = this.arraysDatosService.voluntariosFiltrados.findIndex((el)=>{
          return el.id == id;
        });

        //se modifica el dato en el array de voluntarios filtrados
        this.arraysDatosService.voluntariosFiltrados[indexVolFiltModif].active = this.arraysDatosService.voluntarios[indexVolModif].active;

        //se oculta el spinner
        this.editando[id] = false;

        //se pinta el mensaje de éxito
        this.subscripcionTraducciones = this.translate.get('success.successModifyingVolunt').subscribe((res: string) => {
          this.traduccion = res;
        });
        
        this.generalService.showNotif(this.traduccion,"success",3000);

      }
      else{
        //se oculta el spinner
        this.editando[id] = false;

        this.generalService.showNotif(data.message,"danger",3000);
      }
    },
    error => {
      
      //se oculta el spinner
      this.editando[id] = true;

      this.subscripcionTraducciones = this.translate.get('errores.errorServer').subscribe((res: string) => {
        this.traduccion = res;
      });
      this.generalService.showNotif(this.traduccion,"danger",3000);
    });

  }

  // ----------------------------------------------------------
  // Método para activar y deasctivar un elemento pasando el objeto completo
  // ----------------------------------------------------------
  onChangeActivateComplete(event:any,id:number):void{

    //se muestra el spinner
    this.editando[id] = true;

    //Obtenemos los datos del elemento seleccionado
    let datosEnviar = this.arraysDatosService.voluntarios.filter((el) => {
      return el.id == id;
    });

    datosEnviar[0].active = (event) ? 1 : 0; // Se establece si está activo o no en función del slider
    datosEnviar[0].contrasenia = null; // La contraseña se pone a null porque no se modifica
 
    //Se hace el toggle entre activar y desactivar
    //---------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.sendPost(this.parametrosService.baseUrlApi+'voluntario',datosEnviar[0],this.generalService.apiToken).subscribe(data => {

      if(this.parametrosService.debugMode){
        console.log(data);
      }

      if(data.status == "success" ){

        //formateamos correctamente los datos del elemento creado o modificado que nos devuelve el api
        var dataFromApi:Voluntario[] = this.buildData([data.data]);

        //obtenemos el índice del elemento modificado en el array de voluntarios
        var indexVolModif = this.arraysDatosService.voluntarios.findIndex((el)=>{
          return el.id == dataFromApi[0].id;
        });

        //se modifica el dato en el array de voluntarios
        this.arraysDatosService.voluntarios[indexVolModif] = dataFromApi[0];
   
        //obtenemos el índice del elemento modificado en el array de voluntarios filtrados
        var indexVolFiltModif = this.arraysDatosService.voluntariosFiltrados.findIndex((el)=>{
          return el.id == dataFromApi[0].id;
        });

        //se modifica el dato en el array de voluntarios filtrados
        this.arraysDatosService.voluntariosFiltrados[indexVolFiltModif] = this.arraysDatosService.voluntarios[indexVolModif];

        //se oculta el spinner
        this.editando[id] = false;

        //se pinta el mensaje de éxito
        this.subscripcionTraducciones = this.translate.get('success.successModifyingVolunt').subscribe((res: string) => {
          this.traduccion = res;
        });
        
        this.generalService.showNotif(this.traduccion,"success",3000);

      }
      else{
        //se oculta el spinner
        this.editando[id] = false;

        this.generalService.showNotif(data.message,"danger",3000);
      }
    },
    error => {
      
      //se oculta el spinner
      this.editando[id] = true;

      this.subscripcionTraducciones = this.translate.get('errores.errorServer').subscribe((res: string) => {
        this.traduccion = res;
      });
      this.generalService.showNotif(this.traduccion,"danger",3000);
    });

  }


  // ----------------------------------------------------------
  // Método para filtrar
  // ----------------------------------------------------------

  filtrar():void{
    //sólo se filtra si alguno de los campos está relleno
    if( this.filtros.nombre != "" || this.filtros.apellidos !="" || this.filtros.nombreUsuario !="" || this.filtros.telefono != ""  || this.filtros.email != "" || this.filtros.active != "-1" || this.filtros.lopd != "-1" || this.filtros.fechaDesde.day != null || this.filtros.fechaHasta.day != null ){

      //se construyen las fechas si se han pasado
      let fechaDesde = (this.filtros.fechaDesde.day != null ) ? new Date(this.filtros.fechaDesde.year,this.filtros.fechaDesde.month-1, this.filtros.fechaDesde.day) : null ;
      let fechaHasta = (this.filtros.fechaHasta.day != null) ? new Date(this.filtros.fechaHasta.year,this.filtros.fechaHasta.month-1, this.filtros.fechaHasta.day) : null;

      //se filtran los datos
      let resultado:Voluntario[];
      resultado = this.arraysDatosService.voluntarios.filter((voluntario) => {

        var resultado = true;
        
        //se comprueba el nombre
        if(!voluntario.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase())){ resultado = false }
        //se comprueba el apelido
        if(!voluntario.apellidos.toLowerCase().includes(this.filtros.apellidos.toLowerCase())){ resultado = false }
        //se comprueba el nombre de usuario
        if(!voluntario.nombreUsuario.toLowerCase().includes(this.filtros.nombreUsuario.toLowerCase())){ resultado = false }
        //se comprueba el teléfono
        if(!voluntario.telefono.toLowerCase().includes(this.filtros.telefono.toLowerCase())){ resultado = false }
        //se comprueba el email
        if(!voluntario.email.toLowerCase().includes(this.filtros.email.toLowerCase())){ resultado = false }
        //se comprueba active
        if(voluntario.active != parseFloat(this.filtros.active) && parseFloat(this.filtros.active) != -1 ){ return false }
        //se comprueba lopd
        if(voluntario.lopd.toString() != this.filtros.lopd.toString() && this.filtros.lopd.toString() != "-1" ){return false}
        //se comprueba fecha desde
        if(voluntario.fecha < fechaDesde && fechaDesde != null){ resultado = false }
        //se comprueba fecha hasta
        if(voluntario.fecha > fechaHasta && fechaHasta != null){ resultado = false }

        return resultado;

      });
  
      this.arraysDatosService.voluntariosFiltrados = resultado;

    }
    else{
      this.arraysDatosService.voluntariosFiltrados = this.arraysDatosService.voluntarios;
    }

  }

  // ----------------------------------------------------------
  // Método para resetear todos los filtros
  // ----------------------------------------------------------
  resetFilters():void{

    this.filtros.nombre = "";
    this.filtros.apellidos = "";
    this.filtros.nombreUsuario = "";
    this.filtros.telefono = "";
    this.filtros.email = "";
    this.filtros.active= -1;
    this.filtros.lopd = "-1";
    this.filtros.fechaDesde = {
      "year": null,
      "month": null,
      "day": null
    };
    this.filtros.fechaHasta = {
      "year": null,
      "month": null,
      "day": null
    };

  }

  // ----------------------------------------------------------
  // Método para resetear los filtros individualmente
  // ----------------------------------------------------------

  resetInput(tipo:string):void{

    switch(tipo) {
      case "nombre":
        this.filtros.nombre = "";
        break;
      case "apellidos":
        this.filtros.apellidos = "";
        break;
      case "nombreUsuario":
        this.filtros.nombreUsuario = "";
        break;
      case "telefono":
        this.filtros.telefono = "";
        break;
      case "email":
        this.filtros.email = "";
        break;
      case "fechaDesde":
        this.filtros.fechaDesde = {
          "year": null,
          "month": null,
          "day": null
        };
        break;
      case "fechaHasta":
        this.filtros.fechaHasta = {
          "year": null,
          "month": null,
          "day": null
        };
        break;
    }
  
  }


  // ----------------------------------------------------------
  // Método para cambiar la propiedad que guarda si el acordeón de filtros está desplegado o no
  // ----------------------------------------------------------

  toggleFiltersCollapse():void{
    this.filtersCollapsed = !this.filtersCollapsed;
  }



  /* **************************************** */
  /* MÉTODOS DE CREACIÓN Y EDICIÓN
  /* **************************************** */

  // ----------------------------------------------------------
  // Método para crear un nuevo voluntario
  // ----------------------------------------------------------
  crear():void{

    this.formularioEnviado = false; //Se establece el formulario como no enviado
    this.resetEditar(); //se vacián todos los campos de edición

    //se generan nombres de usuario y contraseña
    //this.arraysDatosService.datosEditVoluntario.nombreUsuario = this.generalService.generateRandomString(12);
    //this.arraysDatosService.datosEditVoluntario.contrasenia = this.generalService.generateRandomString(8);

    //se muestra la pantalla de edición
    this.edicion = true;
    this.visualizacion = false;

    //se lleva el scroll hacia arriba
    $(".cuerpo").scrollTop(0);

  }


  // ----------------------------------------------------------
  // Método para ir a edición o visualización de un voluntario
  // id: id del voluntario
  // modo: indica si se va a editar o a visualzar. 1: editar, 2:visualizar
  // ----------------------------------------------------------
  editarVisualizar(id:number,modo:number = 1):void{

    this.formularioEnviado = false; //Se establece el formulario como no enviado
    this.resetEditar(); //se vacián todos los campos de edición

    //Se busca el voluntario seleccionado para edición basándonos en el id pasado
    //en el array editData se guarda el elemento del array de datos filtrados que tenga el mismo id que el id pasado
    var editData:Voluntario[];
    editData = this.arraysDatosService.voluntariosFiltrados.filter((el) => {
       return el.id == id;
    });    
    //se hace un deep copy del array del usuario seleccionado dentro del array de edición
    this.arraysDatosService.datosEditVoluntario = JSON.parse(JSON.stringify(editData[0]));

    //se muestra la pantalla de edición o visualización
    if(modo === 1){
      this.edicion = true;
      this.visualizacion = false;      
    }
    else if(modo === 2){
      this.edicion = false;
      this.visualizacion = true;
    }

    //se lleva el scroll hacia arriba
    $(".cuerpo").scrollTop(0);

  }


  // ----------------------------------------------------------
  // Método para volver a la tabla o a la pantalla de donaciones
  // ----------------------------------------------------------
  volver():void{
    if(this.volverDonaciones){
      this.volverDonaciones = false;
      this.router.navigate(["/donaciones"]);
    }
    else{
      this.formularioEnviado = false;
      this.edicion = false;
      this.visualizacion = false;

      //se lleva el scroll hacia arriba
      $(".cuerpo").scrollTop(0);
    }
  }


  // ----------------------------------------------------------
  // Método que detecta la pulsación del enter en el formulario y llama al método para guardar
  // ----------------------------------------------------------
  onKeyup($event:any,datosForm:any):boolean{
   
    if($event.keyCode==13){
      this.guardar(datosForm);
      return false;
    }

  }


  // ----------------------------------------------------------
  // Método para guardar los cambios de un voluntario
  // ----------------------------------------------------------
  guardar(datosForm:any):void{

    this.formularioEnviado = true;
    let datosEnviar:Voluntario = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "telefono": "",
      "email": "",
      "ambitoRecogida": [],
      "ambitoEntrega": [],
      "lopd": null,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1
    };

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

      //Se preparan los datos a enviar
      datosEnviar = {
        "id": this.arraysDatosService.datosEditVoluntario.id,
        "nombre": this.arraysDatosService.datosEditVoluntario.nombre,
        "apellidos": this.arraysDatosService.datosEditVoluntario.apellidos,
        "telefono": this.arraysDatosService.datosEditVoluntario.telefono,
        "email": this.arraysDatosService.datosEditVoluntario.email,
        "ambitoRecogida": this.arraysDatosService.datosEditVoluntario.ambitoRecogida,
        "ambitoEntrega": [],
        //"ambitoEntrega": this.arraysDatosService.datosEditVoluntario.ambitoEntrega,
        "lopd": this.arraysDatosService.datosEditVoluntario.lopd,
        "nombreUsuario": this.arraysDatosService.datosEditVoluntario.nombreUsuario,
        "contrasenia": (this.arraysDatosService.datosEditVoluntario.contrasenia == "__original-password__") ? null : String(this.arraysDatosService.datosEditVoluntario.contrasenia),
        "fecha": this.arraysDatosService.datosEditVoluntario.fecha,
        "active": this.arraysDatosService.datosEditVoluntario.active
      }

      //console.log(datosEnviar);


      //Aquí se hace el envío a la api para crear o modificar un voluntario
      this.subscripcionDatos = this.datosService.sendPost(this.parametrosService.baseUrlApi+'voluntario',datosEnviar,this.generalService.apiToken).subscribe(data => {
  
        if(this.parametrosService.debugMode){
          console.log(data);
        }
        
        if(data.status == "success"){
         
          //formateamos correctamente los datos del elemento creado o modificado que nos devuelve el api
          var dataFromApi:Voluntario[] = this.buildData([data.data]);

          //si estamos creando un nuevo voluntario
          //Se añade el nuevo registro al array de voluntarios y de voluntarios filtrados y se obtiene la traducción de éxito al crear
          if(this.arraysDatosService.datosEditVoluntario.id == null){
            
            this.arraysDatosService.voluntarios.push(dataFromApi[0]);
            this.arraysDatosService.voluntariosFiltrados = [];
            this.arraysDatosService.voluntariosFiltrados = this.arraysDatosService.voluntarios;
            this.resetFilters();
            //se obtiene el mensaje de éxito
            this.subscripcionTraducciones = this.translate.get('success.successCreatingVolunt').subscribe((res: string) => {
              this.traduccion = res;
            });


          }
          
          //Si estamos editando un voluntario existente
          //Se modifica el registro en el array de voluntarios y de voluntarios filtrados y se obtiene la traducción de éxito al modificar
          else{

            //obtenemos el índice del elemento modificado en el array de voluntarios
            var indexVolModif = this.arraysDatosService.voluntarios.findIndex((el)=>{
              return el.id == this.arraysDatosService.datosEditVoluntario.id;
            });
            
            //se modifica el dato en el array de voluntarios
            this.arraysDatosService.voluntarios[indexVolModif] = dataFromApi[0];

            //obtenemos el índice del elemento modificado en el array de voluntarios filtrados
            var indexVolFiltModif = this.arraysDatosService.voluntariosFiltrados.findIndex((el)=>{
              return el.id == this.arraysDatosService.datosEditVoluntario.id;
            });

            //se modifica el dato en el array de voluntarios filtrados
            this.arraysDatosService.voluntariosFiltrados[indexVolFiltModif] = this.arraysDatosService.voluntarios[indexVolModif];

            //se obtiene el mensaje de éxito
            this.subscripcionTraducciones = this.translate.get('success.successModifyingVolunt').subscribe((res: string) => {
              this.traduccion = res;
            });
            

          }

          
          //se muestra mensaje de exito y se vuelve
          this.generalService.showNotif(this.traduccion,"success",3000);
          this.edicion = false;
          this.visualizacion = false;
          

        }// Cierra if(data.status == "success"){

        else if(data.status == "error"){
          /*
          this.subscripcionTraducciones = this.translate.get('errores.errorCreatingEditingAdmin').subscribe((res: string) => {
            this.traduccion = res;
          });
          this.generalService.showNotif(this.traduccion,"danger",3000);
          */ 

          this.generalService.showNotif(data.message,"danger",3000);

        }// Cierraelse if(data.status == "error"){

      },
      error => {
        //Error al conectarse con el servidor
        this.subscripcionTraducciones = this.translate.get('errores.errorServer').subscribe((res: string) => {
          this.traduccion = res;
        });
        this.generalService.showNotif(this.traduccion,"danger",3000);
      });





      
    }

  }


  // ----------------------------------------------------------
  // Método para resetear todos los campos de edición
  // ----------------------------------------------------------

  resetEditar():void{

    this.arraysDatosService.datosEditVoluntario = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "telefono": "",
      "email": "",
      "ambitoRecogida": [],
      "ambitoEntrega": [],
      "lopd": null,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1
    };

  }


  // ----------------------------------------------------------
  // Método para construir correctamente los datos que vienen del api y que 
  // se insertarán en los arrays de voluntarios y voluntarios filtrados 
  // arraydata: El array con los datos que nos vienen de la api y con los que construimos los datos que se insertarán
  // ----------------------------------------------------------
  buildData(arraydata:any):Voluntario[]{

    var volBuilt:Voluntario[] = [];

    //se cargan los datos en el array de voluntarios
    arraydata.forEach((item:any,index:number)=>{

      //se crea el objeto de administrador temporal que se añadirá al array de administradores
      var volTemp:Voluntario = {
        "id": parseInt(item.id),
        "nombre": String(item.nombre),
        "apellidos": (item.apellidos == "" || item.apellidos == null || item.apellidos == undefined) ? "" : String(item.apellidos),
        "telefono": (item.telefono == "" || item.telefono == null || item.telefono == undefined) ? "" : String(item.telefono),
        "email": (item.email == "" || item.email == null || item.email == undefined) ? "" : String(item.email),
        "ambitoRecogida": item.ambitoRecogida,
        "ambitoEntrega": item.ambitoEntrega,
        "lopd": item.lopd,
        "nombreUsuario": String(item.nombreUsuario),        
        "contrasenia": (item.contrasenia == "" || item.contrasenia == null || item.contrasenia == undefined) ? "__original-password__" : String(item.contrasenia),
        "fecha": new Date(item.fecha),
        "active": (item.active == "1") ? 1 : 0
      }

      //se añade el beneficario temporal al array de beneficiarios
      volBuilt.push(volTemp);

    });

    return volBuilt;

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