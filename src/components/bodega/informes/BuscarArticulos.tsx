import TableMovArtAndTarjetaExi from "@/components/bodega/informes/tablas/TableMovArtAndTarjetaExi";
import PDFMovimientoArticulo from "@/components/pdf/informes/pdfmovimientoarticulo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFilePdf, FaSearch } from "react-icons/fa";
import {
  api_getAllAlmacenArticuloByEmpByCenByBodByAlm,
  api_getAllAlmacenByEmpByCenByBod,
  api_getAllBodegaByEmpresaYCentroCosto,
  api_getAllBodegas,
  api_getAllCentroCostoByEmpresa,
  api_getAllEmpresas,
  api_getAllArticulosByAlmacen,
  api_getArticuloEntradaSalida,
} from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import router, { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IBodega,
  ICentroCosto,
  IEmpresa,
  IParteEntrada,
  IParteSalida,
} from "@/interfaces/creation";
import { Button, Modal, Table } from "react-daisyui";
import {
  IAlmacen,
  IAlmacenArticulo,
  IArticulo,
} from "@/interfaces/modules/IAlmacen.interface";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WarningAlert from "@/components/alerts/warningAlert";
import { es } from "date-fns/locale/es";
registerLocale("es", es);

import Select from "react-select";
import PDFTarjetaExistencia from "@/components/pdf/informes/pdftarjetaexistencia";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const Schema = z.object({
  CentroCosto: z.string({
    required_error: "Campo requerido",
    invalid_type_error: "Tipo invalido",
  }),
  Bodega: z.string({
    required_error: "Campo requerido",
    invalid_type_error: "Tipo invalido",
  }),
  Almacen: z.string({
    required_error: "Campo requerido",
    invalid_type_error: "Tipo invalido",
  }),
  Articulo: z
    .string({
      required_error: "Campo requerido",
      invalid_type_error: "Tipo invalido",
    })
    .optional(),
  FechaDesde: z.date({
    required_error: "Campo requerido",
    invalid_type_error: "Tipo invalido",
  }),
  FechaHasta: z.date({
    required_error: "Campo requerido",
    invalid_type_error: "Tipo invalido",
  }),
});

interface props {
  label: string;
}

interface formI {
  CentroCosto: string;
  Bodega: string;
  Almacen: string;
  Articulo?: string;
  FechaDesde: Date;
  FechaHasta: Date;
}

