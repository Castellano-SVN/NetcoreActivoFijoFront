import { IPersona } from "./creation";

export interface InventarioFisicoData {
  EmpresaId: string;
  FechaInicio?: Date;
  FechaTermino?: Date;
}
export interface IInventarioFisico {
  empresaId: string;
  fechaInicio?: Date;
  fechaTermino?: Date;
  numero: number;
}

export interface InventarioFisicoFormValues {
  EmpresaId: string;
  FechaInicio: Date | string;
  FechaTermino: Date | string;
}

export interface InventarioFisicoDetalleData {
  empresaId: string;
  numero: number;
  funcionarioId?: string;
  centroCostoId?: string;
  bodegaId?: string;
  fechaRegistro?: Date;
}

export interface IInventarioFisicoDetalle{
  empresaId: string;
  numero: number;
  funcionarioId?: string;
  centroCostoId?: string;
  bodegaId?: string;
  fechaRegistro?: Date;
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
  persona:IPersona;
}