import { boolean } from "zod";

interface PersonaFormValues {
  RunCuerpo: number;
  RunDigito: string;
  Id?: string;
  Nombre: string;
  Nombres: string;
  ApellidoPaterno: string;
  ApellidoMaterno?: string | null;
  Email?: string | null;
  SexoCodigo: number;
  FechaNacimiento?: Date | null;
  NacionalidadCodigo?: number | null;
  EstadoCivilCodigo?: number | null;
  NivelEducacionalCodigo?: number | null;
  RegionCodigo?: number | null;
  CiudadCodigo?: number | null;
  ComunaCodigo?: number | null;
  RegionNacimientoCodigo?: number | null;
  CiudadNacimientoCodigo?: number | null;
  ComunaNacimientoCodigo?: number | null;
  VillaPoblacion?: string | null;
  Direccion?: string | null;
  Telefono?: number | null;
  Celular?: number | null;
  Observaciones?: string | null;
  Ocupacion?: string | null;
  TelefonoLaboral?: number | null;
  DireccionLaboral?: string | null;
  Huella?: ArrayBuffer | null;
  ImagenHuella?: ArrayBuffer | null;
  AreaGeograficaCodigo?: number | null;
  NroDepartamento?: string | null;
}

interface EmpresaFormValues {
  Id: string;
  RutCuerpo: number;
  RutDigito: string;
  RazonSocial: string;
  RegionCodigo?: number | null;
  CiudadCodigo?: number | null;
  ComunaCodigo?: number | null;
  TipoAdministracionCodigo: number;
  ActividadEconomicaPrincipalCodigo?: number | null;
  SectorActividadEconomicaCodigo?: number | null;
  ActividadEconomicaCodigo?: number | null;
  Giro?: string | null;
  Direccion?: string | null;
  Email?: string | null;
  PaginaWeb?: string | null;
  Telefono1?: number | null;
  Telefono2?: number | null;
  Fax?: number | null;
  Celular?: number | null;
  AdministradorId?: string | null;
  GerenteRRHHId?: string | null;
  Bloqueada: boolean;
  RutaReporte?: string | null;
  PieFirmaLiquidacion?: string | null;
  URL?: string | null;
}
interface CentroFormValues {
  EmpresaId: string;
  Id: string;
  CentroCostoId?: string | null;
  AdministradorId?: string | null;
  Nombre: string;
  Sigla?: string | null;
  AreaGeograficaCodigo: number;
  TipoEstablecimientoSaludCodigo?: number | null;
  RegionCodigo?: number | null;
  CiudadCodigo?: number | null;
  ComunaCodigo?: number | null;
  Email?: string | null;
  Direccion?: string | null;
  Telefono1?: number | null;
  Telefono2?: number | null;
  Fax?: number | null;
  Celular?: number | null;
  CodigoContabilidad?: string | null;
  LibroRemuneraciones: boolean;
  RutaReporte?: string | null;
  DepartamentoId?: number | null;
  UnidadId?: number | null;
  CodigoPrevired?: string | null;
  CodigoGesparvu?: number | null;
  AdministracionCentral: boolean;
  CodigoDipres?: string | null;
  Contabilizacion: boolean;

}
interface AlmacenFormValues {
  EmpresaId: string;
  BodegaId: string;
  Id?: string;
  TipoAlmacenId: string;
  Codigo: string;
  Nombre: string;
};


interface BodegaFormValues {
  EmpresaId: string;
  CentroCostoId: string;
  Id?: string;
  Nombre: string;
  Sigla?: string | null;
  Descripcion?: string | null;
}

interface SubFamiliaFormValues {
  EmpresaId: string;
  AnoNumero: number;
  Id: string;
  Codigo: number;
  FamiliaId: string;
  CuentaId?: string;
  CuentaObligacionId?: string;
  Nombre: string;
  Descripcion?: string;
  Eliminado: boolean;
}
interface FamiliaFormValues {
  EmpresaId: string;
  Id: string;
  FamiliaId?: string;
  Codigo: number;
  Nombre: string;
  Descripcion?: string;
  Eliminado: boolean;
}

