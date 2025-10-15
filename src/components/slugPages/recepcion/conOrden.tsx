import PDFConOrden from "@/components/pdf/recepcion/recepcionConOrden";
import { FormValueRecepcionData, IOrdenCompra } from "@/interfaces/creation";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import { Button, Modal, Table, Textarea } from "react-daisyui";
import { Select as SelectDy } from "react-daisyui";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FaFilePdf } from "react-icons/fa";
import { z } from "zod";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api_postRecepcionYDetalle } from "@/services/bodega.service";
import { toast } from "react-toastify";
import UbicacionRecepcion from "./ubicacionRecepcion";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import {
  articulosI,
  recepcionCOC,
} from "../../../interfaces/recepcion.interface";
import { api_tipoDocumentoRecepcion } from "../../../services/ingreso.service";
import { useTiposStore } from "@/store/tipos.store";
const ArticulosSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  nombre: z.string(),
  cantidad: z.number(),
  precio: z.number(),
  recepcionado: z.number(),
  recibida: z.number(),
  descripcion: z.string().optional(),
  observaciones: z.string().optional(),
  AnoNumero: z.number(),
  estadoArticulo: z.number({ required_error: "Campo requerido" }).min(1, { message: "Campo requerido" }),
});

const RecepcionDataSchema = z.object({
  cotizacion: z.string(),
  oc: z.number({ required_error: "Campo requerido" }),
  /*  folio: z.number({ required_error: "Campo requerido" }), */
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

interface props {
  valorPdf: boolean;
  dataConOrdenCompra: IOrdenCompra[];
  numero: number;
  setShowConOrden: (value: boolean) => void; // define el tipo de la función
  setNumero: (value: number | null) => void;
}

export default function ConOrden(props: props) {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Recepcion");
  }, []);

  const searchParams = useSearchParams();
  const id = searchParams.get("empresa"); //obtenemos la empresa
  const empresaId = id?.toString();
  const estado = props.valorPdf;
  const [tipos, setTipos] = useState<{ codigo: number; nombre: string }[]>([]);
  const { jwt } = useUserStore();
  const [ids, setIds] = useState<string[]>([]);
  // const getPDF = async (empresaId: string, estado: boolean) => {
  //     /* ReactPDF.renderToStream(<PDFConsulta />); */
  //     try {
  //         //const response = await api_pdf_recepcion(jwt, empresaId, estado);

  //         // Crear una URL para el Blob
  //         //const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

  //         // Crear un enlace temporal y simular un clic para descargar el archivo
  //         //const link = document.createElement('a');
  //         //link.href = url;
  //         //link.setAttribute('download', `documento_${valorEstado}.pdf`); // Nombre del archivo
  //         //document.body.appendChild(link);
  //         //link.click();

  //         // Limpiar el enlace temporal y revocar la URL
  //         //link.parentNode?.removeChild(link);
  //         //window.URL.revokeObjectURL(url); // Libera memoria utilizada por el Blob
  //     } catch (error) {
  //         console.error('Error al descargar el PDF:', error);

  //     }
  // }

  const CCAvailable = () => {
    const ids: string[] = [];
    props.dataConOrdenCompra[0].ordenCompraDetalles?.forEach((element) => {
      ids.push(element.cotizacionDetalle.solicitudDetalle.centroCostoId);
    });
    setIds(ids);
  };
  const getTipos = async () => {
    const fetch = await api_tipoDocumentoRecepcion(jwt);
    setTipos(fetch.data.dataList);
  };


  useEffect(() => {
    getTipos();
    CCAvailable();
  }, []);

  const methods = useForm<recepcionCOC>({
    resolver: zodResolver(RecepcionDataSchema),
    defaultValues: {
      tipo: 1,
      fecha: new Date(),
      fechaDoc: new Date(),
      oc: props.numero,
      empresa: props.dataConOrdenCompra[0].empresaId,
      cotizacion: props.dataConOrdenCompra[0].cotizacionId,
    },
  });
  const [locationString, setLocationString] = useState<{ centrocosto?: string; bodega?: string; almacen?: string }>({});
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
  const { EstadoArticulo } = useTiposStore();
  const [showPdf, setShowPdf] = useState(false);
  useEffect(() => {
    console.log('errores');
    console.log(errors);
    console.log(getValues());
  }, [errors]);
  useEffect(() => {
    remove([0, 1]);
    props.dataConOrdenCompra[0].ordenCompraDetalles?.forEach((element) => {
      const articulo: articulosI = {
        id: element.cotizacionDetalle.articulo.id,
        codigo: element.cotizacionDetalle.articulo.codigo as string,
        nombre: element.cotizacionDetalle.articulo.nombre as string,
        cantidad: element.cotizacionDetalle.cantidad,
        precio: element.cotizacionDetalle.valorUnitario,
        observacion: element.cotizacionDetalle.observaciones as string,
        recepcionado: element.cotizacionDetalle.cantidad,
        recibida: undefined,
        AnoNumero: element.cotizacionDetalle.articulo.anoNumero,
        observaciones: undefined,
        estadoArticulo: 0,
      };
      append(articulo);
    });
  }, []);
  const [pdfData, setPdfData] = useState<recepcionCOC | null>(null);

  const onSubmit = async (data: recepcionCOC) => {
    try {
      console.log(data)

      // Hacer la solicitud al servicio
      const response = await api_postRecepcionYDetalle(jwt, data);

      // // Mostrar el mensaje de éxito
      if (response) {
        toast.success("Articulo recepcionado correctamente");
        setPdfData(data)
        setShowPdf(true);
      }
    } catch (error) {
      console.error("Error al guardar: ", error);
      toast.error("ha ocurrido un error");
      setShowPdf(false);
    }

    /* console.log('Data del formulario:', data); */
  };

  const volverHandleClick = () => {
    props.setShowConOrden(false);
    reset();
    props.setNumero(null);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-2 bg-white rounded w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">
          Recepción de Artículos con orden de compra
        </h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
              {/* <div>
                <label
                  className="block text-left mb-2"
                  htmlFor="Folio Recepcion"
                >
                  Folio Recepción:
                </label>
                <input
                  type="number"
                  {...register("folio", {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                  className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.folio && (
                  <span className="text-red-600">{errors.folio.message}</span>
                )}
              </div> */}

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
                      className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                {errors.fecha && (
                  <span className="text-red-600">{errors.fecha.message}</span>
                )}
              </div>
            </div>
            {empresaId && ids.length !== 0 && (
              <UbicacionRecepcion empresa={empresaId} filterCC={ids} dispatchStrings={setLocationString} />
            )}
            <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-6">
              <div>
                <label
                  className="block text-left mb-2"
                  htmlFor="numeroDocumento"
                >
                  Número documento:
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

              <div className="flex flex-col">
                <label
                  className="block text-left mb-2"
                  htmlFor="fechaDocumento"
                >
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
                      className="block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                {errors.fechaDoc && (
                  <span className="text-red-600">
                    {errors.fechaDoc.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-center">
                  Tipo de documento:
                </label>
                <div className="flex justify-center">
                  <Controller
                    control={control}
                    name="tipo"
                    render={({ field }) => (
                      <>
                        {tipos.map((tipo, index) => (
                          <label key={tipo.codigo} className="mr-4">
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
                {errors.tipo && (
                  <span className="text-red-600">{errors.tipo.message}</span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-4">
              <Table className="border shadow-lg ">
                <Table.Head className="bg-primary text-white">
                  <span>Código</span>
                  <span>Nombre</span>
                  <span>Cantidad</span>
                  <span>Precio</span>
                  <span>Observación</span>
                  {/* <span>Recepcionado</span> */}
                  <span>Estado</span>
                  <span>Cantidad</span>
                  <span>Observaciones</span>
                </Table.Head>

                <Table.Body>
                  {fields.map((articulo, index) => (
                    <Table.Row key={index} hover={true}>
                      <span>{articulo.codigo}</span>
                      <span>{articulo.nombre}</span>
                      <span>{articulo.cantidad}</span>
                      <span>{articulo.precio}</span>
                      <span>{articulo.observacion ? articulo.observacion : 'Sin observaciónes'}</span>
                      {/* <span className="font-bold">
                        {getValues(`articulos.${index}.recepcionado`)}
                      </span> */}
                      <select
                        className={`block w-20 py-1 px-1 border ${errors.articulos &&
                          errors.articulos[index]?.estadoArticulo
                          ? "border-red-600"
                          : "border-primary"
                          } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                        defaultValue={articulo.estadoArticulo}
                        {...register(`articulos.${index}.estadoArticulo`, {
                          setValueAs: (value) =>
                            value === "" ? undefined : Number(value),
                        })}
                      >
                        <option value={0} disabled>
                          Seleccione el tipo de almacén
                        </option>
                        {EstadoArticulo.map((estado, index) => (
                          <option key={index} value={estado.codigo}>
                            {estado.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        key={articulo.id}
                        type="number"
                        min={1}
                        max={articulo.cantidad}
                        onKeyDown={(e) => {
                          // Bloquea letras, signos, y teclas no numéricas
                          if (
                            e.key === "e" || // evita notación científica
                            e.key === "E" ||
                            e.key === "+" ||
                            e.key === "-" ||
                            e.key === "." ||
                            e.key === ","
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className={`block w-20 py-1 px-1 border ${errors.articulos &&
                          errors.articulos[index]?.recibida
                          ? "border-red-600"
                          : "border-primary"
                          } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                        {...register(`articulos.${index}.recibida`, {
                          setValueAs: (value) =>
                            value === "" ? undefined : Number(value),
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números positivos",
                          },
                        })}
                      />
                      <input
                        key={articulo.id}
                        className={`block w-20 py-1 px-1 border ${errors.articulos &&
                          errors.articulos[index]?.observacion
                          ? "border-red-600"
                          : "border-primary"
                          } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                        {...register(`articulos.${index}.observacion`)}
                      />
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            <div className="mb-4">
              <label
                className="block text-left mb-2"
                htmlFor="Descripcion_generals"
              >
                Descripción General:
              </label>
              <Textarea
                rows={4}
                {...register("descripcion", {
                  setValueAs: (value) => (value === "" ? undefined : value),
                })}
                className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div className="mb-4 flex flex-col md:flex-row lg:flex-row justify-end">
              <button
                type="button"
                className="btn btn-outline btn-secondary mb-3 md:mb-0 lg:mb-0 md:my-0 lg:my-0 md:mx-2 lg:mx-2"
                onClick={volverHandleClick}
              >
                Volver
              </button>

              {showPdf && pdfData && (
                <Modal open={showPdf}>
                  <Modal.Header>
                    ¿Desea crear un reporte de la Recepción?
                  </Modal.Header>
                  <Modal.Body>
                    <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                      <div className="col-span-2">
                        <PDFDownloadLink
                          document={<PDFConOrden data={pdfData} location={locationString} />}
                          fileName={`Orden_De_Compra_Numero_${props.numero}_pdf`}
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
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
