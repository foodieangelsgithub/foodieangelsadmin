import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import { ParametrosService } from '../../servicios/parametros.service';
import { GeneralService } from '../../servicios/general.service';
import { ArraysDatosService } from '../../servicios/arrays-datos.service';
import { DatosService } from '../../servicios/datos.service';

import { Proveedor } from 'src/app/interfaces/proveedor';
import { Municipio } from 'src/app/interfaces/municipio';
import { Horario } from 'src/app/interfaces/horario';

declare var $:any;

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.less']
})
export class ProveedoresComponent implements OnInit,OnDestroy {

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
  filtros:any; //propiedad que guarda los datos de las cajas de filtros
  editando:boolean[] = []; //array que indica si estamos activando o desactivando en uelemento, se usa para mostrar y ocultar el spinner mientras el servidor responde

  constructor(
    public parametrosService: ParametrosService,
    public generalService : GeneralService,
    public arraysDatosService : ArraysDatosService,
    public datosService: DatosService,
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
    this.generalService.menuSelected = "proveedores";

    //se resetea el array de proveedores filtrados
    this.arraysDatosService.proveedoresFiltrados = [];

    //se inicializan los datos de las cajas de filtros
    this.filtros = {
      "nombre": "",
      "apellidos": "",
      "nombreUsuario": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "telefono": "",
      "email": "",
      "codPostal": "",
      "redesSociales": -1,
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
    this.arraysDatosService.datosEditProveedor = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "telefono": "",
      "email": "",
      "codPostal": "",
      "redesSociales": null,
      "lopd": null,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1,
      "horario": [
        {
          "dia": 1,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 2,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 3,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 4,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 5,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 6,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 7,
          "abierto": false,
          "rangoHoras": []
        }
      ]
    };

    setTimeout(() => {

      //obtenemos loa datos de los beneficiarios haciendo la llamada a la api
      //---------------------------------------------------------------------
      this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"proveedor",this.generalService.apiToken).subscribe(data => {

        if(this.parametrosService.debugMode){
          console.log(data);
        }

        if(data.status == "success" ){

          //se resetean los proveedores y los proveedores filtrados
          this.arraysDatosService.proveedores = [];
          this.arraysDatosService.proveedoresFiltrados = [];

          //se cargan los datos en el array de proveedores
          this.arraysDatosService.proveedores = this.buildData(data.data);

          //se cargan los datos en el array de proveedores filtrados (que son los que finalmente se muestran en la tabla)
          this.arraysDatosService.proveedoresFiltrados = this.arraysDatosService.proveedores;
      
          //Si se ha pasado un id para mostrar directamente un proveedor
          if(this.arraysDatosService.proveedorDirectView != null){
            this.volverDonaciones = true; //Se marca que se tiene que volver a la pantalla de donaciones al pulsar el botón volver
            this.editarVisualizar(this.arraysDatosService.proveedorDirectView,2); //Se muestra la pantalla de visualizar
            this.arraysDatosService.proveedorDirectView = null; //se resetea a null voluntarioDirectView
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

        //obtenemos el índice del elemento modificado en el array de proveedores
        var indexProvModif = this.arraysDatosService.proveedores.findIndex((el)=>{
          return el.id == id;
        });

        //se modifica el dato en el array de proveedores
        if(this.arraysDatosService.proveedores[indexProvModif].active === 1){
          this.arraysDatosService.proveedores[indexProvModif].active = 0;
        }
        else{
          this.arraysDatosService.proveedores[indexProvModif].active = 1;
        }

        //obtenemos el índice del elemento modificado en el array de proveedores filtrados
        var indexProvFiltModif = this.arraysDatosService.proveedoresFiltrados.findIndex((el)=>{
          return el.id == id;
        });

        //se modifica el dato en el array de proveedores filtrados
        this.arraysDatosService.proveedoresFiltrados[indexProvFiltModif].active = this.arraysDatosService.proveedores[indexProvModif].active;

        //se oculta el spinner
        this.editando[id] = false;

        //se pinta el mensaje de éxito
        this.subscripcionTraducciones = this.translate.get('success.successModifyingProvider').subscribe((res: string) => {
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
    if( this.filtros.nombre != "" || this.filtros.apellidos !="" || this.filtros.nombreUsuario !="" || this.filtros.direccion != "" || this.filtros.provincia != "" || this.filtros.municipio != "" || this.filtros.telefono != "" || this.filtros.email != "" || this.filtros.codPostal != "" || this.filtros.redesSociales != "-1" || this.filtros.lopd != "-1" || this.filtros.active != "-1" || this.filtros.fechaDesde.day != null || this.filtros.fechaHasta.day != null ){

      //se construyen las fechas si se han pasado
      let fechaDesde = (this.filtros.fechaDesde.day != null ) ? new Date(this.filtros.fechaDesde.year,this.filtros.fechaDesde.month-1, this.filtros.fechaDesde.day) : null ;
      let fechaHasta = (this.filtros.fechaHasta.day != null) ? new Date(this.filtros.fechaHasta.year,this.filtros.fechaHasta.month-1, this.filtros.fechaHasta.day) : null;

      //se filtran los datos
      let resultado:Proveedor[];
      resultado = this.arraysDatosService.proveedores.filter((proveedor) => {

        var resultado = true;
        
        //se comprueba el nombre
        if(!proveedor.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase())){ resultado = false }
        //se comprueba el apelido
        if(!proveedor.apellidos.toLowerCase().includes(this.filtros.apellidos.toLowerCase())){ resultado = false }
        //se comprueba el nombre de usuario
        if(!proveedor.nombreUsuario.toLowerCase().includes(this.filtros.nombreUsuario.toLowerCase())){ resultado = false }
        //se comprueba la dirección
        if(!proveedor.direccion.toLowerCase().includes(this.filtros.direccion.toLowerCase())){ resultado = false }
        //se comprueba la provincia
        if(proveedor.provincia !== parseFloat(this.filtros.provincia) && this.filtros.provincia != null &&  this.filtros.provincia > 0){ resultado = false }
        //se comprueba el municipio
        if(proveedor.municipio !== parseFloat(this.filtros.municipio) && this.filtros.municipio != null &&  this.filtros.municipio > 0){ resultado = false }
        //se comprueba el teléfono
        if(!proveedor.telefono.toLowerCase().includes(this.filtros.telefono.toLowerCase())){ resultado = false }
        //se comprueba el email
        if(!proveedor.email.toLowerCase().includes(this.filtros.email.toLowerCase())){ resultado = false }
        //se comprueba el código postal
        if(!proveedor.codPostal.toLowerCase().includes(this.filtros.codPostal.toLowerCase())){ resultado = false }
        //se comprueban las redes sociales
        if(proveedor.redesSociales.toString() != this.filtros.redesSociales.toString() && this.filtros.redesSociales.toString() != "-1" ){return false}
        //se comprueba lopd
        if(proveedor.lopd.toString() != this.filtros.lopd.toString() && this.filtros.lopd.toString() != "-1" ){return false}
        //se comprueba fecha desde
        if(proveedor.fecha < fechaDesde && fechaDesde != null){ resultado = false }
        //se comprueba fecha hasta
        if(proveedor.fecha > fechaHasta && fechaHasta != null){ resultado = false }
        //se comprueba active
        if(proveedor.active != parseFloat(this.filtros.active) && parseFloat(this.filtros.active) != -1 ){ return false }

        return resultado;

      });
  
      this.arraysDatosService.proveedoresFiltrados = resultado;

    }
    else{
      this.arraysDatosService.proveedoresFiltrados = this.arraysDatosService.proveedores;
    }

  }


  // ----------------------------------------------------------
  // Método para resetear todos los filtros
  // ----------------------------------------------------------
  resetFilters():void{

    this.filtros.nombre = "";
    this.filtros.apellidos = "";
    this.filtros.nombreUsuario = "";
    this.filtros.direccion = "";
    this.filtros.provincia = -1;
    this.filtros.municipio = -1;
    this.filtros.telefono = "";
    this.filtros.email = "";
    this.filtros.codPostal = "";
    this.filtros.redesSociales = "-1";
    this.filtros.lopd = "-1";
    this.filtros.active = "-1";
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
      case "direccion":
        this.filtros.direccion = "";
        break;
      case "provincia":
        this.filtros.provincia = -1;
        break;
      case "municipio":
        this.filtros.municipio = -1;
        break;
      case "telefono":
        this.filtros.telefono = "";
        break;
      case "email":
        this.filtros.email = "";
        break;
      case "codPostal":
        this.filtros.codPostal = "";
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
  // Método para establecer el municipio cuando se cambia la provincia
  // se le pasa si estamos establececindo los municipios de filtros o de edición
  // tipo: 1 -> filtros, 2 -> edición, 3 -> edicion inicial
  // ----------------------------------------------------------
  setMuncipios(tipo:number):void{
    if(tipo == 1){

      if(this.filtros.provincia < 1){
        this.arraysDatosService.provMuncipiosFiltros = this.arraysDatosService.municipios;
      }
      else{
        //obtenemos los muncipios que correspondan a la provincia pasada
        var muncipiotemp:Municipio[] = [];
        muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
           return el.provinciaId == this.filtros.provincia;
        });
        this.arraysDatosService.provMuncipiosFiltros = muncipiotemp;
      }
      this.filtros.municipio = -1;

    }
    else if(tipo == 2){

      if(this.arraysDatosService.datosEditProveedor.provincia < 1){
        this.arraysDatosService.provMuncipiosEdit = this.arraysDatosService.municipios;
      }
      else{
        //obtenemos los muncipios que correspondan a la provincia pasada
        var muncipiotemp:Municipio[] = [];
        muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
           return el.provinciaId == this.arraysDatosService.datosEditProveedor.provincia;
        });
        this.arraysDatosService.provMuncipiosEdit = muncipiotemp;
      }
      this.arraysDatosService.datosEditProveedor.municipio = -1;

    }
    else if(tipo == 3){

      if(this.arraysDatosService.datosEditProveedor.provincia < 1){
        this.arraysDatosService.provMuncipiosEdit = this.arraysDatosService.municipios;
      }
      else{
        //obtenemos los muncipios que correspondan a la provincia pasada
        var muncipiotemp:Municipio[] = [];
        muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
           return el.provinciaId == this.arraysDatosService.datosEditProveedor.provincia;
        });
        this.arraysDatosService.provMuncipiosEdit = muncipiotemp;
      }

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
  // Método para crear un nuevo proveedor
  // ----------------------------------------------------------
  crear():void{

    this.resetEditar(); //se vacián todos los campos de edición
    this.formularioEnviado = false; //se establece el formulario a no enviado

    //se generan nombres de usuario y contraseña
    //this.arraysDatosService.datosEditProveedor.nombreUsuario = this.generalService.generateRandomString(12);
    //this.arraysDatosService.datosEditProveedor.contrasenia = this.generalService.generateRandomString(8);

    //se muestra la pantalla de edición
    this.edicion = true; 
    this.visualizacion = false;

    //se lleva el scroll hacia arriba
    $(".cuerpo").scrollTop(0);

  }


  // ----------------------------------------------------------
  // Método para ir a edición o visualización de un proveedor
  // id: id del proveedor
  // modo: indica si se va a editar o a visualzar. 1: editar, 2:visualizar
  // ----------------------------------------------------------
  editarVisualizar(id:number,modo:number = 1):void{

    this.resetEditar(); //se vacián todos los campos de edición
    this.formularioEnviado = false; //se establece el formulario a no enviado

    //Se busca el proveedor seleccionado para edición basándonos en el id pasado
    //en el array editData se guarda el elemento del array de datos filtrados que tenga el mismo id que el id pasado
    var editData:Proveedor[];
    editData = this.arraysDatosService.proveedoresFiltrados.filter((el) => {
       return el.id == id;
    });    
    //se hace un deep copy del array del usuario seleccionado dentro del array de edición
    this.arraysDatosService.datosEditProveedor = JSON.parse(JSON.stringify(editData[0]));

    this.setMuncipios(3);  //se establecen los muncipios correspondientes a la provincia establecida

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
  // Método para volver a la tabla o a la página de donaciones
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
  // Método para guardar los cambios de un proveedor
  // ----------------------------------------------------------
  guardar(datosForm:any):void{

    this.formularioEnviado = true;

    let datosEnviar:Proveedor = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "telefono": "",
      "email": "",
      "codPostal": "",
      "redesSociales": null,
      "lopd": null,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1,
      "horario": [
        {
          "dia": 1,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 2,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 3,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 4,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 5,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 6,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 7,
          "abierto": false,
          "rangoHoras": []
        }
      ]
    }

    let horarioOrdenado:Horario[];

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

      //Ordenamos el horario por si viene desordenado, desde el día 1 al día 7
      horarioOrdenado = this.ordenaHorario(this.arraysDatosService.datosEditProveedor.horario);

      //Se preparan los datos a enviar
      datosEnviar = {
        "id": this.arraysDatosService.datosEditProveedor.id,
        "nombre": this.arraysDatosService.datosEditProveedor.nombre,
        "apellidos": this.arraysDatosService.datosEditProveedor.apellidos,
        "direccion": this.arraysDatosService.datosEditProveedor.direccion,
        "provincia": this.arraysDatosService.datosEditProveedor.provincia,
        "municipio": this.arraysDatosService.datosEditProveedor.municipio,
        "telefono": this.arraysDatosService.datosEditProveedor.telefono,
        "email": this.arraysDatosService.datosEditProveedor.email,
        "codPostal": this.arraysDatosService.datosEditProveedor.codPostal,
        "redesSociales": this.arraysDatosService.datosEditProveedor.redesSociales,
        "lopd": this.arraysDatosService.datosEditProveedor.lopd,
        "nombreUsuario": this.arraysDatosService.datosEditProveedor.nombreUsuario,
        "contrasenia": (this.arraysDatosService.datosEditProveedor.contrasenia == "__original-password__") ? null : String(this.arraysDatosService.datosEditProveedor.contrasenia),
        "fecha": this.arraysDatosService.datosEditProveedor.fecha,
        "active": this.arraysDatosService.datosEditProveedor.active,
        "horario": [
          {
            "dia": 1,
            "abierto": horarioOrdenado[0].abierto,
            "rangoHoras": horarioOrdenado[0].rangoHoras
          },
          {
            "dia": 2,
            "abierto": horarioOrdenado[1].abierto,
            "rangoHoras": horarioOrdenado[1].rangoHoras
          },
          {
            "dia": 3,
            "abierto": horarioOrdenado[2].abierto,
            "rangoHoras": horarioOrdenado[2].rangoHoras
          },
          {
            "dia": 4,
            "abierto": horarioOrdenado[3].abierto,
            "rangoHoras": horarioOrdenado[3].rangoHoras
          },
          {
            "dia": 5,
            "abierto": horarioOrdenado[4].abierto,
            "rangoHoras": horarioOrdenado[4].rangoHoras
          },
          {
            "dia": 6,
            "abierto": horarioOrdenado[5].abierto,
            "rangoHoras": horarioOrdenado[5].rangoHoras
          },
          {
            "dia": 7,
            "abierto": horarioOrdenado[6].abierto,
            "rangoHoras": horarioOrdenado[6].rangoHoras
          }
        ]
      }

      //console.log(datosEnviar);

      this.subscripcionDatos = this.datosService.sendPost(this.parametrosService.baseUrlApi+'proveedor',datosEnviar,this.generalService.apiToken).subscribe(data => {
        
        if(this.parametrosService.debugMode){
          console.log(data);
        }

        if(data.status == "success"){

          //formateamos correctamente los datos del elemento creado o modificado que nos devuelve el api
          var dataFromApi:Proveedor[] = this.buildData([data.data]);

          //si estamos creando un nuevo proveedor
          //Se añade el nuevo registro al array de proveedores y de proveedores filtrados y se obtiene la traducción de éxito al crear
          if(this.arraysDatosService.datosEditProveedor.id == null){
            this.arraysDatosService.proveedores.push(dataFromApi[0]);
            this.arraysDatosService.proveedoresFiltrados = [];
            this.arraysDatosService.proveedoresFiltrados = this.arraysDatosService.proveedores;
            //se obtiene el mensaje de éxito
            this.subscripcionTraducciones = this.translate.get('success.successCreatingProvider').subscribe((res: string) => {
              this.traduccion = res;
            });
          }

          //si estamos editando un beneficiaro existente
          //Se modifica el registro en el array de beneficiarios y de beneficiarios filtrados y se obtiene la traducción de éxito al modificar
          else{

            //obtenemos el índice del elemento modificado en el array de proveedores
            var indexProvModif = this.arraysDatosService.proveedores.findIndex((el)=>{
              return el.id == this.arraysDatosService.datosEditProveedor.id;
            });

            //se modifica el dato en el array de proveedores
            this.arraysDatosService.proveedores[indexProvModif] = dataFromApi[0];

            //obtenemos el índice del elemento modificado en el array de proveedores filtrados
            var indexProvFiltModif = this.arraysDatosService.proveedoresFiltrados.findIndex((el)=>{
              return el.id == this.arraysDatosService.datosEditProveedor.id;
            });

            //se modifica el dato en el array de proveedores filtrados
            this.arraysDatosService.proveedoresFiltrados[indexProvFiltModif] = this.arraysDatosService.proveedores[indexProvModif];

            //se obtiene el mensaje de éxito
            this.subscripcionTraducciones = this.translate.get('success.successModifyingProvider').subscribe((res: string) => {
              this.traduccion = res;
            });

          }


          //se muestra mensaje de exito y se vuelve
          this.generalService.showNotif(this.traduccion,"success",3000);
          this.edicion = false;
          this.visualizacion = false;


        }// Cierra if(data.status == "success"){
        else if(data.status == "error"){

          this.generalService.showNotif(data.message,"danger",3000);

        }// Cierraelse if(data.status == "error"){
        

      },
      error => {
        //this.generalService.showNotif(error,"danger",3000); //se muestra notifiación de error

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

    this.arraysDatosService.datosEditProveedor = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "telefono": "",
      "email": "",
      "codPostal": "",
      "redesSociales": null,
      "lopd": null,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1,
      "horario": [
        {
          "dia": 1,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 2,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 3,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 4,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 5,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 6,
          "abierto": false,
          "rangoHoras": []
        },
        {
          "dia": 7,
          "abierto": false,
          "rangoHoras": []
        }
      ]
    };

  }


  // ----------------------------------------------------------
  // Método para construir correctamente los datos que vienen del api y que 
  // se insertarán en los arrays de proveedores y proveedores filtrados 
  // arraydata: El array con los datos que nos vienen de la api y con los que construimos los datos que se insertarán
  // ----------------------------------------------------------
  buildData(arraydata:any):Proveedor[]{

    var provfBuit:Proveedor[] = [];

    //se cargan los datos en el array de proveedores
    arraydata.forEach((item:any,index:number)=>{

      //se crea el objeto de proveedor temporal que se añadirá al array de proveedores
      var provTemp:Proveedor = {
        "id": parseInt(item.id),
        "nombre": String(item.nombre),
        "apellidos": String(item.apellidos),
        "direccion": String(item.direccion),
        "provincia": parseInt(item.provincia),
        "municipio": parseInt(item.municipio),
        "telefono": String(item.telefono),
        "email": (item.email == "" || item.email == null || item.email == undefined) ? "" : String(item.email),
        "codPostal": String(item.codPostal),
        "redesSociales": (item.redesSociales == 1 || item.redesSociales == "1" || item.redesSociales == "true" || item.redesSociales == true) ? true : false,
        "lopd": ( item.lopd == 1 || item.lopd == "1"|| item.lopd == "true" || item.lopd == true) ? true : false,
        "nombreUsuario": String(item.nombreUsuario),
        "contrasenia": (item.contrasenia == "" || item.contrasenia == null || item.contrasenia == undefined) ? "__original-password__" : String(item.contrasenia),
        "active": (item.active == 1 || item.active == "1") ? 1 : 0,
        "fecha": new Date(item.fecha),
        "horario": []
      }

      
      //se añaden los días de los horarios temporales que se incluyen en el proveedor temporal que se añadirá al array de proveedores     
      if(item.horario.length > 0){
        item.horario.forEach((item2:any,index2:number)=>{

          var diasHorTemp:any = {
            "dia": parseInt(item2.dia),
            "abierto": (item2.abierto == true || item2.abierto == "true") ? true : false,
            "rangoHoras": []
          }


          if(item2.rangoHoras.length > 0){
            //Se añaden los horarios a cada día
            item2.rangoHoras.forEach((item3:any,index3:number)=>{
              var HorTemp:any = {
                "abre": String(item3.abre),
                "cierra": String(item3.cierra),
              }

              //Se añade el rango de horas al horario temporal
              diasHorTemp.rangoHoras.push(HorTemp);

            });
          }


          //Se rellena el horario temporal al array de horarios del proveedor
          provTemp.horario.push(diasHorTemp);

        });
      }

      //se añade el proveedor temporal al array de proveedores
      provfBuit.push(provTemp);

    });

    return provfBuit;

  }

  // ----------------------------------------------------------------------------------------------
  // Método que ordena el horario en función del día, del día 1 al día 7
  // ----------------------------------------------------------------------------------------------
  ordenaHorario(horario:Horario[]):Horario[]{
    var resultado: Horario[];
    resultado = horario.sort(function(a, b){
      return a.dia-b.dia;
    });
    return resultado;
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