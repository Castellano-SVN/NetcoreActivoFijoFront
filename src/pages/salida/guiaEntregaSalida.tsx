import {
  FormValueGuiaSalidaDetalle,
  IBodega,
  ICentroCosto,
  IPersona,
} from "@/interfaces/creation";
import {
  IAlmacen,
  IAlmacenArticulo,
} from "@/interfaces/modules/IAlmacen.interface";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllBodegaByEmpresaYCentroCosto,
  api_getAllCentroCostoByEmpresa,
  api_getAllPersonas,
  api_getEstadoArticulos,
  api_postPersonas,
} from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import { IFuncionarioEmpresa } from "@/interfaces/inventario.interface";
import { Button, Input, Modal, Table } from "react-daisyui";
import { useMixStore } from "@/store/mix.store";
import { useQuery } from "react-query";
import { api_getSexos } from "@/services/tipos.service";
import { toast } from "react-toastify";
import router from "next/router";
import { FaFilePdf, FaSave } from "react-icons/fa";
import WarningAlert from "@/components/alerts/warningAlert";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGuiaEntregaSalida from "@/components/pdf/guiaEntregaSalida";
import { api_postGuiaEntregaSalidas } from "@/services/salidas.service";
import { format } from "date-fns";
import { api_getAllPersonasByEmpresa } from "@/services/inventario.service";

interface IEstadoArticulo {
  codigo: number;
  nombre?: string;
}

