import { z } from "zod";

export interface ItipoAlmacenSchema {
    id?: string;
    Codigo:string;
    Nombre:string;
  }
  export interface ItipoAlmacen {
    id:string,
    codigo:string;
    nombre:string;
  }
export  const TipoAlmacenSchema = z.object({
    Id: z.string({required_error:"Campo requerido"}).optional(),
    Codigo: z.string({required_error:"Campo requerido"}).min(1,{message: "Campo requerido"}).max(10,{message: "Campo con 10 caracteres maximos"}),
    Nombre: z.string({required_error:"Campo requerido"}).min(1,{message: "Campo requerido"}).max(50,{message: "Campo con 50 caracteres maximos"}),
    
  });

  export const RecepcionSchema = z.object({
    CentroCostoId: z.string({required_error:"Campo requerido"}).default(""),
    bodegaId:z.string({required_error:"Campo requerido"}),
    FechaDocumento: z.date({required_error:"Campo requerido"}),
    year: z.number({required_error:"Campo requerido"}),
    TipoDocumento:z.number({required_error:"Campo requerido"}),
  })