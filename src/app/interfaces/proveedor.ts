import { Horario } from "./horario"

export interface Proveedor {
    "id": number;
    "nombre": string;
    "apellidos": string;
    "direccion": string;
    "provincia": number;
    "municipio": number;
    "telefono": string;
    "email": string;
    "codPostal": string;
    "redesSociales": boolean;
    "lopd": boolean;
    "nombreUsuario": string;
    "contrasenia": string;
    "fecha": Date;
    "active": number;
    "horario": Horario[];
}