import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

//se importa ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';// esta calse se extiende en NgbDateCustomParserFormatter para  cambiar el formato del datepicker de ng bootstrap de yyyy-mm-dd a dd-mm-yyyy. Se llama más abajo en la zona de providers
import { NgbDateCustomParserFormatter} from './clases/dateformat';//clase creada para cambiar el formato del datepicker de ng bootstrap de yyyy-mm-dd a dd-mm-yyyy. extiende NgbDateParserFormatter. Se llama más abajo en la zona de providers

//se importa el angular 9 datatable
import { NgxDataTableModule } from "angular-9-datatable";

//se importa el ngx-slide-toggle
import { SlideToggleModule } from 'ngx-slide-toggle';

// import ngx-translate and the http loader
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

//se carga el idioma español
import { LOCALE_ID } from '@angular/core';
import '@angular/common/locales/global/es';

//servicios
import { ParametrosService } from './servicios/parametros.service';
import { DatosService } from './servicios/datos.service';
import { GeneralService } from './servicios/general.service';
import { ArraysDatosService } from './servicios/arrays-datos.service';

//guards
import { ActivateLoginGuard } from './guards/activate-login.guard';
import { DeactivateLoginGuard } from './guards/deactivate-login.guard';
import { ActivateAppGuard } from './guards/activate-app.guard';

//componentes
import { HeaderComponent } from './componentes/header/header.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { NotificacionComponent } from './componentes/notificacion/notificacion.component';
import { HorarioShowComponent } from './componentes/horario/horario-show/horario-show.component';
import { HorarioEditComponent } from './componentes/horario/horario-edit/horario-edit.component';

//modales
import { ModalComponent } from './modales/modal/modal.component';
import { ModalBorrarAdministradorComponent } from './modales/modal-borrar-administrador/modal-borrar-administrador.component';
import { ModalBorrarProveedorComponent } from './modales/modal-borrar-proveedor/modal-borrar-proveedor.component';
import { ModalBorrarVoluntarioComponent } from './modales/modal-borrar-voluntario/modal-borrar-voluntario.component';
import { ModalBorrarBeneficiarioComponent } from './modales/modal-borrar-beneficiario/modal-borrar-beneficiario.component';
import { ModalBorrarDonacionComponent } from './modales/modal-borrar-donacion/modal-borrar-donacion.component';
import { ModalEditarHorarioComponent } from './modales/modal-editar-horario/modal-editar-horario.component';

//páginas
import { LoginComponent } from './paginas/login/login.component';
import { AdministradoresComponent } from './paginas/administradores/administradores.component';
import { ProveedoresComponent } from './paginas/proveedores/proveedores.component';
import { VoluntariosComponent } from './paginas/voluntarios/voluntarios.component';
import { BeneficiariosComponent } from './paginas/beneficiarios/beneficiarios.component';
import { DonacionesComponent } from './paginas/donaciones/donaciones.component';
import { VisorComponent } from './componentes/visor/visor.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    SpinnerComponent,
    NotificacionComponent,
    HorarioShowComponent,
    HorarioEditComponent,
    ModalComponent,
    ModalBorrarAdministradorComponent,
    ModalBorrarProveedorComponent,
    ModalBorrarVoluntarioComponent,
    ModalBorrarBeneficiarioComponent,
    ModalBorrarDonacionComponent,
    ModalEditarHorarioComponent,
    LoginComponent,
    AdministradoresComponent,
    ProveedoresComponent,
    VoluntariosComponent,
    BeneficiariosComponent,
    DonacionesComponent,
    VisorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgxDataTableModule,
    SlideToggleModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [
    ParametrosService,
    DatosService,
    GeneralService,
    ArraysDatosService,
    ActivateLoginGuard,
    DeactivateLoginGuard,
    ActivateAppGuard,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}, //se usa la nueva clase NgbDateCustomParserFormatter para cambiar el formato del datepicker de ng bootstrap de yyyy-mm-dd a dd-mm-yyyy. extiende NgbDateParserFormatter.
    {provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}