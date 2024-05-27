import axios from 'axios';
import Cookies from "js-cookie";
let token = Cookies.get("bearer")
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 404) {
      // Aquí ejecutas la acción de deslogueo
      console.log('Error 404 - Deslogueando...');
    }
    return Promise.reject(error);
  }
);

export function api_getNacionalidades(bearer: string) {
  return api.get(`nacionalidad`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getSexos(bearer: string) {
  return api.get(`sexos`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

export function api_getEstadoCivil(bearer: string) {
  return api.get(`estadocivil`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getNivelEducacional(bearer: string) {
  return api.get(`niveleducacional`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getAreaGeografica(bearer: string) {
  return api.get(`areageografica`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

export function api_getRegiones(bearer: string) {
  return api.get(`Region`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

export function api_getCiudades(bearer: string, region: number) {
  return api.get(`Ciudad/${region}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

export function api_getComuna(bearer: string, region: number, ciudad: number) {
  return api.get(`Comuna/${region}/${ciudad}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getTipoAdministracion(bearer: string) {
  return api.get(`tipoadministracion`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getActividadEconomicaPrincipal(bearer: string) {
  return api.get(`actividadeconomicaprincipal`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getSectorActividadEconomicaPrincipal(bearer: string, actividad: number) {
  return api.get(`sectoractividadeconomica/${actividad}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getTipoEstablecimientoSalud(bearer: string) {
  return api.get(`tipoEstablecimientoSalud`, { headers: { "Authorization": `Bearer ${bearer}` } })
}


export function api_postTipoAlmacen(bearer: string, data: any) {
  return api.post(`tipoalmacen/`, data, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_putTipoAlmacen(bearer: string, data: any) {
  return api.put(`tipoalmacen/`, data, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getTipoAlmacen(bearer: string) {
  return api.get(`tipoalmacen/`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

export function api_postAlmacen(bearer: string, data: any) {
  return api.post(`almacen/`, data, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getAno(bearer: string) {
  return api.get(`ano/`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
export function api_getTipoUnidad(bearer: string) {
  return api.get(`tipoUnidad/`, { headers: { "Authorization": `Bearer ${bearer}` } })
}
