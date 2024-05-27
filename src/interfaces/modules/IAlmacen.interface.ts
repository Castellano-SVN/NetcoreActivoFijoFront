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

export type { IAlmacen, ILocacion } 