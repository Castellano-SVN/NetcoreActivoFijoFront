import { useFormContext } from "react-hook-form";
import { FormValueRecepcionData } from "../../../interfaces/creation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUserStore } from "../../../store/user.store";
import {
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllBodegaByEmpresaYCentroCosto,
  api_getAllBodegas,
  api_getAllCentroCostoByEmpresa,
} from "../../../services/bodega.service";
import {
  recepcionCOC,
  ubicacionRecepcionI,
} from "../../../interfaces/recepcion.interface";
interface props {
  empresa: string;
  filterCC: string[];
  dispatchStrings?:Dispatch<SetStateAction<{
    centrocosto?: string;
    bodega?: string;
    almacen?: string;
  }>>
}
export default function UbicacionRecepcion(props: props) {
  const { jwt } = useUserStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
    watch,
  } = useFormContext<ubicacionRecepcionI>();
  const [cc, setCC] = useState<{ nombre: string; id: string }[]>([]);
  const [bodegas, setBodegas] = useState<{ nombre: string; id: string }[]>([]);
  const [almacens, setAlmacens] = useState<{ nombre: string; id: string }[]>(
    []
  );
  const ccWatch = watch("cc");
  const ccBodega = watch("bodega");
  const ccAlmacen = watch("almacen");
  useEffect(() => {
    getCentroCostos();
  }, []);

  const getCentroCostos = async () => {
    const cc = await api_getAllCentroCostoByEmpresa(jwt, props.empresa);
    if (props.filterCC.length !== 0) {
      const filteredArray = cc.data.dataList.filter((obj: { id: string }) =>
        props.filterCC.includes(obj.id)
      );
      setCC(filteredArray);
      setValue("cc", filteredArray[0]?.id);
    }
    setCC(cc.data.dataList);
    setValue("cc", cc.data.dataList[0].id);
  };

  const getBodegas = async () => {
    const bodegas = await api_getAllBodegaByEmpresaYCentroCosto(
      jwt,
      props.empresa,
      ccWatch
    );
    setBodegas(bodegas.data.dataList);
    //if(!bodegas ||  !bodegas.data || !bodegas.data.dataList || bodegas.data.dataList.length === 0) return;
    setValue("bodega", bodegas.data.dataList[0].id);
  };
  const getAlmacens = async () => {
    const alm = await api_getAllAlmacenByEmpByCenByBod(
      jwt,
      props.empresa,
      ccWatch,
      ccBodega
    );
    setAlmacens(alm.data.dataList);
    setValue("almacen", alm.data.dataList[0]?.id);
  };
  useEffect(() => {
    if (!ccWatch) return;
    getBodegas();
    
  }, [ccWatch]);

  useEffect(() => {
    if (!ccBodega) return;
    getAlmacens();
  }, [ccBodega]);

  useEffect(() => {
    if ((ccAlmacen ) && almacens.length === 0) return;

    if (props.dispatchStrings) {
      props.dispatchStrings(
        {centrocosto:cc.find(e => e.id === ccWatch)?.nombre,
          bodega:bodegas.find(e => e.id === ccBodega)?.nombre,
          almacen:almacens.find(e => e.id === ccAlmacen)?.nombre
        }
      )
    }
  },[ccAlmacen])
  return (
    <>
      <div className="flex flex-col md:flex-row lg:flex-row justify-between">
        <div className="w-full md:mr-2 lg:mr-2">
          <div className="mt-2">
            <label className="block text-left mb-2" htmlFor="centroDeCosto">
              Centro de costo:
            </label>
            <select
              {...register("cc")}
              className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              {cc.map((cc, index) => (
                <option key={index} value={cc.id}>
                  {cc.nombre}
                </option>
              ))}
            </select>
            {errors.cc && (
              <span className="text-red-600">{errors.cc.message}</span>
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="mt-2">
            <label className="block text-left mb-2" htmlFor="bodega">
              Bodega:
            </label>
            <select
              {...register("bodega")}
              className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              {bodegas.map((cc, index) => (
                <option key={index} value={cc.id}>
                  {cc.nombre}
                </option>
              ))}
            </select>
            {errors.bodega && (
              <span className="text-red-600">{errors.bodega.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row lg:flex-row justify-between">
        <div className="w-full md:mr-2 lg:mr-2">
          <div className="mt-2">
            <label className="block text-left mb-2" htmlFor="bodega">
              Almacén:
            </label>
            <select
              {...register("almacen")}
              className="mt-1 block w-1/2 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              {almacens.map((cc, index) => (
                <option key={index} value={cc.id}>
                  {cc.nombre}
                </option>
              ))}
            </select>
            {errors.almacen && (
              <span className="text-red-600">{errors.almacen.message}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
