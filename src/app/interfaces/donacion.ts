export interface Donacion {
    "id": number;
    "producto": number;
    "cantidad": number;
    "provinciaProveedor": number;
    "municipioProveedor": number;
    "provinciaBeneficiario": number;
    "municipioBeneficiario": number;
    "proveedorId": number;
    "proveedorNombre": string;
    "proveedorApellidos": string;
    "proveedorNombreUsuario": string;
    "voluntarioId": number;
    "voluntarioNombre": string;
    "voluntarioApellidos": string;
    "voluntarioNombreUsuario": string;
    "beneficiarioId": number;
    "beneficiarioNombre": string;
    "beneficiarioApellidos": string;
    "beneficiarioNombreUsuario": string;
    "rutaFoto": string;
    "fecha": Date;
}