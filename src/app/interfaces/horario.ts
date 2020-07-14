import { RangoHoras } from "./rango-horas"

export interface Horario {
    "dia": number;
    "abierto": boolean;
    "rangoHoras": RangoHoras[];
}