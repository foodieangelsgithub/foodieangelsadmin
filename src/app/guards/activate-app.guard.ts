import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { Router } from '@angular/router';

import { GeneralService } from '../servicios/general.service';
import { DatosService } from '../servicios/datos.service';
import { ParametrosService } from '../servicios/parametros.service';
import { ArraysDatosService } from '../servicios/arrays-datos.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateAppGuard implements CanActivate {

  constructor(
    public parametrosService: ParametrosService,
    public arraysDatosService : ArraysDatosService,
    public datosService: DatosService,
    public generalService: GeneralService,
    public router: Router
  ){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //Si se está logueado se permite permanecer en la sección
    if(this.generalService.logueado){
      return true;
    }
    else{

      var apitoken = sessionStorage.getItem("foodieToken");

       //Si no se está logueado se comprueba en el servidor si se está logueado
      this.datosService.getHeaderCall(this.parametrosService.baseUrlApi+"login",apitoken).subscribe(data => {

        //Si se está logueado se hacen las operaciones necesarias
        if(data.status == "success" && data.data.rol[0] == "ROLE_ADMIN"){

          //se establece el usuario como logueado
          this.generalService.logueado = true;
          this.generalService.nombreUsuario = data.data.username;
          this.generalService.apiToken = data.data.apiToken;

          //se cargan los datos generales necsarios para la app, provincias, municipios,situaciones laborales,ingresos, procedencia de ingresos y relaciones
          if(this.arraysDatosService.provincias.length < 1) this.arraysDatosService.fillProvincias(); //Se cargan las provincias
          if(this.arraysDatosService.municipios.length < 1)this.arraysDatosService.fillMunicipios(); //Se cargan los municipios
          if(this.arraysDatosService.situacionesLaborales.length < 1) this.arraysDatosService.fillSitLaborales(); //Se cargan las situaciones laborales
          if(this.arraysDatosService.ingresos.length < 1) this.arraysDatosService.fillIngresos(); //Se cargan los ingresos
          if(this.arraysDatosService.procIngresos.length < 1) this.arraysDatosService.fillProcIngresos(); //Se cargan las procedencias de ingresos
          if(this.arraysDatosService.relaciones.length < 1) this.arraysDatosService.fillRelaciones(); //Se cargan las relaciones

          return true;

        }
        //Si no se está logueado se redirige al login
        else if(data.status == "error"){
          this.router.navigate(["/login"]);
          return false;
        }
      },
      error => {
        this.router.navigate(["/login"]);
        return false;
      });

      return true;


    }



  }
}