import { IPersona } from "./creation";

export interface InventarioFisicoData {
  EmpresaId: string;
  FechaInicio?: Date;
  FechaTermino?: Date;
}
export interface IInventarioFisico {
  empresaId: string;
  fechaInicio: Date;
  fechaTermino: Date;
  numero: number;
}

export interface InventarioFisicoFormValues {
  EmpresaId: string;
  FechaInicio: Date | string;
  FechaTermino: Date | string;
}

export interface IInventarioFisicoDetalle {
  empresaId: string;
  numero: number;
  funcionarioId?: string;
  centroCostoId?: string;
  centroCosto?: string;
  bodegaId?: string;
  bodega?: string;
  encargado?: string;
  encargadoRut?: string;
  fechaRegistro?: string;
  id:string;
  status: boolean
}
export interface InventarioFisicoDetalleFormValues {
  EmpresaId: string;
  Numero: number;
  FuncionarioId?: string;
  CentroCostoId?: string;
  BodegaId?: string;
}

export interface IFuncionarioEmpresa {
  empresaId: string;
  funcionarioId: string;
  gradoCertificadoProfesionalCodigo?: number;
  formacionProfesional?: string;
  funcion?: string;
  puntaje?: number;
  activo: boolean;
  saldo?: number;
  titulo?: string;
  institucionAcademica?: string;
  estadoAcreditacionInstitucion?: string;
  metodoVerificacionEducacion?: string;
  fechaGraduacion?: Date;
  pagarAlumnosPrioritarios: boolean;
  reliquidacionId?: string;
  numeroBienioReliquidado?: number;
  brpTitulo: boolean;
  brpMencion: boolean;
  tituloCodigo?: number;
  unidadFuncionalCodigo?: number;
  postTituloCodigo?: number;
  especialidadCodigo?: number;
  inicioNombramientoContrata?: Date;
  inicioNombramientoTitular?: Date;
  terminoNombramiento?: Date;
  ingresoServicio?: Date;
  fechaInicioCalidadJuridicaContrata?: Date;
  fechaInicioCalidadJuridicaPlanta?: Date;
  persona: IPersona;
}

export interface InventarioFisicoRegistroFormValues {
  InventarioFisicoDetalleId: string;
  InvFisRegistro: {
    EmpresaId: string;
    FuncionarioId: string;
    PersonaConteoId: string;
    SubFamiliaId: string;
    ArticuloId: string;
    MarcaId: string;
    EstadoCodigo: number;
    LugarFisicoConteo: string;
    LocacionId: string;
    ProgramaId: string;
    Presentacion: string;
    Observaciones: string;
    Codigo: string;
    NumeroUnidades: number;
  }[];
}