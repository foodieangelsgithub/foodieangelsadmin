import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  //debug
  debugMode:boolean = false;
  defaultLang:string = "es"; //idioma por defecto (por ahora 'es' o 'en')

  //rutas
  //baseUrlApi:string = "/api/"; //base url del api, se hace redirección al servidor con un proxy desde src/proxy.conf.json
  baseUrlApi:string = "http://foodieangels-prewebs7.hps.es:9099/api/"; //base url del api

  rutaLocalImg:string = "assets/imagenes/"; //ruta donde se encuentran las imágenes locales de la aplicación

  constructor() { }
}