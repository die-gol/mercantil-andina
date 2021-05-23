import { ICoverage } from "./coverage.model";
import { ILocation } from "./location.model";
import { IVehicle } from "./vehicle.model";

export interface IUser {
	dni: number,
	nombre: string,
	apellido: string,
	email: string,
	celular: string,
	telefono: string,
	location: ILocation,
	nacimiento: string,
	usuario: string,
	contraseña: string,
    vehiculo: IVehicle,
	marca: string,
	año: number,
	modelo: string,
	version:string,
    cobertura: ICoverage
}