interface CotizacionFormValues {
  EmpresaId: string;
  AnoNumero: number;
  id: string;
  SolicitudId: string;
  ProveedorId: string;
  ContactoId?: string;
  FormaPagoCodigo: number;
  EstadoCotizacionCodigo: number;
  Numero: number;
  Nombre: string;
  FechaIngreso: string;
  FechaEntrega: string;
  ValorIvaIncluido: boolean;
  Exenta: boolean;
  ValorNeto: number;
  Descuento?: number;
  Impuesto: number;
  ValorTotal: number;
  Observaciones?: string;
  DescuentoPorcentual: boolean;
  Activa: boolean;
  RedondeaImpuesto: boolean;


}

interface IYears {
  id: string;
  numero: number;
  nombre: string;
}
interface IFamilia {
  empresaId: string;
  id: string;
  familiaId?: string;
  codigo: number;
  nombre: string;
  descripcion?: string;
  eliminado: boolean;
}

interface ICentroCosto {
  id: string;
  empresaId: number;
  centroCostoId?: number | null;
  administradorId?: number | null;
  nombre: string;
  sigla?: string | null;
  areaGeograficaCodigo: number;
  tipoEstablecimientoSaludCodigo?: number | null;
  regionCodigo?: number | null;
  ciudadCodigo?: number | null;
  comunaCodigo?: number | null;
  email?: string | null;
  direccion?: string | null;
  telefono1?: number | null;
  telefono2?: number | null;
  fax?: number | null;
  celular?: number | null;
  codigoContabilidad?: string | null;
  libroRemuneraciones: boolean;
  rutaReporte?: string | null;
  departamentoId?: number | null;
  unidadId?: number | null;
  codigoPrevired?: string | null;
  codigoGesparvu?: number | null;
  administracionCentral: boolean;
  codigoDipres?: string | null;
  contabilizacion: boolean;
}

interface IPrograma {
  empresaId: string;
  anoNumero: number;
  id: string;
  numero: number;
  nombre: string;
  sigla?: string;
  ambitoCodigo: number;
  presupuestoMonto?: number;
  presupuestoRestante?: number;
  programaSEP: boolean;
  programaPIE: boolean;
  gastoCorriente: boolean;
  departamentoId: string;
  unidadId: string;
}
interface IPersona {
  id?: string;
  runCuerpo: number;
  runDigito: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string
  email: string
  sexoCodigo: number
  fechaNacimiento?: Date | null;
  nacionalidadCodigo?: number | null;
  estadoCivilCodigo?: number | null;
  nivelEducacionalCodigo?: number | null;
  regionCodigo?: number | null;
  ciudadCodigo?: number | null;
  comunaCodigo?: number | null;
  regionNacimientoCodigo?: number | null;
  ciudadNacimientoCodigo?: number | null;
  comunaNacimientoCodigo?: number | null;
  villaPoblacion?: string | null;
  direccion?: string | null;
  telefono: number;
  celular: number;
  observaciones?: string | null;
  ocupacion?: string | null;
  telefonoLaboral: number;
  direccionLaboral?: string | null;
  huella?: string | null;
  imagenHuella?: string | null;
  areaGeograficaCodigo?: number | null;
  nroDepartamento?: string | null;
}
interface IEmpresa {
  id: string;
  rutCuerpo: number;
  rutDigito: string;
  razonSocial: string;
  regionCodigo?: number | null;
  ciudadCodigo?: number | null;
  comunaCodigo?: number | null;
  tipoAdministracionCodigo: number;
  actividadEconomicaPrincipalCodigo?: number | null;
  sectorActividadEconomicaCodigo?: number | null;
  actividadEconomicaCodigo?: number | null;
  giro?: string | null;
  direccion?: string | null;
  email?: string | null;
  paginaWeb?: string | null;
  telefono1?: number | null;
  telefono2?: number | null;
  fax?: number | null;
  celular?: number | null;
  administradorId?: string | null;
  gerenteRRHHId?: string | null;
  bloqueada: boolean;
  rutaReporte?: string | null;
  pieFirmaLiquidacion?: string | null;
  uRL?: string | null;
}

