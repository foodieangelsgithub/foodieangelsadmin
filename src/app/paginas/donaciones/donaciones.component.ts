import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import { ParametrosService } from '../../servicios/parametros.service';
import { GeneralService } from '../../servicios/general.service';
import { ArraysDatosService } from '../../servicios/arrays-datos.service';
import { DatosService } from '../../servicios/datos.service';

import { Donacion } from '../../interfaces/donacion';
import { Producto } from '../../interfaces/producto';
import { Provincia } from '../../interfaces/provincia';
import { Municipio } from '../../interfaces/municipio';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

declare var $:any;

@Component({
  selector: 'app-donaciones',
  templateUrl: './donaciones.component.html',
  styleUrls: ['./donaciones.component.less']
})
export class DonacionesComponent implements OnInit,OnDestroy {

  //propiedades generales
  //----------------------
  iniciado:boolean = false; //propiedad que indica si ya se han inicializado los datos al cargar el componente. Sirve para saber si mostrar el spinner o la caja de no resultados cuando el array de datos se queda vacío
  filtersCollapsed:boolean = true; //propiedad que indica si el acordeón de los filtros está plegado o desplegado. Sirve para establecer si la flecita apunta hacia arriba o hacia abajo
  visualizacion:boolean = false; //propiedad que indica si estamos en modo visualización y que establece si se muestra la zona de tabla o la de visualización
  formularioEnviado:boolean = false; //propiedad que indica si el formulario se ha enviado ya. Sirve para sber cuando mostrar los errores
  traduccion:string; //propiedad que guardda las traducciones que pueda haber
  subscripcionDatos:Subscription;// propiedad que guarda la subscripción al observable
  subscripcionTraducciones:Subscription;// propiedad que guarda la subscripción al observable de traducciones

  //propiedades de datos
  //--------------------
  productos:Producto[] = []; //propiedad que guarda los datos de los productos
  filtros:any; //propiedad que guarda los datos de las cajas de filtros
  fechaEditCalendar:NgbDateStruct; //datos de año mes y día para el datepicker de la fecha de la donación

