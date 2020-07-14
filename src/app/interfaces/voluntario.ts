export interface Voluntario {
    "id": number;
    "nombre": string;
    "apellidos": string;
    "telefono": string;
    "email": string;
    "ambitoRecogida": string[];
    "ambitoEntrega": string[];
    "lopd": boolean;
    "nombreUsuario": string;
    "contrasenia": string;
    "fecha": Date;
    "active": number;
}