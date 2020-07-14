import { Component, OnInit, Input } from '@angular/core';

import { GeneralService } from '../../../servicios/general.service';
import { ArraysDatosService } from '../../../servicios/arrays-datos.service';

import { Horario } from '../../../interfaces/horario';
import { RangoHoras } from '../../../interfaces/rango-horas';

@Component({
  selector: 'app-horario-edit',
  templateUrl: './horario-edit.component.html',
  styleUrls: ['./horario-edit.component.less']
})
export class HorarioEditComponent implements OnInit {

  @Input() zona:string; //Propiedad que indica la zona en la que se muestra este compoentne. Sirve para saber que datos cargar en el componente

  constructor(
    public generalService: GeneralService,
    public arraysDatosService: ArraysDatosService
  ){}

  // ----------------------------------------------------------
  // Método que se ejecuta al iniciarse el componente y que carga los datos
  // ----------------------------------------------------------
  ngOnInit() {

    this.generalService.horarioEdit = [];

    //se inicializan los datos de cada día a vacío
    this.generalService.horarioEdit = [
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
    this.generalService.horarioEdit.forEach((datoHorario,index)=>{
      let diaPasado:Horario[];
      
      if(this.zona=="proveedores"){
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

  
  // ----------------------------------------------------------
  // Método para cambiar el estado de abierto a cerrado de un día
  // $event: el evento que viene del slider, vale true o false en función de si el slider está activado o no
  // index: número de índeice del elemento a cambiar
  // ----------------------------------------------------------
  onChange(event:any,index:number):void{
    this.generalService.horarioEdit[index].abierto = event;
    // se vacía el array de rango de horas cuando se cambia
    this.generalService.horarioEdit[index].rangoHoras = [];
  }

  // ----------------------------------------------------------
  // Método para añadir un nuevo horario
  // index: número de índeice del elemento al que se añade un horario
  // ----------------------------------------------------------
  addSchedule(index:number):void{
    let nuevoHorario:RangoHoras = {
      "abre": "",
      "cierra": ""
    }
    this.generalService.horarioEdit[index].rangoHoras.push(nuevoHorario);
  }

  // ----------------------------------------------------------
  // Método para eliminar un horario
  // index: número de índeice del elemento al que se elimina un horario
  // index2: número de índeice de horario que se quiere eliminar
  // ----------------------------------------------------------
  deleteSchedule(index:number,index2:number):void{
    this.generalService.horarioEdit[index].rangoHoras.splice(index2,1);
  }

  // ----------------------------------------------------------
  // Método para cambiar el valor de una caja de horario
  // event: evento del keyup de la caja
  // tipo: el tipod e caja. 'abre' -> caja de abre a las, 'cierra' -> caja de cierra a las
  // index: número de índeice del elemento al que se modifica una caja
  // index2: número de índeice de horario que se modifica una caja
  // ----------------------------------------------------------
  changeSchedule(event:any,tipo:string,index:number,index2:number):void{
    if(tipo == "abre"){
      this.generalService.horarioEdit[index].rangoHoras[index2].abre =  event.target.value;
    }
    if(tipo == "cierra"){
      this.generalService.horarioEdit[index].rangoHoras[index2].cierra = event.target.value;
    }
  }

}