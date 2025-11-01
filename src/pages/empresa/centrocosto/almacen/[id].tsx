import { useRouter } from "next/router";
import { useUserStore } from "../../../../store/user.store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAllAlmacenArticuloByEmpByCenByBodByAlmStock,
  api_putAlmacenArticuloStock,
  api_getAlmacenById,
  api_getEstadoArticulos,
  api_getTipoLocation,
  api_postLocation,
  api_putAlmacenArticulo,
} from "../../../../services/bodega.service";
import {
  IAlmacen,
  ILocacion,
} from "../../../../interfaces/modules/IAlmacen.interface";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Head from "next/head";
import { ItipoAlmacen } from "../../../../schemas/tipo_almacen.schema";
import { FiPlus } from "react-icons/fi";
import { FaArchive, FaArrowLeft, FaEye, FaSave } from "react-icons/fa";
import {
  Button,
  Divider,
  Input,
  Loading,
  Modal,
  Select,
  Textarea,
} from "react-daisyui";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  ITipoLocation,
  LocationFormValues,
} from "../../../../interfaces/creation";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineArchive } from "react-icons/hi";
import { ArchiveBoxIcon } from "@heroicons/react/20/solid";
import { FaArrowsLeftRight } from "react-icons/fa6";
import { MdInventory2 } from "react-icons/md";
import { useTiposStore } from "@/store/tipos.store";
interface IAlmacenTA extends IAlmacen {
  tipoAlmacen: ItipoAlmacen;
  locacions: ILocacion[];
}
import { LuPackagePlus } from "react-icons/lu";
import { useParams } from "next/navigation";
interface articuloI {
  articuloId: string;
  cantidad: number;
  locacion: string | undefined;
  nombre: string;
  descripcion: string;
  subfamilia: string;
  familia: string;
  estado: number;
  anoNumero: number;
}
interface estadosI {
  codigo: number;
  nombre: string;
}

