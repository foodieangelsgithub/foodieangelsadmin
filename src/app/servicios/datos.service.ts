import { Injectable } from '@angular/core';

import { Observable,of,throwError } from 'rxjs';
import { map,catchError,retry,tap } from 'rxjs/operators';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { ParametrosService } from './parametros.service';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  transError:string = ""; //propiedad que guarda la traducción del error

  constructor(
    public http: HttpClient,
    public parametrosService: ParametrosService,
    public translate: TranslateService,
  ){}


  /* --------------------- */
  /*          GET          */
  /* --------------------- */

  getCall(url:string): Observable<any>{
    return this.http.get(url)
    .pipe(
      tap( ()=> {
        if(this.parametrosService.debugMode){
          console.log("enviado");
        }
      }),
      catchError(error => {
        /*
        //se carga la traducción del error
        this.translate.get('notifications.errorServer').subscribe((res: string) => {
          this.transError=res;
        });
        //return throwError(error.json().error || "server error");
        return throwError(this.transError);
        */
       return throwError(error.error.message || "server error");
      })
    );
  }

  /*
  getConfig(url:string) {
    return this.http.get<Config>(url)
    .pipe(
      tap(()=>{
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error:HttpErrorResponse){
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
  */


  /* ---------------------------------- */
  /*          GET CON CABECERA          */
  /* ---------------------------------- */

  getHeaderCall(url:string,apitoken:string): Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'x-auth-token':  apitoken
      })
    };

    return this.http.get(url,httpOptions)
    .pipe(
      tap( ()=> {
        if(this.parametrosService.debugMode){
          console.log("enviado");
        }
      }),
      catchError(error => {
        /*
        //se carga la traducción del error
        this.translate.get('notifications.errorServer').subscribe((res: string) => {
          this.transError=res;
        });
        //return throwError(error.json().error || "server error");
        return throwError(this.transError);
        */
       return throwError(error.error.message || "server error");
      })
    );
  

  }

  

  /* --------------------- */
  /*          POST         */
  /* --------------------- */

  sendPost(url:string,datos,apitoken:string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
        'x-auth-token':  apitoken
      })
    };

    return this.http
      .post(url,datos,httpOptions)
      .pipe(
        tap( ()=> {
          if(this.parametrosService.debugMode){
            console.log("enviado");
          }
        }),
        catchError(error => {
          /*
          //se carga la traducción del error
          this.translate.get('notifications.errorServer').subscribe((res: string) => {
            this.transError=res;
          });
          //return throwError(error.json().error || "server error");
          return throwError(this.transError);
          */
          return throwError(error.error.message || "server error");
        })
      )
  }




  /* --------------------- */
  /*       POST FILE       */
  /* --------------------- */

  sendPostFile(url,fileToUpload: File,apitoken:string): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('upload_file', fileToUpload, fileToUpload.name);

    return this.http
      .post(url,formData)
      .pipe(
        tap( ()=> { 
          if(this.parametrosService.debugMode){
            console.log("archivo enviado");
          }
        }),
        catchError(error => {
          /*
          //se carga la traducción del error
          this.translate.get('notifications.errorServer').subscribe((res: string) => {
            this.transError=res;
          });
          //return throwError(error.json().error || "server error");
          return throwError(this.transError);
          */
          return throwError(error.error.message || "server error");
        })
      )

  }



  /* --------------------- */
  /*          PUT          */
  /* --------------------- */

  sendPut(url:string,datos:Object,apitoken:string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
        'x-auth-token':  apitoken
      })
    };

    return this.http
      .put(url,datos,httpOptions)
      .pipe(
        tap( ()=> {
          if(this.parametrosService.debugMode){
            console.log("enviado");
          }
        }),
        catchError(error => {
          /*
          //se carga la traducción del error
          this.translate.get('notifications.errorServer').subscribe((res: string) => {
            this.transError=res;
          });
          //return throwError(error.json().error || "server error");
          return throwError(this.transError);
          */
          return throwError(error.error.message || "server error");
        })
      )
  }
  


}
