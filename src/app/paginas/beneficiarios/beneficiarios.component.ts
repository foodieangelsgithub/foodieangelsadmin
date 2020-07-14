import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { ParametrosService } from '../../servicios/parametros.service';
import { GeneralService } from '../../servicios/general.service';
import { ArraysDatosService } from '../../servicios/arrays-datos.service';
import { DatosService } from '../../servicios/datos.service';

import { Beneficiario } from '../../interfaces/beneficiario';
import { Integrante } from '../../interfaces/integrante';
import { Municipio } from 'src/app/interfaces/municipio';

declare var $:any;

@Component({
  selector: 'app-beneficiarios',
  host: {
    '(window:resize)': 'onResize($event)'
  },
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.less']
})
export class BeneficiariosComponent implements OnInit,OnDestroy {

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
  //----------------------
  filtros:any; //propiedad que guarda los datos de las cajas de filtros
  editando:boolean[] = []; //array que indica si estamos activando o desactivando en uelemento, se usa para mostrar y ocultar el spinner mientras el servidor responde
  fnacimEditCalendar:NgbDateStruct; //datos de año mes y día para el datepicker de la fecha de nacimiento del beneficiario para la edición
  integrantesValidos:any[] = []; //datos de la validación de los datos de los integrantes

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
    this.generalService.menuSelected = "beneficiarios";

    //se resetea el array de beneficiarios filtrados
    this.arraysDatosService.beneficiariosFiltrados = [];

    //se inicializan los datos de las cajas de filtros
    this.filtros = {
      "nombre": "",
      "apellidos": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "nombreUsuario": "",
      "telefono": "",
      "email": "",
      "sitLaboral": -1,
      "discapacidadDesde": null,
      "discapacidadHasta": null,
      "edadDesde": null,
      "edadHasta": null,
      "codPostal": "",
      "ingresos": -1,
      "procIngresos": -1,
      "numIntegrantesDesde": null,
      "numIntegrantesHasta": null,
      "fechaDesde":{
        "year": null,
        "month": null,
        "day": null
      },
      "fechaHasta":{
        "year": null,
        "month": null,
        "day": null
      },
      "active": -1,
      "lopd": -1,
    }

