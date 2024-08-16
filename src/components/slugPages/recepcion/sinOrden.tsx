import PDFSinOrden from "@/components/pdf/recepcion/recepcionSinOrden";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Table } from "react-daisyui";
import { FaFilePdf, FaSearch } from "react-icons/fa";
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
  FieldArrayWithId,
  FormProvider,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useForm,
  useFormContext,
} from "react-hook-form";
import router from "next/router";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  api_getAllFamilias,
  api_getArticulosBySubfamilia,
  api_getSubFamiliaByEmpresa,
  api_postRecepcionYDetalle,
} from "@/services/bodega.service";
import { toast } from "react-toastify";
import {
  articulosI,
  articulosSOC,
  recepcionCOC,
  recepcionSOC,
  ubicacionRecepcionI,
} from "../../../interfaces/recepcion.interface";
import UbicacionRecepcion from "./ubicacionRecepcion";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import Select from "react-select";
import { api_getArticulos } from "../../../services/ingreso.service";
import { FaPlus } from "react-icons/fa";
import WarningAlert from "@/components/alerts/warningAlert";
import { HiCheck, HiOutlineX, HiX } from "react-icons/hi";

registerLocale("es", es);

interface familiaI {
  nombre: string;
  id: string;
  descripcion?: string;
  action: string;
}

interface props {
  empresa: string;
  list: FieldArrayWithId<recepcionSOC, "articulos", "id">[];
}
interface propsArticulo extends props {
  familia: familiaI[];
  subFamilias: familiaI[];
  setSubfamilias: React.Dispatch<React.SetStateAction<familiaI[]>>;
  article: articulosSOC[];
  setArticle: React.Dispatch<React.SetStateAction<articulosSOC[]>>;
  selectedFamilia: familiaI | null;
  setSelectedFamilia: React.Dispatch<React.SetStateAction<familiaI | null>>;

  selectedSubFamilia: familiaI | null;
  setSelectedSubFamilia: React.Dispatch<React.SetStateAction<familiaI | null>>;

  textArticle: string;
  setTextArticle: React.Dispatch<React.SetStateAction<string>>;
  append: UseFieldArrayAppend<recepcionSOC, "articulos">
  list: FieldArrayWithId<recepcionSOC, "articulos", "id">[]
  remove: UseFieldArrayRemove;
  search: () => Promise<void>;
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
  const methods = useForm<recepcionSOC>({
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
      keyName: 'code'
    }
  );

  const { jwt } = useUserStore();

  const [dataFamilia, setDataFamilia] = useState<familiaI[]>([]);
  const [dataSubFamilia, setDataSubFamilia] = useState<familiaI[]>([]);
  const [selectedFamilia, setSelectedFamilia] = useState<familiaI | null>(null);
  const [selectedSubFamilia, setSelectedSubFamilia] = useState<familiaI | null>(
    null
  );

  const [textArticle, setTextArticle] = useState<string>("");
  const getFamilias = async () => {
    try {
      const data = await api_getAllFamilias(jwt, props.empresa);
      setDataFamilia(data.data.dataList); //variable datos y luego el datalist
    } catch (error) {
      console.log(error);
    }
  };