const avoidStatus = [5, 6, 7];
export default function Page() {
  const validationSchemaLocation = z.object({
    EmpresaId: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    CentroCostoId: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    BodegaId: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    AlmacenId: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
    TipoLocacionId: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    Direccion: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    Descripcion: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .optional(),
  });
  const methodsLocation = useForm<LocationFormValues>({
    resolver: zodResolver(validationSchemaLocation),
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = methodsLocation;
  const router = useRouter();
  const { jwt } = useUserStore();
  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const [estadosArticulos, setEstadosArticulos] = useState<estadosI[]>([]);
  const [articulos, setArticulos] = useState<articuloI[]>([]);
  const [almacen, setAlmacen] = useState<IAlmacenTA>();
  const [stock, setStock] = useState<
    {
      anoNumero: number;
      articuloId: string;
      cantidadMinima: number;
      stock: number;
    }[]
  >([]);
  const getAlmacen = async () => {
    try {
      const response = await api_getAlmacenById(jwt, router.query.id as string);
      setAlmacen(response.data.dataList[0]);
    } catch {
      toast.error("Ocurrio un error buscando al buscar el almacén");
    }
  };
  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
  const getEstadosArticulos = async () => {
    if (EstadoArticulo.length !== 0) return;

    try {
      const _data = await api_getEstadoArticulos(jwt);
      setEstadoArticulo(_data.data.dataList);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!jwt) return;
    getEstadosArticulos();
  }, []);
  useEffect(() => {
    if (!router.query.id) return;
    getAlmacen();
  }, [router.query.id]);

  const locationRef = useRef<HTMLDialogElement>(null);
  const handleShowLocation = useCallback(() => {
    locationRef.current?.showModal();
  }, [locationRef]);

  const handleCloseLocation = useCallback(() => {
    locationRef.current?.close();
  }, [locationRef]);

  const getArticles = async () => {
    if (!almacen) return;
    setArticulos([]);
    setStock([]);
    const articles = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(
      jwt,
      almacen.empresaId,
      almacen.centroCostoId,
      almacen.bodegaId,
      almacen.id,
    );
    const stockList = await api_getAllAlmacenArticuloByEmpByCenByBodByAlmStock(
      jwt,
      almacen.empresaId,
      almacen.centroCostoId,
      almacen.bodegaId,
      almacen.id,
    );
    stockList.data.dataList.map(
      (e: {
        anoNumero: number;
        articuloId: string;
        cantidaMinima: number;
        stock: number;
      }) => {
        articles.data.dataList
          .filter(
            (x: {
              anoNumero: number;
              articuloId: string;
              cantidaMinima: number;
              cantidad: number;
              estadoArticuloCodigo: number;
            }) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId,
          )
          .map((articulo: any) => {
            if (avoidStatus.includes(articulo.estadoArticuloCodigo)) return;
            if (!e.stock) e.stock = 0;
            e.stock = e.stock + articulo.cantidad;
          });
      },
    );
    setStock(stockList.data.dataList);
    const newElementsArticles: articuloI[] = [];
    articles.data.dataList.map((e: any) => {
      newElementsArticles.push({
        anoNumero: e.anoNumero,
        articuloId: e.articuloId,
        cantidad: e.cantidad,
        descripcion: e.articulo.descripcion,
        familia: e.articulo.subFamilium.familium.nombre,
        locacion: e.locacionId,
        nombre: e.articulo.nombre,
        subfamilia: e.articulo.subFamilium.nombre,
        estado: e.estadoArticuloCodigo,
      });
    });
    setArticulos(newElementsArticles);
  };

  const LocationSubmit = async (data: LocationFormValues) => {
    try {
      await api_postLocation(jwt, data);
      toast.success("¡La nueva ubicación se creo correctamente!");
      reset();
      handleCloseLocation();
      await getAlmacen();
    } catch (error) {
      toast.error("Ha ocurrido un error.");
    }
  };
  const [dataLocation, setDataLocation] = useState<ITipoLocation[]>([]);
  const getTipoLocation = async () => {
    try {
      if (!almacen) return;
      const data = await api_getTipoLocation(jwt, almacen?.empresaId);
      setDataLocation(data.data.dataList);
    } catch (error) {}
  };

  const defaultValues = () => {
    if (!almacen) return;
    setValue("AlmacenId", almacen.id);
    setValue("BodegaId", almacen.bodegaId);
    setValue("CentroCostoId", almacen.centroCostoId);

    setValue("EmpresaId", almacen.empresaId);
  };

  useEffect(() => {
    console.warn(errors);
  }, [errors]);

  useEffect(() => {
    if (!almacen) return;
    getTipoLocation();
    defaultValues();
    getArticles();
  }, [almacen]);

  return (
    <>
      <Head>
        <title>{almacen ? `Almacen ${almacen.nombre}` : `Almacen`}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal backdrop responsive ref={locationRef}>
        <Modal.Header className="font-bold">Ubicación</Modal.Header>
        <Divider />
        <Modal.Body>
          <form onSubmit={handleSubmit((d) => LocationSubmit(d))}>
            <div className="my-2">
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Dirección</span>
                  </label>
                  <Input
                    {...register("Direccion", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  />
                  <label className="label text-error">
                    <span>{errors.Direccion?.message}</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Tipo de Locación</span>
                  </label>
                  <Select
                    defaultValue={""}
                    {...register("TipoLocacionId", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  >
                    <Select.Option value={""} disabled>
                      Seleccione El tipo de Locación
                    </Select.Option>
                    {dataLocation.map((tipolocacion, index) => (
                      <Select.Option key={index} value={tipolocacion.id}>
                        {tipolocacion.nombre}
                      </Select.Option>
                    ))}
                  </Select>
                  <label className="label text-error">
                    {errors.TipoLocacionId?.message}
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Descripción</span>
                  </label>
                  <Textarea
                    {...register("Descripcion", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  />
                </div>
              </div>
              <div className="my-2">
                <div className="flex items-center justify-center">
                  <Button
                    type="submit"
                    className="text-base-100"
                    color="primary"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <div className="w-full transition duration-300 ease-in-out">
        <div className="flex flex-col bg-primary bordered rounded shadow-md ">
          <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-t-lg">
            <h3 className="text-large font-bold text-base-100 text-center">
              Almacén
            </h3>
            <h3 className="text-large font-bold text-base-100 text-center">
              Tipo
            </h3>
          </div>
          <div>
            <div className="flex flex-row justify-between bg-primary px-6 py-4  rounded-b-lg">
              <h3 className="text-large font-bold text-base-100">
                {almacen ? almacen?.nombre.toUpperCase() : ""}
              </h3>
              <h3 className="text-large font-bold text-base-100">
                {almacen ? almacen?.tipoAlmacen.nombre.toUpperCase() : ""}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row lg:flex-row flex-col-reverse justify-around items-center mt-4 md:mt-4 lg:mt-2  rounded-lg border shadow-md hover:shadow-xl py-2 ">
          <button
            type="button"
            className="btn btn-primary mt-2 md:mt-0"
            onClick={() => router.back()}
          >
            <FaArrowLeft />
            Volver
          </button>
          {almacen && (
            <div className="join">
              <button
                onClick={() => {
                  reset();
                  defaultValues();
                  handleShowLocation();
                }}
                className="btn btn-primary join-item animate-fadein"
              >
                <FiPlus />
                Crear locación
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/empresa/centrocosto/almacen/tipolocacion/${almacen?.empresaId}`,
                  )
                }
                className="btn btn-primary join-item"
              >
                <FiPlus /> Tipo Locación
              </button>
            </div>
          )}
        </div>
        {almacen ? (
          <div className="w-full mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {almacen?.locacions?.map((e, index) => (
              <Locations
                stock={stock}
                key={index}
                almacen={almacen}
                locacion={e}
                articulos={articulos}
                estados={estadosArticulos}
                locations={almacen?.locacions}
                update={getArticles}
              />
            ))}
            <WithoutLocations
              almacen={almacen}
              stock={stock}
              articulos={articulos}
              estados={estadosArticulos}
              locations={almacen?.locacions}
              update={getArticles}
            />
          </div>
        ) : (
          <div className="text-primary text-center mt-4">
            <Loading size="lg" />
          </div>
        )}
      </div>
    </>
  );
}

function Locations({
  locacion,
  articulos,
  estados,
  locations,
  almacen,
  update,
  stock,
}: {
  locacion: ILocacion;
  articulos: articuloI[];
  estados: estadosI[];
  locations: ILocacion[];
  almacen: IAlmacenTA;
  update: () => Promise<void>;
  stock: {
    anoNumero: number;
    articuloId: string;
    cantidadMinima: number;
    stock: number;
  }[];
}) {
  const [cantidad, setCantidad] = useState<number>(0);
  const validationSchemaLocation = z.object({
    almacen: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    articulo: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    estado: z.number({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    estadoInicial: z.number({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    locacion: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    locacionOrigen: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .nullish(),
    anoNumero: z.number(),
    cantidad: z
      .number({})
      .min(1, "La cantidad mínima es 1")
      .max(cantidad, `La cantidad máxima es ${cantidad}`),
  });
  const { jwt } = useUserStore();

  const methodsLocation = useForm<{
    cantidad: number;
    almacen: string;
    articulo: string;
    estado: number;
    estadoInicial: number;
    locacion: string | undefined;
    locacionOrigen: string | undefined;
    anoNumero: number;
  }>({
    resolver: zodResolver(validationSchemaLocation),
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = methodsLocation;
  const Submit = async (data: {
    cantidad: number;
    almacen: string;
    articulo: string;
    estado: number;
    locacion: string | undefined;
  }) => {
    try {
      await api_putAlmacenArticulo(jwt, data);
      await update();
      handleCloseLocation();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message
            ? error.response.data.message
            : "Ha ocurrido un error.",
        );
      } else {
        toast.error("Ha ocurrido un error.");
      }
    }
  };
  const stockRef = useRef<HTMLDialogElement>(null);
  const handleShowStock = useCallback(
    (
      stock: {
        anoNumero: number;
        articuloId: string;
        cantidadMinima: number;
        stock: number;
      },
      element: articuloI,
    ) => {
      stockRef.current?.showModal();
      setStockSelected(stock);
      setProductSelected(element);
    },
    [stockRef],
  );

  const handleCloseStock = useCallback(() => {
    stockRef.current?.close();
  }, [stockRef]);

  const router = useRouter();
  const [articulosFilter, setArticulosFilter] = useState<articuloI[]>([]);

  useEffect(() => {
    setArticulosFilter(articulos.filter((e) => e.locacion === locacion.id));
  }, [articulos]);
  const locationRef = useRef<HTMLDialogElement>(null);
  const handleShowLocation = useCallback(
    (element: articuloI) => {
      reset();
      setValue("almacen", almacen.id);
      setValue("articulo", element.articuloId);
      setValue("estado", element.estado);
      setValue("estadoInicial", element.estado);
      setValue("locacion", element.locacion);
      setValue("locacionOrigen", element.locacion);
      setValue("anoNumero", element.anoNumero);
      setValue("cantidad", element.cantidad);
      setCantidad(element.cantidad);
      locationRef.current?.showModal();
    },
    [locationRef],
  );

  const handleCloseLocation = useCallback(() => {
    locationRef.current?.close();
  }, [locationRef]);
  const [stockSelected, setStockSelected] = useState<{
    anoNumero: number;
    articuloId: string;
    cantidadMinima: number;
    stock: number;
  }>({ anoNumero: 0, articuloId: "", cantidadMinima: 0, stock: 0 });
  const [productSelected, setProductSelected] = useState<articuloI>({
    anoNumero: 0,
    articuloId: "",
    cantidad: 0,
    descripcion: "",
    estado: 0,
    locacion: "",
    nombre: "",
    familia: "",
    subfamilia: "",
  });

  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
  const CalculateStock = (
    stock?: number,
    cuantity?: number,
    destiny?: string,
  ) => {
    if (stock === undefined || cuantity === undefined) return;
    if (cuantity <= stock) {
      if (destiny === "font") {
        return "font-semibold text-red-500";
      }
      return "bg-red-200 hover:bg-red-300";
    }
    return "hover";
  };
  return (
    <>
      <Modal backdrop responsive ref={locationRef}>
        <Modal.Header className="font-bold">Ubicación</Modal.Header>
        <Divider />
        <Modal.Body>
          <form onSubmit={handleSubmit((d) => Submit(d))}>
            <div className="my-2">
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Locación</span>
                  </label>
                  <Select
                    defaultValue={""}
                    {...register("locacion", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  >
                    <Select.Option value={""} disabled>
                      Seleccione nueva Locación
                    </Select.Option>
                    {locations?.map((locations, index) => (
                      <Select.Option key={index} value={locations.id}>
                        {locations.direccion}
                      </Select.Option>
                    ))}
                  </Select>
                  <label className="label text-error">
                    {errors.locacion?.message}
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Estado</span>
                  </label>
                  <Select
                    {...register("estado", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                  >
                    <Select.Option value={""} disabled>
                      Seleccione nueva Locación
                    </Select.Option>
                    {EstadoArticulo.map((estado, index) => (
                      <Select.Option key={index} value={estado.codigo}>
                        {estado.nombre}
                      </Select.Option>
                    ))}
                  </Select>
                  <label className="label text-error">
                    {errors.estado?.message}
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Cantidad</span>
                  </label>
                  <Input
                    {...register("cantidad", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números",
                      },
                      min: {
                        value: 1,
                        message: "El valor mínimo es 1",
                      },
                      max: {
                        value: cantidad,
                        message: `El valor máximo es ${cantidad}`,
                      },
                    })}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <label className="label text-error">
                    <span>{errors.cantidad?.message}</span>
                  </label>
                </div>
              </div>
              <div className="my-2">
                <div className="flex items-center justify-center">
                  <Button
                    type="submit"
                    className="text-base-100"
                    color="primary"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <ChangeStock
        modalRef={stockRef}
        stock={stockSelected}
        product={productSelected}
        update={update}
      ></ChangeStock>
      <div className="flex flex-col bordered rounded shadow-md ">
        <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-t-lg">
          <h3 className="text-large font-bold text-base-100 text-center">
            {locacion.direccion}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th align="right">Año</th>
                <th align="right">Stock Min </th>
                <th align="right">Total en almacen</th>
                <th align="right">Cantidad</th>
                <th>Estado</th>
                <th align="center">Acciones</th>
                <th align="center">Stock</th>
              </tr>
            </thead>
            <tbody>
              {articulosFilter.map((e, index) => (
                <tr
                  className={` ${CalculateStock(stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.cantidadMinima, stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.stock)}`}
                  key={index}
                >
                  <th className="text-bold">{index + 1}</th>
                  <td>
                    <span className="font-bold">{e.nombre}</span>
                    <br />
                    <span>
                      {e.familia} - {e.subfamilia}
                    </span>
                  </td>
                  <td align="right" className="font-bold">
                    {e.anoNumero}
                  </td>
                  <td
                    className={`${CalculateStock(stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.cantidadMinima, stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.stock, "font")}`}
                    align={!avoidStatus.includes(e.estado) ? "right" : "center"}
                  >
                    {!avoidStatus.includes(e.estado)
                      ? stock.find(
                          (x) =>
                            x.anoNumero === e.anoNumero &&
                            x.articuloId === e.articuloId,
                        )?.cantidadMinima
                      : "-"}
                  </td>
                  <td
                    className={`${CalculateStock(stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.cantidadMinima, stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.stock, "font")}`}
                    align={!avoidStatus.includes(e.estado) ? "right" : "center"}
                  >
                    {!avoidStatus.includes(e.estado)
                      ? stock.find(
                          (x) =>
                            x.anoNumero === e.anoNumero &&
                            x.articuloId === e.articuloId,
                        )?.stock
                      : "-"}
                  </td>
                  <td className="font-bold" align="right">
                    {e.cantidad}
                  </td>
                  <td className="font-semibold">
                    {
                      EstadoArticulo.find(
                        (estado) => e.estado === estado.codigo,
                      )?.nombre
                    }
                  </td>
                  <td align="center">
                    <button type="button" onClick={() => handleShowLocation(e)}>
                      <FaArrowsLeftRight className="h-4 w-4 text-primary" />
                    </button>
                  </td>
                  <td align="center">
                    {!avoidStatus.includes(e.estado) ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleShowStock(
                            stock.find(
                              (x) =>
                                x.anoNumero === e.anoNumero &&
                                x.articuloId === e.articuloId,
                            )!,
                            e,
                          );
                        }}
                      >
                        <LuPackagePlus className="h-4 w-4 text-primary" />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function WithoutLocations({
  articulos,
  estados,
  locations,
  almacen,
  update,
  stock,
}: {
  articulos: articuloI[];
  estados: estadosI[];
  locations: ILocacion[];
  almacen: IAlmacenTA;
  update: () => Promise<void>;
  stock: {
    anoNumero: number;
    articuloId: string;
    cantidadMinima: number;
    stock: number;
  }[];
}) {
  const [cantidad, setCantidad] = useState<number>(0);

  const validationSchemaLocation = z.object({
    almacen: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    articulo: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    estado: z.number({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    estadoInicial: z.number({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    locacion: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }),
    locacionOrigen: z
      .string({
        required_error: "Campo inválido",
        invalid_type_error: "Campo inválido",
      })
      .nullish(),
    cantidad: z
      .number({})
      .min(1, "La cantidad mínima es 1")
      .max(cantidad, `La cantidad máxima es ${cantidad}`),
    anoNumero: z.number(),
  });
  const methodsLocation = useForm<{
    almacen: string;
    articulo: string;
    estado: number;
    estadoInicial: number;
    locacion: string | undefined;
    locacionOrigen: string | undefined;
    anoNumero: number;
    cantidad: number;
  }>({
    resolver: zodResolver(validationSchemaLocation),
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = methodsLocation;
  const { jwt } = useUserStore();

  const Submit = async (data: {
    anoNumero: number;
    almacen: string;
    articulo: string;
    estado: number;
    estadoInicial: number;
    locacion: string | undefined;
    cantidad: number;
  }) => {
    try {
      await api_putAlmacenArticulo(jwt, data);
      await update();
      handleCloseLocation();
      console.log(data);
    } catch (error) {
      toast.error("Ha ocurrido un error.");
    }
  };
  const router = useRouter();
  const [articulosFilter, setArticulosFilter] = useState<articuloI[]>([]);
  useEffect(() => {
    setArticulosFilter(articulos.filter((e) => !e.locacion));
  }, [articulos]);
  const locationRef = useRef<HTMLDialogElement>(null);
  const handleShowLocation = useCallback(
    (element: articuloI) => {
      reset();
      setValue("almacen", almacen.id);
      setValue("articulo", element.articuloId);
      setValue("estado", element.estado);
      setValue("estadoInicial", element.estado);
      setValue("locacion", element.locacion);
      setValue("locacionOrigen", element.locacion);
      setValue("anoNumero", element.anoNumero);
      setValue("cantidad", element.cantidad);
      setCantidad(element.cantidad);
      locationRef.current?.showModal();
    },
    [locationRef],
  );

  const handleCloseLocation = useCallback(() => {
    locationRef.current?.close();
  }, [locationRef]);

  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
  const CalculateStock = (
    stock?: number,
    cuantity?: number,
    destiny?: string,
  ) => {
    if (stock === undefined || cuantity === undefined) return;
    if (cuantity <= stock) {
      if (destiny === "font") {
        return "font-semibold text-red-500";
      }
      return "bg-red-200 hover:bg-red-300";
    }
    return "hover";
  };
  const [stockSelected, setStockSelected] = useState<{
    anoNumero: number;
    articuloId: string;
    cantidadMinima: number;
    stock: number;
  }>({ anoNumero: 0, articuloId: "", cantidadMinima: 0, stock: 0 });
  const [productSelected, setProductSelected] = useState<articuloI>({
    anoNumero: 0,
    articuloId: "",
    cantidad: 0,
    descripcion: "",
    estado: 0,
    locacion: "",
    nombre: "",
    familia: "",
    subfamilia: "",
  });

  const stockRef = useRef<HTMLDialogElement>(null);
  const handleShowStock = useCallback(
    (
      stock: {
        anoNumero: number;
        articuloId: string;
        cantidadMinima: number;
        stock: number;
      },
      element: articuloI,
    ) => {
      stockRef.current?.showModal();
      setStockSelected(stock);
      setProductSelected(element);
    },
    [stockRef],
  );

  const handleCloseStock = useCallback(() => {
    stockRef.current?.close();
  }, [stockRef]);

  return (
    <>
      <Modal backdrop responsive ref={locationRef}>
        <Modal.Header className="font-bold">Ubicación</Modal.Header>
        <Divider />
        <Modal.Body>
          <form onSubmit={handleSubmit((d) => Submit(d))}>
            <div className="my-2">
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Locación</span>
                  </label>
                  <Select
                    defaultValue={""}
                    {...register("locacion", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  >
                    <Select.Option value={""} disabled>
                      Seleccione nueva Locación
                    </Select.Option>
                    {locations?.map((locations, index) => (
                      <Select.Option key={index} value={locations.id}>
                        {locations.direccion}
                      </Select.Option>
                    ))}
                  </Select>
                  <label className="label text-error">
                    {errors.locacion?.message}
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Estado</span>
                  </label>
                  <Select
                    {...register("estado", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                  >
                    <Select.Option value={""} disabled>
                      Seleccione estado
                    </Select.Option>
                    {EstadoArticulo.map((estado, index) => (
                      <Select.Option key={index} value={estado.codigo}>
                        {estado.nombre}
                      </Select.Option>
                    ))}
                  </Select>
                  <label className="label text-error">
                    {errors.estado?.message}
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                  <label className="label">
                    <span className="label-text">Cantidad</span>
                  </label>
                  <Input
                    {...register("cantidad", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números",
                      },
                      min: {
                        value: 1,
                        message: "El valor mínimo es 1",
                      },
                      max: {
                        value: cantidad,
                        message: `El valor máximo es ${cantidad}`,
                      },
                    })}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <label className="label text-error">
                    <span>{errors.cantidad?.message}</span>
                  </label>
                </div>
              </div>

              <div className="my-2">
                <div className="flex items-center justify-center">
                  <Button
                    type="submit"
                    className="text-base-100"
                    color="primary"
                  >
                    Guardar <FaSave />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <ChangeStock
        modalRef={stockRef}
        stock={stockSelected}
        product={productSelected}
        update={update}
      />
      <div className="flex flex-col bordered rounded shadow-md ">
        <div className="flex flex-row justify-between bg-error px-6 py-4 rounded-t-lg">
          <h3 className="text-large font-bold text-base-100 text-center">
            Artículos sin locación
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Año</th>
                <th align="right">Stock Min </th>
                <th align="right">Total en almacen</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th align="center">Acciones</th>
                <th align="center">Stock</th>
              </tr>
            </thead>
            <tbody>
              {articulosFilter.map((e, index) => (
                <tr
                  className={`${CalculateStock(stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.cantidadMinima, stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.stock)}`}
                  key={index}
                >
                  <th className="text-bold">{index + 1}</th>
                  <td>
                    <span className="font-bold">{e.nombre}</span>
                    <br />
                    <span>
                      {e.familia} - {e.subfamilia}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold">{e.anoNumero}</span>
                  </td>
                  <td
                    className={`${CalculateStock(stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.cantidadMinima, stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.stock, "font")}`}
                    align={!avoidStatus.includes(e.estado) ? "right" : "center"}
                  >
                    {!avoidStatus.includes(e.estado)
                      ? stock.find(
                          (x) =>
                            x.anoNumero === e.anoNumero &&
                            x.articuloId === e.articuloId,
                        )?.cantidadMinima
                      : "-"}
                  </td>
                  <td
                    className={`${CalculateStock(stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.cantidadMinima, stock.find((x) => x.anoNumero === e.anoNumero && x.articuloId === e.articuloId)?.stock, "font")}`}
                    align={!avoidStatus.includes(e.estado) ? "right" : "center"}
                  >
                    {!avoidStatus.includes(e.estado)
                      ? stock.find(
                          (x) =>
                            x.anoNumero === e.anoNumero &&
                            x.articuloId === e.articuloId,
                        )?.stock
                      : "-"}
                  </td>
                  <td align="right">{e.cantidad}</td>
                  <td className="font-semibold">
                    {
                      EstadoArticulo.find(
                        (estado) => e.estado === estado.codigo,
                      )?.nombre
                    }
                  </td>
                  <td>
                    <button className="button hover:font-bold">
                      <ArchiveBoxIcon
                        className="h-4 w-4 text-primary hover:font-bold"
                        onClick={() => handleShowLocation(e)}
                      />
                    </button>
                  </td>
                  <td align="center">
                    <button
                      type="button"
                      onClick={() => {
                        handleShowStock(
                          stock.find(
                            (x) =>
                              x.anoNumero === e.anoNumero &&
                              x.articuloId === e.articuloId,
                          )!,
                          e,
                        );
                      }}
                    >
                      <LuPackagePlus className="h-4 w-4 text-primary" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ChangeStock({
  modalRef,
  stock,
  product,
  update,
}: {
  modalRef: React.RefObject<HTMLDialogElement>;
  stock: {
    anoNumero: number;
    articuloId: string;
    cantidadMinima: number;
    stock: number;
  };
  product: articuloI;
  update: () => Promise<void>;
}) {
  const Schema = z.object({
    anoNumero: z.number(),
    articuloId: z.string(),
    stock: z.number().min(1, "Se requiere que el stock sea mayor a 1"),
  });
  const { jwt } = useUserStore();
  const params = useParams();
  const methods = useForm<{
    anoNumero: number;
    articuloId: string;
    stock: number;
  }>({
    resolver: zodResolver(Schema),
  });
  useEffect(() => {
    setValue("anoNumero", stock.anoNumero);
    setValue("articuloId", stock.articuloId);
    setValue("stock", stock.cantidadMinima);
  }, [product, stock]);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = methods;
  const Submit = async (data: {
    anoNumero: number;
    articuloId: string;
    stock: number;
  }) => {
    try {
      setIsLoading(true);
      const param = params.id as string;
      await api_putAlmacenArticuloStock({ ...data, almacen: param }, jwt);
      toast.success("¡El stock se actualizó correctamente!");
      update();
      setIsLoading(false);
      modalRef.current?.close();
    } catch (error) {
      toast.error("Ha ocurrido un error.");
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Modal backdrop responsive ref={modalRef}>
      <Modal.Header className="font-bold">Modificacion de Stock</Modal.Header>
      <Divider />
      <Modal.Body>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((d) => Submit(d))}
        >
          <span>
            Producto: {product.nombre} - {product.anoNumero}
          </span>
          <span>Cantidad en almacén: {stock.stock}</span>
          <div className="flex flex-wrap">
            <div className="flex flex-col w-full">
              <label className="label">
                <span className="label-text">Cantidad</span>
              </label>
              <Input
                {...register("stock", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Solo se permiten números",
                  },
                  min: {
                    value: 1,
                    message: "El valor mínimo es 1",
                  },
                })}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              <label className="label text-error">
                <span>{errors.stock?.message}</span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button
              disabled={isLoading}
              type="submit"
              className="text-base-100"
              color="primary"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
