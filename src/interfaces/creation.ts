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

interface SolicitudFormValues {
  EmpresaId: string;
  AnoNumero: number;
  Id: string;
  CentroCostoId: string;
  SolicitanteId: string;
  ProgramaId: string;
  EstadoSolicitudCodigo?: number;
  Numero: number;
  Nombre: string;
  FechaIngreso: Date;
  Observaciones: string;


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
  run: string;
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
interface ArticleCuantity extends IArticuloIngreso {
  CentroCostoId: string;
  EmpresaId: string;
  Cantidad: number | undefined;
  Glosa: string | undefined;
}
interface RequerimientosFormValues {
  CentroCostoId: string;
  EmpresaId: string;
  Nombre: string;
  ProgramaId: string;
  Observaciones?: string;
  Articulo: ArticleCuantity[]
}


interface IConsulta {
  centroCostoId: string;
  empresaId: string;
  fechaIngreso: Date;
  nombre: string;
  numero: number;
  observaciones?: string;
  estadoSolicitudCodigo: number;
  programa: {
    nombre: string;
  }
  programaId: string;
  solicitudDetalles: {
    CentroCostoId: string;
    EmpresaId: string;
    articulo: {
      codigo?: string;
      id: string;
      nombre: string;
    }
    cantidad: number;
    CantidadAprobada?: number;
    Id: string;
    observaciones?: string;
    Orden: number;
    SolicitudId: string;
    SubFamiliaId: string;
  }[]
}

interface ConsultaFormValues {
  EmpresaId: string;
  CentroCostoId: string;
  FechaIngreso: Date;
  Nombre: string;
  Numero: number;
  ProgramaId: string;
  EstadoSolicitudCodigo: number;
  Observaciones?: string;
  SolicitudDetalles: {
    CentroCostoId: string;
    EmpresaId: string;
    articulo: {
      codigo?: string;
      id: string;
      nombre: string;
    }
    cantidad: number;
    CantidadAprobada?: number;
    Id: string;
    observaciones?: string;
    Orden: number;
    SolicitudId: string;
    SubFamiliaId: string;
  }[]
}

interface InventarioFormValues {
  NombreEncargado: string;
  FechaInventario: Date;
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
  valor: number;
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

interface IOrdenCompra {
  empresaId: string;
  cotizacionId: string;
  anoNumero: number;
  funcionarioId: string;
  formaPagoCodigo: number;
  fecha: string;
  numero: number;
  valorNeto: number;
  valorNetoDescuento: number;
  impuesto: number;
  valorTotal: number;
  nula: boolean;
  direccionEnvio?: string;
  observaciones?: string;
  ordenCompraDetalles: {
    cotizacionDetalle: {
      articulo: {
        codigo?: string;
        id: string;
        nombre?: string;
      }
      cantidad: number;
      id: string;
      observaciones?: string;
      solicitudDetalle: {
        cantidadAprobada: number;
        centroCostoId: string;
        centroCosto: {
          id: string;
          nombre: string;
          bodegas: {
            almacens: {
              id: string;
              nombre: string;
              sigla: string;
            }[]
            id: string;
            nombre: string;
            sigla: string;
          }[]
        }
      }
      valorUnitario: number;
    }
  }[]
}
interface FormValueRecepcionData {
  Recepcion: {
    CotizacionId: string;
    CentroCostoName?: string;
    EmpresaId: string;
    AnoNumero: number;
    Id: string;
    CentroCostoId: string;
    BodegaId: string;
    AlmacenId: string;
    BodegaName?: string;
    FuncionarioId: string;
    TipoDocumentoRecepcionCodigo: number;
    NumeroDocumento: number;
    FechaIngreso: Date;
    FechaRecepcion: Date;
    Observaciones: string;
    NumeroRecepcion: number;
    FechaDocumento: Date;
    Nula: boolean;
  };
  RecepcionDetalle: {
    CotizacionId: string;
    ObservacionDetalle?: string;
    Codigo?: string;
    Nombre?: string;
    ArticuloId?: string;
    Precio?: string;
    Recepcionado?: string;
    EmpresaId: string;
    CotizacionDetalleId: string;
    AnoNumero: number;
    CantidadPorRecepcionar: number;
    Cantidad: number;
    Observaciones: string;
  }[];
}

interface FormValueRecepcionSoData {
  Recepcion: {
    CotizacionId: string;
    EmpresaId: string;
    AnoNumero: number;
    CentroCostoId: string;
    BodegaId?: string;
    FuncionarioId: string;
    TipoDocumentoRecepcionCodigo: number;
    NumeroDocumento: number;
    FechaIngreso: Date;
    FechaRecepcion: Date;
    Observaciones: string;
    NumeroRecepcion: number;
    FechaDocumento: Date;
    Nula: boolean;
  };
  RecepcionDetalle: {
    CotizacionId: string;
    EmpresaId: string;
    CotizacionDetalleId: string;
    AnoNumero: number;
    Cantidad: number;
    Observaciones: string;
  }[];
}
interface InventarioFisicoFormValue {
  InventarioFisico: {
    EmpresaId: string;
    FuncionarioId: string;
    Numero: number;
    FechaRegistro: Date;
    FechaInicio: Date;
    FechaTermino: Date;
  };
  InventarioFisicoDetalle: {
    EmpresaId: string;
    InventarioFisicoId: string;
    FuncionarioId: string;
    CentroCostoId: string;
    BodegaId: string;
    DependenciaLocacion: string;
    FechaRegistro: Date;
  };
  InventarioFisicoRegistro: {
    EmpresaId: string;
    InventarioFisicoId: string;
    InventarioFisicoDetalleId: string;
    FuncionarioId: string;
    PersonaConteoId: string;
    AnoNumero: number;
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
    FechaRegistro: Date;
  };
}



interface ICotizacion {
  empresaId: string;
  id: string;
  anoNumero: number;
  solicitudId: string;
  proveedorId: string;
  contactoId?: string;
  formaPagoCodigo: number;
  estadoCotizacionCodigo: number;
  numero: number;
  nombre: string;
  fechaIngreso: string;
  fechaEntrega: string;
  valorIvaIncluido: boolean;
  exenta: boolean;
  valorNeto: number;
  descuento?: number;
  impuesto: number;
  valorTotal: number;
  observaciones?: string;
  descuentoPorcentual: boolean;
  activa: boolean;
  redondeaImpuesto: boolean;
  proveedor: {
    nombreComercial?: string;
  }
  cotizacionDetalles: {
    articulo: {
      id: string;
      codigo?: string;
      nombre?: string;
      subFamilium: {
        nombre: string;
        codigo: number;
        familium: {
          nombre: string;
          codigo: number;
        }
      }
    }
    cantidad: number;
    id: string;
    observaciones?: string;
    solicitudDetalle: {
      solicitud: {
        funcionarioEmpresa: {
          funcionarioId: string;
        }
      }
      centroCosto: {
        id: string;
        nombre: string;
        bodegas: {
          id: string;
          nombre: string;
          sigla: string;
        }[]
      }
    }
    valorUnitario: number;
  }[]
}

interface OutPutFormValues {
  EmpresaIdOrigen: string;
  EmpresaIdDestino: string;
  CentroCostoIdOrigen: string;
  CentroCostoIdDestino: string;
  BodegaIdOrigen: string;
  BodegaIdDestino: string;
  AlmacenIdOrigen: string
  AlmacenIdDestino: string
  BodegaOrigen: string;
  BodegaDestino: string;
  DireccionOrigen: string;
  DireccionDestino: string;
  ParteSalida: {
    AlmacenId: string;
    ArticuloId: string;
    Cantidad: number;
    CodigoArticulo?: string;
    CodigoFamilia: number;
    Familia: string;
    CodigoSubFamilia: number;
    SubFamilia: string;
    DescripcionArticulo?: string;
  }[]
};

interface OutPutQuiebreStockFormValues {
  FechInforme: Date;
  QuiebreStock: {
    Correlativo: number;
    CodigoArticulo?: string;
    CodigoFamilia: number;
    Familia: string;
    CodigoSubFamilia: number;
    SubFamilia: string;
    DescripcionArticulo?: string;
    CantidadSistema: number;
    StockCritico: number;
    ProcesoCompra: string;
  }[]
};

interface IParteSalida {
  empresaId: string;
  centroCostoId: string;
  bodegaId: string;
  almacenId: string;
  anoNumero: number;
  subFamiliaId: string;
  articuloId: string;
  estadoArticuloCodigo: number;
  id: string;
  fecha: Date;
  numero: number;
  cantidad: number;
  almacenArticulo: {
    cantidad: number;
    almacen: {
      bodega: {
        nombre: string;
        empresa: {
          rut: string;
          recepcions: {
            tipoDocumentoRecepcionCodigoNavigation: {
              codigo: number;
              nombre: string;
            }
          }[]
          funcionarioEmpresas: {
            funcionario: {
              idNavigation: {
                run: string;
                nombre: string;
                nombres: string;
                apellidoPaterno: string;
              }
            }
          }[]
        }
      }
    }
  }
}
interface IParteEntrada {
  empresaId: string;
  centroCostoId: string;
  bodegaId: string;
  almacenId: string;
  anoNumero: number;
  subFamiliaId: string;
  articuloId: string;
  estadoArticuloCodigo: number;
  id: string;
  recepcionId: string;
  cotizacionId: string;
  cotizacionDetalleId: string;
  fecha: Date;
  numero: number;
  cantidad: number;
  recepcionDetalle: {
    recepcion: {
      cotizacion: {
        proveedor: {
          id: string;
          rut: string;
          razonSocial: string;
          nombreComercial: string;
        }
        cotizacionDetalles: {
          valorUnitario: number;
        }[]
      },
      tipoDocumentoRecepcionCodigoNavigation: {
        codigo: number;
        nombre: string;
      },
      funcionarioEmpresa: {
        funcionario: {
          idNavigation: {
            run: string;
            nombre: string;
            nombres: string;
            apellidoPaterno: string;
          }
        }
      }
    }
  }
  almacenArticulo: {
    cantidad: number;
    articulo: {
      codigo?: number;
      descripcion?: string;
    }
  }
}
interface IMarca {
  id: string;
  nombre: string;
}
interface IInventarioFisicoEstado {
  codigo: number;
  nombre: string;
}

interface IBodegaQuiebre {
  almacen: {
    bodega: {
      id: string;
      nombre: string;
    }
    codigo: string;
    id: string;
    nombre: string;
  }
  articulo: {
    codigo: string;
    descripcion: string;
    nombre: string;
    subFamilia: {
      familia: {
        codigo: string;
        id: string;
        nombre: string;
      }
      codigo: string;
      id: string;
      nombre: string;
    }
  }
  cantidad: number;
  cantidadMinima: number;
}
interface FormValueGuiaSalidaDetalle {
  EmpresaId: string;
  CentroCostoId: string;
  BodegaId: string;
  BodegaNombre: string;
  AlmacenId: string;
  AlmacenNombre: string;
  FuncionarioEntregaId: string;
  FuncionarioEntregaNombre: string;
  PersonaRecibeId: string;
  PersonaRecibeNombre: string;
  MotivoSalida: string;
  Observacion: string;
  GuiaSalidaDetalle: {
    AlmacenId: string;
    SubFamiliaId: string;
    ArticuloId: string;
    EstadoArticuloCodigo: number;
    Cantidad: number;
    Observacion?: string;
    CodigoSubFamilia: number;
    NombreSubFamilia: string;
    CodigoArticulo?: string;
    DescripcionArticulo?: string;
    CantidadSistema: number;
    EstadoArticuloNombre:string;
  }[]
}




export type {
  PersonaFormValues, EmpresaFormValues, CentroFormValues, AlmacenFormValues, BodegaFormValues, ICentroCosto, IPersona, ArticuloFormValues, IAno, ITipoUnidad, IEmpresa, LocationFormValues, ITipoLocation, IArticulo,
  ISubFamilia, IBodega, SubFamiliaFormValues, ICuenta, FamiliaFormValues, IFamilia, IYears, ITipoDocumento, IArticuloValor, IArticuloIngreso, IPrograma,
  RequerimientosFormValues, ArticleCuantity, IConsulta, ConsultaFormValues, IOrdenCompra, ICotizacion, FormValueRecepcionData, OutPutFormValues, IParteSalida, IParteEntrada, InventarioFormValues,
  OutPutQuiebreStockFormValues, FormValueRecepcionSoData, IMarca, IInventarioFisicoEstado, InventarioFisicoFormValue, IBodegaQuiebre, FormValueGuiaSalidaDetalle
}