import { Component, OnInit } from '@angular/core';

import { GeneralService } from '../../servicios/general.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.less']
})
export class NotificacionComponent implements OnInit {

  constructor(
    public generalService: GeneralService
  ){}

  ngOnInit() {
  }

  cierraNotif():void{
    this.generalService.hideNotif();
  }

}
