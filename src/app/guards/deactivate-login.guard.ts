import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from '../paginas/login/login.component';

import { GeneralService } from '../servicios/general.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()

export class DeactivateLoginGuard implements CanDeactivate<LoginComponent> {
  
  traduccion:string; //propiedad que guardda las traducciones que pueda haber

  constructor(
    public generalService: GeneralService,
    public translate: TranslateService
  ){}

  canDeactivate(component: LoginComponent,currentRoute: ActivatedRouteSnapshot,currentState: RouterStateSnapshot,nextState: RouterStateSnapshot):Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    
    //si el login nos da permiso para salir de él
    if(component.canDeactivate()){
      return true;
    }
    //si el login no nos da permiso para salir de él
    else{

      this.translate.get('errores.errorUserNotLogged').subscribe((res: string) => {
        this.traduccion = res;
      });
      this.generalService.showNotif(this.traduccion,"danger",3000);

      return false;
      
    }

  }
}