  constructor(
    public parametrosService : ParametrosService,
    public generalService : GeneralService,
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

    //se resetea el visor
    this.generalService.visorVisible = false;
    this.generalService.visorImagen = "";

    //se marca la sección del menú
    this.generalService.menuSelected = "donaciones";

    //se resetea el array de donaciones filtradas
    this.arraysDatosService.donacionesFiltradas = [];

    //se inicializan los datos de las cajas de filtros
    this.filtros = {
      "producto": -1,
      "cantidadDesde": null,
      "cantidadHasta": null,
      "proveedorNombre": "",
      "proveedorApellidos": "",
      "proveedorNombreUsuario": "",
      "beneficiarioNombre": "",
      "beneficiarioApellidos": "",
      "beneficiarioNombreUsuario": "",
      "voluntarioNombre": "",
      "voluntarioApellidos": "",
      "voluntarioNombreUsuario": "",
      "provinciaProveedor": -1,
      "municipioProveedor": -1,
      "provinciaBeneficiario": -1,
      "municipioBeneficiario": -1,
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
    };
    
    //se inicializan los datos de las cajas de edición
    this.arraysDatosService.datosEditDonacion = {
      "id": null,
      "producto": null,
      "cantidad": null,
      "provinciaProveedor": null,
      "municipioProveedor": null,
      "provinciaBeneficiario": null,
      "municipioBeneficiario": null,
      "proveedorId": null,
      "proveedorNombre": "",
      "proveedorApellidos": "",
      "proveedorNombreUsuario": "",
      "beneficiarioId": null,
      "beneficiarioNombre": "",
      "beneficiarioApellidos": "",
      "beneficiarioNombreUsuario": "",
      "voluntarioId": null,
      "voluntarioNombre": "",
      "voluntarioApellidos": "",
      "voluntarioNombreUsuario": "",
      "rutaFoto": "",
      "fecha": null
    }
    
    //se inicializan los datos de año mes y día para el datepicker de la fecha de nacimiento del beneficiario para la edición
    this.fechaEditCalendar = {
      "year": null,
      "month": null,
      "day": null
    };


    //Se cargan los datos
    setTimeout(() => {

      //se cargan los datos de los productos
      if(this.arraysDatosService.productos.length < 1) this.arraysDatosService.fillProductos();

      //Se cargan los datos de las donaciones
      this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"servicio/final",this.generalService.apiToken).subscribe(data => {

        if(this.parametrosService.debugMode){
          console.log(data);
        }

        if(data.status == "success" ){

          //se resetean las donaciones y las donaciones filtradas
          this.arraysDatosService.donaciones = [];
          this.arraysDatosService.donacionesFiltradas = [];

          //se cargan los datos en el array de donaciones
          this.arraysDatosService.donaciones = this.buildData(data.data);

          //se cargan los datos en el array de donaciones filtradas (que son las que finalmente se muestran en la tabla)
          this.arraysDatosService.donacionesFiltradas = this.arraysDatosService.donaciones;

          this.iniciado = true;

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

  // ----------------------------------------------------------
  // Método para obtener el nombre del Producto
  // id: id del producto
  // ----------------------------------------------------------
  getProductoNombre(id:number):string{
    var producto:Producto[];
    producto = this.arraysDatosService.productos.filter((el) => {
       return el.id == id;
    });
    return producto[0].nombre;
  }



  /* **************************************** */
  /* MÉTODOS DE VISUALIZACIÓN Y FILTRADO
  /* **************************************** */

  // ----------------------------------------------------------
  // Método para filtrar
  // ----------------------------------------------------------

  filtrar():void{
    //sólo se filtra si alguno de los campos está relleno
    if(this.filtros.producto != null || this.filtros.cantidadDesde != null || this.filtros.cantidadHasta != null || this.filtros.proveedorNombre != "" || this.filtros.proveedorApellidos != "" || this.filtros.proveedorNombreUsuario != "" || this.filtros.beneficiarioNombre != "" || this.filtros.beneficiarioApellidos != "" || this.filtros.beneficiarioNombreUsuario != "" || this.filtros.voluntarioNombre != "" || this.filtros.voluntarioApellidos != "" || this.filtros.voluntarioNombreUsuario != "" || this.filtros.provinciaProveedor != "" || this.filtros.municipioProveedor != "" || this.filtros.provinciaBeneficiario != "" || this.filtros.municipioBeneficiario != "" || this.filtros.fechaDesde.day != null || this.filtros.fechaHasta != null ){
      //se construyen las fechas si se han pasado
      let fechaDesde = (this.filtros.fechaDesde.day != null ) ? new Date(this.filtros.fechaDesde.year,this.filtros.fechaDesde.month-1, this.filtros.fechaDesde.day) : null ;
      let fechaHasta = (this.filtros.fechaHasta.day != null) ? new Date(this.filtros.fechaHasta.year,this.filtros.fechaHasta.month-1, this.filtros.fechaHasta.day) : null;

      //se filtran los datos
      let resultado:Donacion[];
      resultado = this.arraysDatosService.donaciones.filter((donacion) => {

        var resultado = true;

        //se comprueba el producto
        if(donacion.producto !== parseFloat(this.filtros.producto) && this.filtros.producto != null &&  this.filtros.producto > 0){ resultado = false }
        //se comprueba la cantidad desde
        if(donacion.cantidad < parseFloat(this.filtros.cantidadDesde) && this.filtros.cantidadDesde != null &&  this.filtros.cantidadDesde != ""){ resultado = false }
        //se comprueba la cantidad hasta
        if(donacion.cantidad > parseFloat(this.filtros.cantidadHasta) && this.filtros.cantidadHasta != null &&  this.filtros.cantidadHasta != ""){ resultado = false }
        //se comprueba proveedorNombre
        if(!donacion.proveedorNombre.toLowerCase().includes(this.filtros.proveedorNombre.toLowerCase())){ resultado = false }
        //se comprueba proveedorApellidos
        if(!donacion.proveedorApellidos.toLowerCase().includes(this.filtros.proveedorApellidos.toLowerCase())){ resultado = false }
        //se comprueba proveedorNombreUsuario
        if(!donacion.proveedorNombreUsuario.toLowerCase().includes(this.filtros.proveedorNombreUsuario.toLowerCase())){ resultado = false }
        //se comprueba beneficiarioNombre
        if(!donacion.beneficiarioNombre.toLowerCase().includes(this.filtros.beneficiarioNombre.toLowerCase())){ resultado = false }
        //se comprueba beneficiarioApellidos
        if(!donacion.beneficiarioApellidos.toLowerCase().includes(this.filtros.beneficiarioApellidos.toLowerCase())){ resultado = false }
        //se comprueba beneficiarioNombreUsuario
        if(!donacion.beneficiarioNombreUsuario.toLowerCase().includes(this.filtros.beneficiarioNombreUsuario.toLowerCase())){ resultado = false }
        //se comprueba voluntarioNombre
        if(!donacion.voluntarioNombre.toLowerCase().includes(this.filtros.voluntarioNombre.toLowerCase())){ resultado = false }
        //se comprueba voluntarioApellidos
        if(!donacion.voluntarioApellidos.toLowerCase().includes(this.filtros.voluntarioApellidos.toLowerCase())){ resultado = false }
        //se comprueba voluntarioNombreUsuario
        if(!donacion.voluntarioNombreUsuario.toLowerCase().includes(this.filtros.voluntarioNombreUsuario.toLowerCase())){ resultado = false }
        //se comprueba la provincia
        if(donacion.provinciaProveedor !== parseFloat(this.filtros.provinciaProveedor) && this.filtros.provinciaProveedor != null &&  this.filtros.provinciaProveedor > 0){ resultado = false }
        //se comprueba el municipio
        if(donacion.municipioProveedor !== parseFloat(this.filtros.municipioProveedor) && this.filtros.municipioProveedor != null &&  this.filtros.municipioProveedor > 0){ resultado = false }
        //se comprueba la provincia
        if(donacion.provinciaBeneficiario !== parseFloat(this.filtros.provinciaBeneficiario) && this.filtros.provinciaBeneficiario != null &&  this.filtros.provinciaBeneficiario > 0){ resultado = false }
        //se comprueba el municipio
        if(donacion.municipioBeneficiario !== parseFloat(this.filtros.municipioBeneficiario) && this.filtros.municipioBeneficiario != null &&  this.filtros.municipioBeneficiario > 0){ resultado = false }
        //se comprueba fecha desde
        if(donacion.fecha < fechaDesde && fechaDesde != null){ resultado = false }
        //se comprueba fecha hasta
        if(donacion.fecha > fechaHasta && fechaHasta != null){ resultado = false }

        return resultado;

      });
  
      this.arraysDatosService.donacionesFiltradas = resultado;

    }
    else{
      this.arraysDatosService.donacionesFiltradas = this.arraysDatosService.donaciones;
    }

  }

  // ----------------------------------------------------------
  // Método para resetear todos los filtros
  // ----------------------------------------------------------
  resetFilters():void{
    this.filtros.producto = -1;
    this.filtros.cantidadDesde = null;
    this.filtros.cantidadHasta = null;
    this.filtros.proveedorNombre = "";
    this.filtros.proveedorApellidos = "";
    this.filtros.proveedorNombreUsuario = "";
    this.filtros.beneficiarioNombre = "";
    this.filtros.beneficiarioApellidos = "";
    this.filtros.beneficiarioNombreUsuario = "";
    this.filtros.voluntarioNombre = "";
    this.filtros.voluntarioApellidos = "";
    this.filtros.voluntarioNombreUsuario = "";
    this.filtros.provinciaProveedor = -1;
    this.filtros.municipioProveedor = -1;
    this.filtros.provinciaBeneficiario = -1;
    this.filtros.municipioBeneficiario = -1;
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
      case "producto":
        this.filtros.producto = -1;
        break;
      case "cantidadDesde":
        this.filtros.cantidadDesde = null;
        break;      
      case "cantidadHasta":
        this.filtros.cantidadHasta = null;
        break;
      case "proveedorNombre":
        this.filtros.proveedorNombre = "";
        break;
      case "proveedorApellidos":
        this.filtros.proveedorApellidos = "";
        break;
      case "proveedorNombreUsuario":
        this.filtros.proveedorNombreUsuario = "";
        break;
      case "beneficiarioNombre":
        this.filtros.beneficiarioNombre = "";
        break;
      case "beneficiarioApellidos":
        this.filtros.beneficiarioApellidos = "";
        break;
      case "beneficiarioNombreUsuario":
        this.filtros.beneficiarioNombreUsuario = "";
        break;
      case "voluntarioNombre":
        this.filtros.voluntarioNombre = "";
        break;
      case "voluntarioApellidos":
        this.filtros.voluntarioApellidos = "";
        break;
      case "voluntarioNombreUsuario":
        this.filtros.voluntarioNombreUsuario = "";
        break;
      case "provinciaProveedor":
        this.filtros.provinciaProveedor = -1;
        break;
      case "municipioProveedor":
        this.filtros.municipioProveedor = -1;
        break;
      case "provinciaBeneficiario":
        this.filtros.provinciaBeneficiario = -1;
        break;
      case "municipioBeneficiario":
        this.filtros.municipioBeneficiario = -1;
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
  // se le pasa si hay que esblecer el municpio del proveedor o del beneficiario y si estamos establececindo los municipios de filtros o de edición
  // ambito: 1 -> establecer municipio del proveedor, 2 -> establecer el municipio del beneficiario
  // tipo: 1 -> filtros, 2 -> edición, 3 -> edicion inicial
  // ----------------------------------------------------------
  setMuncipios(ambito:number,tipo:number):void{

    if(tipo == 1){

        if(ambito == 1){

          if(this.filtros.provinciaProveedor < 1){
            this.arraysDatosService.domMuncipios1Filtros = this.arraysDatosService.municipios;
          }
          else{
            var muncipiotemp:Municipio[] = [];
            muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
              return el.provinciaId == this.filtros.provinciaProveedor;
            });
            this.arraysDatosService.domMuncipios1Filtros = muncipiotemp;
          }
          this.filtros.municipioProveedor = -1;

        }
        else if(ambito == 2){

          if(this.filtros.provinciaBeneficiario < 1){
            this.arraysDatosService.domMuncipios2Filtros = this.arraysDatosService.municipios;
          }
          else{
            var muncipiotemp:Municipio[] = [];
            muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
              return el.provinciaId == this.filtros.provinciaBeneficiario;
            });
            this.arraysDatosService.domMuncipios2Filtros = muncipiotemp;
          }
          this.filtros.municipioBeneficiario = -1;

        }


    }
    else if(tipo == 2){

        if(ambito == 1){

          if(this.arraysDatosService.datosEditDonacion.provinciaProveedor < 1){
            this.arraysDatosService.donMuncipios1Edit = this.arraysDatosService.municipios;
          }
          else{
            //obtenemos los muncipios que correspondan a la provincia pasada
            var muncipiotemp:Municipio[] = [];
            muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
              return el.provinciaId == this.arraysDatosService.datosEditDonacion.provinciaProveedor;
            });
            this.arraysDatosService.donMuncipios1Edit = muncipiotemp;
          }
          this.arraysDatosService.datosEditDonacion.provinciaProveedor = -1;

        }
        else if(ambito == 2){

          if(this.arraysDatosService.datosEditDonacion.provinciaBeneficiario < 1){
            this.arraysDatosService.donMuncipios2Edit = this.arraysDatosService.municipios;
          }
          else{
            //obtenemos los muncipios que correspondan a la provincia pasada
            var muncipiotemp:Municipio[] = [];
            muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
              return el.provinciaId == this.arraysDatosService.datosEditDonacion.provinciaBeneficiario;
            });
            this.arraysDatosService.donMuncipios2Edit = muncipiotemp;
          }
          this.arraysDatosService.datosEditDonacion.provinciaBeneficiario = -1;

        }

    }
    else if(tipo == 3){


      if(ambito == 1){

        if(this.arraysDatosService.datosEditDonacion.provinciaProveedor < 1){
          this.arraysDatosService.donMuncipios1Edit = this.arraysDatosService.municipios;
        }
        else{
          var muncipiotemp:Municipio[] = [];
          muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
             return el.provinciaId == this.arraysDatosService.datosEditDonacion.provinciaProveedor;
          });
          this.arraysDatosService.donMuncipios1Edit = muncipiotemp;
        }

      }
      else if(ambito == 2){

          if(this.arraysDatosService.datosEditDonacion.provinciaBeneficiario < 1){
            this.arraysDatosService.donMuncipios2Edit = this.arraysDatosService.municipios;
          }
          else{
            var muncipiotemp:Municipio[] = [];
            muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
              return el.provinciaId == this.arraysDatosService.datosEditDonacion.provinciaBeneficiario;
            });
            this.arraysDatosService.donMuncipios2Edit = muncipiotemp;
          }

      }

    }

  }

  // ----------------------------------------------------------
  // Método para cambiar la propiedad que guarda si el acordeón de filtros está desplegado o no
  // ----------------------------------------------------------
  toggleFiltersCollapse():void{
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  // ----------------------------------------------------------
  // Método para mostrar el proveedor seleccionado
  // id: id del proveedor que se quiere visualizar
  // ----------------------------------------------------------
  muestraProveedor(id:number):void{
    this.arraysDatosService.proveedorDirectView = id;
    this.router.navigate(["/proveedores"]);
  }

  // ----------------------------------------------------------
  // Método para mostrar el voluntario seleccionado
  // id: id del voluntario que se quiere visualizar
  // ----------------------------------------------------------
  muestraVoluntario(id:number):void{
    this.arraysDatosService.voluntarioDirectView = id;
    this.router.navigate(["/voluntarios"]);
  }
  // ----------------------------------------------------------
  // Método para mostrar el beneficiario seleccionado
  // id: id del beneficiario que se quiere visualizar
  // ----------------------------------------------------------
  muestraBeneficiario(id:number):void{
    this.arraysDatosService.beneficiarioDirectView = id;
    this.router.navigate(["/beneficiarios"]);
  }
  
  // ----------------------------------------------------------
  // Método para mostrar la foto en el visor de fotos
  // ----------------------------------------------------------
  muestraFoto(id:number):void{
    var visorData:Donacion[];
    //Se obtiene el elemento seleccionado por el id
    visorData = this.arraysDatosService.donacionesFiltradas.filter((el) => {
       return el.id == id;
    });
    this.generalService.visorImagen = this.parametrosService.baseUrlApi+visorData[0].rutaFoto; //Se añade la ruta de la foto del elemento a la propiedad de la imagen del visor
    this.generalService.visorVisible = true; //Se muestra el visor
  }





  /* **************************************** */
  /* MÉTODOS DE VISUALIZACIÓN
  /* **************************************** */

  // ----------------------------------------------------------
  // Método para ir a visualización de una Donación
  // id: id de la donación
    // ----------------------------------------------------------
  visualizar(id:number):void{

    this.resetEditar(); //se vacián todos los campos de edición

    //Se busca la donación seleccionada basándonos en el id pasado
    //en el array editData se guarda el elemento del array de datos filtrados que tenga el mismo id que el id pasado
    var editData:Donacion[];
    editData = this.arraysDatosService.donacionesFiltradas.filter((el) => {
       return el.id == id;
    });
    //se hace un deep copy del array de la donación seleccionada dentro del array de edición
    this.arraysDatosService.datosEditDonacion = JSON.parse(JSON.stringify(editData[0]));

    //se introduce la fecha en el campo de fecha del beneficiario
    this.fechaEditCalendar.year = editData[0].fecha.getFullYear();
    this.fechaEditCalendar.month = editData[0].fecha.getMonth()+1;
    this.fechaEditCalendar.day = editData[0].fecha.getDate();

    this.setMuncipios(1,3);  //se establecen los muncipios correspondientes a la provincia del proveedor establecido
    this.setMuncipios(2,3);  //se establecen los muncipios correspondientes a la provincia del beneficiario establecido

    //se muestra la pantalla de visualización
    this.visualizacion = true;

    //se lleva el scroll hacia arriba
    $(".cuerpo").scrollTop(0);

  }


  // ----------------------------------------------------------
  // Método para volver a la tabla
  // ----------------------------------------------------------
  volver():void{
    this.formularioEnviado = false;
    this.visualizacion = false;

    //se lleva el scroll hacia arriba
    $(".cuerpo").scrollTop(0);

  }


  // ----------------------------------------------------------
  // Método para resetear todos los campos de edición
  // ----------------------------------------------------------

  resetEditar():void{

    this.arraysDatosService.datosEditDonacion = {
      "id": null,
      "producto": null,
      "cantidad": null,
      "provinciaProveedor": -1,
      "municipioProveedor": -1,
      "provinciaBeneficiario": -1,
      "municipioBeneficiario": -1,
      "proveedorId": null,
      "proveedorNombre": "",
      "proveedorApellidos": "",
      "proveedorNombreUsuario": "",
      "beneficiarioId": null,
      "beneficiarioNombre": "",
      "beneficiarioApellidos": "",
      "beneficiarioNombreUsuario": "",
      "voluntarioId": null,
      "voluntarioNombre": "",
      "voluntarioApellidos": "",
      "voluntarioNombreUsuario": "",
      "rutaFoto": "",
      "fecha": null
    };

    this.fechaEditCalendar = {
      year: null,
      month: null,
      day: null,
    }

  }


  // ----------------------------------------------------------
  // Método para construir correctamente los datos que vienen del api y que 
  // se insertarán en los arrays de donaciones y donaciones filtradas 
  // arraydata: El array con los datos que nos vienen de la api y con los que construimos los datos que se insertarán
  // ----------------------------------------------------------
  buildData(arraydata:any):Donacion[]{

    var donBuilt:Donacion[] = [];

    //se cargan los datos en el array de donaciones
    arraydata.forEach((item:any,index:number)=>{

      //se crea el objeto de donación temporal que se añadirá al array de donaciones
      var donTemp:Donacion = {
        "id": parseInt(item.servicioId),
        "producto": parseInt(item.producto),
        "cantidad": parseInt(item.cantidad),
        "provinciaProveedor": parseInt(item.proveedorProvincia),
        "municipioProveedor": parseInt(item.proveedorMunicipio),
        "provinciaBeneficiario": parseInt(item.beneficiarioProvincia),
        "municipioBeneficiario": parseInt(item.beneficiarioMunicipio),
        "proveedorId":  parseInt(item.proveedorId),
        "proveedorNombre": String(item.proveedorNombre),
        "proveedorApellidos": String(item.proveedorApellidos),
        "proveedorNombreUsuario": String(item.proveedorNombreUsuario),
        "beneficiarioId": parseInt(item.beneficiarioId),
        "beneficiarioNombre": String(item.beneficiarioNombre),
        "beneficiarioApellidos": String(item.beneficiarioApellidos),
        "beneficiarioNombreUsuario": String(item.beneficiarioNombreUsuario),
        "voluntarioId": parseInt(item.voluntarioId),
        "voluntarioNombre": String(item.voluntarioNombre),
        "voluntarioApellidos": String(item.voluntarioApellidos),
        "voluntarioNombreUsuario": String(item.voluntarioNombreUsuario),
        "rutaFoto": String(item.rutaFoto),
        "fecha": new Date(item.fecha)
      }

      //se añade la donación temporal al array de donaciones
      donBuilt.push(donTemp);

    });

    return donBuilt;

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