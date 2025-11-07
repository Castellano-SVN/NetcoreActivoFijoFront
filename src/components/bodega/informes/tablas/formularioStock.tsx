import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import { IBodega, ICentroCosto } from "@/interfaces/creation";
import { useEffect, useState } from "react";
import { IAlmacen } from "@/interfaces/modules/IAlmacen.interface";
import router, { useRouter } from "next/router";
import { useUserStore } from "@/store/user.store";
import {
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllBodegaByEmpresaYCentroCosto,
  api_getAllCentroCostoByEmpresa,
} from "@/services/bodega.service";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WarningAlert from "@/components/alerts/warningAlert";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
interface FormData {
  centro: string;
  bodega: string;
  almacen: string;
  Desde: Date;
  Hasta: Date;
}
interface submitI {
  centro: string;
  bodega: string;
  almacen: string;
  // El signo de interrogación '?' indica que este campo es opcional
  Desde: string;
  Hasta: string;
}
const formSchema = z.object({
  // Campos requeridos
  centro: z
    .string({ required_error: "Se necesita seleccionar una opcion" })
    .min(1, { message: "El Centro es obligatorio" }),
  bodega: z
    .string({ required_error: "Se necesita seleccionar una opcion" })
    .min(1, { message: "La Bodega es obligatoria" }),
  almacen: z
    .string({ required_error: "Se necesita seleccionar una opcion" })
    .optional(),
  Desde: z.date({
    required_error: "Campo requerido",
    invalid_type_error: "Tipo invalido",
  }),
  Hasta: z.date({
    required_error: "Campo requerido",
    invalid_type_error: "Tipo invalido",
  }),
});

export default function FormularioStock({
  loadData,
}: {
  loadData: (data: submitI) => void;
}) {
  const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>([]);
  const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
  const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
  const { jwt } = useUserStore();
  const { empresa } = router.query;

  const getAllCentroCostosByEmpresa = async () => {
    try {
      const data2 = await api_getAllCentroCostoByEmpresa(
        jwt,
        empresa as string,
      );
      setDataCentroCosto(data2.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllBodegasByEmpresaYCentroCosto = async (CentroCosto: string) => {
    try {
      const data = await api_getAllBodegaByEmpresaYCentroCosto(
        jwt,
        empresa as string,
        CentroCosto,
      );
      setDataBodega(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllAlmacenByEmpByCenByBod = async (
    CentroCosto: string,
    Bodega: string,
  ) => {
    try {
      const data = await api_getAllAlmacenByEmpByCenByBod(
        jwt,
        empresa as string,
        CentroCosto,
        Bodega,
      );
      setDataAlmacen(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!empresa) return;
    getAllCentroCostosByEmpresa();
  }, [empresa]);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Desde: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      Hasta: new Date(),
    },
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
  const fechaDesde = watch("Desde");
  const fechaHasta = watch("Hasta");

  const onSubmit = async (data: FormData) => {
    const clone: submitI = {
      Desde: data.Desde.toISOString().split("T")[0],
      Hasta: data.Hasta.toISOString().split("T")[0],
      almacen: data.almacen,
      bodega: data.bodega,
      centro: data.centro,
    };
    loadData(clone);
    // Aquí puedes realizar el envío a tu API, etc.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="w-11/12 md:w-8/12 m-auto border shadow-md rounded-lg p-2 transition duration-300 transform hover:border-primary mt-3">
        <legend>Filtro</legend>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <Controller
              control={control}
              name="centro"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  className="mt-2 px-0 md:px-8"
                  placeholder="Seleccione Centro costo"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nombre}
                  value={dataCentroCosto.find((e) => e.id === value)}
                  options={dataCentroCosto}
                  onChange={(val) => {
                    setValue("centro", val?.id as string);
                    getAllBodegasByEmpresaYCentroCosto(val?.id as string);
                  }}
                  menuPortalTarget={document.body}
                  loadingMessage={() => "Cargando opciones..."}
                  isLoading={dataCentroCosto.length === 0}
                  isClearable
                />
              )}
            />
            {errors.centro && (
              <span className="text-red-600 block">
                {errors.centro.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="bodega"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  className="mt-2 px-0 md:px-8"
                  placeholder="Seleccione Bodega"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nombre}
                  value={dataBodega.find((e) => e.id === value)}
                  options={dataBodega}
                  onChange={(val) => {
                    console.log("se ejecuto");
                    setValue("bodega", val?.id as string);
                    getAllAlmacenByEmpByCenByBod(
                      getValues("centro"),
                      val?.id as string,
                    );
                  }}
                  menuPortalTarget={document.body}
                  loadingMessage={() => "Cargando opciones..."}
                  isLoading={dataCentroCosto.length === 0}
                  isClearable
                />
              )}
            />
            {errors.bodega && (
              <span className="text-red-600 block">
                {errors.bodega.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="almacen"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  className="mt-2 px-0 md:px-8 "
                  placeholder="Seleccione un almacén"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nombre}
                  value={dataAlmacen.find((e) => e.id === value)}
                  options={dataAlmacen}
                  onChange={(val) => setValue("almacen", val?.id as string)}
                  menuPortalTarget={document.body}
                  loadingMessage={() => "Cargando opciones..."}
                  isLoading={dataAlmacen.length === 0}
                  isClearable
                />
              )}
            />
            {errors.almacen && (
              <span className="text-red-600 block">
                {errors.almacen.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          /* onClick={() => getMovimientoArticulo()} */
          className="btn btn-outline btn-primary mt-3"
        >
          Buscar
        </button>
      </fieldset>
    </form>
  );
}