  const getSubFamilias = async () => {
    try {
      if (selectedFamilia) {
        setDataSubFamilia([]);
        const data = await api_getSubFamiliaByEmpresa(
          jwt,
          props.empresa,
          selectedFamilia.id
        );
        setDataSubFamilia(data.data.dataList); //variable datos y luego el datalist
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedSubFamilia(null);
    getSubFamilias();
  }, [selectedFamilia]);

  useEffect(() => {
    getFamilias();
  }, []);

  const [selectedArticles, setSelectedArticles] = useState([]);
  const [dataArticulo, setDataArticulo] = useState<articulosSOC[]>([]);
  const ArticleSearch = async () => {
    try {
      const res = await api_getArticulos(
        jwt,
        props.empresa,
        selectedFamilia?.id,
        selectedSubFamilia?.id,
        textArticle
      );
      const resulset = res.data.dataList.map((item: { id: string; }) => {
        const exists = fields.some(articulo => articulo.id.toString() === item.id.toString());
        return {
          ...item,
          action: exists ? "success" : "stand"
        };
      });
      setDataArticulo(resulset)
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>

      <div className="w-11/12 md:w-11/12 md:w-8/12  m-auto p- flex flex-col">
        <div className=" shadow  flex flex-row justify-around rounded p-1">
          <a
            onClick={() => {
              setTab(0);
            }}
            className={`${tab == 0 && "border-b-2 border-primary font-bold"
              } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Artículos
          </a>
          <a
            onClick={() => {
              setTab(1);
            }}
            className={`${tab == 1 && "border-b-2 border-primary font-bold"
              } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Recepción
          </a>
          <a
            onClick={() => {
              setTab(2);
            }}
            className={`${tab == 2 && "border-b-2 border-primary font-bold"
              } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Resumen
          </a>
        </div>
      </div>
      {tab == 0 && (
        <Articulos
          empresa={props.empresa}
          familia={dataFamilia}
          setArticle={setDataArticulo}
          setSubfamilias={setDataSubFamilia}
          subFamilias={dataSubFamilia}
          selectedFamilia={selectedFamilia}
          setSelectedFamilia={setSelectedFamilia}
          selectedSubFamilia={selectedSubFamilia}
          setSelectedSubFamilia={setSelectedSubFamilia}
          setTextArticle={setTextArticle}
          textArticle={textArticle}
          search={ArticleSearch}
          article={dataArticulo}
          append={append}
          list={fields}
          remove={remove}
        />
      )}
      <div className="w-11/12 md:w-8/12  m-auto p- flex flex-col">
        {tab == 1 && (
          <FormProvider {...methods}>
            <form className="">
              <Recepcion empresa={props.empresa} list={fields}/>
            </form>
          </FormProvider>
        )}
      </div>
      {tab == 2 && (
        'hola mundo'
      )}
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
          <legend>Articulos Seleccionados</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.list.map((article, index) => (
              <div key={index} className="flex flex-row items-center p-2 border-b border-gray-200">
                <div className="w-3/4">
                  <span className="font-bold">{article.nombre}</span>
                  <span className="text-sm ml-3">{article.descripcion}</span>
                </div>
                <div className="w-1/4">
                  <input
                    type="number"
                    className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Cantidad recibida"
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}

function Articulos(props: propsArticulo) {

  const { jwt } = useUserStore();
  const updateArticle = (index: number, article: articulosSOC) => {
    props.setArticle(prevState => {
      const updatedArticles = [...prevState];
      updatedArticles[index] = { ...updatedArticles[index], action: "loading" };
      return updatedArticles;
    });

    props.append(article);
    props.setArticle(prevState => {
      const updatedArticles = [...prevState];
      updatedArticles[index] = { ...updatedArticles[index], action: "success" };
      return updatedArticles;
    });
  }

  const deleteField = (index: number, article: articulosSOC) => {
    const inList = props.article.findIndex(e => e.id == article.id);
    if (inList !== -1) {
      props.setArticle(prevState => {
        const updatedArticles = [...prevState];
        updatedArticles[inList] = { ...updatedArticles[inList], action: "stand" };
        return updatedArticles;
      });
    }
    props.remove(index)
  }


  const handleClickRecepcion = () => {
    console.log(props.list);
  };

  return (
    <>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
        {props.familia.length !== 0 && (
          <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105 ">
            <legend>Busqueda de articulos</legend>
            <Select
              placeholder="Seleccione Familia"
              value={props.selectedFamilia}
              className="px-0 md:px-8"
              onChange={(option) => props.setSelectedFamilia(option)}
              getOptionValue={(option) => option.id}
              options={props.familia}
              getOptionLabel={(option) => option.nombre}
              menuPortalTarget={document.body}
              isClearable
            />
            <Select
              className="mt-2 px-0 md:px-8 "
              placeholder="Seleccione SubFamilia "
              options={props.subFamilias}
              onChange={(option) => props.setSelectedSubFamilia(option)}
              value={props.selectedSubFamilia}
              loadingMessage={() => "Cargando opciones..."}
              isLoading={props.subFamilias.length === 0}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.nombre}
              menuPortalTarget={document.body}
              isClearable
            />
            <div className="w-full px-0 md:px-8 mt-2">
              <label className="border inline-flex w-full rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary items-center">
                <span className="whitespace-normal md:whitespace-nowrap px-3  border-r-2 select-none">
                  Nombre articulo
                </span>
                <input
                  value={props.textArticle}
                  onChange={(ev) => props.setTextArticle(ev.target.value)}
                  className="mt-1 h-full block w-full  md:py-2 lg:py-2 pl-3 bg-white   focus:outline-none sm:text-sm"
                />
              </label>
            </div>

            <div className="w-full flex flex-row justify-center md:justify-end px-0 md:px-8 mt-2">
              <a
                onClick={props.search}
                className="border-4 border-primary p-1 px-4 rounded-md shadow-sm cursor-pointer hover:bg-primary hover:brightness-90 transition duration-300 ease-in-out hover:text-white active:scale-110"
              >
                <span className="font-bold select-none">
                  <FaSearch />
                </span>
              </a>
            </div>
          </fieldset>
        )}
        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform">
          <legend>Artículos seleccionados</legend>
          <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-1">
            {props.list.map((articulo, index) => (
              <div className="pl-2 m-1 border-2 rounded flex justify-between items-center hover:border-primary hover:border-2" key={index}>
                <div className="w-4/5 flex flex-col text-start">
                  <label className=" select-none"><span className="font-semibold">{articulo.nombre}</span></label>
                </div>
                <div className="w-1/5 border-l border-gray-300 h-full flex justify-center items-center">
                  <button disabled={articulo.action == "loading"} onClick={() => deleteField(index, articulo)} type="button" className="flex items-center justify-center h-full w-full text-primary hover:text-error">
                    {articulo.action == "stand" && <HiX className="h-6 w-6 focus:scale-115 " />}
                  </button>

                </div>
              </div>
            ))}
          </div>
          {props.list.length !== 0 && (
            <>
              <div className="flex flex-row justify-end">
                <button className="btn btn-outline btn-primary" onClick={() => handleClickRecepcion()}>Recepcionar Articulos</button>
              </div>
            </>
          )}
        </fieldset>
      </div>
      <fieldset className="border shadow-md rounded-lg p-6 md:m-10 m-0">
        <legend>Artículos encontrados</legend>
        {props.article.length !== 0 ? (
          <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-2">
            {props.article.map((articulo, index) => (
              <div className="pl-2 border-2 rounded flex justify-between items-center hover:border-primary hover:border-2" key={index}>
                <div className="w-4/5 flex flex-col text-start">
                  <label className=" select-none"><span className="font-semibold">Nombre</span>: {articulo.nombre}</label>
                  <label className="select-none"><span className="font-semibold">Descripcion</span>: {articulo.descripcion}</label>
                </div>
                <div className="w-1/5 border-l border-gray-300 h-full flex justify-center items-center">
                  <button disabled={articulo.action != "stand"} onClick={() => updateArticle(index, articulo)} type="button" className="flex items-center justify-center h-full w-full text-primary hover:text-success">
                    {articulo.action == "stand" && <FaPlus className="h-6 w-6 focus:scale-115" />}
                    {articulo.action == "success" && <HiCheck className="h-6 w-6 focus:scale-115" />}
                  </button>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <WarningAlert message="No se ha encontrado ningun artículo" />
        )}
      </fieldset>
    </>
  );
}
