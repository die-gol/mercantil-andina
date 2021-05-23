import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
  })
export class CommonService {

	constructor(
		protected http: HttpClient
	) { }

	getProvincias(): Observable<any> {
		return this.http.get('https://apis.datos.gob.ar/georef/api/provincias');
	}

    getMunicipio(idProvincia: number): Observable<any>{
        return this.http.get('https://apis.datos.gob.ar/georef/api/municipios?provincia=' + idProvincia + '&campos=id,nombre&max=135');
    }

    existUser(userName: string): Observable<any> {
        return this.http.get('https://servicios.qamercantilandina.com.ar/api_mock_frontend/v1/usuarios?nombre=' + userName);
    }

    getBrands(): Observable<any> {
		return this.http.get('https://servicios.qamercantilandina.com.ar/api/v1/vehiculos/marcas');
	}

    getModelos(idMarca: any, year: any): Observable<any> {
        return this.http.get('https://servicios.qamercantilandina.com.ar/api/v1/vehiculos/marcas/' + idMarca + '/' + year);
    }

    getVersiones(idMarca: any, year: any, idModelo: any): Observable<any> {
        return this.http.get('https://servicios.qamercantilandina.com.ar/api/v1/vehiculos/marcas/' + idMarca + '/' + year + '/' + idModelo);
    }

    getCoberturas(): Observable<any> {
        return this.http.get('https://servicios.qamercantilandina.com.ar/api_mock_frontend/v1/coberturas');
    }

}
