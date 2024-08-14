import PDFSinOrden from "@/components/pdf/recepcion/recepcionSinOrden";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Table } from "react-daisyui";
import { FaFilePdf } from "react-icons/fa";
import {
  FormValueRecepcionData,
  FormValueRecepcionSoData,
  ICotizacion,
  IFamilia,
} from "@/interfaces/creation";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import router from "next/router";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  api_getAllFamilias,
  api_postRecepcionYDetalle,
} from "@/services/bodega.service";
import { toast } from "react-toastify";
import {
  recepcionCOC,
  ubicacionRecepcionI,
} from "../../../interfaces/recepcion.interface";
import UbicacionRecepcion from "./ubicacionRecepcion";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import Select from 'react-select';

registerLocale("es", es);

interface familiaI {
    nombre: string;
    id: string;
}

interface props {
  empresa: string;
}
interface propsArticulo extends props {
    familia: familiaI[]
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

  const [tab, setTab] = useState<number>(0);
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

  const { jwt } = useUserStore();

  const [dataFamilia, setDataFamilia] = useState<familiaI[]>([]);
  const getFamilias = async () => {
    try {
      const data = await api_getAllFamilias(jwt, props.empresa);
      setDataFamilia(data.data.dataList); //variable datos y luego el datalist
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFamilias();
  }, []);



  return (
    <>
      <FormProvider {...methods}>
        <form className="">
          <div className="w-8/12 m-auto p- flex flex-col">
            <div className=" shadow  flex flex-row justify-around rounded p-1">
              <a
                onClick={() => {
                  setTab(0);
                }}
                className={`${
                  tab == 0 && "border-b-2 border-primary font-bold"
                } w-full mr-1 hover:font-bold hover:cursor-pointer`}
              >
                Artículos
              </a>
              <a
                onClick={() => {
                  setTab(1);
                }}
                className={`${
                  tab == 1 && "border-b-2 border-primary font-bold"
                } w-full mr-1 hover:font-bold hover:cursor-pointer`}
              >
                Recepcion
              </a>
              <a
                onClick={() => {
                  setTab(2);
                }}
                className={`${
                  tab == 2 && "border-b-2 border-primary font-bold"
                } w-full mr-1 hover:font-bold hover:cursor-pointer`}
              >
                Resumen
              </a>
            </div>
          </div>
          {tab == 0 && <Articulos empresa={props.empresa} familia={dataFamilia}/>}
          <div className="w-8/12 m-auto p- flex flex-col">
            {tab == 1 && <Recepcion empresa={props.empresa}  />}
          </div>
          {tab == 2 && <Recepcion empresa={props.empresa} />}
        </form>
      </FormProvider>
    </>
  );
}

function Recepcion(props: props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
    watch,
  } = useFormContext<recepcionCOC>();
  return (
    <div className="">
      <div className="flex flex-col md:flex-row lg:flex-row justify-between shadow-md bordered p-4 my-2 rounded transition duration-300 transform hover:scale-105">
        <div className="w-full md:mr-2 lg:mr-2">
          <label className="block text-left mb-2" htmlFor="Folio Recepcion">
            Folio Recepción:
          </label>
          <input
            type="number"
            {...register("folio", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors.folio && (
            <span className="text-red-600">{errors.folio.message}</span>
          )}
        </div>
        <div className="w-full">
          <div className="flex flex-col">
            <label className="block text-left mb-2">Fecha:</label>

            <Controller
              control={control}
              name="fecha"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  onBlur={field.onBlur}
                  className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-100"
                  dropdownMode="select"
                  yearDropdownItemNumber={15}
                  peekNextMonth
                  showYearDropdown
                  showMonthDropdown
                  dateFormat={"dd/MM/yyyy"}
                  locale="es"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 mx-auto">
        <fieldset className="border shadow-md p-4 rounded transition duration-300 transform hover:scale-105">
          <legend>Ubicacion</legend>
          <UbicacionRecepcion empresa={props.empresa} filterCC={[]} />
        </fieldset>
      </div>

      <div className="mt-2 mx-auto">
        <fieldset className="border shadow-md p-4 rounded transition duration-300 transform hover:scale-105">
          <legend>Documento</legend>
          <div className="flex flex-col md:flex-row lg:flex-row justify-between">
            <div className="w-full md:mr-2 lg:mr-2">
              <label
                className="block text-left mb-2"
                htmlFor="Numero Documento"
              >
                Numero de documento:
              </label>
              <input
                type="number"
                {...register("numDoc", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.numDoc && (
                <span className="text-red-600">{errors.numDoc.message}</span>
              )}
            </div>
            <div className="w-full">
              <div className="flex flex-col">
                <label className="block text-left mb-2">
                  Fecha de documento:
                </label>
                <Controller
                  control={control}
                  name="fechaDoc"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      onBlur={field.onBlur}
                      className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-100"
                      dropdownMode="select"
                      yearDropdownItemNumber={15}
                      peekNextMonth
                      showYearDropdown
                      showMonthDropdown
                      dateFormat={"dd/MM/yyyy"}
                      locale="es"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mt-2 mx-auto">
        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105">
          <legend>Tipo de documento</legend>
          <div className="flex justify-center">
            <label className="mr-4">
              <input
                type="radio"
                value={1}
                {...register("tipo", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                className="radio radio-xs radio-primary ml-2 mr-2"
              />
              Factura
            </label>

            <label>
              <input
                type="radio"
                value={2}
                {...register("tipo", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                className="radio radio-xs radio-primary ml-2 mr-2"
              />
              Guia de despacho
            </label>
          </div>
        </fieldset>
      </div>

      <div className="mt-2 mx-auto">
        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105">
          <legend>Articulos</legend>
          <div className="flex justify-center"></div>
        </fieldset>
      </div>
    </div>
  );
}

function Articulos(props: propsArticulo) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
    watch,
  } = useFormContext<recepcionCOC>();
  return (
    <>
      <div className=" grid grid-cols-2 gap-8 p-2">
        { props.familia.length !== 0 && <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105">
          <legend>Busqueda de articulos</legend>
          <Select getOptionValue={(option) => option.id} options={props.familia} getOptionLabel={(option) => option.nombre} menuPortalTarget={document.body} /> 
        </fieldset>}
        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105">
          <legend>Articulos seleccionados</legend>
        </fieldset>
      </div>
      <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105">
        <legend>Articulos encontrados</legend>
      </fieldset>
    </>
  );
}