export default function BuscarArticuloMovTarjeta(props: props) {
  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const { jwt } = useUserStore();
  const { empresa } = router.query;

  const [getDataEmpresa, setGetDataEmpresa] = useState("");

  const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>([]);
  const getAllCentroCostosByEmpresa = async () => {
    try {
      const data2 = await api_getAllCentroCostoByEmpresa(
        jwt,
        empresa as string
      );
      setDataCentroCosto(data2.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!empresa) return;
    getAllCentroCostosByEmpresa();
  }, [empresa]);

  const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
  const getAllBodegasByEmpresaYCentroCosto = async () => {
    try {
      const data = await api_getAllBodegaByEmpresaYCentroCosto(
        jwt,
        empresa as string,
        CentroCosto
      );
      setDataBodega(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
  const getAllAlmacenByEmpByCenByBod = async () => {
    try {
      const data = await api_getAllAlmacenByEmpByCenByBod(
        jwt,
        empresa as string,
        CentroCosto,
        Bodega
      );
      setDataAlmacen(data.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  const [dataArticulo, setDataArticulo] = useState<IArticulo[]>([]);
  const getAllArticulosByAlmacen = async () => {
    try {
      const responseArt = await api_getAllArticulosByAlmacen(jwt, Almacen);
      setDataArticulo(responseArt.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };

  const methods = useForm<formI>({
    resolver: zodResolver(Schema),
    defaultValues: {
      FechaDesde: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      FechaHasta: new Date(),
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

  const CentroCosto = watch("CentroCosto");
  const Bodega = watch("Bodega");
  const Almacen = watch("Almacen");
  const Articulo = watch("Articulo");

  useEffect(() => {
    if (!CentroCosto) return;
    getAllBodegasByEmpresaYCentroCosto();
  }, [CentroCosto]);

  useEffect(() => {
    if (!Bodega) return;
    getAllAlmacenByEmpByCenByBod();
  }, [Bodega]);

  useEffect(() => {
    if (!Almacen) return;
    getAllArticulosByAlmacen();
  }, [Almacen]);

  const fechaDesde = watch("FechaDesde");
  const fechaHasta = watch("FechaHasta");

  const [dataEntradaSalida, setDataEntradaSalida] = useState<IParteSalida[]>(
    []
  );

  /*  const getMovimientoArticulo = async () => {
    if (!Almacen || !fechaDesde || !fechaHasta) return;
    const formattedFechaDesde = fechaDesde.toISOString().split("T")[0];
    const formattedFechaHasta = fechaHasta.toISOString().split("T")[0];
    try {
      const entradasalida = await api_getArticuloEntradaSalida(
        jwt,
        Almacen,
        formattedFechaDesde,
        formattedFechaHasta,
        Articulo
      );
      console.log("Datos obtenididos:", entradasalida.data.dataList);
      setDataEntradaSalida(entradasalida.data.dataList); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Articulo !== "") {
      getMovimientoArticulo();
    }
  }, [Articulo, fechaDesde, fechaHasta]); */

  const onSubmit = async (data: formI) => {
    try {
      if (data.Articulo == undefined) {
        data.Articulo = "";
      }

      if (data) {
        const formattedFechaDesde = data.FechaDesde.toISOString().split("T")[0];
        const formattedFechaHasta = data.FechaHasta.toISOString().split("T")[0];
        const response = await api_getArticuloEntradaSalida(
          jwt,
          data.Almacen,
          formattedFechaDesde,
          formattedFechaHasta,
          data.Articulo
        );
        console.log(response.data.dataList);
      }
      console.log("este es el data:", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:border-primary mt-3">
        <legend>Filtro de movimientos</legend>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <Controller
              control={control}
              name="CentroCosto"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  className="mt-2 px-0 md:px-8"
                  placeholder="Seleccione Centro costo"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nombre}
                  value={dataCentroCosto.find((e) => e.id === value)}
                  options={dataCentroCosto}
                  onChange={(val) => setValue("CentroCosto", val?.id as string)}
                  menuPortalTarget={document.body}
                  loadingMessage={() => "Cargando opciones..."}
                  isLoading={dataCentroCosto.length === 0}
                  isClearable
                />
              )}
            />
            {errors.CentroCosto && (
              <span className="text-red-600 block">
                {errors.CentroCosto.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="Bodega"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  className="mt-2 px-0 md:px-8"
                  placeholder="Seleccione Bodega"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nombre}
                  value={dataBodega.find((e) => e.id === value)}
                  options={dataBodega}
                  onChange={(val) => setValue("Bodega", val?.id as string)}
                  menuPortalTarget={document.body}
                  loadingMessage={() => "Cargando opciones..."}
                  isLoading={dataCentroCosto.length === 0}
                  isClearable
                />
              )}
            />
            {errors.Bodega && (
              <span className="text-red-600 block">
                {errors.Bodega.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="Almacen"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  className="mt-2 px-0 md:px-8 "
                  placeholder="Seleccione una almacen"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nombre}
                  value={dataAlmacen.find((e) => e.id === value)}
                  options={dataAlmacen}
                  onChange={(val) => setValue("Almacen", val?.id as string)}
                  menuPortalTarget={document.body}
                  loadingMessage={() => "Cargando opciones..."}
                  isLoading={dataAlmacen.length === 0}
                  isClearable
                />
              )}
            />
            {errors.Almacen && (
              <span className="text-red-600 block">
                {errors.Almacen.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Controller
              control={control}
              name="Articulo"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  className="mt-2 px-0 md:px-8"
                  placeholder="Seleccione Articulo"
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.nombre}
                  value={dataArticulo.find((e) => e.id === value)}
                  options={dataArticulo}
                  onChange={(val) => setValue("Articulo", val?.id as string)}
                  menuPortalTarget={document.body}
                  loadingMessage={() => "Cargando opciones..."}
                  isLoading={dataCentroCosto.length === 0}
                  isClearable
                />
              )}
            />
            {errors.Articulo && (
              <span className="text-red-600 block">
                {errors.Articulo.message}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 mb-3">
          <h1>Rango de fecha</h1>
          <div className="grid grid-cols-2">
            <div className="flex flex-col">
              <div className="inline-block">
                <label className="w-full lg:w-40 text-center mr-2">
                  Desde:
                </label>
                <Controller
                  control={methods.control}
                  name="FechaDesde"
                  render={({ field }) => (
                    <DatePicker
                      portalId="root-portal"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      onBlur={field.onBlur}
                      className="block w-full py-1 md:py-2 lg:py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      dropdownMode="select"
                      yearDropdownItemNumber={15}
                      peekNextMonth
                      showYearDropdown
                      showMonthDropdown
                      dateFormat={"dd/MM/yyyy"}
                      selectsStart
                      startDate={fechaDesde}
                      endDate={fechaHasta}
                      locale="es"
                    />
                  )}
                />
              </div>
              {errors.FechaDesde && (
                <span className="text-red-600 block">
                  {errors.FechaDesde.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="inline-block">
                <label className="w-full lg:w-40 text-center mr-2">
                  Hasta:
                </label>
                <Controller
                  control={methods.control}
                  name="FechaHasta"
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <DatePicker
                      portalId="root-portal"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      onBlur={field.onBlur}
                      className="block w-full py-1 md:py-2 lg:py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      dropdownMode="select"
                      yearDropdownItemNumber={15}
                      peekNextMonth
                      showYearDropdown
                      showMonthDropdown
                      dateFormat={"dd/MM/yyyy"}
                      selectsEnd
                      startDate={fechaDesde}
                      endDate={fechaHasta}
                      minDate={fechaDesde}
                      locale="es"
                    />
                  )}
                />
              </div>
              {errors.FechaDesde && (
                <span className="text-red-600 block">
                  {errors.FechaDesde.message}
                </span>
              )}
            </div>
          </div>
          {props.label == "MovimientoArticulo" && (
            <button
              type="submit"
              /* onClick={() => getMovimientoArticulo()} */
              className="btn btn-outline btn-primary mt-3"
            >
              Buscar Movimiento
            </button>
          )}
          {props.label == "TarjetaExistencia" && (
            <button
              /* onClick={() => getMovimientoArticulo()} */
              className="btn btn-outline btn-primary mt-3"
            >
              Buscar Tarjeta
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
