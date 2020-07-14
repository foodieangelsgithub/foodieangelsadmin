import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Proveedor } from '../interfaces/proveedor';
import { Horario } from '../interfaces/horario';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare var $:any;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  //---------------------
  // PROPIEDADES GENERALES
  //---------------------

  //---------------------
  // PROPIEDADES DE LOGIN
  //---------------------
  logueado:boolean = false; //propiedad que indica si el usuario está logueado
  nombreUsuario:string = ""; //propiedad que guarda el nombre del usuario logueado
  apiToken:string = ""; //propiedad que guarda el token del usuario logueado

  //-------------------------
  // PROPIEDADES PARA EL MENÚ
  //-------------------------
  menuVisible:boolean = false; //propiedad que determina si el menú lateral está visible o no
  menuSelected:string = ""; //propiedad que guarda la sección que se está mostrando. Sirve para resaltar la opción seleccionada en el menú

  //----------------------------
  // PROPIEDADES PARA LOS MODALES
  //----------------------------
  showingModals:boolean = false; //propiedad que determina si se están mostrando los modales, sirve para que cuando se muestre un modal se reinicialicen los componentes del modal
  modalLargeSize:boolean = false; //propiedad que indica si el modal es de tamaño grande
  modalSelected:string = "";//propiedad que indica el modal a mostar

  modalIdElemento:number = null; //propiedad para indicar a un modal el id de un elemento para eliminarlo de un array, crearlo o lo que haga falta
  modalParameters:any = {}; //propiedad para pasar parámetros a los modales

  //-----------------------------------------
  // PROPIEDADES PARA LA EDICIÓN DEL HORARIO
  //----------------------------------------
  horarioShowing:boolean = true; //propiedad que inidca si se muestra o no el componente de mostrar el horario. Sirve para reinicializar el componente
  horarioShow:Horario[] = []; //propiedad con los datos de horario que se pintan en el componente de mostrar el horario
  horarioEdit:Horario[] = []; //propiedad que guarda el array de edición de horario de un usuario

  //------------------------------------
  // PROPIEDADES PARA LAS NOTIFICACIONES
  //------------------------------------
  notifVisible:boolean = false; //propiedad que indica si la notificación está visible
  classContentNotif:string = ""; //contenido del class de la notificación
  tipoNotif:string = ""; //tipo de la notificación -> Success, warning, info o danger
  contNotif:string = ""; //contenido del texto de la notificación

  //--------------------------------------
  // PROPIEDADES PARA EL VISOR DE IMÁGENES
  //--------------------------------------
  visorVisible:boolean = false; //propiedad que indica si el visor está visible
  visorImagen:string = ""; //propiedad que guarda la imagen que se muestra en el visor
  visorAnchoImagen:number = 0; //propiedad que guarda el ancho de la imagen
  visorAltoImagen:number = 0; //propiedad que guarda el alto de la imagen


  constructor(
    public translate: TranslateService
  ){}
  
  // ------------------------------------------------------------------------
  // MÉTODO DE AYUDA QUE MUESTRA POR CONSOLA EL DATO QUE SE LE PASE
  // ------------------------------------------------------------------------
  log(dato:any):void{
    console.log(dato);
  }

  // ----------------------------------------------------------
  // MÉTODOS PARA MOSTRAR U OCULTAR EL MENÚ
  // ----------------------------------------------------------

  //muestra el menú
  showMenu():void{
    this.menuVisible = true;
  }

  //oculta el menú
  hideMenu():void{
    this.menuVisible = false;
  }

  // ----------------------------------------------------------
  // MÉTODO PARA MOSTRAR Y OCULTAR LAS PASSWORDS
  // se le pasa el id del elemento pulsado
  // jquery
  // ----------------------------------------------------------
  showHidePass(id:string):void{
    let elemento = $("#"+id); //se obtiene el elemento que contiene el el icono del ojo
    let icono = elemento.find("i"); //se obtiene el icono del ojo
    let inputPass = elemento.parent().prev("input");//se obtiene el input que está justo encima del span que contiene el input group addon con el icono del ojo

    //si el input tiene el type a password, lo cambia a text y cambia el icono del ojo
    //si el type está a text, se cambia a password y se cambia el icno del ojo
    if(inputPass.attr("type")=="password"){
      inputPass.attr("type","text");
      icono.removeClass("fa-eye-slash");
      icono.addClass("fa-eye");
    }
    else if(inputPass.attr("type")=="text"){
      inputPass.attr("type","password");
      icono.removeClass("fa-eye");
      icono.addClass("fa-eye-slash");
    }

  }

  // ----------------------------------------------------------
  // MÉTODO PARA GUARDAR UN STRING ALEATORIO CON EL NÚMERO DE CARACTERES QUE SE DESEE
  // para generar nombres de usuario y passwords
  // number: el número de caracteres
  // ----------------------------------------------------------
  generateRandomString(length:number = 8):string{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // -----------------------------------------
  // MÉTODOS PARA LA TABLA RESPONSIVE
  // para mostrar y ocultr cabeceras en la versión responsive
  // jquery
	// -----------------------------------------

  //en función del anchode la pantalla crea los títulos responsive o los oculta
  resetTableResponsive():void{
    if($(window).width()<=1199){
			this.fillTableResponsive();
		}
		else{
			this.clearTableResponsive();
		}
  }

  //Se crean los títulos responsive
	fillTableResponsive():void{

		this.clearTableResponsive();
		var numCols=1;
		var totalCols=$("table.tablaResponsiva thead th").length;
		
		$("table.tablaResponsiva thead th").each(function(){
			if(numCols<=totalCols){
				$("table.tablaResponsiva td:nth-of-type("+numCols+")").prepend("<span class='titfila'>"+$(this).text()+": </span>");
			}
			++numCols;
		})
		
	}
  
  //Se ocultan los títulos responsive
	clearTableResponsive():void{
		$("table.tablaResponsiva td .titfila").remove();
	}
  

  // ----------------------------------------------------------
  // MÉTODO QUE ABRE LOS MODALES
  // El tipo indica el modal a abrir
  // 'aviso': Aviso Legal, 'buscador': buscador
  // jQuery
  // ----------------------------------------------------------
  abreModal(tipo:string):void{
    this.modalSelected = ""; //se resetea el modal seleccionado
    this.showingModals = true; //se pone a true la visibilidad del modal
    setTimeout(()=>{
      
      this.modalSelected = tipo;
      $('#modalFoodieAngels').modal('show'); // se muestra el modal

      //en el evento de ocultar el modal
      $('#modalFoodieAngels').on('hidden.bs.modal',()=>{ 
        setTimeout(()=>{
          this.showingModals = false; // se pone a false la visibilidad del modal
          this.modalLargeSize = false; // se reinicializa a false el tamaño grande
          this.emptyModalParams(); //se vacían los parámetros para el modal
          this.resetHorario(); //se resetea la propiedad que guarda el array de edición de horario de un usuario, por si se había rellenado
          $('#modalFoodieAngels').unbind(); // se quita el evento de ocultar el modal para que no se repita
        },0);
      });

    },0);
  }

  // ----------------------------------------------------------
  // MÉTODO PARA VACIAR EL OBJETO DE PARÁMETROS DE LOS MODALES
  // ----------------------------------------------------------
  emptyModalParams():void{
    for (let prop in this.modalParameters) {
      delete this.modalParameters[prop];
    }
  }


  // ----------------------------------------------------------
  // MÉTODOS PARA LAS NOTIFICACIONES
  // contenido: indica el texto que mostrará la notificación
  // tipo: indica el tipo de notificación -> Success, warning, info o danger
  // tiempo: indica cuanto tiempo estará visible en milisegundos
  // ----------------------------------------------------------
  
  //muestra la notificación
  showNotif(contenido:string,tipo:string,tiempo:number):void{
    if(!this.notifVisible){
      var textoClass = "visible "+tipo;
      this.tipoNotif = tipo;
      this.contNotif = contenido;
      this.classContentNotif = textoClass;
      this.notifVisible = true;
      setTimeout(() => {
        this.hideNotif();
      }, tiempo);
    }
  }

  //Oculta la notificación
  hideNotif():void{
    var textoClass = this.tipoNotif;
    this.classContentNotif = textoClass;
    setTimeout(() => {
      this.contNotif = "";
      this.classContentNotif = "";
      this.tipoNotif = "";
      this.notifVisible = false;
    }, 1500);
  }

  // ----------------------------------------------------------
  // MÉTODOS PARA EL IDIOMA
  // ----------------------------------------------------------
  
  //Método para cambiar el idioma
  useLanguage(language:string):void {
    this.translate.use(language);
  }

  //Método para mostrar el idioma que se está usando
  getLanguage():void{
    alert(this.translate.currentLang);
  }

  // ----------------------------------------------------------
  // MÉTODO PARA CALCULAR LA EDAD PASÁNDOLE LA FECHA DE NACIMIENTO
  // birthday: fecha de nacimiento en formato de fecha
  // ----------------------------------------------------------
  calculaEdad(birthday:Date):number{
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }


  // ---------------------------------------------------------
  // MÉTODOS PARA EL HORARIO
  // ---------------------------------------------------------

  // ---------------------------------------------------------------------------
  // MÉTODO PARA VERIFICAR QUE UN HORARIO NO CONTIENE ELEMENTOS VACÍOS
  // SI EL HORARIO ESTÁ CORRECTO DEVUELVE TRUE, EN CASO CONTRARIO DEVUELVE FALSE
  // ---------------------------------------------------------------------------
  checkSchedule():boolean{

    var resultado:boolean = true;

    this.horarioEdit.forEach((dato,index) => {

      //si un día está marcado como abierto pero no contiene ningún horario se devuelve false
      if(dato.abierto && dato.rangoHoras.length < 1) resultado = false;

      //si alguno de los horarios contendos dentro del rango de horas está vacío se devuelve false
      dato.rangoHoras.forEach((dato2,index2) => {
        if(dato2.abre == "" || dato2.cierra == "") resultado = false;
      });

    });

    return resultado;

  }

  // ----------------------------------------------------------
  // MÉTODO PARA RESETEAR LA PROPIEDAD DE EDICIÓN DEL HORARIO
  // ----------------------------------------------------------
  resetHorario():void{
    this.horarioEdit = [];
  }



  // ----------------------------------------------------------------------------------------------
  // MÉTODO PARA REDIMENSIONAR UNA IMAGEN PARA EL VISOR DE FOTOS
  // Jquery
  // ----------------------------------------------------------------------------------------------
  tamFotoVisor(ruta:string):void{

    var resultadoAncho:number; // Ancho final de la imagen que devuelve el método
    var resultadoAlto:number; // Alto final de la imagen que devuelve el método

    var anchoHueco= Math.ceil($(window).width()-75); // Al ancho de la pantalla se le resta la separación que le queremos dar
    var altoHueco=Math.ceil($(window).height()-75); // Al alto de la pantalla se le resta la separación que le queremos dar
    var anchoFoto:number;
    var altoFoto:number;
    var imagen:any = new Image();// Imagen que se crea para calcular el tamaño original de la imagen que se quiere redimensionar
    imagen.src= ruta; // Se añade el src a nuestra imagen creada para calcular el tamaño original de la imagen

    imagen.onload = () => {

      anchoFoto = imagen.width;
      altoFoto = imagen.height;
      var altoFinal:number = Math.ceil((anchoHueco*altoFoto)/anchoFoto);
      var anchoFinal = Math.ceil((anchoFoto*altoHueco)/altoFoto);

      if(anchoFinal > anchoHueco){
        resultadoAncho = anchoHueco;
        resultadoAlto = altoFinal;
      }
      else{
        resultadoAncho = anchoFinal;
        resultadoAlto = altoHueco;
      }

      this.visorAnchoImagen = resultadoAncho;
      this.visorAltoImagen = resultadoAlto;

    }

  }


  // ----------------------------------------------------------------------------------------------
  // MÉTODO PARA ORDENAR UN ARRAY POR SU ID
  // ----------------------------------------------------------------------------------------------
  ordenaArray(elem):any[]{
    var resultado: [];
    resultado = elem.sort(function(a, b){
      return a.id-b.id;
    });
    return resultado;
  }

}