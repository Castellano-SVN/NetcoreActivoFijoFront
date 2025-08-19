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

interface IArticulo{
    id: string;
    nombre: string;
}
interface IAlmacenArticulo {
    almacenId: string;
    anoNumero: number;
    articulo: {
        codigo?: string;
        nombre: string;
        anoNumero: number;
        descripcion?: string;
        id: string;
        subFamilium: {
            codigo: number;
            id: string;
            nombre: string;
            familium: {
                codigo: number;
                id: string;
                nombre: string;
            }
        }
    }
    articuloId: string;
    bodegaId: string;
    cantidad: number;
    centroCostoId?: string;
    empresaId: string;
    estadoArticuloCodigo: number;
    locacionId?: string;
    locacion: {
        descripcion?: string;
        direccion: string;
    }
    subFamiliaId: string;
}

export type { IAlmacen, ILocacion, IAlmacenArticulo, IArticulo } 