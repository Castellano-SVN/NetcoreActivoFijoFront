import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
let token = Cookies.get("bearer");
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 1) Timeout (código ECONNABORTED)
    if (error.code === "ECONNABORTED") {
      console.error("Timeout de la petición:", error.message);
      toast.error(
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde."
      );
    }
    // 2) Sin respuesta (p. ej. servidor caído o CORS bloqueado)
    else if (error.request && !error.response) {
      console.error("No hubo respuesta del servidor:", error.message);
      toast.error(
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde."
      );
    }
    // 3) Error 404: logout
    else if (error.response?.status === 404) {
      console.log("Error 404 - Deslogueando...");
      // Ejemplo de logout:
      // Cookies.remove('bearer');
      // window.location.href = '/login';
    }
    // 4) Errores 5xx genéricos
    else if (error.response?.status! >= 500) {
      console.error(`Error ${error.response!.status} del servidor`);
      toast.error(
        "Ocurrió un error en la conexión con el servidor. Por favor, inténtalo de nuevo más tarde."
      );
    }

    return Promise.reject(error);
  }
);

export function api_getPersonas(bearer: string, page: number) {
  return api.get(`persona?page=${page}&perPage=6`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllPersonas(bearer: string, search?: string) {
  const url = `personaall` + (search ? `?search=${search}` : "");

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postPersonas(bearer: string, data: any) {
  return api.post(`persona`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_putPersonas(bearer: string, data: any) {
  return api.put(`persona`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_postPersonas_huella(bearer: string, id: string, data: any) {
  return api.post(`persona/huella?id=${id}`, data, {
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "multipart/form-data",
    },
  });
}
export function api_postEmpresas(bearer: string, data: any) {
  return api.post(`empresa`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_postEmpresas_Bloquear(bearer: string, id: string) {
  return api.delete(`empresa?id=${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_putEmpresas(bearer: string, data: any) {
  return api.put(`empresa`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getCuenta(bearer: string, empresaId: string) {
  return api.get(`cuenta/${empresaId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_postCentroCostos(bearer: string, data: any) {
  return api.post(`centrocosto`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getCentroCostos(bearer: string, page: number) {
  return api.get(`centrocosto?page=${page}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAllCentroCostos(bearer: string, id: string) {
  return api.get(`centrocosto?id=${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getOneCentroCosto(bearer: string, id: string) {
  return api.get(`centrocosto/${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getEmpresas(
  bearer: string,
  page: number,
  searchParams?: {
    // Parámetros de búsqueda opcionales
    searchTerm?: string;
    searchType?: "startsWith" | "contains" | "endsWith" | "exact";
  }
) {
  let url = `empresa?page=${page}&perPage=6`;

  // Agregar parámetros de búsqueda si existen
  if (searchParams?.searchTerm && searchParams?.searchType) {
    url += `&searchTerm=${encodeURIComponent(
      searchParams.searchTerm
    )}&searchType=${searchParams.searchType}`;
  }

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getOneEmpresa(bearer: string, id: string) {
  return api.get(`empresa/${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getTipoDocumentos(bearer: string) {
  return api.get(`tipodocumento`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postBodegas(bearer: string, data: any) {
  return api.post(`bodega`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getBodegas(bearer: string, centroCosto: string) {
  return api.get(`bodega/${centroCosto}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAllBodegasByEmpresa(bearer: string, empresaId: string) {
  return api.get(`bodegabyempresa/${empresaId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAllBodegas(bearer: string) {
  return api.get(`bodega`, { headers: { Authorization: `Bearer ${bearer}` } });
}
export function api_postAlmacen(bearer: string, data: any) {
  return api.post(`almacen`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAlmacen(
  bearer: string,
  page: number,
  id: string,
  searchParams?: {
    searchTerm?: string;
    searchType?: "startsWith" | "contains" | "endsWith" | "exact";
  }
) {
  let url = `almacen?page=${page}&id=${id}&perPage=5`;

  if (searchParams?.searchTerm && searchParams?.searchType) {
    url += `&searchTerm=${encodeURIComponent(
      searchParams.searchTerm
    )}&searchType=${searchParams.searchType}`;
  }

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAlmacenById(bearer: string, id: string) {
  return api.get(`almacen/${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getTipoLocation(bearer: string, id: string) {
  return api.get(`tipolocacion?id=${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_postTipoLocation(bearer: string, data: any) {
  return api.post(`tipolocacion`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getOneLocacion(bearer: string, id: string) {
  return api.get(`locacion/${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postLocation(bearer: string, data: any) {
  return api.post(`locacion`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

/* export function api_getSubFamilias(bearer: string, id: string, page: number) {
  return api.get(`subFamilia/${id}?page=${page}`, { headers: { "Authorization": `Bearer ${bearer}` } })
} */

export function api_getSubFamilias(
  bearer: string,
  id: string,
  page: number,
  searchParams?: {
    searchTerm?: string;
    searchType?: "startsWith" | "contains" | "endsWith" | "exact";
  }
) {
  let url = `subFamilia/${id}?page=${page}`;

  if (searchParams?.searchTerm && searchParams?.searchType) {
    url += `&searchTerm=${encodeURIComponent(
      searchParams.searchTerm
    )}&searchType=${searchParams.searchType}`;
  }

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllSubFamilias(bearer: string) {
  return api.get(`subfamilia`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getSubFamiliaByEmpresa(
  bearer: string,
  empresa: string,
  familiaId: string
) {
  return api.get(`subfamilia?empresa=${empresa}&familia=${familiaId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getOneSubFamilias(
  bearer: string,
  id: string,
  familia: string
) {
  return api.get(`subFamilia/${id}/${familia}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postSubFamilias(bearer: string, data: any) {
  return api.post(`subFamilia`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_putSubFamilias(bearer: string, data: any) {
  return api.put(`subFamilia`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_deleteSubFamilia(bearer: string, id: string) {
  return api.delete(`subFamilia/${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getArticulos(
  bearer: string,
  id: string,
  page: number,
  searchParams?: {
    searchTerm?: string;
    searchType?: "startsWith" | "contains" | "endsWith" | "exact";
  }
) {
  let url = `articulo/${id}?page=${page}`;
  if (searchParams?.searchTerm && searchParams?.searchType) {
    url += `&searchTerm=${encodeURIComponent(
      searchParams.searchTerm
    )}&searchType=${searchParams.searchType}`;
  }
  return api.get(url, { headers: { Authorization: `Bearer ${bearer}` } });
}

export function api_getArticulosBySubfamilia(
  bearer: string,
  empresaId: string,
  familiaId: string,
  subFamiliaId: string
) {
  return api.get(
    `articulo?empresa=${empresaId}&familia=${familiaId}&subFamilia=${subFamiliaId}`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  );
}

export function api_postArticulos(bearer: string, data: any) {
  return api.post(`articulo`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_putArticulos(bearer: string, data: any) {
  return api.put(`articulo`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_deleteArticulo(bearer: string, id: string) {
  return api.delete(`articulo/${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

/* export function api_getFamilias(bearer: string, id: string, page: number) {
  return api.get(`familia/${id}?page=${page}`, { headers: { "Authorization": `Bearer ${bearer}` } })
} */

export function api_getFamilias(
  bearer: string,
  id: string,
  page: number,
  searchParams?: {
    searchTerm?: string;
    searchType?: "startsWith" | "contains" | "endsWith" | "exact";
  }
) {
  let url = `familia/${id}?page=${page}`;

  if (searchParams?.searchTerm && searchParams?.searchType) {
    url += `&searchTerm=${encodeURIComponent(
      searchParams.searchTerm
    )}&searchType=${searchParams.searchType}`;
  }

  return api.get(url, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllFamilias(bearer: string, id: string) {
  return api.get(`familia?id=${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getOneFamilias(
  bearer: string,
  id: string,
  empresa: string
) {
  return api.get(`familia/${id}/${empresa}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_postFamilias(bearer: string, data: any) {
  return api.post(`familia`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_putFamilias(bearer: string, data: any) {
  return api.put(`familia`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_deleteFamilias(bearer: string, id: string) {
  return api.delete(`familia/${id}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getYears(bearer: string) {
  return api.get(`ano`, { headers: { Authorization: `Bearer ${bearer}` } });
}
export function api_getAnoMes(bearer: string) {
  return api.get(`currentDate`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getProgramaByEmpresa(bearer: string, empresa: string) {
  return api.get(`programa/${empresa}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postCotizaciones(bearer: string, data: any) {
  return api.post(`cotizacion`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getOneConOrdenCompra(
  bearer: string,
  empresaId: string,
  numero: number
) {
  return api.get(`ordencompra/${empresaId}/${numero}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getOneSinOrdenCompra(
  bearer: string,
  empresaId: string,
  numero: number
) {
  return api.get(`cotizacion/${empresaId}/${numero}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postRecepcionYDetalle(bearer: string, data: any) {
  return api.post(`recepcion`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllEmpresas(bearer: string) {
  return api.get(`empresas`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllCentroCostoByEmpresa(
  bearer: string,
  empresaId: string
) {
  return api.get(`centrocostos/${empresaId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAllBodegaByEmpresaYCentroCosto(
  bearer: string,
  empresaId: string,
  centroCostoId: string
) {
  return api.get(`bodegas/${empresaId}/${centroCostoId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllAlmacenByEmpByCenByBod(
  bearer: string,
  empresaId: string,
  centroCostoId: string,
  bodegaId: string
) {
  return api.get(`almacenes/${empresaId}/${centroCostoId}/${bodegaId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllAlmacenByEmpByCenByBodPage(
  bearer: string,
  empresaId: string,
  centroCostoId: string,
  bodegaId: string,
  page: number
) {
  return api.get(
    `almacenesp/${empresaId}/${centroCostoId}/${bodegaId}?page=${page}&perPage=10`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  );
}

export function api_getAllAlmacenArticuloByEmpByCenByBodByAlm(
  bearer: string,
  empresaId: string,
  centroCostoId: string,
  bodegaId: string,
  almacenId: string
) {
  return api.get(
    `almacenArticulos/${empresaId}/${centroCostoId}/${bodegaId}/${almacenId}`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  );
}
export function api_getAllAlmacenArticuloByEmpByCenByBodByAlmStock(
  bearer: string,
  empresaId: string,
  centroCostoId: string,
  bodegaId: string,
  almacenId: string
) {
  return api.get(
    `almacenArticulos/stock/${empresaId}/${centroCostoId}/${bodegaId}/${almacenId}`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  );
}
export function api_putAlmacenArticuloStock(data:any,bearer:string) {
  return api.put("almacenArticulos/stock", data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });

}
api_putAlmacenArticuloStock
export function api_getAllArticulosByAlmacen(
  bearer: string,
  almacenId: string
) {
  return api.get(`almacen/${almacenId}/articulos`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllAlmacenArticuloBylocacion(
  bearer: string,
  locacionId: string
) {
  return api.get(`almacenarticulosbylocacionid/${locacionId}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getArticuloEntradaSalida(
  bearer: string,
  almacenId: string,
  fechaDesde: string,
  fechaHasta: string,
  articuloId?: string
) {
  return api.get(
    `articuloentradasalida/${almacenId}/${fechaDesde}/${fechaHasta}/${articuloId}`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  );
}

export function api_getInventario(
  bearer: string,
  nombreEncargado: string,
  fechaInventario: string
) {
  return api.get(`inventario/${nombreEncargado}/${fechaInventario}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getAllMarcas(bearer: string) {
  return api.get(`marcas`, { headers: { Authorization: `Bearer ${bearer}` } });
}
export function api_postMarcas(bearer: string, data: any) {
  return api.post(`marcascambio`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
export function api_getAllInventarioFisicoEstados(bearer: string) {
  return api.get(`inventariofisicoestados`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_postInventarioFisico(bearer: string, data: any) {
  return api.post(`inventariofisico`, data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_getEstadoArticulos(bearer: string) {
  return api.get("almacenarticulosestados", {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}

export function api_putAlmacenArticulo(bearer: string, data: Object) {
  return api.put("almacenarticulo", data, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
}
