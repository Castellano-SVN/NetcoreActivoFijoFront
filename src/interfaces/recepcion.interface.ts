export interface ubicacionRecepcionI {
    cc: string;
    bodega: string;
    almacen: string;
}
export interface articulosI {
    codigo: string;
    nombre: string;
    cantidad: number;
    precio: number;
    id: string;
    observacion: string;
    recepcionado: number;
    porRecepcionar: number | undefined;
    recibida: number  | undefined;
    observaciones: string | undefined;
}
export interface recepcionCOC extends ubicacionRecepcionI {
    oc: number;
    empresa: string;
    cotizacion: string;
    folio: number;
    fecha: Date;
    numDoc: number;
    fechaDoc: Date;
    tipo : number;
    descripcion:string;
    articulos: articulosI[]
}