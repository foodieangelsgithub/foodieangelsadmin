import { Component, OnInit } from '@angular/core';

import { GeneralService } from '../../servicios/general.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnInit {

  constructor(
    public generalService: GeneralService
  ){}

  ngOnInit() {
  }

}
