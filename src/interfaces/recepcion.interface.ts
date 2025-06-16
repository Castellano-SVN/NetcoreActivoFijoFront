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

 export interface articulosSOC {
    cantidad: number;
    action: string;
    codigo: number;
    id: string;
    nombre: string;
    descripcion: string;
    valor: number;
    cantidadAlmacen: string | number;
 }
 interface recepcion extends ubicacionRecepcionI {
    oc: number;
    empresa: string;
    cotizacion: string;
    folio?: number;
    fecha: Date;
    numDoc?: number;
    fechaDoc: Date;
    tipo : number;
    descripcion:string;
}
export interface recepcionCOC extends recepcion {
    articulos: articulosI[]

}
export interface recepcionSOC extends recepcion {
    articulos: articulosSOC[]
}
