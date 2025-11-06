import { IArticulo, IBodega, ICentroCosto } from "@/interfaces/creation";
import { IAlmacen } from "@/interfaces/modules/IAlmacen.interface";
import {
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllArticulosByAlmacen,
  api_getAllBodegaByEmpresaYCentroCosto,
  api_getAllCentroCostoByEmpresa,
} from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import { useContextStore } from "@/store/context.store";
import { useTiposStore } from "@/store/tipos.store";
import { api_getEstadoArticulos } from "@/services/inventario.service";

export default function InventarioFisico() {
  const { empresa } = router.query as { empresa: string };
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Informes");
  }, []);
  const { EstadoArticulo, setEstadoArticulo } = useTiposStore();
  const { jwt } = useUserStore();

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
  return (
    <>
      <div className="">
        <h1 className="text-2xl font-bold mt-4">
          Informe movimiento de artículo
        </h1>
        <BuscarArticulos EmpresaId={empresa} />
      </div>
    </>
  );
}

interface IFormulario {
  CentroCostoId: string;
  BodegaId: string;
  AlmacenId?: string;
  ArticuloId?: string;
  EncargadoTomaInventarioFisicoId: string;
  FechaInventario: Date;
}

interface props {
  EmpresaId: string;
}

function BuscarArticulos(props: props) {
  const { jwt } = useUserStore();

  const Schema = z.object({
    CentroCostoId: z.string(),
    BodegaId: z.string(),
    AlmacenId: z.string().optional(),
    ArticuloId: z.string().optional(),
    EncargadoTomaInventarioFisicoId: z.string(),
    FechaInventario: z.date(),
  });

  const methods = useForm<IFormulario>({
    resolver: zodResolver(Schema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    control,
    watch,
  } = methods;

  const CentroCostoId = watch("CentroCostoId");
  const BodegaId = watch("BodegaId");
  const AlmacenId = watch("AlmacenId");
  const ArticuloId = watch("ArticuloId");

  const [CentroCosto, setCentroCosto] = useState<ICentroCosto[]>([]);
  const getAllCentroCostosByEmpresa = async () => {
    try {
      const data = await api_getAllCentroCostoByEmpresa(jwt, props.EmpresaId);
      setCentroCosto(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!props.EmpresaId) return;
    getAllCentroCostosByEmpresa();
  }, [props.EmpresaId]);

  const [Bodega, setBodega] = useState<IBodega[]>([]);
  const getAllBodegasByEmpresaYCentroCosto = async () => {
    try {
      const data = await api_getAllBodegaByEmpresaYCentroCosto(
        jwt,
        props.EmpresaId,
        CentroCostoId,
      );
      setBodega(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!CentroCostoId || !props.EmpresaId) return;
    getAllBodegasByEmpresaYCentroCosto();
  }, [props.EmpresaId, CentroCostoId]);

  const [Almacen, setAlmacen] = useState<IAlmacen[]>([]);
  const getAllAlmacenByEmpByCenByBod = async () => {
    try {
      const data = await api_getAllAlmacenByEmpByCenByBod(
        jwt,
        props.EmpresaId,
        CentroCostoId,
        BodegaId,
      );
      setAlmacen(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!props.EmpresaId || !CentroCostoId || !BodegaId) return;
    getAllAlmacenByEmpByCenByBod();
  }, [props.EmpresaId, CentroCostoId, BodegaId]);

  const [Articulo, setArticulo] = useState<IArticulo[]>([]);
  const getAllArticulosByAlmacen = async () => {
    try {
      if (AlmacenId) {
        const data = await api_getAllArticulosByAlmacen(jwt, AlmacenId);
        setArticulo(data.data.dataList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!AlmacenId) return;
    getAllArticulosByAlmacen();
  }, [Almacen]);

  const onSubmit = async (data: IFormulario) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="w-11/12 md:w-8/12 m-auto border shadow-md rounded-lg p-2 transition duration-300 transform hover:border-primary mt-3">
          <legend>Filtro de inventario físico</legend>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col">
              <Controller
                control={control}
                name="CentroCostoId"
                render={({ field: { onChange, value, name, ref } }) => (
                  <Select
                    className="mt-2 px-0 md:px-8"
                    placeholder="Seleccione Centro costo*"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nombre}
                    value={CentroCosto.find((e) => e.id === value)}
                    options={CentroCosto}
                    onChange={(val) =>
                      setValue("CentroCostoId", val?.id as string)
                    }
                    menuPortalTarget={document.body}
                    loadingMessage={() => "Cargando opciones..."}
                    isLoading={CentroCosto.length === 0}
                    isClearable
                  />
                )}
              />
              {errors.CentroCostoId && (
                <span className="text-red-600 block">
                  {errors.CentroCostoId.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Controller
                control={control}
                name="BodegaId"
                render={({ field: { onChange, value, name, ref } }) => (
                  <Select
                    className="mt-2 px-0 md:px-8"
                    placeholder="Seleccione Bodega*"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nombre}
                    value={Bodega.find((e) => e.id === value)}
                    options={Bodega}
                    onChange={(val) => setValue("BodegaId", val?.id as string)}
                    menuPortalTarget={document.body}
                    loadingMessage={() => "Cargando opciones..."}
                    isLoading={Bodega.length === 0}
                    isClearable
                  />
                )}
              />
              {errors.BodegaId && (
                <span className="text-red-600 block">
                  {errors.BodegaId.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Controller
                control={control}
                name="AlmacenId"
                render={({ field: { onChange, value, name, ref } }) => (
                  <Select
                    className="mt-2 px-0 md:px-8 "
                    placeholder="Seleccione un almacén"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nombre}
                    value={Almacen.find((e) => e.id === value)}
                    options={Almacen}
                    onChange={(val) => setValue("AlmacenId", val?.id as string)}
                    menuPortalTarget={document.body}
                    loadingMessage={() => "Cargando opciones..."}
                    isLoading={Almacen.length === 0}
                    isClearable
                  />
                )}
              />
              {errors.AlmacenId && (
                <span className="text-red-600 block">
                  {errors.AlmacenId.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Controller
                control={control}
                name="ArticuloId"
                render={({ field: { onChange, value, name, ref } }) => (
                  <Select
                    className="mt-2 px-0 md:px-8"
                    placeholder="Seleccione Artículo"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.nombre}
                    value={Articulo.find((e) => e.id === value)}
                    options={Articulo}
                    onChange={(val) =>
                      setValue("ArticuloId", val?.id as string)
                    }
                    menuPortalTarget={document.body}
                    loadingMessage={() => "Cargando opciones..."}
                    isLoading={Articulo.length === 0}
                    isClearable
                  />
                )}
              />
              {errors.ArticuloId && (
                <span className="text-red-600 block">
                  {errors.ArticuloId.message}
                </span>
              )}
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
}
