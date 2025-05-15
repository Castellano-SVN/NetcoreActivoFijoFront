"use client";

import type React from "react";

import PDFSinOrden from "@/components/pdf/recepcion/recepcionSinOrden";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Button, Modal, Table } from "react-daisyui";
import { FaFilePdf, FaSearch } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Controller,
  type FieldArrayWithId,
  FormProvider,
  useFieldArray,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  useForm,
  useFormContext,
} from "react-hook-form";
import router from "next/router";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAllFamilias,
  api_getSubFamiliaByEmpresa,
} from "@/services/bodega.service";
import { toast } from "react-toastify";
import type {
  articulosSOC,
  recepcionSOC,
} from "../../../interfaces/recepcion.interface";
import UbicacionRecepcion from "./ubicacionRecepcion";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import Select from "react-select";
import {
  api_getArticulos,
  api_postRecepcionSo,
  api_tipoDocumentoRecepcion,
} from "../../../services/ingreso.service";
import { FaPlus } from "react-icons/fa";
import WarningAlert from "@/components/alerts/warningAlert";
import { HiCheck, HiX } from "react-icons/hi";

registerLocale("es", es);

interface familiaI {
  nombre: string;
  id: string;
  descripcion?: string;
  action: string;
}

interface props {
  empresa: string;
}
interface recepcionProps extends props {
  tipos: { codigo: number; nombre: string }[];
  setLocationString: Dispatch<
    SetStateAction<{ centrocosto?: string; bodega?: string; almacen?: string }>
  >;
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
  append: UseFieldArrayAppend<recepcionSOC, "articulos">;
  list: FieldArrayWithId<recepcionSOC, "articulos", "id">[];
  remove: UseFieldArrayRemove;
  search: (page?: number) => Promise<void>;
  paginationInfo: PaginationInfo;
  setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

const ArticulosSchema = z.object({
  id: z.string(),
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  valor: z.number().optional(),
  cantidadAlmacen: z.number().optional(),
  cantidad: z.number().min(0, { message: "Es necesario al menos 1 unidad" }),
});

const RecepcionDataSchema = z.object({
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
      tipo: 2,
      fecha: new Date(),
      fechaDoc: new Date(),
      empresa: props.empresa,
    },
  });
  const [locationString, setLocationString] = useState<{
    centrocosto?: string;
    bodega?: string;
    almacen?: string;
  }>({});
  const [locationStringPDF, setLocationStringPDF] = useState<{
    centrocosto?: string;
    bodega?: string;
    almacen?: string;
  }>({});

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
      keyName: "code",
    }
  );
  const [tipos, setTipos] = useState<{ codigo: number; nombre: string }[]>([]);

  const { jwt } = useUserStore();

  const [dataFamilia, setDataFamilia] = useState<familiaI[]>([]);
  const [dataSubFamilia, setDataSubFamilia] = useState<familiaI[]>([]);
  const [selectedFamilia, setSelectedFamilia] = useState<familiaI | null>(null);
  const [selectedSubFamilia, setSelectedSubFamilia] = useState<familiaI | null>(
    null
  );

  const [textArticle, setTextArticle] = useState<string>("");
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });

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
    if (selectedFamilia) {
      setSelectedSubFamilia(null);
      getSubFamilias();
    }
  }, [selectedFamilia]);

  const getTipos = async () => {
    const fetch = await api_tipoDocumentoRecepcion(jwt);
    setTipos(fetch.data.dataList);
  };

  useEffect(() => {
    getFamilias();
    getTipos();
  }, []);

  useEffect(() => {
    console.log(errors);
    console.log(getValues());
  }, [errors]);

  const [selectedArticles, setSelectedArticles] = useState([]);
  const [dataArticulo, setDataArticulo] = useState<articulosSOC[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const ArticleSearch = async (page = 1) => {
    setIsLoading(true);

    // Ahora todos los filtros son opcionales
    try {
      const res = await api_getArticulos(
        jwt,
        props.empresa,
        selectedFamilia?.id,
        selectedSubFamilia?.id,
        textArticle,
        page,
        paginationInfo.perPage
      );

      const resulset = res.data.dataList.map((item: { id: string }) => {
        const exists = fields.some(
          (articulo) => articulo.id.toString() === item.id.toString()
        );
        return {
          ...item,
          action: exists ? "success" : "stand",
        };
      });

      setDataArticulo(resulset);

      setPaginationInfo({
        currentPage: page, // <-- Asegurar que viene del backend
        totalPages: res.data.pages,
        totalItems: res.data.total,
        perPage: paginationInfo.perPage,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error al buscar artículos");
    } finally {
      setIsLoading(false);
    }
  };

  const [showPdf, setShowPdf] = useState(false);
  const [pdfData, setPdfData] = useState<recepcionSOC>({} as recepcionSOC);
  const onSubmit = async (data: recepcionSOC) => {
    console.log(data);
    try {
      const response = await api_postRecepcionSo(jwt, data);
      if (response) {
        setLocationStringPDF(locationString);
        toast.success("Recepción Sin orden de compra creada correctamente");
        setShowPdf(true);
        console.log("esta es la data que se guarda en el pdf", data);
        setPdfData(data);
        reset();
      } else {
        toast.error("ha ocurrido un error en generar la Salida");
        setShowPdf(false);
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        setShowPdf(false);
      } else {
        toast.error("Ha ocurrido un error inesperado");
        setShowPdf(false);
      }
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
            className={`${
              tab == 0 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Paso 1: Seleccionar Artículos
          </a>
          <a
            onClick={() => {
              setTab(1);
            }}
            className={`${
              tab == 1 && "border-b-2 border-primary font-bold"
            } w-full mr-1 hover:font-bold hover:cursor-pointer`}
          >
            Paso 2: Ver Detalle Recepción
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
          paginationInfo={paginationInfo}
          setPaginationInfo={setPaginationInfo}
        />
      )}
      <div className="w-11/12 md:w-8/12  m-auto p- flex flex-col">
        {tab == 1 && (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Recepcion
                empresa={props.empresa}
                tipos={tipos}
                setLocationString={setLocationString}
              />
              {showPdf && pdfData && (
                <Modal open={showPdf}>
                  <Modal.Header>
                    ¿Desea crear un reporte de la Recepción?
                  </Modal.Header>
                  <Modal.Body>
                    <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                      <div className="col-span-2">
                        <PDFDownloadLink
                          document={
                            <PDFSinOrden
                              data={pdfData}
                              location={locationStringPDF}
                            />
                          }
                          fileName={`Recepcion_SOC_Numero_pdf`}
                        >
                          {({ loading, url, error, blob }) =>
                            loading ? (
                              "Cargando.."
                            ) : (
                              <button
                                type="button"
                                className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"
                              >
                                <FaFilePdf />
                                Exportar
                              </button>
                            )
                          }
                        </PDFDownloadLink>
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          className="btn btn-outline btn-secondary w-1/2 mt-2"
                          onClick={() => router.reload()}
                        >
                          salir
                        </Button>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              )}
              <button
                type="submit"
                className="btn btn-outline btn-primary md:my-0 lg:my-0 md:mx-2 lg:mx-2 inline-block"
              >
                Guardar
              </button>
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
}

function Recepcion(props: recepcionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
    watch,
  } = useFormContext<recepcionSOC>();
  const { jwt } = useUserStore();
  const [loadingAlmacenCantidad, setLoadingAlmacenCantidad] =
    useState<boolean>(false);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "articulos", // unique name for your Field Array
      keyName: "code",
    }
  );
  const almacenWatch = watch("almacen");
  const tipoWatch = watch("tipo");
  const getAlmacenArticulo = async () => {
    setLoadingAlmacenCantidad(true);
    const data = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(
      jwt,
      props.empresa,
      getValues("cc"),
      getValues("bodega"),
      getValues("almacen")
    );
    const commonItems = fields.map((item1) => {
      // Encuentra el elemento en dataList que tenga un ID coincidente
      const matchingItem2 = data.data.dataList.find(
        (item2: { articuloId: string; cantidad: number; almacenId: string }) =>
          item2.articuloId === item1.id &&
          item2.almacenId === getValues("almacen")
      );

      // Si hay una coincidencia, agrega la propiedad cantidadAlmacen; de lo contrario, deja el objeto sin cambios
      return {
        ...item1,
        cantidadAlmacen: matchingItem2 ? matchingItem2.cantidad : 0,
      };
    });
    remove();
    append(commonItems);
    setLoadingAlmacenCantidad(false);
  };
  useEffect(() => {
    if (fields.length !== 0 && almacenWatch) {
      getAlmacenArticulo();
    }
  }, [fields.length, almacenWatch]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo dígitos del 0 al 9
    if (/^\d*$/.test(value)) {
      e.target.value = value;
    } else {
      e.target.value = e.target.value.replace(/[^\d]/g, ""); // Elimina caracteres no numéricos
    }
  };

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
            <label className="block text-left mb-2">Fecha Recepción:</label>

            <Controller
              control={control}
              name="fecha"
              render={({ field }) => (
                <DatePicker
                  portalId="root-portal"
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
          <legend>Ubicación</legend>
          <UbicacionRecepcion
            empresa={props.empresa}
            filterCC={[]}
            dispatchStrings={props.setLocationString}
          />
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
                Número de documento:
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
                      portalId="root-portal"
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
        <fieldset className="border shadow-md rounded-lg py-2 transition duration-300 transform hover:scale-105">
          <legend>Tipo de documento</legend>
          <div className="flex justify-center">
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <>
                  {props.tipos.map((tipo, index) => (
                    <label key={tipo.codigo} className="mr-4">
                      <br />
                      <input
                        {...field}
                        type="radio"
                        value={tipo.codigo}
                        className="radio radio-xs radio-primary ml-2 mr-2"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      {tipo.nombre}
                    </label>
                  ))}
                </>
              )}
            />
          </div>
        </fieldset>
      </div>

      <div className="overflow-x-auto mt-2 mx-auto p-6">
        <fieldset className="border-t rounded-lg transition duration-300 transform">
          <legend>Artículos</legend>
          <div className=" ">
            <Table className="border shadow-lg my-5 overflow-x-auto">
              <Table.Head className="bg-primary text-white">
                <span>Código</span>
                <span>Nombre</span>
                <div className="flex justify-center">
                  <span className="">Cantidad en almacén</span>
                </div>
                <span>Precio</span>
                <span>Cantidad a recepcionar</span>
              </Table.Head>

              <Table.Body>
                {fields
                  .sort((a, b) => {
                    if (Number(a.codigo) < Number(b.codigo)) return -1;
                    if (Number(a.codigo) > Number(b.codigo)) return 1;
                    return 0;
                  })
                  .map((articulo, index) => (
                    <Table.Row key={index} hover={true}>
                      <span>{articulo.codigo}</span>
                      <span>{articulo.nombre}</span>
                      <div className="flex justify-center">
                        <span className="font-bold">
                          {!loadingAlmacenCantidad ? (
                            articulo.cantidadAlmacen
                          ) : (
                            <span className="loading loading-spinner loading-md text-primary"></span>
                          )}
                        </span>
                      </div>
                      <span className="font-semibold">{articulo.valor}</span>

                      <input
                        key={articulo.id}
                        onInput={handleInput}
                        className={`block w-20 py-1 px-1 border ${
                          errors.articulos && errors.articulos[index]?.cantidad
                            ? "border-red-600"
                            : "border-primary"
                        } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                        {...register(`articulos.${index}.cantidad`, {
                          setValueAs: (value) =>
                            value === "" ? undefined : Number(value),
                        })}
                      />
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

function Articulos(props: propsArticulo) {
  const { jwt } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateArticle = (index: number, article: articulosSOC) => {
    props.setArticle((prevState) => {
      const updatedArticles = [...prevState];
      updatedArticles[index] = { ...updatedArticles[index], action: "loading" };
      return updatedArticles;
    });
    article.cantidadAlmacen = 0;
    props.append(article);
    props.setArticle((prevState) => {
      const updatedArticles = [...prevState];
      updatedArticles[index] = { ...updatedArticles[index], action: "success" };
      return updatedArticles;
    });
  };

  const deleteField = (index: number, article: articulosSOC) => {
    const inList = props.article.findIndex((e) => e.id == article.id);
    if (inList !== -1) {
      props.setArticle((prevState) => {
        const updatedArticles = [...prevState];
        updatedArticles[inList] = {
          ...updatedArticles[inList],
          action: "stand",
        };
        return updatedArticles;
      });
    }
    props.remove(index);
  };

  const handlePageChange = (page: number) => {
    // si pides menos de 1 o más que el total, aborta
    if (page < 1 || page > props.paginationInfo.totalPages) return;

    props.setPaginationInfo((prev) => ({ ...prev, currentPage: page }));
    props.search(page);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105 ">
          <legend>Búsqueda de artículos</legend>
          <Select
            placeholder="Seleccione Familia (opcional)"
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
            placeholder="Seleccione SubFamilia (opcional)"
            options={props.subFamilias}
            onChange={(option) => props.setSelectedSubFamilia(option)}
            value={props.selectedSubFamilia}
            loadingMessage={() => "Cargando opciones..."}
            isLoading={props.subFamilias.length === 0}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.nombre}
            menuPortalTarget={document.body}
            isClearable
            isDisabled={!props.selectedFamilia}
          />
          <div className="w-full px-0 md:px-8 mt-2">
            <label className="border inline-flex w-full rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary items-center">
              <span className="whitespace-normal md:whitespace-nowrap px-3 border-r-2 select-none">
                Nombre o Código del artículo (opcional)
              </span>
              <input
                value={props.textArticle}
                onChange={(ev) => props.setTextArticle(ev.target.value)}
                className="mt-1 h-full block w-full md:py-2 lg:py-2 pl-3 bg-white focus:outline-none sm:text-sm"
              />
            </label>
          </div>

          <div className="w-full flex flex-row justify-center md:justify-end px-0 md:px-8 mt-2">
            <a
              onClick={() => props.search(1)}
              className="border-4 border-primary p-1 px-4 rounded-md shadow-sm cursor-pointer hover:bg-primary hover:brightness-90 transition duration-300 ease-in-out hover:text-white active:scale-110"
            >
              <span className="font-bold select-none">
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FaSearch />
                )}
              </span>
            </a>
          </div>
        </fieldset>
        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform">
          <legend>Artículos seleccionados</legend>
          <div className="grid grid-flow-row-dense ggrid-cols-1 md:grid-cols-3 grid-rows-3 gap-1">
            {props.list.map((articulo, index) => (
              <div
                className="pl-2 m-1 border-2 rounded flex justify-between items-center hover:border-primary hover:border-2"
                key={index}
              >
                <div className="w-4/5 flex flex-col text-start">
                  <label className=" select-none">
                    <span className="font-semibold">{articulo.nombre}</span>
                  </label>
                </div>
                <div className="w-1/5 border-l border-gray-300 h-full flex justify-center items-center">
                  <button
                    disabled={articulo.action == "loading"}
                    onClick={() => deleteField(index, articulo)}
                    type="button"
                    className="flex items-center justify-center h-full w-full text-primary hover:text-error"
                  >
                    {articulo.action == "stand" && (
                      <HiX className="h-6 w-6 focus:scale-115 " />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      <fieldset className="border shadow-md rounded-lg p-6 md:m-10 m-0">
        <legend>Artículos encontrados</legend>
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : props.article.length !== 0 ? (
          <>
            <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 grid-rows-3 gap-2">
              {props.article.map((articulo, index) => (
                <div
                  className="pl-2 border-2 rounded flex justify-between items-center hover:border-primary hover:border-2"
                  key={index}
                >
                  <div className="w-4/5 flex flex-col text-start">
                    <label className=" select-none">
                      <span className="font-semibold">Nombre</span>:{" "}
                      {articulo.nombre}
                    </label>
                    <label className="select-none">
                      <span className="font-semibold">Código</span>:{" "}
                      {articulo.codigo}
                    </label>
                    <label className="select-none">
                      <span className="font-semibold">Descripción</span>:{" "}
                      {articulo.descripcion}
                    </label>
                  </div>
                  <div className="w-1/5 border-l border-gray-300 h-full flex justify-center items-center">
                    <button
                      disabled={articulo.action != "stand"}
                      onClick={() => updateArticle(index, articulo)}
                      type="button"
                      className="flex items-center justify-center h-full w-full text-primary hover:text-success"
                    >
                      {articulo.action == "stand" && (
                        <FaPlus className="h-6 w-6 focus:scale-115" />
                      )}
                      {articulo.action == "success" && (
                        <HiCheck className="h-6 w-6 focus:scale-115" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Componente de paginación */}
            <div className="flex justify-center mt-6">
              <div className="btn-group">
                <button
                  className="btn btn-outline btn-sm btn-primary"
                  onClick={() =>
                    handlePageChange(props.paginationInfo.currentPage - 1)
                  }
                  disabled={props.paginationInfo.currentPage <= 1}
                >
                  «
                </button>
                <button className="btn btn-outline btn-sm btn-primary">
                  Página {props.paginationInfo.currentPage} de{" "}
                  {props.paginationInfo.totalPages}
                </button>
                <button
                  className="btn btn-outline btn-sm btn-primary"
                  onClick={() =>
                    handlePageChange(props.paginationInfo.currentPage + 1)
                  }
                  disabled={
                    props.paginationInfo.currentPage >=
                    props.paginationInfo.totalPages
                  }
                >
                  »
                </button>
              </div>
            </div>
          </>
        ) : (
          <WarningAlert message="No se ha encontrado ningún artículo" />
        )}
      </fieldset>
    </>
  );
}
