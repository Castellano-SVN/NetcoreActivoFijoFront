import { IArticulo, IBodega, ICentroCosto, IEmpresa, ITipoDocumento } from "@/interfaces/creation";
import { api_getArticulos, api_getBodegas, api_getOneEmpresa, api_getTipoDocumentos } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Divider, Input, Select } from "react-daisyui";
import { SubmitHandler, useForm } from "react-hook-form";
import { RecepcionSchema } from "../../schemas/tipo_almacen.schema";
interface IRecepcionForm {
  CentroCostoId: string;
  year: string;
  bodegaId: string;
  FechaDocumento: Date;
  TipoDocumento: number;
  NumeroDocumento: number;
}

export default function Index() {
  const { setActive } = useContextStore();
  const router = useRouter();
  const { jwt } = useUserStore();
  useEffect(() => {
    setActive("Recepcion");
  }, []);
  const {
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IRecepcionForm>({
    resolver: zodResolver(RecepcionSchema),
    mode: "onSubmit",
  });

  const [slugs, setSlugs] = useState<{ empresa: string }>();
  const [dataEmpresa, setDataEmpresa] = useState<IEmpresa>();
  const [centroCostos, setCentroCostos] = useState<ICentroCosto[]>([]);
  const [bodegas, setBodegas] = useState<IBodega[]>([]);
  const [tipoDocumentos, setTipoDocumento] = useState<ITipoDocumento[]>([]);

  const [meta, setMeta] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const getEmpresa = async (id: string) => {
    try {
      const dataGet = await api_getOneEmpresa(jwt, id);
      setDataEmpresa(dataGet.data.dataList[0]);
      setCentroCostos(dataGet.data.dataList[0].centroCostos);
    } catch (error) {
      router.back();
      console.log(error);
    }
  };
  const getBodegas = async (cc: string) => {
    try {
      const dataGet = await api_getBodegas(jwt, cc);
      setBodegas(dataGet.data.dataList);
    } catch (error) {
      router.back();
      console.log(error);
    }
  };

  const [dataArticulos, setArticulos] = useState<IArticulo[]>([]);
  const getArticulos = async (id: string) => {
    try {
      const dataGet = await api_getArticulos(jwt, id, meta.pages + 1);
      setArticulos(dataGet.data.dataList);
    } catch (error) {
      // router.back();
      console.log(error);
    }
  };

  const getDocumentos = async () => {
    try {
      const dataGet = await api_getTipoDocumentos(jwt);
      setTipoDocumento(dataGet.data.dataList);

    } catch (error) {
      // router.back();
      console.log(error);
    }
  };
  useEffect(() => {
    if (!router.query.slug) {
      // router.back();
      return;
    }
    const empresa = router.query.slug[0];
    getDocumentos()
    getEmpresa(empresa);
    setSlugs({
      empresa: empresa,
    });
    getArticulos(empresa);

  }, [router.query]);

  if (!dataEmpresa) return "cargando";
  if (!slugs?.empresa) return "cargando";
  const onSubmit: SubmitHandler<IRecepcionForm> = (data) => console.log(data);


  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container shadow-md md:mx-24 mt-2 sm:mt-4 rounded-lg">
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                {dataEmpresa.razonSocial}
              </span>
              <span className="text-left">{dataEmpresa.giro}</span>
            </div>
          </div>
          <Divider />
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4 px-16">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">Recepcion</span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col flex-wrap justify-center items-center">


              <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 mx-4 md:mx-0 lg:mx-0">
                <label className="label">
                  <span className="label-text font-bold">Centro de costo</span>
                </label>
                <label className="form-control w-full ">
                  <select
                    defaultValue={""}
                    className="select select-bordered"
                    {...register("CentroCostoId", {
                      onChange: (e) => {
                        getBodegas(getValues("CentroCostoId"));
                      },
                    })}
                  >
                    <option value={""} disabled>
                      Seleccione el centro de costo
                    </option>
                    {centroCostos.map((element: ICentroCosto, index: number) => (
                      <option key={index} value={element.id}>{element.nombre}</option>

                    ))}
                  </select>
                  <label className="label text-error">
                    {errors.CentroCostoId ? errors.CentroCostoId.message : ""}
                  </label>
                </label>
              </div>

              <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 mx-4 md:mx-0 lg:mx-0">
                <label className="label">
                  <span className="label-text font-bold">Bodega</span>
                </label>
                <select
                  defaultValue={""}
                  className="select select-bordered"
                  {...register("bodegaId", {
                    onChange: (e) => {
                    },
                  })}
                >
                  <option value={""} disabled>
                    Seleccione el centro de costo
                  </option>
                  {bodegas.map((element: IBodega, index: number) => (
                    <option key={index} value={element.id}>{element.nombre}</option>

                  ))}
                </select>
                <label className="label text-error">
                  {errors.bodegaId ? errors.bodegaId.message : ""}
                </label>

              </div>

              <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 mx-4 md:mx-0 lg:mx-0">
                <label className="label">
                  <span className="label-text font-bold">Tipo documentos</span>
                </label>
                <div className="flex flex-row space-x-2">
                  {
                    tipoDocumentos.map((e: ITipoDocumento, index: number) => (

                      <label key={index} className="cursor-pointer flex items-center space-x-2">
                        <input type="radio" name="radio-10" className="radio checked:bg-primary" />
                        <span className="label-text">{e.descripcion}</span>
                      </label>


                    ))
                  }

                </div>
                <label className="label text-error">
                  {errors.TipoDocumento ? errors.TipoDocumento.message : ""}
                </label>
              </div>

              <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 mx-4 md:mx-0 lg:mx-0">
                <label className="label">
                  <span className="label-text font-bold">Numero de documento:</span>
                </label>
                <Input />
                <label className="label text-error">
                  {errors.NumeroDocumento && (
                    <span>{errors.NumeroDocumento.message}</span>
                  )}
                </label>
              </div>

              <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 mx-4 md:mx-0 lg:mx-0">
                <label className="label">
                  <span className="label-text font-bold">Fecha documento:</span>
                </label>
                <Input type="date" />
                <label className="label text-error">
                  {errors.NumeroDocumento && (
                    <span>{errors.NumeroDocumento.message}</span>
                  )}
                </label>
              </div>

            </div>
            <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4 px-16">
              <div className="flex flex-col">
                <span className="font-bold text-2xl mb-2">Articulos</span>
                <div>
                  <div className="overflow-x-auto w-auto rounded-lg border mb-4">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th className="font-bold text-black">Código</th>
                          <th className="font-bold text-black">Nombre</th>
                          <th className="font-bold text-black">Cantidad</th>
                          <th className="font-bold text-black">Precio</th>
                          <th className="font-bold text-black">Observaciones</th>
                          <th className="font-bold text-black">Recepcionado</th>
                          <th className="font-bold text-black">Por recepcionar</th>
                          <th className="font-bold text-black">Cantidad Recibida</th>
                          <th className="font-bold text-black">Observacion</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {dataArticulos.map((articulo: IArticulo, index) => (
                          <tr key={index} className="hover:bg-[#FAF6FF]">
                            <td>{articulo.codigo}</td>
                            <td>{articulo.nombre}</td>
                            <td>0</td>
                            <td>{articulo.articuloValors.map((valor, i) => (
                              <div key={i}>{valor.valor}</div>
                            ))}</td>
                            <td>{articulo.descripcion}</td>
                            <td>0</td>
                            <td>0</td>
                            <td><Input type="Number" className="w-full"/></td>
                            <td><Input type="text" className="w-full"/></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* <CreateCotizacion guid={slugs?.empresa} /> */}
          {/* <Show  empresaId={slugs.empresa}/> */}
        </div>
      </div>
    </>
  );
}
