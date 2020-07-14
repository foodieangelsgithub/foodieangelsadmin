import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

//guards
import { ActivateLoginGuard } from './guards/activate-login.guard';
import { DeactivateLoginGuard } from './guards/deactivate-login.guard';
import { ActivateAppGuard } from './guards/activate-app.guard';

//páginas
import { LoginComponent } from './paginas/login/login.component';
import { AdministradoresComponent } from './paginas/administradores/administradores.component';
import { ProveedoresComponent } from './paginas/proveedores/proveedores.component';
import { VoluntariosComponent } from './paginas/voluntarios/voluntarios.component';
import { BeneficiariosComponent } from './paginas/beneficiarios/beneficiarios.component';
import { DonacionesComponent } from './paginas/donaciones/donaciones.component';

/*
const routes: Routes = [
  {path:'',component:LoginComponent,canDeactivate: [DeactivateLoginGuard],canActivate: [ActivateLoginGuard]},
  {path:'login',component:LoginComponent,canDeactivate: [DeactivateLoginGuard],canActivate: [ActivateLoginGuard] },
  {path:'administradores',component:AdministradoresComponent,canActivate: [ActivateAppGuard]},
  {path:'proveedores',component:ProveedoresComponent,canActivate: [ActivateAppGuard]},
  {path:'voluntarios',component:VoluntariosComponent,canActivate: [ActivateAppGuard]},
  {path:'beneficiarios',component:BeneficiariosComponent,canActivate: [ActivateAppGuard]},
  {path:'donaciones',component:DonacionesComponent,canActivate: [ActivateAppGuard]},
  
  {path:'**',redirectTo:'login',pathMatch:'full'}
];
*/

const routes: Routes = [
  { path:'',component:LoginComponent,canActivate: [ActivateLoginGuard] },
  { path:'login',component:LoginComponent,canActivate: [ActivateLoginGuard] },
  { path:'administradores',component:AdministradoresComponent,canActivate: [ActivateAppGuard] },
  { path:'proveedores',component:ProveedoresComponent,canActivate: [ActivateAppGuard] },
  { path:'voluntarios',component:VoluntariosComponent,canActivate: [ActivateAppGuard] },
  { path:'beneficiarios',component:BeneficiariosComponent,canActivate: [ActivateAppGuard] },
  {path:'donaciones',component:DonacionesComponent,canActivate: [ActivateAppGuard] },
  
  { path:'**',redirectTo:'login',pathMatch:'full' }
];


const opciones: ExtraOptions = {
  /*
  enableTracing?: boolean
  useHash?: boolean
  initialNavigation?: InitialNavigation
  errorHandler?: ErrorHandler
  preloadingStrategy?: any
  onSameUrlNavigation?: 'reload' | 'ignore'
  scrollPositionRestoration?: 'disabled' | 'enabled' | 'top'
  anchorScrolling?: 'disabled' | 'enabled'
  scrollOffset?: [number, number] | (() => [number, number])
  paramsInheritanceStrategy?: 'emptyOnly' | 'always'
  malformedUriErrorHandler?: (error: URIError, urlSerializer: UrlSerializer, url: string) => UrlTree
  urlUpdateStrategy?: 'deferred' | 'eager'
  relativeLinkResolution?: 'legacy' | 'corrected'
  */
}

@NgModule({
  imports: [RouterModule.forRoot(routes,opciones)],
  exports: [RouterModule]
})
export class AppRoutingModule { }