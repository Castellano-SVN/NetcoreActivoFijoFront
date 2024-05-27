import { IPersona } from "../creation";

interface Empresa {
  id: string;
  rut: string;
  rutCuerpo: number;
  rutDigito: string;
  razonSocial: string;
  regionCodigo: number | null;
  ciudadCodigo: number | null;
  comunaCodigo: number | null;
  tipoAdministracionCodigo: number;
  actividadEconomicaPrincipalCodigo: number | null;
  sectorActividadEconomicaCodigo: number | null;
  actividadEconomicaCodigo: number | null;
  giro: string | null;
  direccion: string | null;
  email: string | null;
  paginaWeb: string | null;
  telefono1: number | null;
  telefono2: number | null;
  fax: number | null;
  celular: number | null;
  administradorId: string | null;
  gerenteRRHHId: string | null;
  bloqueada: boolean;
  rutaReporte: string | null;
  pieFirmaLiquidacion: string | null;
  url: string | null;
  administrador: any | null; // Aquí deberías definir el tipo correcto de acuerdo a la estructura del objeto
  gerenteRrhh: any | null; // Igualmente aquí
}
export interface IcentroCosto_Bodega {
  empresaId: string;
  centroCostoId: string
  id: string;
  nombre: string;
  sigla?: string | null;
  descripcion?: string | null;
}
export default interface IcentroCosto {
  empresaId: string;
  id: string;
  centroCostoId: string;
  administradorId: string | null;
  nombre: string;
  sigla: string;
  areaGeograficaCodigo: number;
  tipoEstablecimientoSaludCodigo: number;
  regionCodigo: number;
  ciudadCodigo: number;
  comunaCodigo: number;
  email: string;
  direccion: string;
  telefono1: number;
  telefono2: number;
  fax: number;
  celular: number;
  codigoContabilidad: string;
  libroRemuneraciones: boolean;
  rutaReporte: string;
  departamentoId: string | null;
  unidadId: string | null;
  codigoPrevired: string;
  codigoGesparvu: number;
  administracionCentral: boolean;
  codigoDipres: string;
  contabilizacion: boolean;
  empresa: Empresa;
  administrador: IPersona | null
  bodegas: IcentroCosto_Bodega[]
}