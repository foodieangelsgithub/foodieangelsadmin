import { Component, OnInit, Input } from '@angular/core';

import { GeneralService } from '../../../servicios/general.service';
import { ArraysDatosService } from '../../../servicios/arrays-datos.service';

import { Horario } from '../../../interfaces/horario';

@Component({
  selector: 'app-horario-show',
  templateUrl: './horario-show.component.html',
  styleUrls: ['./horario-show.component.less']
})
export class HorarioShowComponent implements OnInit {

  @Input() zona:string; //Propiedad que indica la zona en la que se muestra este compoentne. Sirve para saber que datos cargar en el componente
  @Input() visualizacion:boolean; //Propiedad que indic si estamos en visualización

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService
  ){}

  ngOnInit(){

    this.generalService.horarioShow = [];

    //se inicializan los datos de cada día a vacío
    this.generalService.horarioShow = [
      {
        "dia": 1,
        "abierto": false,
        "rangoHoras": []
      },
      {
        "dia": 2,
        "abierto": false,
        "rangoHoras": []
      },
      {
        "dia": 3,
        "abierto": false,
        "rangoHoras": []
      },
      {
        "dia": 4,
        "abierto": false,
        "rangoHoras": []
      },
      {
        "dia": 5,
        "abierto": false,
        "rangoHoras": []
      },
      {
        "dia": 6,
        "abierto": false,
        "rangoHoras": []
      },
      {
        "dia": 7,
        "abierto": false,
        "rangoHoras": []
      }
    ]

    //Se recorre cada día y se comprueba si los datos pasados tienen conteniDo
    //Si el día tiene contenido se rellena, si no se deja vacío
    this.generalService.horarioShow.forEach((datoHorario,index)=>{
      let diaPasado:Horario[] = [];

      if(this.zona == "proveedores"){
        diaPasado = this.arraysDatosService.datosEditProveedor.horario.filter((el)=>{
          if(el.dia === datoHorario.dia) return true;
          else return false;
        });
      }
      
      if(diaPasado.length > 0 && diaPasado[0].abierto){
        datoHorario.abierto = true;
      }
      if(diaPasado.length > 0 && diaPasado[0].rangoHoras.length > 0 && diaPasado[0].abierto ){
        datoHorario.rangoHoras = JSON.parse(JSON.stringify(diaPasado[0].rangoHoras));
      }
    });


  }

}
