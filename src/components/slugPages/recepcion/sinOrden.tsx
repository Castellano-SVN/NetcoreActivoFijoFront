import PDFSinOrden from "@/components/pdf/recepcion/recepcionSinOrden";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect } from "react";
import { Table } from "react-daisyui";
import { FaFilePdf } from "react-icons/fa";
import {
  FormValueRecepcionData,
  FormValueRecepcionSoData,
  ICotizacion,
} from "@/interfaces/creation";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import router from "next/router";
import DatePicker from "react-datepicker";
import { api_postRecepcionYDetalle } from "@/services/bodega.service";
import { toast } from "react-toastify";
import { recepcionCOC } from "../../../interfaces/recepcion.interface";
import UbicacionRecepcion from "./ubicacionRecepcion";
interface props {
  empresa: string;
}
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
export default function SinOrden(props: props) {
  const methods = useForm<recepcionCOC>({
    resolver: zodResolver(RecepcionDataSchema),
    defaultValues: {
      tipo: 1,
      fecha: new Date(),
      fechaDoc: new Date(),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
  } = methods;
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "articulos", // unique name for your Field Array
    }
  );
  return (
    <>
      <FormProvider {...methods}>
        <form>
          <UbicacionRecepcion empresa={props.empresa} filterCC={[]} />
        </form>
      </FormProvider>
    </>
  );
}
