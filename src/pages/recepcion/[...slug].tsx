import { IBodega, ICentroCosto, IEmpresa } from "@/interfaces/creation";
import { api_getBodegas, api_getOneEmpresa } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Divider, Select } from "react-daisyui";
import { SubmitHandler, useForm } from "react-hook-form";
import { RecepcionSchema } from "../../schemas/tipo_almacen.schema";
interface IRecepcionForm {
  CentroCostoId: string;
  year: string;
  bodegaId: string;
  FechaDocumento: Date;
  TipoDocumento: number;
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

  useEffect(() => {
    if (!router.query.slug) {
      // router.back();
      return;
    }
    const empresa = router.query.slug[0];
    getEmpresa(empresa);
    setSlugs({
      empresa: empresa,
    });
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
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">Recepcion</span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap">
              <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                <label className="label">
                  <span className="label-text">Centro de costo</span>
                </label>
                <label className="form-control w-full max-w-xs">
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
              <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                <label className="label">
                  <span className="label-text">Bodega</span>
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
                    {errors.CentroCostoId ? errors.CentroCostoId.message : ""}
                  </label>
                {/* <Select
                  defaultValue={""}
                  {...register("bodegaId", {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                >
                  <Select.Option value={""} disabled>
                    Seleccione el centro de costo
                  </Select.Option>
                  {bodegas.map((element: IBodega, index: number) => (
                    <Select.Option key={index} value={element.id}>
                      {element.nombre}
                    </Select.Option>
                  ))}
                </Select> */}
                <label className="label text-error">
                  {errors.CentroCostoId ? errors.CentroCostoId.message : ""}
                </label>
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
