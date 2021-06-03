import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const API_URL = environment.apiUrl;
const API_URL_GOB = environment.apiUrlGob;

@Injectable({
    providedIn: "root"
  })
export class CommonService {

	constructor(
		protected http: HttpClient
	) { }

    getApiURL() {
		return API_URL;
	}

    getApiURLGob() {
		return API_URL_GOB;
	}

	getProvincias(): Observable<any> {
		return this.http.get(this.getApiURLGob() + 'georef/api/provincias');
	}

    getMunicipio(idProvincia: number): Observable<any>{
        return this.http.get(this.getApiURLGob() + 'georef/api/municipios?provincia=' + idProvincia + '&campos=id,nombre&max=135');
    }

    existUser(userName: string): Observable<any> {
        return this.http.get(this.getApiURL() + 'api_mock_frontend/v1/usuarios?nombre=' + userName);
    }

    getBrands(): Observable<any> {
        return this.http.get(this.getApiURL() + 'api/v1/vehiculos/marcas');
	}

    getModelos(idMarca: any, year: any): Observable<any> {
        return this.http.get(this.getApiURL() + 'api/v1/vehiculos/marcas/' + idMarca + '/' + year);
    }

    getVersiones(idMarca: any, year: any, idModelo: any): Observable<any> {
        return this.http.get(this.getApiURL() + 'api/v1/vehiculos/marcas/' + idMarca + '/' + year + '/' + idModelo);
    }

    getCoberturas(): Observable<any> {
        return this.http.get(this.getApiURL() + 'api_mock_frontend/v1/coberturas');
    }

}
