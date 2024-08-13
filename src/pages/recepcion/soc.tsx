import { z } from "zod";
import SinOrden from "../../components/slugPages/recepcion/sinOrden";
import UbicacionRecepcion from "../../components/slugPages/recepcion/ubicacionRecepcion";
import { useSearchParams } from "next/navigation";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { recepcionCOC } from "../../interfaces/recepcion.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
const ArticulosSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  nombre: z.string(),
  cantidad: z.number(),
  precio: z.number(),
  observacion: z.string(),
  recepcionado: z.number(),
  porRecepcionar: z.number(),
  recibida: z.number(),
  descripcion: z.string().optional(),
});

const RecepcionDataSchema = z.object({
  cotizacion: z.string(),
  oc: z.number({ required_error: "Campo requerido" }),
  folio: z.number({ required_error: "Campo requerido" }),
  fecha: z.date({ required_error: "Campo requerido" }),
  empresa: z.string(),
  cc: z
    .string({ required_error: "Campo requerido" })
    .min(1, { message: "Campo requerido" }),
  bodega: z
    .string({ required_error: "Campo requerido" })
    .min(1, { message: "Campo requerido" }),
  almacen: z
    .string({ required_error: "Campo requerido" })
    .min(1, { message: "Campo requerido" }),
  numDoc: z.number({ required_error: "Campo requerido" }),
  fechaDoc: z.date({ required_error: "Campo requerido" }),
  tipo: z.number({ required_error: "Campo requerido" }),
  descripcion: z.string({ required_error: "Campo requerido" }).optional(),
  articulos: z.array(ArticulosSchema),
});

export default function soc() {
  const searchParams = useSearchParams();
  const search = searchParams.get("empresa");
  const idEmpresa = search; // Convertir a cadena
	if (!idEmpresa) return;
  return <SinOrden empresa={idEmpresa}/>
}
