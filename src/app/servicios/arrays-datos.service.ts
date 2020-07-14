import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { GeneralService } from '../servicios/general.service';
import { ParametrosService } from '../servicios/parametros.service';
import { DatosService } from '../servicios/datos.service';

import { Administrador } from '../interfaces/administrador'
import { Proveedor } from '../interfaces/proveedor'
import { Voluntario } from '../interfaces/voluntario';
import { Beneficiario } from '../interfaces/beneficiario';
import { Donacion } from '../interfaces/donacion';
import { SituacionLaboral } from '../interfaces/situacion-laboral';
import { Ingreso } from '../interfaces/ingreso';
import { ProcedenciaIngreso } from '../interfaces/procedencia-ingreso';
import { Relacion } from '../interfaces/relacion';
import { Producto } from '../interfaces/producto';
import { Provincia } from '../interfaces/provincia';
import { Municipio } from '../interfaces/municipio';

@Injectable({
  providedIn: 'root'
})
export class ArraysDatosService {

  // En este servicio se guardan y comparten los arrays de datos de las diferentes secciones de la aplicación así como los datos que puedan necesitar las secciones
  // Al guardarse en este servicio, se puede acceder a ellos desde los modales para eliiminar un elemento por ejemplo, y desde otros servicios y componentes
  
  // Arrays de datos generales
  provincias:Provincia[] = []; //array de provincias
  municipios:Municipio[] = []; //array de municipios
  situacionesLaborales:SituacionLaboral[] = []; //array de situaciones laborales
  ingresos:Ingreso[]= []; //array de ingresos
  procIngresos:ProcedenciaIngreso[] = []; //array de procedencias de ingresos
  relaciones:Relacion[] = []; //array de relaciones
  productos:Producto[] = []; //array de productos
  subscripcionDatos:Subscription;// propiedad que guarda la subscripción al observable

  // Arrays de administradores
  administradores:Administrador[] = []; // Array que guarda la lista completa con todos los datos de los administradores
  administradoresFiltrados:Administrador[] = []; // Array que guarda la lista filtrada con los datos de administradores que es la que se muestra en la tabla
  datosEditAdministrador:Administrador; // Propiedad que guarda los datos de las cajas de edición del administrador

  // Arrays de proveedores
  proveedores:Proveedor[] = []; // Array que guarda la lista completa con todos los datos de los proveedores
  proveedoresFiltrados:Proveedor[] = []; // Array que guarda la lista filtrada con los datos de proveedores que es la que se muestra en la tabla
  datosEditProveedor:Proveedor; // Propiedad que guarda los datos de las cajas de edición del proveedor
  proveedorDirectView:number = null; // Propiedad que guarda el id del proveedor en caso de acceder directamente a la visualización de un proveedor
  provMuncipiosFiltros:Municipio[] = []; //El listado de municipios que aparecerá en la zona de filtros en proveedores
  provMuncipiosEdit:Municipio[] = []; //El listado de municipios que aparecerá en la zona de edición en proveedores

  // Arrays de voluntarios
  voluntarios:Voluntario[] = []; // Array que guarda la lista completa con todos los datos de los voluntarios
  voluntariosFiltrados:Voluntario[] = []; // Array que guarda la lista filtrada con los datos de voluntarios que es la que se muestra en la tabla
  datosEditVoluntario:Voluntario; // Propiedad que guarda los datos de las cajas de edición del voluntario
  voluntarioDirectView:number = null; // Propiedad que guarda el id del voluntario en caso de acceder directamente a la visualización de un proveedor