    //se inicializan los datos de las cajas de edición
    this.arraysDatosService.datosEditBeneficiario = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "telefono": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "email": "",
      "sitLaboral": -1,
      "discapacidad": null,
      "fnacim": null,
      "codPostal": "",
      "ingresos": null,
      "procIngresos": -1,
      "lopd": null,
      "numIntegrantes": 0,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1,
      "integrantes": []
    };

    //se inicializan los datos de año mes y día para el datepicker de la fecha de nacimiento del beneficiario para la edición
    this.fnacimEditCalendar = {
      "year": null,
      "month": null,
      "day": null
    };

    setTimeout(() => {

      //obtenemos loa datos de los beneficiarios haciendo la llamada a la api
      //---------------------------------------------------------------------
      this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"beneficiario",this.generalService.apiToken).subscribe(data => {

        if(this.parametrosService.debugMode){
          console.log(data);
        }

        if(data.status == "success" ){

          //se resetean los benefciarios y los beneficiarios filtrados
          this.arraysDatosService.beneficiarios = [];
          this.arraysDatosService.beneficiariosFiltrados = [];

          //se cargan los datos en el array de beneficiarios
          this.arraysDatosService.beneficiarios = this.buildData(data.data);

          //se cargan los datos en el array de beneficiarios filtrados (que son los que finalmente se muestran en la tabla)
          this.arraysDatosService.beneficiariosFiltrados = this.arraysDatosService.beneficiarios;

          //Si se ha pasado un id para mostrar directamente un beneficiario
          if(this.arraysDatosService.beneficiarioDirectView != null){
            this.volverDonaciones = true; //Se marca que se tiene que volver a la pantalla de donaciones al pulsar el botón volver
            this.editarVisualizar(this.arraysDatosService.beneficiarioDirectView,2); //Se muestra la pantalla de visualizar
            this.arraysDatosService.beneficiarioDirectView = null;//se resetea a null beneficiarioDirectView
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

    },1000);
    
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

        //obtenemos el índice del elemento modificado en el array de beneficiarios
        var indexBenModif = this.arraysDatosService.beneficiarios.findIndex((el)=>{
          return el.id == id;
        });

        //se modifica el dato en el array de beneficiarios
        if(this.arraysDatosService.beneficiarios[indexBenModif].active === 1){
          this.arraysDatosService.beneficiarios[indexBenModif].active = 0;
        }
        else{
          this.arraysDatosService.beneficiarios[indexBenModif].active = 1;
        }

        //obtenemos el índice del elemento modificado en el array de beneficiarios filtrados
        var indexBenFiltModif = this.arraysDatosService.beneficiariosFiltrados.findIndex((el)=>{
          return el.id == id;
        });

        //se modifica el dato en el array de beneficiarios filtrados
        this.arraysDatosService.beneficiariosFiltrados[indexBenFiltModif].active = this.arraysDatosService.beneficiarios[indexBenModif].active;

        //se oculta el spinner
        this.editando[id] = false;

        //se pinta el mensaje de éxito
        this.subscripcionTraducciones = this.translate.get('success.successModifyingBeneficiary').subscribe((res: string) => {
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
    if(this.filtros.nombre != "" || this.filtros.apellidos !="" || this.filtros.direccion !="" || this.filtros.provincia !="" || this.filtros.municipio !="" || this.filtros.nombreUsuario !="" || this.filtros.telefono != "" || this.filtros.email != "" || this.filtros.sitLaboral > 0 || this.filtros.discapacidadDesde != null || this.filtros.discapacidadHasta != null || this.filtros.edadDesde != null || this.filtros.edadHasta != null || this.filtros.codPostal != "" || this.filtros.ingresos > 0 || this.filtros.procIngresos > 0 || this.filtros.numIntegrantesDesde != null || this.filtros.numIntegrantesHasta != null || this.filtros.fechaDesde.day != null || this.filtros.fechaHasta.day != null || this.filtros.active != "-1" || this.filtros.lopd != "-1" ){

      //se construyen las fechas si se han pasado
      let fechaDesde = (this.filtros.fechaDesde.day != null ) ? new Date(this.filtros.fechaDesde.year,this.filtros.fechaDesde.month-1, this.filtros.fechaDesde.day) : null ;
      let fechaHasta = (this.filtros.fechaHasta.day != null) ? new Date(this.filtros.fechaHasta.year,this.filtros.fechaHasta.month-1, this.filtros.fechaHasta.day) : null;

      //se filtran los datos
      let resultado:Beneficiario[];
      resultado = this.arraysDatosService.beneficiarios.filter((beneficiario) => {

        var resultado = true;
        
        //se comprueba el nombre
        if(!beneficiario.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase())){ resultado = false }
        //se comprueba el apelido
        if(!beneficiario.apellidos.toLowerCase().includes(this.filtros.apellidos.toLowerCase())){ resultado = false }
        //se comprueba la dirección
        if(!beneficiario.direccion.toLowerCase().includes(this.filtros.direccion.toLowerCase())){ resultado = false }
        //se comprueba la provincia
        if(beneficiario.provincia !== parseFloat(this.filtros.provincia) && this.filtros.provincia != null &&  this.filtros.provincia > 0){ resultado = false }
        //se comprueba el municipio
        if(beneficiario.municipio !== parseFloat(this.filtros.municipio) && this.filtros.municipio != null &&  this.filtros.municipio > 0){ resultado = false }
        //se comprueba el nombre de usuario
        if(!beneficiario.nombreUsuario.toLowerCase().includes(this.filtros.nombreUsuario.toLowerCase())){ resultado = false }
        //se comprueba el teléfono
        if(!beneficiario.telefono.toLowerCase().includes(this.filtros.telefono.toLowerCase())){ resultado = false }
        //se comprueba el email
        if(!beneficiario.email.toLowerCase().includes(this.filtros.email.toLowerCase())){ resultado = false }
        //se comprueba la situación laboral
        if(beneficiario.sitLaboral !== parseFloat(this.filtros.sitLaboral) && this.filtros.sitLaboral != null &&  this.filtros.sitLaboral > 0){ resultado = false }
        //se comprueba la discapacidad desde
        if(beneficiario.discapacidad < parseFloat(this.filtros.discapacidadDesde) && this.filtros.discapacidadDesde != null &&  this.filtros.discapacidadDesde != ""){ resultado = false }
        //se comprueba la discapacidad hasta
        if(beneficiario.discapacidad > parseFloat(this.filtros.discapacidadHasta) && this.filtros.discapacidadHasta != null &&  this.filtros.discapacidadHasta != ""){ resultado = false }
        //se comprueba la edad desde
        if(this.generalService.calculaEdad(beneficiario.fnacim) < parseFloat(this.filtros.edadDesde) && this.filtros.edadDesde != null &&  this.filtros.edadDesde != ""){ resultado = false }
        //se comprueba la edad hasta
        if(this.generalService.calculaEdad(beneficiario.fnacim) > parseFloat(this.filtros.edadHasta) && this.filtros.edadHasta != null &&  this.filtros.edadHasta != ""){ resultado = false }
        //se comprueba el código postal
        if(!beneficiario.codPostal.toLowerCase().includes(this.filtros.codPostal.toLowerCase())){ resultado = false }
        //se comprueban los ingresos
        if(beneficiario.ingresos !== parseFloat(this.filtros.ingresos) && this.filtros.ingresos != null &&  this.filtros.ingresos > 0){ resultado = false }
        //se comprueba la procedencia de los ingresos
        if(beneficiario.procIngresos !== parseFloat(this.filtros.procIngresos) && this.filtros.procIngresos != null &&  this.filtros.procIngresos > 0){ resultado = false }
        //se comprueba el número de integrantes desde
        if(beneficiario.numIntegrantes < parseFloat(this.filtros.numIntegrantesDesde) && this.filtros.numIntegrantesDesde != null &&  this.filtros.numIntegrantesDesde != ""){ resultado = false }
        //se comprueba el número de integrantes hasta
        if(beneficiario.numIntegrantes > parseFloat(this.filtros.numIntegrantesHasta) && this.filtros.numIntegrantesHasta != null &&  this.filtros.numIntegrantesHasta != ""){ resultado = false }
        //se comprueba fecha desde
        if(beneficiario.fecha < fechaDesde && fechaDesde != null){ resultado = false }
        //se comprueba fecha hasta
        if(beneficiario.fecha > fechaHasta && fechaHasta != null){ resultado = false }
        //se comprueba lopd
        if(beneficiario.lopd.toString() != this.filtros.lopd.toString() && this.filtros.lopd.toString() != "-1" ){return false}
        //se comprueba active
        if(beneficiario.active != parseFloat(this.filtros.active) && parseFloat(this.filtros.active) != -1 ){ return false }
        
        return resultado;

      });
  
      this.arraysDatosService.beneficiariosFiltrados = resultado;

    }
    else{
      this.arraysDatosService.beneficiariosFiltrados = this.arraysDatosService.beneficiarios;
    }

    //$('.collapse').collapse("toggle");

  }

  // ----------------------------------------------------------
  // Método para resetear todos los filtros
  // ----------------------------------------------------------
  resetFilters():void{
    this.filtros.nombre = "";
    this.filtros.apellidos = "";
    this.filtros.direccion = "";
    this.filtros.provincia = -1;
    this.filtros.municipio = -1;
    this.arraysDatosService.benMuncipiosFiltros = this.arraysDatosService.municipios;
    this.filtros.nombreUsuario = "";
    this.filtros.telefono = "";
    this.filtros.email = "";
    this.filtros.sitLaboral = -1;
    this.filtros.discapacidadDesde = null;
    this.filtros.discapacidadHasta = null;
    this.filtros.edadDesde = null;
    this.filtros.edadHasta = null;
    this.filtros.codPostal = "";
    this.filtros.ingresos = -1;
    this.filtros.procIngresos = -1;
    this.filtros.numIntegrantesDesde = null;
    this.filtros.numIntegrantesHasta = null;
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
    this.filtros.active = "-1";
    this.filtros.lopd = "-1";
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
      case "direccion":
        this.filtros.direccion = "";
        break;
      case "provincia":
        this.filtros.provincia = -1;
        break;
      case "municipio":
        this.filtros.municipio = -1;
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
      case "discapacidadDesde":
        this.filtros.discapacidadDesde = null;
        break;
      case "discapacidadHasta":
        this.filtros.discapacidadHasta = null;
        break;
      case "edadDesde":
        this.filtros.edadDesde = null;
        break;
      case "edadHasta":
          this.filtros.edadHasta = null;
          break;
      case "codPostal":
        this.filtros.codPostal = "";
        break;
      case "numIntegrantesDesde":
        this.filtros.numIntegrantesDesde = null;
        break;
      case "numIntegrantesHasta":
        this.filtros.numIntegrantesHasta = null;
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
        this.arraysDatosService.benMuncipiosFiltros = this.arraysDatosService.municipios;
      }
      else{
        //obtenemos los muncipios que correspondan a la provincia pasada
        var muncipiotemp:Municipio[] = [];
        muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
           return el.provinciaId == this.filtros.provincia;
        });
        this.arraysDatosService.benMuncipiosFiltros = muncipiotemp;
      }
      this.filtros.municipio = -1;

    }
    else if(tipo == 2){

      if(this.arraysDatosService.datosEditBeneficiario.provincia < 1){
        this.arraysDatosService.benMuncipiosEdit = this.arraysDatosService.municipios;
      }
      else{
        //obtenemos los muncipios que correspondan a la provincia pasada
        var muncipiotemp:Municipio[] = [];
        muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
           return el.provinciaId == this.arraysDatosService.datosEditBeneficiario.provincia;
        });
        this.arraysDatosService.benMuncipiosEdit = muncipiotemp;
      }
      this.arraysDatosService.datosEditBeneficiario.municipio = -1;

    }
    else if(tipo == 3){

      if(this.arraysDatosService.datosEditBeneficiario.provincia < 1){
        this.arraysDatosService.benMuncipiosEdit = this.arraysDatosService.municipios;
      }
      else{
        //obtenemos los muncipios que correspondan a la provincia pasada
        var muncipiotemp:Municipio[] = [];
        muncipiotemp = this.arraysDatosService.municipios.filter((el) => {
           return el.provinciaId == this.arraysDatosService.datosEditBeneficiario.provincia;
        });
        this.arraysDatosService.benMuncipiosEdit = muncipiotemp;
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
  // Método para crear un nuevo beneficiario
  // ----------------------------------------------------------
  crear():void{
    this.resetEditar(); //se vacián todos los campos de edición
    this.formularioEnviado = false; //se establece el formulario a no enviado

    //se generan nombres de usuario y contraseña
    //this.arraysDatosService.datosEditBeneficiario.nombreUsuario = this.generalService.generateRandomString(12);
    //this.arraysDatosService.datosEditBeneficiario.contrasenia = this.generalService.generateRandomString(8);

    //se muestra la pantalla de edición
    this.edicion = true; 
    this.visualizacion = false;

    setTimeout(() => {
      // Se resetean los títulos de la tabla responsive
      this.generalService.resetTableResponsive();
    }, 0);

    //se lleva el scroll hacia arriba
    $(".cuerpo").scrollTop(0);

  }


  // ----------------------------------------------------------
  // Método para ir a edición o visualización de un beneficiario
  // id: id del beneficiario
  // modo: indica si se va a editar o a visualzar. 1: editar, 2:visualizar
  // ----------------------------------------------------------
  editarVisualizar(id:number,modo:number = 1):void{

    this.resetEditar(); //se vacián todos los campos de edición
    this.formularioEnviado = false; //se establece el formulario a no enviado

    //Se busca el beneficiario seleccionado para edición basándonos en el id pasado
    //en el array editData se guarda el elemento del array de datos filtrados que tenga el mismo id que el id pasado
    var editData:Beneficiario[];
    editData = this.arraysDatosService.beneficiariosFiltrados.filter((el) => {
       return el.id == id;
    });    
    //se hace un deep copy del array del usuario seleccionado dentro del array de edición
    this.arraysDatosService.datosEditBeneficiario = JSON.parse(JSON.stringify(editData[0]));

    this.setMuncipios(3);  //se establecen los muncipios correspondientes a la provincia establecida

    //se introduce la fecha en el campo de fecha del beneficiario
    this.fnacimEditCalendar.year = editData[0].fnacim.getFullYear();
    this.fnacimEditCalendar.month = editData[0].fnacim.getMonth()+1;
    this.fnacimEditCalendar.day = editData[0].fnacim.getDate();

    //se rellenan lsa fechas de integrantes y el array de validación de campos de los integrantes
    this.arraysDatosService.datosEditBeneficiario.integrantes.forEach((valor,index)=>{

      var nuevoIntegranteValido = {
        "nombre": true,
        "apellidos": true,
        "telefono": true,
        "sitLaboral": true,
        "discapacidad": true,
        "relacion": true,
        "fnacimDia": true,
        "fnacimMes": true,
        "fnacimAnio": true
      }
      this.integrantesValidos.push(nuevoIntegranteValido);
    });

    //se muestra la pantalla de edición o visualización
    if(modo === 1){
      this.edicion = true;
      this.visualizacion = false;      
    }
    else if(modo === 2){
      this.edicion = false;
      this.visualizacion = true;
    }

    setTimeout(() => {
      // Se resetean los títulos de la tabla responsive
      this.generalService.resetTableResponsive();
    }, 0);

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
  
      setTimeout(() => {
        // Se resetean los títulos de la tabla responsive
        this.generalService.resetTableResponsive();
      }, 0);
  
      //se lleva el scroll hacia arriba
      $(".cuerpo").scrollTop(0);
    }
  }


  // --------------------------------------------------------------------------------------------------------------------
  // Método para establecer los conteidos de los integrantes dentro del array de integrantes dentro de los datos de edición
  // --------------------------------------------------------------------------------------------------------------------
  onKey(event,index:number,campo:string){
    
    switch(campo){
      case "nombre":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].nombre = event.target.value;
        if(event.target.value != "") this.integrantesValidos[index].nombre = true;
        else this.integrantesValidos[index].nombre = false;
        break;
      case "apellidos":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].apellidos = event.target.value;
        if(event.target.value != "") this.integrantesValidos[index].apellidos = true;
        else this.integrantesValidos[index].apellidos = false;
        break;
      case "telefono":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].telefono = event.target.value;
        if(event.target.value != "") this.integrantesValidos[index].telefono = true;
        else this.integrantesValidos[index].telefono = false;
        break;
      case "sitLaboral":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].sitLaboral = this.arraysDatosService.getSitLaboralId(event.target.value);
        if(this.arraysDatosService.datosEditBeneficiario.integrantes[index].sitLaboral > 0) this.integrantesValidos[index].sitLaboral = true;
        else this.integrantesValidos[index].sitLaboral = false;
        break;
      case "discapacidad":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].discapacidad = event.target.value;
        if(event.target.value != "") this.integrantesValidos[index].discapacidad = true;
        else this.integrantesValidos[index].discapacidad = false;
        break;
      case "relacion":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].relacion = this.arraysDatosService.getRelacionlId(event.target.value);
        if(this.arraysDatosService.datosEditBeneficiario.integrantes[index].relacion > 0) this.integrantesValidos[index].relacion = true;
        else this.integrantesValidos[index].relacion = false;
        break;
      case "fnacimDia":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].fnacimDia = event.target.value;
        if(this.arraysDatosService.datosEditBeneficiario.integrantes[index].fnacimDia > 0) this.integrantesValidos[index].fnacimDia = true;
        else this.integrantesValidos[index].fnacimDia = false;
        break;
      case "fnacimMes":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].fnacimMes = event.target.value;
        if(this.arraysDatosService.datosEditBeneficiario.integrantes[index].fnacimMes > 0) this.integrantesValidos[index].fnacimMes = true;
        else this.integrantesValidos[index].fnacimMes = false;
        break;
      case "fnacimAnio":
        this.arraysDatosService.datosEditBeneficiario.integrantes[index].fnacimAnio = event.target.value;
        if(this.arraysDatosService.datosEditBeneficiario.integrantes[index].fnacimAnio > 0) this.integrantesValidos[index].fnacimAnio = true;
        else this.integrantesValidos[index].fnacimAnio = false;
        break;
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
  // Método para guardar los cambios de un beneficiario
  // ----------------------------------------------------------
  guardar(datosForm:any):void{

    this.formularioEnviado = true;

    let datosEnviar:Beneficiario = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "telefono": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "email": "",
      "sitLaboral": -1,
      "discapacidad": null,
      "fnacim": null,
      "codPostal": "",
      "ingresos": null,
      "procIngresos": -1,
      "lopd": null,
      "numIntegrantes": 0,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1,
      "integrantes": []
    };

    var valores:any = datosForm.value;

    // Si el formulario es inválido
    if(datosForm.form.invalid || !this.validIntegrantes()){

      this.validIntegrantes();//se marcan los campos inválidos de los integrantes

      this.subscripcionTraducciones = this.translate.get('errores.errorComplete').subscribe((res: string) => {
        this.traduccion = res;
      });
      this.generalService.showNotif(this.traduccion,"danger",5000);

    }
    // si el formulario es válido
    else{
      //se pasa la fecha de nacimiento del beneficiario al array de datos editados
      this.arraysDatosService.datosEditBeneficiario.fnacim = new Date(valores.fnacimEditCalendar.year,valores.fnacimEditCalendar.month-1,valores.fnacimEditCalendar.day+1);
      
      //si el número de integrantes viene a null, se pone a 0
      if(this.arraysDatosService.datosEditBeneficiario.numIntegrantes == null) this.arraysDatosService.datosEditBeneficiario.numIntegrantes = 0;

      //Se preparan los datos a enviar
      datosEnviar = {
        "id": this.arraysDatosService.datosEditBeneficiario.id,
        "nombre": this.arraysDatosService.datosEditBeneficiario.nombre,
        "apellidos": this.arraysDatosService.datosEditBeneficiario.apellidos,
        "telefono": this.arraysDatosService.datosEditBeneficiario.telefono,
        "direccion": this.arraysDatosService.datosEditBeneficiario.direccion,
        "provincia": this.arraysDatosService.datosEditBeneficiario.provincia,
        "municipio": this.arraysDatosService.datosEditBeneficiario.municipio,
        "email": this.arraysDatosService.datosEditBeneficiario.email,
        "sitLaboral": this.arraysDatosService.datosEditBeneficiario.sitLaboral,
        "discapacidad": this.arraysDatosService.datosEditBeneficiario.discapacidad,
        "fnacim": this.arraysDatosService.datosEditBeneficiario.fnacim,
        "codPostal": this.arraysDatosService.datosEditBeneficiario.codPostal,
        "ingresos": this.arraysDatosService.datosEditBeneficiario.ingresos,
        "procIngresos": this.arraysDatosService.datosEditBeneficiario.procIngresos,
        "lopd": this.arraysDatosService.datosEditBeneficiario.lopd,
        "numIntegrantes": this.arraysDatosService.datosEditBeneficiario.numIntegrantes,
        "nombreUsuario": this.arraysDatosService.datosEditBeneficiario.nombreUsuario,
        "contrasenia": (this.arraysDatosService.datosEditBeneficiario.contrasenia == "__original-password__") ? null : String(this.arraysDatosService.datosEditBeneficiario.contrasenia),
        "fecha": this.arraysDatosService.datosEditBeneficiario.fecha,
        "active": this.arraysDatosService.datosEditBeneficiario.active,
        "integrantes": this.arraysDatosService.datosEditBeneficiario.integrantes
      }

      //console.log(datosEnviar);

      this.subscripcionDatos = this.datosService.sendPost(this.parametrosService.baseUrlApi+'beneficiario',datosEnviar,this.generalService.apiToken).subscribe(data => {
        
        if(this.parametrosService.debugMode){
          console.log(data);
        }

        if(data.status == "success"){

          //formateamos correctamente los datos del elemento creado o modificado que nos devuelve el api
          var dataFromApi:Beneficiario[] = this.buildData([data.data]);

          //si estamos creando un nuevo beneficiaro
          //Se añade el nuevo registro al array de beneficiarios y de beneficiarios filtrados y se obtiene la traducción de éxito al crear
          if(this.arraysDatosService.datosEditBeneficiario.id == null){
            this.arraysDatosService.beneficiarios.push(dataFromApi[0]);
            this.arraysDatosService.beneficiariosFiltrados = [];
            this.arraysDatosService.beneficiariosFiltrados = this.arraysDatosService.beneficiarios;
            //se obtiene el mensaje de éxito
            this.subscripcionTraducciones = this.translate.get('success.successCreatingBeneficiary').subscribe((res: string) => {
              this.traduccion = res;
            });
          }

          //si estamos editando un beneficiaro existente
          //Se modifica el registro en el array de beneficiarios y de beneficiarios filtrados y se obtiene la traducción de éxito al modificar
          else{

            //obtenemos el índice del elemento modificado en el array de beneficiarios
            var indexBenModif = this.arraysDatosService.beneficiarios.findIndex((el)=>{
              return el.id == this.arraysDatosService.datosEditBeneficiario.id;
            });

            //se modifica el dato en el array de beneficiarios
            this.arraysDatosService.beneficiarios[indexBenModif] = dataFromApi[0];

            //obtenemos el índice del elemento modificado en el array de beneficiarios filtrados
            var indexBenFiltModif = this.arraysDatosService.beneficiariosFiltrados.findIndex((el)=>{
              return el.id == this.arraysDatosService.datosEditBeneficiario.id;
            });

            //se modifica el dato en el array de beneficiarios filtrados
            this.arraysDatosService.beneficiariosFiltrados[indexBenFiltModif] = this.arraysDatosService.beneficiarios[indexBenModif];

            //se obtiene el mensaje de éxito
            this.subscripcionTraducciones = this.translate.get('success.successModifyingBeneficiary').subscribe((res: string) => {
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
  // Método para añadir un nuevo integrante de la familia del beneficiario
  // ----------------------------------------------------------
  agregarIntegrante():void{
    var nuevoIntegrante:Integrante ={
      "id": null,
      "nombre": "",
      "apellidos": "",
      "telefono": "",
      "sitLaboral": -1,
      "discapacidad": null,
      "relacion": -1,
      "fnacimDia": null,
      "fnacimMes": null,
      "fnacimAnio": null
    }
    this.arraysDatosService.datosEditBeneficiario.integrantes.push(nuevoIntegrante);

    var nuevoIntegranteValido = {
      "nombre": true,
      "apellidos": true,
      "telefono": true,
      "sitLaboral": true,
      "discapacidad": true,
      "relacion": true,
      "fnacimDia": true,
      "fnacimMes": true,
      "fnacimAnio": true
    }
    this.integrantesValidos.push(nuevoIntegranteValido);

    setTimeout(() => {
      // Se resetean los títulos de la tabla responsive
      this.generalService.resetTableResponsive();
    }, 0);


    //se asigna al número de integrantes el número de integrantes después de añadir el integrante
    this.arraysDatosService.datosEditBeneficiario.numIntegrantes = this.arraysDatosService.datosEditBeneficiario.integrantes.length;
    
  }

  // ----------------------------------------------------------
  // Método para borrar un integrante de la lista de integrantes.
  // index: índeice dentro del array de integrantes del integrante seleccionado
  // ----------------------------------------------------------
  eliminarIntegrante(index:number):void{

    this.arraysDatosService.datosEditBeneficiario.integrantes.splice(index,1);
    this.integrantesValidos.splice(index,1);

    setTimeout(() => {
      // Se resetean los títulos de la tabla responsive
      this.generalService.resetTableResponsive();
    }, 0);

    //se asigna al número de integrantes el número de integrantes después de eliminar el integrante
    this.arraysDatosService.datosEditBeneficiario.numIntegrantes = this.arraysDatosService.datosEditBeneficiario.integrantes.length;

  }


  // ----------------------------------------------------------
  // Método para comprobar si algún campo de algún integrante está vacío
  // devuelve true si todos los campos están rellenos, o no hay integrantes y false si alguno está vacío
  // ----------------------------------------------------------
  validIntegrantes():boolean{
    var resultado:boolean = true;

    if(this.arraysDatosService.datosEditBeneficiario.integrantes.length > 0){
      this.arraysDatosService.datosEditBeneficiario.integrantes.forEach((valor,index)=>{

        //verifica el nombre
        if (valor.nombre == "" || valor.nombre == null || valor.nombre == undefined){
          this.integrantesValidos[index].nombre = false;
          resultado = false;
        }

        //verifica los apellidos
        if (valor.apellidos == "" || valor.apellidos == null || valor.apellidos == undefined){
          this.integrantesValidos[index].apellidos = false;
          resultado = false;
        }

        //verifica el teléfono
        if (valor.telefono == "" || valor.telefono == null || valor.telefono == undefined){
          this.integrantesValidos[index].telefono = false;
          resultado = false;
        }

        //verifica la situación laboral
        if (valor.sitLaboral == null || valor.sitLaboral == undefined || valor.sitLaboral < 0){
          this.integrantesValidos[index].sitLaboral = false;
          resultado = false;
        }

        //verifica la discapacidad
        if (valor.discapacidad == null || valor.discapacidad == undefined || isNaN(valor.discapacidad) ){
          this.integrantesValidos[index].discapacidad = false;
          resultado = false;
        }

        //verifica la relación
        if (valor.relacion < 0 || valor.relacion == null || valor.relacion == undefined){
          this.integrantesValidos[index].relacion = false;
          resultado = false;
        }

        //verifica el día de nacimiento
        if (valor.fnacimDia == null || valor.fnacimDia == undefined || valor.fnacimDia <= 0 || valor.fnacimDia > 31){
          this.integrantesValidos[index].fnacimDia = false;
          resultado = false;
        }

        //verifica el mes de nacimiento
        if (valor.fnacimMes == null || valor.fnacimMes == undefined || valor.fnacimMes <= 0 || valor.fnacimMes > 12){
          this.integrantesValidos[index].fnacimMes = false;
          resultado = false;
        }

        //verifica el año de nacimiento
        if (valor.fnacimAnio == null || valor.fnacimAnio == undefined || valor.fnacimAnio <= 0){
          this.integrantesValidos[index].fnacimAnio = false;
          resultado = false;
        }

      });
    }

    return resultado;
  }

  // ----------------------------------------------------------
  // Método para resetear todos los campos de edición
  // ----------------------------------------------------------
  resetEditar():void{

    this.arraysDatosService.datosEditBeneficiario = {
      "id": null,
      "nombre": "",
      "apellidos": "",
      "direccion": "",
      "provincia": -1,
      "municipio": -1,
      "telefono": "",
      "email": "",
      "sitLaboral": -1,
      "discapacidad": null,
      "fnacim": null,
      "codPostal": "",
      "ingresos": -1,
      "procIngresos": -1,
      "lopd": null,
      "numIntegrantes": 0,
      "nombreUsuario": "",
      "contrasenia": "",
      "fecha": null,
      "active": 1,
      "integrantes": []
    };

    this.fnacimEditCalendar = {
      year: null,
      month: null,
      day: null,
    }

    this.integrantesValidos = [];
    
    this.arraysDatosService.benMuncipiosEdit = this.arraysDatosService.municipios;

  }

  // ----------------------------------------------------------
  // Método para construir correctamente los datos que vienen del api y que 
  // se insertarán en los arrays de beneficiarios y beneficiarios filtrados 
  // arraydata: El array con los datos que nos vienen de la api y con los que construimos los datos que se insertarán
  // ----------------------------------------------------------
  buildData(arraydata:any):Beneficiario[]{

    var benefBuit:Beneficiario[] = [];

    //se cargan los datos en el array de beneficiarios
    arraydata.forEach((item:any,index:number)=>{

      //se crea el objeto de beneficiario temporal que se añadirá al array de beneficiarios
      var benefTemp:Beneficiario = {
        "id": parseInt(item.id),
        "nombre": String(item.nombre),
        "apellidos": String(item.apellidos),
        "direccion": String(item.direccion),
        "provincia": parseInt(item.provincia),
        "municipio": parseInt(item.municipio),
        "telefono": String(item.telefono),
        "email": (item.email == "" || item.email == null || item.email == undefined) ? "" : String(item.email),
        "sitLaboral": parseInt(item.sitLaboral),
        "discapacidad": parseInt(item.discapacidad),
        "fnacim": new Date(item.fnacim),
        "codPostal": String(item.codPostal),
        "ingresos": parseInt(item.ingresos),
        "procIngresos": parseInt(item.procIngresos),
        "lopd": (item.lopd == "1") ? true : false,
        "numIntegrantes": parseInt(item.numIntegrantes),
        "nombreUsuario": String(item.nombreUsuario),
        "contrasenia": (item.contrasenia == "" || item.contrasenia == null || item.contrasenia == undefined) ? "__original-password__" : String(item.contrasenia),
        "active": (item.active == "1") ? 1 : 0,
        "fecha": new Date(item.fecha),
        "integrantes": []
      }

      //se añaden los integrantes temporales que se incluyen en el beneficiario temporal que se añadirá al array de beneficiarios
      item.integrantes.forEach((item2:any,index2:number)=>{

        var dateInt = new Date(item2.fnacim);

        var integranteTemp:any = {
          "id": parseInt(item2.id),
          "nombre": String(item2.nombre),
          "apellidos": String(item2.apellidos),
          "telefono": String(item2.telefono),
          "sitLaboral": parseInt(item2.sitLaboral),
          "discapacidad": parseInt(item2.discapacidad),
          "relacion": parseInt(item2.relacion),
          "fnacimDia": dateInt.getDate(),
          "fnacimMes": dateInt.getMonth()+1,
          "fnacimAnio": dateInt.getFullYear()
        }            
        benefTemp.integrantes.push(integranteTemp);
      });

      //se añade el beneficario temporal al array de beneficiarios
      benefBuit.push(benefTemp);

    });

    return benefBuit;

  }


  // ----------------------------------------------------------
  // Método que se ejecuta en el resize
  // ----------------------------------------------------------
  onResize($event){

    // Se resetean los títulos de la tabla responsive
    this.generalService.resetTableResponsive();

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