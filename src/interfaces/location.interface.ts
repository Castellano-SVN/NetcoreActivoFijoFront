interface IRegion {
    codigo: number,
    nombre: string;
    nombreOficial: string;
    codigoLibroClaseElectronico: number;
}

interface ICiudad {
    regionCodigo: number;
    codigo: number;
    nombre: string;
}

interface IComuna {
    regionCodigo: number;
    ciudadCodigo: number;
    codigo: number;
    nombre: string;
    codigoDIPRES: string;
    codigoPostal: number;
    codigoLibroClaesElectronico: number;
    codigoLre: number;
}
interface ITipoAtencion {
    codigo: number,
    nombre: string
}
interface IGenericCodigoDescripcion {
    codigo: number;
    descripcion: string;
}
interface ISectorActividadEconomica extends IGenericCodigoDescripcion {
    actividadEconomicaPrincipalCodigo: number;
}
interface ITipoEstablecimientoSalud {
    codigo: number;
    nombre: string;

}
export type {
    IRegion, ICiudad, IComuna, ITipoAtencion, IGenericCodigoDescripcion, ISectorActividadEconomica,ITipoEstablecimientoSalud
}