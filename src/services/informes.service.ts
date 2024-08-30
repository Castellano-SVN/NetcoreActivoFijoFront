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

export function api_getinformeArticulo(bearer: string, empresa:string,almacen:string,fechaDesde:string,fechaHasta:string,articulo?:string) {
    let query = `empresa=${empresa}`
    query = query + `&almacen=${almacen}`
    query = query + `&fecha_desde=${fechaDesde}`
    query = query + `&fecha_hasta=${fechaHasta}`
    if (articulo) query = query + `&articulo=${articulo}`
    return api.get(`informe/movimientos/busqueda?${query}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}


export function api_getinformeInput(bearer: string, empresa:string,almacen:string,fechaDesde:string,fechaHasta:string,articulo:string) {
    let query = `empresa=${empresa}`
    query = query + `&almacen=${almacen}`
    query = query + `&fecha_desde=${fechaDesde}`
    query = query + `&fecha_hasta=${fechaHasta}`
    query = query + `&articulo=${articulo}`
    return api.get(`informe/movimientos/entradas?${query}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}

export function api_getinformeOutput(bearer: string, empresa:string,almacen:string,fechaDesde:string,fechaHasta:string,articulo:string) {
  let query = `empresa=${empresa}`
  query = query + `&almacen=${almacen}`
  query = query + `&fecha_desde=${fechaDesde}`
  query = query + `&fecha_hasta=${fechaHasta}`
  query = query + `&articulo=${articulo}`
  return api.get(`informe/movimientos/salidas?${query}`, { headers: { "Authorization": `Bearer ${bearer}` } })
}