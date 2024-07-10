import { LocationFormValues } from "../creation";

interface IAlmacen {
    empresaId: string;
    bodegaId: string;
    id: string;
    tipoAlmacenId: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    centroCostoId: string;
}

interface ILocacion {
    empresaId: string;
    id: string;
    centroCostoId?: string;
    bodegaId?: string;
    almacenId?: string;
    tipoLocacionId: string;
    direccion: string;
    descripcion?: string;
}

interface IAlmacenArticulo {
    empresaId: string;
    centroCostoId?: string;
    bodegaId: string;
    almacenId: string;
    anoNumeor:number;
    subFamiliaId:string;
    articuloId:string;
    estadoArticuloCodigo:number;
    locacionId: string;
    cantidad:number;
}

export type { IAlmacen, ILocacion,IAlmacenArticulo } 