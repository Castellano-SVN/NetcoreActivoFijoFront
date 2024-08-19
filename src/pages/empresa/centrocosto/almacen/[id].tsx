import { useRouter } from "next/router";
import { useUserStore } from "../../../../store/user.store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAlmacenById,
  api_getEstadoArticulos,
  api_getTipoLocation,
  api_postLocation,
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
import { FaArchive, FaArrowLeft, FaEye } from "react-icons/fa";
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
interface IAlmacenTA extends IAlmacen {
  tipoAlmacen: ItipoAlmacen;
  locacions: ILocacion[];

}
interface articuloI {
  articuloId: string;
  cantidad: number;
  locacion: string  | undefined;
  nombre: string;
  descripcion: string;
  subfamilia: string;
  familia: string;
  estado:number;
}
interface estadosI {
  codigo:number;nombre:string;
}
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
  const [estadosArticulos,setEstadosArticulos] = useState<estadosI[]>([])
  const [articulos,setArticulos] = useState<articuloI[]>([])
  const [almacen, setAlmacen] = useState<IAlmacenTA>();
  
  const { isLoading, error, data, refetch } = useQuery(
    "AlmacenByID",
    () => api_getAlmacenById(jwt, router.query.id as string),
    {
      enabled: router.query.id !== undefined && almacen === undefined,
      onSuccess: (data) => {
        setAlmacen(data.data.dataList[0]);
      },
      onError: (err: AxiosError) => {
        toast.error("Ocurrio un error buscando al buscar el almacen");
        return router.back();
      },
    }
  );
  const locationRef = useRef<HTMLDialogElement>(null);
  const handleShowLocation = useCallback(() => {
    reset();
    defaultValues();
    locationRef.current?.showModal();
  }, [locationRef]);

  const handleCloseLocation = useCallback(() => {
    locationRef.current?.close();
  }, [locationRef]);

  const getArticles = async () => {
    if (!almacen) return;
    const articles = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(jwt,almacen.empresaId,almacen.centroCostoId,almacen.bodegaId,almacen.id)
    const estados = await api_getEstadoArticulos(jwt)
    setEstadosArticulos(estados.data.dataList)

    const  newElementsArticles: articuloI[] = [];
    articles.data.dataList.map((e:any) => {
      newElementsArticles.push({
        articuloId:e.articuloId,
        cantidad:e.cantidad,
        descripcion:e.articulo.descripcion,
        familia: e.articulo.subFamilium.familium.nombre,
        locacion: e.locacionId,
        nombre: e.articulo.nombre,
        subfamilia: e.articulo.subFamilium.nombre,
        estado:e.estadoArticuloCodigo
      })
    })

    setArticulos(newElementsArticles);
  }

  const LocationSubmit = async (data: LocationFormValues) => {
    try {
      await api_postLocation(jwt, data);
      toast.success("¡La nueva ubicación se creo correctamente!");
      reset();
      handleCloseLocation();
      refetch();
    } catch (error) {
      toast.error("Ha ocurrido un error.");
      console.log(error);
    }
  };
  const [dataLocation, setDataLocation] = useState<ITipoLocation[]>([]);
  const getTipoLocation = async () => {
    try {
      if (!almacen) return;
      const data = await api_getTipoLocation(jwt, almacen?.empresaId);
      setDataLocation(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  const defaultValues = () => {
    if (!almacen) return;
    setValue("AlmacenId", almacen.id);
    setValue("BodegaId", almacen.bodegaId);
    setValue("CentroCostoId", almacen.centroCostoId);
    setValue("EmpresaId", almacen.empresaId);
  };
  useEffect(() => {
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
                      Seleccione El tipo de Locacion
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
                  <Button type="submit" className="text-base-100" color="primary">Guardar</Button>
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
              Almacen
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
          <button type="button" className="btn btn-primary mt-2 md:mt-0" onClick={() => router.back()}><FaArrowLeft />Volver</button>
          <div className="join">
            {!isLoading && (
              <button
                onClick={handleShowLocation}
                className="btn btn-primary join-item animate-fadein"
              >
                <FiPlus />
                Crear locacion
              </button>
            )}
            <button onClick={() => router.push(`/empresa/centrocosto/almacen/tipolocacion/${almacen?.empresaId}`)} className="btn btn-primary join-item">
              <FiPlus /> Tipo Locacion
            </button>
          </div>
        </div>
        {!isLoading && almacen ? (
          <div className="w-full mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            
            {almacen?.locacions.map((e,index) => <Locations key={index} almacen={almacen} locacion={e} articulos={articulos} estados={estadosArticulos} locations={almacen?.locacions}/>)}
            <WithoutLocations almacen={almacen}  articulos={articulos} estados={estadosArticulos} locations={almacen?.locacions}/>
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

function Locations({ locacion,articulos,estados,locations,almacen }: { locacion: ILocacion,articulos:articuloI[],estados:estadosI[],locations: ILocacion[], almacen:IAlmacenTA }) {
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
    locacion: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }).optional(),
  });
  const methodsLocation = useForm<{almacen:string,articulo:string,estado:number,locacion:string | undefined}>({
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
  const Submit = async (data: {almacen:string,articulo:string,estado:number,locacion:string | undefined}) => {
    try {
      console.log('ACTUALIZACION')
    } catch (error) {
      toast.error("Ha ocurrido un error.");
      console.log(error);
    }
  };
  const router = useRouter();
  const [articulosFilter,setArticulosFilter] = useState<articuloI[]>([])

  useEffect(() => {
    setArticulosFilter(articulos.filter(e => e.locacion === locacion.id))
  },[articulos])
  const locationRef = useRef<HTMLDialogElement>(null);
  const handleShowLocation = useCallback((element:articuloI) => {
    reset();
    setValue("almacen",almacen.id)
    setValue("articulo",element.articuloId);
    setValue("estado",element.estado);
    setValue("locacion",element.locacion);
    locationRef.current?.showModal();
  }, [locationRef]);

  const handleCloseLocation = useCallback(() => {
    locationRef.current?.close();
  }, [locationRef]);
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
                      Seleccione nueva Locacion
                    </Select.Option>
                    {locations.map((locations, index) => (
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
                      setValueAs: (value) => (value === "" ? undefined : Number(value)),
                    })}
                  >
                    <Select.Option value={""} disabled>
                      Seleccione nueva Locacion
                    </Select.Option>
                    {estados.map((estado, index) => (
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
              <div className="my-2">
                <div className="flex items-center justify-center">
                  <Button type="submit" className="text-base-100" color="primary">Guardar</Button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
          <div className="flex flex-col bordered rounded shadow-md ">
          <div className="flex flex-row justify-between bg-primary px-6 py-4 rounded-t-lg">
            <h3 className="text-large font-bold text-base-100 text-center">
            Articulos sin locacion
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
      <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        
          {articulosFilter.map((e,index) =>  (
            <tr className="hover">
              <th className="text-bold">{index + 1}</th>
              <td>
                <span className="font-bold">
                  {e.nombre}
                  </span>
                  <br />
                  <span>{e.familia} - {e.subfamilia}</span>
                </td>
              <td>{e.cantidad}</td>
              <td className="font-semibold">{estados.find(estado => e.estado === estado.codigo)?.nombre}</td>
              <td>
                <button type="button">
                  <FaEye className="h-4 w-4 text-primary" onClick={()=> handleShowLocation(e)} />
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
          </div>
        </div>
    
  </>
  );
}

function WithoutLocations({articulos,estados,locations,almacen }: { articulos:articuloI[],estados:estadosI[],locations: ILocacion[], almacen:IAlmacenTA }) {
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
    locacion: z.string({
      required_error: "Campo inválido",
      invalid_type_error: "Campo inválido",
    }).optional(),
  });
  const methodsLocation = useForm<{almacen:string,articulo:string,estado:number,locacion:string | undefined}>({
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
  const Submit = async (data: {almacen:string,articulo:string,estado:number,locacion:string | undefined}) => {
    try {
      console.log('ACTUALIZACION')
    } catch (error) {
      toast.error("Ha ocurrido un error.");
      console.log(error);
    }
  };
  const router = useRouter();
  const [articulosFilter,setArticulosFilter] = useState<articuloI[]>([])

  useEffect(() => {
    setArticulosFilter(articulos.filter(e => !e.locacion))
  },[articulos])
  const locationRef = useRef<HTMLDialogElement>(null);
  const handleShowLocation = useCallback((element:articuloI) => {
    reset();
    setValue("almacen",almacen.id)
    setValue("articulo",element.articuloId);
    setValue("estado",element.estado);
    setValue("locacion",element.locacion);
    locationRef.current?.showModal();
  }, [locationRef]);

  const handleCloseLocation = useCallback(() => {
    locationRef.current?.close();
  }, [locationRef]);
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
                      Seleccione nueva Locacion
                    </Select.Option>
                    {locations.map((locations, index) => (
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
                      setValueAs: (value) => (value === "" ? undefined : Number(value)),
                    })}
                  >
                    <Select.Option value={""} disabled>
                      Seleccione nueva Locacion
                    </Select.Option>
                    {estados.map((estado, index) => (
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
              <div className="my-2">
                <div className="flex items-center justify-center">
                  <Button type="submit" className="text-base-100" color="primary">Guardar</Button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
          <div className="flex flex-col bordered rounded shadow-md ">
          <div className="flex flex-row justify-between bg-error px-6 py-4 rounded-t-lg">
            <h3 className="text-large font-bold text-base-100 text-center">
            Articulos sin locacion
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
      <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        
          {articulosFilter.map((e,index) =>  (
            <tr className="hover">
              <th className="text-bold">{index + 1}</th>
              <td>
                <span className="font-bold">
                  {e.nombre}
                  </span>
                  <br />
                  <span>{e.familia} - {e.subfamilia}</span>
                </td>
              <td>{e.cantidad}</td>
              <td className="font-semibold">{estados.find(estado => e.estado === estado.codigo)?.nombre}</td>
              <td>
                <button type="button">
                  <FaEye className="h-4 w-4 text-primary" onClick={()=> handleShowLocation(e)} />
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
          </div>
        </div>
    
  </>
  );
}