  // Arrays de beneficiarios
  beneficiarios:Beneficiario[] = []; // Array que guarda la lista completa con todos los datos de los beneficiarios
  beneficiariosFiltrados:Beneficiario[] = []; // Array que guarda la lista filtrada con los datos de beneficiarios que es la que se muestra en la tabla
  datosEditBeneficiario:Beneficiario; // Propiedad que guarda los datos de las cajas de edición del beneficiario
  beneficiarioDirectView:number = null; // Propiedad que guarda el id del beneficiario en caso de acceder directamente a la visualización de un proveedor
  benMuncipiosFiltros:Municipio[] = []; //El listado de municipios que aparecerá en la zona de filtros en beneficiarios
  benMuncipiosEdit:Municipio[] = []; //El listado de municipios que aparecerá en la zona de edición en beneficiarios

  // Arrays de donaciones
  donaciones:Donacion[] = []; // Array que guarda la lista completa con todos los datos de las donaciones
  donacionesFiltradas:Donacion[] = []; // Array que guarda la lista filtrada con los datos de donaciones que es la que se muestra en la tabla
  datosEditDonacion:Donacion; // Propiedad que guarda los datos de las cajas de edición de la donación
  domMuncipios1Filtros:Municipio[] = []; //El listado de municipios para el proveedor que aparecerá en la zona de filtros en Donaciones
  domMuncipios2Filtros:Municipio[] = []; //El listado de municipios para el beneficiario que aparecerá en la zona de filtros en donaciones
  donMuncipios1Edit:Municipio[] = []; //El listado de municipios para el proveedor que aparecerá en la zona de edición en donaciones
  donMuncipios2Edit:Municipio[] = []; //El listado de municipios para el beneficiario que aparecerá en la zona de edición en donaciones

  constructor(
    private generalService: GeneralService,
    private parametrosService: ParametrosService,
    private datosService: DatosService,
  ){}

