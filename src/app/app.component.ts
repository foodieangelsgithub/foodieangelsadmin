import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ParametrosService } from './servicios/parametros.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'foodieAngels';

  constructor(
    public translate: TranslateService,
    public parametrosService: ParametrosService
  ){
    //se establece el idioma que se mostrará
    translate.setDefaultLang(this.parametrosService.defaultLang);
    translate.use(this.parametrosService.defaultLang);
  }

}
