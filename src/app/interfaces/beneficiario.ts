
import { Integrante } from './integrante';

export interface Beneficiario {
    "id": number;
    "nombre": string;
    "apellidos": string;
    "direccion": string;
    "provincia": number;
    "municipio": number;
    "telefono": string;
    "email": string;
    "sitLaboral": number;
    "discapacidad": number;
    "fnacim": Date;
    "codPostal": string;
    "ingresos": number;
    "procIngresos": number;
    "lopd": boolean;
    "numIntegrantes": number;
    "nombreUsuario": string;
    "contrasenia": string;
    "fecha": Date;
    "active": number;
    "integrantes": Integrante[];
}