export default function Salidas() {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Salidas");
  }, []);
  const { jwt } = useUserStore();
  const searchParams = useSearchParams();
  const search = searchParams.get("empresa");
  const idEmpresa = String(search); // Convertir a cadena

  const [dataCc, setDataCc] = useState<ICentroCosto[]>();
  const getCentroCostos = async () => {
    try {
      const cc = await api_getAllCentroCostoByEmpresa(jwt, idEmpresa);
      setDataCc(cc.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  const [dataFuncionario, setDataFuncionario] =
    useState<IFuncionarioEmpresa[]>();
  const [funcionarioSearch, setFuncionarioSearch] = useState("");
  const getFuncionarios = async (search: string) => {
    try {
      const data = await api_getAllPersonasByEmpresa(jwt, idEmpresa, search);
      setDataFuncionario(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  const [dataPersona, setDataPersona] = useState<IPersona[]>();
  const [personaSearch, setPersonaSearch] = useState("");
  const getPersonas = async (search: string) => {
    try {
      const data = await api_getAllPersonas(jwt, search);
      setDataPersona(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (funcionarioSearch.length >= 8) {
        getFuncionarios(funcionarioSearch);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [funcionarioSearch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (personaSearch.length >= 8) {
        getPersonas(personaSearch);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [personaSearch]);

  useEffect(() => {
    if (!idEmpresa) return;
    setValue('EmpresaId',idEmpresa)
    getCentroCostos();
  }, [idEmpresa]);

  const GuiSalidaDetalles = z.object({
    AlmacenId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    ArticuloId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    Cantidad: z.number({
      required_error: "Campo requerido",
      invalid_type_error: "tipo invalido",
    }),
    Observacion: z.string({ invalid_type_error: "tipo invalido" }).optional(),
    CodigoSubFamilia: z.number({
      required_error: "Campo requerido",
      invalid_type_error: "tipo invalido",
    }),
    estadoArticulo: z
      .number({
        required_error: "Campo invalido",
        invalid_type_error: "Tipo invalido",
      }).min(1),
    estadoArticuloOrigen: z
      .number({
        required_error: "Campo invalido",
        invalid_type_error: "Tipo invalido",
      }),
    anoNumero: z.number(),
  });

  const GuiaSalida = z.object({
    EmpresaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    CentroCostoId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    BodegaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    BodegaNombre: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    AlmacenId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    AlmacenNombre: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    FuncionarioEntregaId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    FuncionarioEntregaNombre: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    PersonaRecibeId: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    PersonaRecibeNombre: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    MotivoSalida: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    }),
    Observacion: z.string({ invalid_type_error: "Tipo invalido" }).optional(),
    GuiaSalidaDetalle: z.array(GuiSalidaDetalles),
  });

  const methods = useForm<FormValueGuiaSalidaDetalle>({
    resolver:
      zodResolver(GuiaSalida) /* ,defaultValues:{GuiaSalidaDetalle:[]} */,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = methods;

  useEffect(() => {
    console.log("codigo errores: ", errors);
  }, [errors]);

  const [showPdf, setShowPdf] = useState(false);
  const [dataPost, setDataPost] = useState<FormValueGuiaSalidaDetalle | null>(
    null,
  );
  const onSubmit = async (data: FormValueGuiaSalidaDetalle) => {
    console.log(data);
    try {
      const response = await api_postGuiaEntregaSalidas(jwt, data);
      if (response) {
        toast.success("Salida creada correctamente");
        setShowPdf(true);
        setDataPost(data);
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

  const CCId = watch("CentroCostoId");
  const bodegaId = watch("BodegaId");
  const almacenId = watch("AlmacenId");

  const [dataBodega, setDataBodega] = useState<IBodega[]>();
  const getBodegas = async () => {
    try {
      const bodega = await api_getAllBodegaByEmpresaYCentroCosto(
        jwt,
        idEmpresa,
        CCId,
      );
      setDataBodega(bodega.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!idEmpresa || !CCId) return;
    getBodegas();
  }, [idEmpresa, CCId]);

  const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
  const getAllAlmacenByEmpByCenByBod = async () => {
    try {
      const data = await api_getAllAlmacenByEmpByCenByBod(
        jwt,
        idEmpresa,
        CCId,
        bodegaId,
      );
      setDataAlmacen(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!idEmpresa || !CCId || !bodegaId) return;

    // Obtener el nombre de la bodega
    const selectedBodega = dataBodega?.find((bodega) => bodega.id == bodegaId);
    if (selectedBodega) {
      setValue("BodegaNombre", selectedBodega.nombre);
    }

    // Obtener los almacenes
    getAllAlmacenByEmpByCenByBod();
  }, [idEmpresa, CCId, bodegaId]);

  useEffect(() => {
    if (!almacenId || !dataAlmacen) return; // Verificar que almacenId tenga un valor válido

    const selectedAlmacen = dataAlmacen.find(
      (almacen) => almacen.id === almacenId,
    );
    if (selectedAlmacen) {
      setValue("AlmacenNombre", selectedAlmacen.nombre);
    }
  }, [almacenId, dataAlmacen]);

  const modalRef = useRef<HTMLDialogElement>(null);

  const handleShowModal = useCallback(() => {
    modalRef.current?.showModal();
  }, []);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "GuiaSalidaDetalle",
    },
  );

  const [dataAlmacenArticulo, setDataAlmacenArticulo] = useState<
    IAlmacenArticulo[]
  >([]);
  const getAllAlmacenArticuloByEmpByCenByBodByAlm = async () => {
    try {
      const data = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(
        jwt,
        idEmpresa,
        CCId,
        bodegaId,
        almacenId,
      );
      setDataAlmacenArticulo(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!idEmpresa || !CCId || !bodegaId || !almacenId) return;
    getAllAlmacenArticuloByEmpByCenByBodByAlm();
  }, [idEmpresa, CCId, bodegaId, almacenId]);

  const [dataEstadoA, setDataEstadoA] = useState<IEstadoArticulo[]>([]);

  const getEstadoArticulo = async () => {
    const data = await api_getEstadoArticulos(jwt);
    setDataEstadoA(data.data.dataList);
  };

  useEffect(() => {
    getEstadoArticulo();
  }, []);

  // Observar los cambios en GuiaSalidaDetalle
  const guiaSalidaDetalle = watch("GuiaSalidaDetalle");

  const fechaActualConMinutos = format(new Date(), "yyyy-MM-dd HH:mm");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-md p-4 gap-4 mx-auto">
            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col">
                <label
                  htmlFor="Centro costo"
                  className="label font-semibold tex-left"
                >
                  Centro Costo*
                </label>
                <select
                  className="select select-primary"
                  {...register("CentroCostoId", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                >
                  <option value="" selected disabled>
                    Seleccione una opción:{" "}
                  </option>
                  {dataCc?.map((cc, index) => (
                    <option value={cc.id}>{cc.nombre}</option>
                  ))}
                </select>
                {errors.CentroCostoId && (
                  <span className="text-red-600 block">
                    {errors.CentroCostoId.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col">
                <label
                  htmlFor="Bodega"
                  className="label font-semibold tex-left"
                >
                  Bodega*
                </label>
                <select
                  className="select select-primary"
                  {...register("BodegaId", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                >
                  <option value="" selected disabled>
                    Seleccione una opción:{" "}
                  </option>
                  {dataBodega?.map((bodega, index) => (
                    <option value={bodega.id}>{bodega.nombre}</option>
                  ))}
                </select>
                {errors.BodegaId && (
                  <span className="text-red-600 block">
                    {errors.BodegaId.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col">
                <label
                  htmlFor="Almacen"
                  className="label font-semibold tex-left"
                >
                  Almacen*
                </label>
                <select
                  className="select select-primary"
                  {...register("AlmacenId", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                >
                  <option value="" selected disabled>
                    Seleccione una opción:{" "}
                  </option>
                  {dataAlmacen.map((almacen, index) => (
                    <option value={almacen.id}>{almacen.nombre}</option>
                  ))}
                </select>
                {errors.AlmacenId && (
                  <span className="text-red-600 block">
                    {errors.AlmacenId.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col">
                <label
                  htmlFor="Encargado"
                  className="label font-semibold tex-left"
                >
                  Encargado*
                </label>
                <Controller
                  control={control}
                  name="FuncionarioEntregaId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onInputChange={(newValue) =>
                        setFuncionarioSearch(newValue)
                      }
                      className="border-2 border-primary rounded-md"
                      placeholder="Rut formato 12123123-1"
                      getOptionValue={(option) => option.funcionarioId}
                      getOptionLabel={(option) =>
                        `${option.persona.nombres} ${option.persona.apellidoPaterno}`
                      }
                      options={dataFuncionario}
                      onChange={(val) => {
                        field.onChange(val?.funcionarioId);
                        if (val) {
                          setValue(
                            "FuncionarioEntregaNombre",
                            `${val.persona.nombres} ${val.persona.apellidoPaterno}`,
                            { shouldValidate: false },
                          );
                        }
                      }}
                      value={dataFuncionario?.find(
                        (e) => e.funcionarioId === field.value,
                      )}
                      menuPortalTarget={document.body}
                      isClearable
                      loadingMessage={() => "Cargando..."}
                      isLoading={
                        funcionarioSearch.length >= 8 && !dataFuncionario
                      }
                      noOptionsMessage={({ inputValue }) =>
                        inputValue.length < 8
                          ? "Ingrese al menos 8 caracteres"
                          : "No se encontraron resultados"
                      }
                      filterOption={null}
                    />
                  )}
                />
                {errors.FuncionarioEntregaId && (
                  <span className="text-red-600 block">
                    {errors.FuncionarioEntregaId.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col">
                <label
                  htmlFor="Recibe"
                  className="label font-semibold tex-left"
                >
                  Destinatario*
                </label>
                <Controller
                  control={control}
                  name="PersonaRecibeId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onInputChange={(newValue) => setPersonaSearch(newValue)}
                      className="border-2 border-primary rounded-md"
                      placeholder="Rut formato 12123123-1"
                      getOptionValue={(option) => option.id || ""}
                      getOptionLabel={(option) =>
                        `${option.nombres} ${option.apellidoPaterno}`
                      }
                      options={dataPersona}
                      onChange={(val) => {
                        field.onChange(val?.id);
                        if (val) {
                          setValue(
                            "PersonaRecibeNombre",
                            `${val.nombres} ${val.apellidoPaterno}`,
                            { shouldValidate: false },
                          );
                        }
                      }}
                      value={dataPersona?.find((e) => e.id === field.value)}
                      menuPortalTarget={document.body}
                      isClearable
                      loadingMessage={() => "Cargando..."}
                      isLoading={personaSearch.length >= 8 && !dataPersona}
                      noOptionsMessage={({ inputValue }) =>
                        inputValue.length < 8
                          ? "Ingrese al menos 8 caracteres"
                          : "No se encontraron resultados"
                      }
                      filterOption={null}
                    />
                  )}
                />
                {errors.PersonaRecibeId && (
                  <span className="text-red-600 block">
                    {errors.PersonaRecibeId.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col items-center">
                <label
                  htmlFor="nuevo usuario"
                  className="label font-semibold tex-left"
                >
                  ¿No has encontrado al destinatario?
                </label>
                <button
                  type="button"
                  onClick={handleShowModal}
                  className="btn btn-primary btn-outline w-1/2 my-0"
                >
                  Añadir Destinario
                </button>{" "}
              </div>
            </div>

            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col">
                <label
                  htmlFor="Motivo de la salida"
                  className="label font-semibold tex-left"
                >
                  Motivo de la salida*
                </label>
                <textarea
                  rows={2}
                  {...register("MotivoSalida", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                  placeholder="Porfavor ingrese el motivo..."
                  className="textarea textarea-primary w-full"
                />
                {errors.MotivoSalida && (
                  <span className="text-red-600 block">
                    {errors.MotivoSalida.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-4">
              <div className="flex flex-col">
                <label
                  htmlFor="Observacion"
                  className="label font-semibold tex-left"
                >
                  Observaciones
                </label>
                <textarea
                  rows={2}
                  {...register("Observacion")}
                  className="textarea textarea-primary w-full"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 rounded-md p-4 gap-4 mx-auto">
            <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-2">
              {almacenId && dataAlmacenArticulo.length > 0 ? (
                <Table className="border shadow-lg">
                  <Table.Head className="bg-primary text-white">
                    <span>Selección</span>
                    <span>Código sub-familia</span>
                    <span>Sub-familia</span>
                    <span>Código artículo</span>
                    <span>Descripción artículo</span>
                    <span>Cantidad sistema</span>
                    <span>Cantidad salida*</span>
                    <span>Estado de salida*</span>
                    <span>Observaciones</span>
                  </Table.Head>
                  <Table.Body>
                    {dataAlmacenArticulo.map((almacenArticulo, index) => {
                      const fieldIndex = fields.findIndex(
                        (field) =>
                          field.ArticuloId === almacenArticulo.articuloId &&
                          field.anoNumero === almacenArticulo.anoNumero &&
                          field.estadoArticuloOrigen === almacenArticulo.estadoArticuloCodigo,
                      );
                      return (
                        <Table.Row key={index} hover={true}>
                          <span>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary"
                              checked={fieldIndex !== -1}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  append({
                                    AlmacenId: almacenArticulo.almacenId,
                                    SubFamiliaId:
                                      almacenArticulo.articulo.subFamilium.id,
                                    ArticuloId: almacenArticulo.articuloId,
                                    EstadoArticuloCodigo: 0,
                                    estadoArticuloOrigen: almacenArticulo.estadoArticuloCodigo,
                                    Cantidad: 0,
                                    anoNumero:
                                      almacenArticulo.articulo.anoNumero,
                                    Observacion: "",
                                    CodigoSubFamilia:
                                      almacenArticulo.articulo.subFamilium
                                        .codigo,
                                    NombreSubFamilia:
                                      almacenArticulo.articulo.nombre,
                                    estadoArticulo:
                                      almacenArticulo.articulo.codigo,
                                    DescripcionArticulo:
                                      almacenArticulo.articulo.descripcion,
                                    CantidadSistema: almacenArticulo.cantidad,
                                    EstadoArticuloNombre: "",
                                  });
                                } else {
                                  if (fieldIndex !== -1) {
                                    remove(fieldIndex);
                                  }
                                }
                              }}
                            />
                          </span>
                          <span>
                            {almacenArticulo.articulo.subFamilium.codigo}
                          </span>
                          <span>
                            {almacenArticulo.articulo.subFamilium.nombre}
                          </span>
                          <span>
                            {almacenArticulo.articulo.codigo
                              ? almacenArticulo.articulo.codigo
                              : "articulo sin codigo"}
                          </span>
                          <span>
                            {almacenArticulo.articulo.descripcion
                              ? almacenArticulo.articulo.descripcion
                              : "articulo sin descripción"}
                          </span>
                          <span>{almacenArticulo.cantidad}</span>
                          <span>
                            {fieldIndex !== -1 && (
                              <>
                                <input
                                  onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e")
                                      e.preventDefault();
                                  }}
                                  type="number"
                                  min={1}
                                  max={almacenArticulo.cantidad}
                                  {...register(
                                    `GuiaSalidaDetalle.${fieldIndex}.Cantidad`,
                                    {
                                      setValueAs: (value) => {
                                        if (value === "" || value === 0) {
                                          return undefined;
                                        }
                                        return Number(value);
                                      },
                                    },
                                  )}
                                  className="w-full py-1 px-2 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                />
                                {errors.GuiaSalidaDetalle &&
                                  errors.GuiaSalidaDetalle[fieldIndex] &&
                                  errors.GuiaSalidaDetalle[fieldIndex]
                                    ?.Cantidad && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {
                                        errors.GuiaSalidaDetalle[fieldIndex]
                                          ?.Cantidad?.message
                                      }
                                    </p>
                                  )}
                              </>
                            )}
                          </span>
                          <span>
                            {fieldIndex !== -1 && (
                              <>
                                <select
                                  {...register(
                                    `GuiaSalidaDetalle.${fieldIndex}.estadoArticulo`,
                                    {
                                      setValueAs: (value) => {
                                        if (value === "" || value === 0) {
                                          return undefined;
                                        }
                                        return Number(value);
                                      },
                                    },
                                  )}
                                  onChange={(e) => {
                                    const estadoArticulo = dataEstadoA.find(
                                      (estado) =>
                                        estado.codigo ===
                                        Number(e.target.value),
                                    );
                                    if (
                                      estadoArticulo &&
                                      estadoArticulo.nombre
                                    ) {
                                      setValue(
                                        `GuiaSalidaDetalle.${fieldIndex}.EstadoArticuloNombre`,
                                        estadoArticulo.nombre,
                                      );
                                    } else {
                                      setValue(
                                        `GuiaSalidaDetalle.${fieldIndex}.EstadoArticuloNombre`,
                                        "",
                                      );
                                    }
                                  }}
                                  className="w-full py-1 px-2 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                >
                                  <option value="" disabled>
                                    Seleccione una opción
                                  </option>
                                  {dataEstadoA.map((e, ie) => (
                                    <option value={e.codigo} key={ie}>
                                      {e.nombre}
                                    </option>
                                  ))}
                                </select>
                                {errors.GuiaSalidaDetalle &&
                                  errors.GuiaSalidaDetalle[fieldIndex] &&
                                  errors.GuiaSalidaDetalle[fieldIndex]
                                    ?.EstadoArticuloCodigo && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {
                                        errors.GuiaSalidaDetalle[fieldIndex]
                                          ?.EstadoArticuloCodigo?.message
                                      }
                                    </p>
                                  )}
                              </>
                            )}
                          </span>
                          <span>
                            {fieldIndex !== -1 && (
                              <input
                                type="text"
                                {...register(
                                  `GuiaSalidaDetalle.${fieldIndex}.Observacion`,
                                )}
                                className="w-full py-1 px-2 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                              />
                            )}
                          </span>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              ) : almacenId && dataAlmacenArticulo.length === 0 ? (
                <WarningAlert
                  message={"No hay artículos disponibles en este almacén"}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="col-span-1 md:col-span-4 flex justify-center items-center md:justify-center mb-2">
            <button
              type="submit"
              className="btn btn-primary btn-outline w-full md:w-auto"
            >
              <FaSave />
              Guardar
            </button>
          </div>
        </div>
        {showPdf && dataPost && (
          <Modal open={showPdf}>
            <Modal.Header>
              ¿Desea crear un reporte de la guía de despacho de salida?
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                <div className="col-span-2">
                  <PDFDownloadLink
                    document={<PDFGuiaEntregaSalida data={dataPost} />}
                    fileName={`Pdf_salida_&${fechaActualConMinutos}`}
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
                    onClick={() => router.back()}
                  >
                    salir
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </form>
      <ModalPersonaRecibe
        modalRef={modalRef}
        actualizarPersonas={getPersonas}
      />
    </>
  );
}

interface ModalPersonaRecibeProps {
  modalRef: React.RefObject<HTMLDialogElement>;
  actualizarPersonas: (search: string) => Promise<void>;
}

interface FormModalPersona {
  RunCuerpo: number;
  RunDigito: string;
  Nombres: string;
  ApellidoPaterno: string;
  SexoCodigo: number;
  Email: string;
  Celular: number;
}

function ModalPersonaRecibe({
  modalRef,
  actualizarPersonas,
}: ModalPersonaRecibeProps) {
  const { jwt } = useUserStore();

  const schema = z.object({
    RunCuerpo: z.number({ required_error: "Campo requerido" }),
    RunDigito: z.string({ required_error: "Campo requerido" }),
    Nombres: z.string({ required_error: "Campo requerido" }),
    ApellidoPaterno: z.string({ required_error: "Campo requerido" }),
    SexoCodigo: z.number({ required_error: "Campo requerido" }),
    Email: z.string().optional(),
    Celular: z.number().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormModalPersona>({
    resolver: zodResolver(schema),
  });

  const { sexos, setSexos } = useMixStore();
  const Query = useQuery("sexos", () => api_getSexos(jwt), {
    enabled: useMixStore.getState().sexos.length === 0,
    onSuccess: (data) => {
      setSexos(data.data.dataList);
    },
  });

  const handleRunCuerpoChange = (e: any) => {
    const value = e.target.value;
    const truncatedValue = value.replace(/\D/g, "").slice(0, 8);
    if (truncatedValue.length < value.length) {
      e.target.value = truncatedValue;
    }
  };

  const handleRunDigitoChange = (e: any) => {
    let value = e.target.value.toUpperCase(); // Convertimos a mayúscula para simplificar la validación
    value = value.replace(/[^0-9K]/g, "").slice(0, 1); // Solo números o 'K'
    e.target.value = value;
  };

  const handleCelularChange = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 9); // Solo 0-9 y '+', máximo 12 caracteres
    e.target.value = value;
  };

  const [rutValido, setRutValido] = useState(true);

  const validarRut = (rutCuerpo: number, rutDigito: string) => {
    // Convierte el cuerpo del RUT a string y elimina puntos y guiones
    const rut = rutCuerpo.toString().replace(/[\.-]/g, "");

    // Obtiene el dígito verificador ingresado
    const dv = rutDigito.toUpperCase();

    // Calcula el dígito verificador
    let suma = 0;
    let multiplicador = 2;

    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    let dvCalculado: number | string = 11 - (suma % 11);
    dvCalculado =
      dvCalculado === 11 ? 0 : dvCalculado === 10 ? "K" : dvCalculado;

    // Compara el dígito verificador calculado con el ingresado
    return dvCalculado.toString() === dv;
  };

  const onSubmit = async (data: FormModalPersona) => {
    try {
      if (!validarRut(data.RunCuerpo, data.RunDigito)) {
        setRutValido(false);
        toast.error("Rut chileno invalido.");
        return; // No se envía el formulario si el RUT es inválido
      }
      setRutValido(true);
      await api_postPersonas(jwt, data);
      toast.success("Destinatario agregado con exito.");
      reset();
      modalRef.current?.close();
      actualizarPersonas(data.RunCuerpo.toString()); //para actualizar la data de personas se vuelve a llamar.
    } catch (error) {
      console.error("Error al guardar la persona:", error);
    }
  };

  return (
    <>
      <Modal ref={modalRef}>
        <Modal.Header className="font-bold">Agregar Persona</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col mr-1">
                <label htmlFor="RunCuerpo" className="label">
                  RUN Cuerpo: *
                </label>
                <div className="flex flex-col">
                  <input
                    type="number"
                    placeholder="Ej: 20111111"
                    {...register("RunCuerpo", {
                      setValueAs: (value) =>
                        value === "" ? undefined : parseInt(value),
                    })}
                    className="input input-primary w-full"
                    onChange={handleRunCuerpoChange}
                  />
                  {errors.RunCuerpo && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.RunCuerpo.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col ml-1">
                <label htmlFor="RunDigito" className="label md:text-right">
                  RUN Dígito: *
                </label>
                <div className="flex flex-col">
                  <Input
                    type="text"
                    placeholder="Ej: 7"
                    {...register("RunDigito", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                    className="input input-primary"
                    onChange={handleRunDigitoChange}
                  />
                  {errors.RunDigito && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.RunDigito.message}
                    </p>
                  )}
                </div>
              </div>
              {!rutValido && (
                <p className="col-span-2 text-red-500 text-xs mt-1">
                  El RUT ingresado no es válido.
                </p>
              )}
              <div className="flex flex-col mr-1">
                <label htmlFor="Nombres" className="label">
                  Nombres: *
                </label>
                <Input
                  type="text"
                  {...register("Nombres", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                  className="input input-primary input-bordered w-full"
                />
                {errors.Nombres && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Nombres.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col ml-1">
                <label htmlFor="ApellidoPaterno" className="label">
                  Apellido Paterno: *
                </label>
                <Input
                  type="text"
                  {...register("ApellidoPaterno", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                  className="input input-primary input-bordered w-full"
                />
                {errors.ApellidoPaterno && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ApellidoPaterno.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mr-1">
                <label htmlFor="SexoCodigo" className="label">
                  Seleccione su sexo: *
                </label>
                <select
                  className="select select-primary w-full"
                  {...register("SexoCodigo", {
                    setValueAs: (value) =>
                      value === "" ? undefined : parseInt(value),
                  })}
                >
                  <option value="" selected disabled>
                    Selecione una opcion
                  </option>
                  {sexos.map((e, index) => (
                    <option key={index} value={e.codigo}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
                {errors.SexoCodigo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.SexoCodigo.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col ml-1">
                <label htmlFor="Email" className="label">
                  Email:{" "}
                </label>
                <Input
                  type="text"
                  {...register("Email")}
                  className="input input-primary input-bordered w-full"
                />
                {errors.Email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mr-1">
                <label htmlFor="Celular" className="label">
                  Celular:{" "}
                </label>
                <Input
                  type="number"
                  {...register("Celular", {
                    setValueAs: (value) =>
                      value === "" ? undefined : parseInt(value),
                  })}
                  placeholder="Formato 925789405"
                  onChange={handleCelularChange}
                  className="input input-primary input-bordered w-full"
                />
                {errors.Celular && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Celular.message}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-action">
              <Button type="submit" className="btn btn-primary">
                Guardar
              </Button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Actions>
          <form method="dialog">
            <Button>Cerrar</Button>
          </form>
        </Modal.Actions>
      </Modal>
    </>
  );
}