  // ----------------------------------------------------------
  // Método para rellenar los datos de provincias
  // ----------------------------------------------------------
  fillProvincias():void{
    
    //obtenemos loa datos de las provincias haciendo la llamada a la api
    //---------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"provincia",this.generalService.apiToken).subscribe(data => {

      if(data.status == "success" ){
        data.data.forEach((item:any,index:number)=>{
          var provinciaTemp:Provincia = {
            "id": item.id,
            "nombre": item.nombre
          }
          this.provincias.push(provinciaTemp);
        });

        if(this.parametrosService.debugMode){
          console.log("----------------------------------------------------------");
          console.log("Provincias:");
          console.log(this.provincias);
          console.log("----------------------------------------------------------");
        }

      }
      else{
        console.log("Error obteniendo provincias");
      }

    },
    error => {
      console.log("Error conectando con el servidor para obtener las provincias");
    });
    
  }

  // ----------------------------------------------------------
  // Método para rellenar los datos de municipios
  // ----------------------------------------------------------
  fillMunicipios():void{

    //obtenemos loa datos de los municipios haciendo la llamada a la api
    //---------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"municipio",this.generalService.apiToken).subscribe(data => {
      if(data.status == "success" ){
        data.data.forEach((item:any,index:number)=>{
          var municipioTemp:Municipio = {
            "id": item.id,
            "provinciaId": item.provincia,
            "nombre": item.nombre,
          }
          this.municipios.push(municipioTemp);
        });

        if(this.parametrosService.debugMode){
          console.log("----------------------------------------------------------");
          console.log("Municipios: ");
          console.log(this.municipios);
          console.log("----------------------------------------------------------");
        }

      }
      else{
        console.log("Error obteniendo provincias");
      }
    },
    error => {
      console.log("Error conectando con el servidor para obtener las provincias");
    });

  }

  // ----------------------------------------------------------
  // Método para rellenar los datos de situacionesLaborales
  // ----------------------------------------------------------
  fillSitLaborales():void{

    //obtenemos loa datos de las situaciones laborales haciendo la llamada a la api
    //---------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"situacionlaboral",this.generalService.apiToken).subscribe(data => {
      if(data.status == "success" ){
        data.data.forEach((item:any,index:number)=>{
          var sitLaboralTemp:SituacionLaboral = {
            "id": item.id,
            "nombre": item.nombre,
          }
          this.situacionesLaborales.push(sitLaboralTemp);
        });

        if(this.parametrosService.debugMode){
          console.log("----------------------------------------------------------");
          console.log("Situaciones laborales: ");
          console.log(this.situacionesLaborales);
          console.log("----------------------------------------------------------");
        }

      }
      else{
        console.log("Error obteniendo situaciones laborales");
      }
    },
    error => {
      console.log("Error conectando con el servidor para obtener las situaciones laborales");
    });

  }

  // ----------------------------------------------------------
  // Método para rellenar los datos de ingresos
  // ----------------------------------------------------------
  fillIngresos():void{

    //obtenemos loa datos de ingresos haciendo la llamada a la api
    //---------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"ingresos",this.generalService.apiToken).subscribe(data => {
      if(data.status == "success" ){
        data.data.forEach((item:any,index:number)=>{
          var ingresoTemp:Ingreso = {
            "id": item.id,
            "nombre": item.nombre,
          }
          this.ingresos.push(ingresoTemp);
        });

        if(this.parametrosService.debugMode){
          console.log("----------------------------------------------------------");
          console.log("Tipos de ingresos: ");
          console.log(this.ingresos);
          console.log("----------------------------------------------------------");
        }

      }
      else{
        console.log("Error obteniendo tipos de ingresos");
      }
    },
    error => {
      console.log("Error conectando con el servidor para obtener los tipos de ingresos");
    });

  }

  // ----------------------------------------------------------
  // Método para rellenar los datos de procIngresos
  // ----------------------------------------------------------
  fillProcIngresos():void{

    //obtenemos loa datos de procedencia de ingresos haciendo la llamada a la api
    //----------------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"procIngresos",this.generalService.apiToken).subscribe(data => {
      if(data.status == "success" ){
        data.data.forEach((item:any,index:number)=>{
          var procIngresoTemp:ProcedenciaIngreso = {
            "id": item.id,
            "nombre": item.nombre,
          }
          this.procIngresos.push(procIngresoTemp);
        });

        if(this.parametrosService.debugMode){
          console.log("----------------------------------------------------------");
          console.log("Procedencia de ingresos: ");
          console.log(this.procIngresos);
          console.log("----------------------------------------------------------");
        }

      }
      else{
        console.log("Error obteniendo procedencia de ingresos");
      }
    },
    error => {
      console.log("Error conectando con el servidor para obtener las procedencias de ingresos");
    });

  }

  // ----------------------------------------------------------
  // Método para rellenar los datos de relaciones
  // ----------------------------------------------------------
  fillRelaciones():void{

    //obtenemos loa datos de relaciones haciendo la llamada a la api
    //----------------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"relacion",this.generalService.apiToken).subscribe(data => {
      if(data.status == "success" ){
        data.data.forEach((item:any,index:number)=>{
          var relacionTemp:Relacion = {
            "id": item.id,
            "nombre": item.nombre,
          }
          this.relaciones.push(relacionTemp);
        });

        if(this.parametrosService.debugMode){
          console.log("----------------------------------------------------------");
          console.log("Relación: ");
          console.log(this.relaciones);
          console.log("----------------------------------------------------------");
        }

      }
      else{
        console.log("Error obteniendo relaciones");
      }
    },
    error => {
      console.log("Error conectando con el servidor para obtener las relaciones");
    });

  }



  // ----------------------------------------------------------
  // Método para rellenar los datos de productos
  // ----------------------------------------------------------
  fillProductos():void{

    //obtenemos loa datos de productos haciendo la llamada a la api
    //----------------------------------------------------------------------------
    this.subscripcionDatos = this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"producto",this.generalService.apiToken).subscribe(data => {

      if(data.status == "success" ){
        data.data.forEach((item:any,index:number)=>{
          var productoTemp:Relacion = {
            "id": item.id,
            "nombre": item.nombre,
          }
          this.productos.push(productoTemp);
        });

        if(this.parametrosService.debugMode){
          console.log("----------------------------------------------------------");
          console.log("Producto: ");
          console.log(this.productos);
          console.log("----------------------------------------------------------");
        }

      }
      else{
        console.log("Error obteniendo producto");
      }
    },
    error => {
      console.log("Error conectando con el servidor para obtener los productos");
    });

  }


  // ----------------------------------------------------------
  // Método para obtener el nombre de la provincia. Se le pasa el id y devuelve el nombre
  // id: id de la provincia
  // ----------------------------------------------------------
  getProvinciaNombre(id:number):string{
    var provincia:Provincia[];
    provincia = this.provincias.filter((el) => {
       return el.id == id;
    });

    if(provincia.length > 0){
      return provincia[0].nombre;
    }
    else{
      return "";
    }

  }

  // ----------------------------------------------------------
  // Método para obtener el nombre del municipio. Se le pasa el id y devuelve el nombre
  // id: id del municipio
  // ----------------------------------------------------------
  getMunicipioNombre(id:number):string{
    var municipio:Municipio[];
    municipio = this.municipios.filter((el) => {
       return el.id == id;
    });

    if(municipio.length > 0){
      return municipio[0].nombre;
    }
    else{
      return "";
    }

  }

  // ----------------------------------------------------------
  // Método para obtener el nombre de la situación laboral.Se le pasa el id y devuelve el nombre
  // id: id de la situación laboral
  // ----------------------------------------------------------
  getSitLaboralNombre(id:number):string{
    var sitLaboral:SituacionLaboral[];
    sitLaboral = this.situacionesLaborales.filter((el) => {
       return el.id == id;
    });
    
    if(sitLaboral.length > 0){
      return sitLaboral[0].nombre;
    }
    else{
      return "";
    }

  }

  // ----------------------------------------------------------
  // Método para obtener el id de la situación laboral. Se le pasa el nombre y devuelve el id
  // nombre: nombre de la situación laboral
  // ----------------------------------------------------------
  getSitLaboralId(nombre:string):number{
    var sitLaboral:SituacionLaboral[];
    sitLaboral = this.situacionesLaborales.filter((el) => {
       return el.nombre == nombre;
    });

    if(sitLaboral.length < 1){
      return -1;
    }
    else{
      return sitLaboral[0].id;
    }   
  }

  // ----------------------------------------------------------
  // Método para obtener el nombre del tipo de ingreso.Se le pasa el id y devuelve el nombre
  // id: id del tipo de ingreso
  // ----------------------------------------------------------
  getIngresoNombre(id:number):string{
    var ingreso:Ingreso[];
    ingreso = this.ingresos.filter((el) => {
       return el.id == id;
    });
    
    if(ingreso.length > 0){
      return ingreso[0].nombre;
    }
    else{
      return "";
    }

  }

  // ----------------------------------------------------------
  // Método para obtener el nombre de la procedencia de ingreso.Se le pasa el id y devuelve el nombre
  // id: id del tipo de procedencia de  ingreso
  // ----------------------------------------------------------
  getProcIngresoNombre(id:number):string{
    var procIngreso:ProcedenciaIngreso[];
    procIngreso = this.procIngresos.filter((el) => {
       return el.id == id;
    });
    
    if(procIngreso.length > 0){
      return procIngreso[0].nombre;
    }
    else{
      return "";
    }

  }

  // ----------------------------------------------------------
  // Método para obtener el id de la relación de los integrantes con el beneficiario. Se le pasa el nombre y devuelve el id
  // nombre: nombre de la relación
  // ----------------------------------------------------------
  getRelacionlId(nombre:string):number{
    var relacion:Relacion[];
    relacion = this.relaciones.filter((el) => {
       return el.nombre == nombre;
    });
    if(relacion.length < 1){
      return -1;
    }
    else{
      return relacion[0].id;
    }    
  }

}