interface ArticuloFormValues {
  EmpresaId: string;
  AnoNumero: number;
  SubFamiliaId: string;
  Id: string;
  TipoUnidadCodigo: number;
  Codigo?: string | null;
  Nombre: string;
  Descripcion?: string | null;
  Eliminado: boolean;
  Valor: number;

}

interface RequerimientosFormValues {
  Nombre: string;
  Codigo?: string;
  NombreArticulo: string;
  Cantidad: number;
  Glosa?: string;
  ProgramaId: string;
  Observaciones?: string;
}

interface ICuenta {
  id: string;
  anoNumero: number;
  empresaId: string;
  cuentaId?: string | null;
  numeroNivel?: number | null;
  tipoCuentaCodigo?: number | null;
  numero: number;
  numeroCuenta?: string | null;
  descripcion: string;
  fechaCreacion: Date;
  informeAnalitico: boolean;
  centroCostos: boolean;
  balanceTrimestral: boolean;
  actualizacionPresupuestaria: boolean;
  presupuestoInicial?: number | null;
  presupuestoVigente?: number | null;
  fondoRendir: boolean;
  fondoFijo: boolean;
  cuentaPorPagar: boolean;
  facturaPorPagar: boolean;
  proveedores: boolean;
  anticipoProveedores: boolean;
  rut: boolean;
  clientes: boolean;
  honorarios: boolean;
  honorarioPorPagar: boolean;
  retencionHonorario: boolean;
  sueldosPorPagar: boolean;
  caja: boolean;
  activoCirculante: boolean;
  pasivoCirculante: boolean;
  correccionMonetaria: boolean;
  gav: boolean;
  planta: boolean;
  contrata: boolean;
  impuestoRenta: boolean;
  devolucionFondo: boolean;
  cuentaPasivoPresupuesto: boolean;
  cuentaResultado: boolean;
  tipoIngresoOperacionalCodigo?: number;
  tipoGastoOperacionalCodigo?: number;
  tipoCuentaEstadoResultadoCodigo?: number;
  cuentaPatrimonio: boolean;
  cuentaContabilizaIva: boolean;

}

interface IArticuloValor {
  valor: string;
}
interface IArticulo {
  empresaId: string;
  anoNumero: number;
  subFamiliaId: string;
  id: string;
  tipoUnidadCodigo: number;
  codigo?: string | null;
  nombre: string;
  descripcion?: string | null;
  eliminado: boolean;
  valor: number;
}
interface IArticuloIngreso extends IArticulo {
  subFamilium: {
    nombre: string;
    familium: {
      nombre: string;
    }
  }
}

interface IAno {
  numero: number;
  nombre: string;
  activo: boolean;
}

interface LocationFormValues {
  EmpresaId: string;
  Id: string;
  CentroCostoId?: string;
  BodegaId?: string;
  AlmacenId?: string;
  TipoLocacionId: string;
  Direccion: string;
  Descripcion?: string;

}

interface ITipoLocation {
  empresaId: string;
  id: string;
  nombre: string;
}

interface ITipoUnidad {
  codigo: number;
  nombre: string;
  signo: string;
}

interface ISubFamilia {
  empresaId: string;
  anoNumero: number;
  id: string;
  codigo: number;
  familiaId: string;
  cuentaId?: string;
  cuentaObligacionId?: string;
  nombre: string;
  descripcion?: string;
  eliminado: boolean;
}

interface IBodega {
  empresaId: string;
  centroCostoId: string;
  id: string;
  nombre: string;
  sigla?: string;
  descripcion?: string;
}

interface ITipoDocumento {
  codigo: number,
  descripcion: string;
  sigla: string;
}
export type {
  PersonaFormValues, EmpresaFormValues, CentroFormValues, AlmacenFormValues, BodegaFormValues, ICentroCosto, IPersona, ArticuloFormValues, IAno, ITipoUnidad, IEmpresa, LocationFormValues, ITipoLocation, IArticulo,
  ISubFamilia, IBodega, SubFamiliaFormValues, ICuenta, FamiliaFormValues, IFamilia, IYears, CotizacionFormValues, ITipoDocumento, IArticuloValor, IArticuloIngreso, IPrograma,
  RequerimientosFormValues,
}