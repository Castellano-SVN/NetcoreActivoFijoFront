import TableMoveArticle from "@/components/bodega/informes/tablemovartic";
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
  api_getArticuloSalida,
  api_getArticuloEntrada,
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

export default function MovimientoArticulos() {
  const ref = useRef<HTMLDialogElement>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const { jwt } = useUserStore();
  const  {empresa}  = router.query;

  const [getDataEmpresa, setGetDataEmpresa] = useState("");



  const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>([]);
  const [selectedCentroCosto, setSelectedCentroCosto] = useState<ICentroCosto | null>(null);
  const getAllCentroCostosByEmpresa = async () => {
    try {
      console.log("bucando centro de costo por la empresa:",empresa)
      const data2 = await api_getAllCentroCostoByEmpresa(jwt, empresa as string);
      console.log("Centro costos encontrados:",data2)
      setDataCentroCosto(data2.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (empresa !== "") {
      getAllCentroCostosByEmpresa();
    }
  }, [empresa]);

  const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
  const [selectedBodega, setSelectedBodega] = useState<IBodega | null>(null);
  
  const getAllBodegasByEmpresaYCentroCosto = async () => {
    try {
      if (selectedCentroCosto) {
        const data = await api_getAllBodegaByEmpresaYCentroCosto(jwt, empresa as string, selectedCentroCosto.id);
        setDataBodega(data.data.dataList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllBodegasByEmpresaYCentroCosto();
  }, [selectedCentroCosto]);

  const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
  const [selectedAlmacen, setSelectedAlmacen] = useState<IAlmacen | null>(null);

  const getAllAlmacenByEmpByCenByBod = async () => {
    try {
      if (selectedCentroCosto && selectedBodega) {
        const data = await api_getAllAlmacenByEmpByCenByBod(jwt, empresa as string, selectedCentroCosto.id, selectedBodega.id);
        setDataAlmacen(data.data.dataList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAlmacenByEmpByCenByBod();
  }, [selectedBodega]);

  const [dataAlmacenArticulo, setDataAlmacenArticulo] = useState<IAlmacenArticulo[]>([]);
  const [selectedArticulo, setSelectedArticulo] = useState<IAlmacenArticulo | null>(null);


  const getAllAlmacenArticuloByEmpByCenByBodByAlm = async () => {
    try {
      if (selectedCentroCosto && selectedBodega && selectedAlmacen) {
        const data = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(jwt, empresa as string, selectedCentroCosto.id, selectedBodega.id, selectedAlmacen.id);
        setDataAlmacenArticulo(data.data.dataList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAlmacenArticuloByEmpByCenByBodByAlm();
  }, [selectedAlmacen]);

  const methods = useForm({
    defaultValues: {
      fechaDesde: new Date(),
      fechaHasta: new Date(),
    },
  });
  const { handleSubmit, control, watch } = methods;

  const [idArticulo, setIdArticulo] = useState("");
  const fechaDesde = watch("fechaDesde");
  const fechaHasta = watch("fechaHasta");

  const [dataSalida, setDataSalida] = useState<IParteSalida[]>([]);
  const [dataEntrada, setDataEntrada] = useState<IParteEntrada[]>([]);

  const getMovimientoArticulo = async () => {
    if (!idArticulo || !fechaDesde || !fechaHasta) return;
    const formattedFechaDesde = fechaDesde.toISOString().split("T")[0];
    const formattedFechaHasta = fechaHasta.toISOString().split("T")[0];
    try {
      const salida = await api_getArticuloSalida(
        jwt,
        idArticulo,
        formattedFechaDesde,
        formattedFechaHasta
      );
      setDataSalida(salida.data.dataList);
      const entrada = await api_getArticuloEntrada(
        jwt,
        idArticulo,
        formattedFechaDesde,
        formattedFechaHasta
      );
      setDataEntrada(entrada.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idArticulo !== "") {
      getMovimientoArticulo();
    }
  }, [idArticulo, fechaDesde, fechaHasta]);
  return (
    <>
    <div className="">
      <h1 className="text-2xl font-bold mt-4">Informe movimiento de articulo</h1>
      <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105 mt-3">
            <legend>Busca un artículo</legend>
            <div className="grid grid-cols-2">

            <Select
              className="mt-2 px-0 md:px-8 "
              placeholder="Seleccione Centro costo"
              value={selectedCentroCosto}
              onChange={(option) => setSelectedCentroCosto(option)}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.nombre}
              options={dataCentroCosto}
              menuPortalTarget={document.body}
              loadingMessage={() => "Cargando opciones..."}
              isLoading={dataCentroCosto.length === 0}
              isClearable
            />
            <Select
              className="mt-2 px-0 md:px-8 "
              placeholder="Seleccione una bodega"
              value={selectedBodega}
              onChange={(option) => setSelectedBodega(option)}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.nombre}
              options={dataBodega}
              menuPortalTarget={document.body}
              loadingMessage={() => "Cargando opciones..."}
              isLoading={dataBodega.length === 0}
              isClearable
            />
            <Select
              className="mt-2 px-0 md:px-8 "
              placeholder="Seleccione una almacen"
              value={selectedAlmacen}
              onChange={(option) => setSelectedAlmacen(option)}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.nombre}
              options={dataAlmacen}
              menuPortalTarget={document.body}
              loadingMessage={() => "Cargando opciones..."}
              isLoading={dataAlmacen.length === 0}
              isClearable
            />
            <Select
              className="mt-2 px-0 md:px-8 "
              placeholder="Seleccione un articulo"
              value={selectedArticulo}
              onChange={(option) => setSelectedArticulo(option)}
              getOptionValue={(option) => option.articulo.id}
              getOptionLabel={(option) => option.articulo.nombre}
              options={dataAlmacenArticulo}
              menuPortalTarget={document.body}
              loadingMessage={() => "Cargando opciones..."}
              isLoading={dataAlmacenArticulo.length === 0}
              isClearable
            />
            </div>
            
        </fieldset>
      <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105 mt-3">
            <legend>Artículo seleccionado</legend>
            <div className="grid grid-cols-2">

            {selectedArticulo  && (
            <FormProvider {...methods}>
                <div className="transition duration-1000 ease-in-out">
                    <div className="flex flex-col md:flex-row lg:flex-row md:justify-around lg:justify-around w-full">
                        <div className="flex flex-col mr-4">
                            <div className="flex flex-col lg:flex-row items-center mb-2">
                                <label className="w-full lg:w-40 text-center lg:text-left">Codigo Articulo:</label>
                                <div className="flex flex-col lg:flex-col w-full">
                                    {/* <input
                                        type="text"
                                        value={codigoArticulo}
                                        className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        readOnly
                                    /> */}
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center mb-2">
                                <label className="w-full lg:w-40 text-center lg:text-left">Nombre Articulo:</label>
                                {/* <input
                                    type="text"
                                    value={nameArticulo}
                                    className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    readOnly
                                /> */}
                            </div>
                            <div className="flex flex-col lg:flex-row items-center mb-2">
                                <label className="w-full lg:w-40 text-center lg:text-left">Descripcion Articulo:</label>
                                {/* <input
                                    type="text"
                                    value={DescripcionArticulo}
                                    className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    readOnly
                                /> */}
                            </div>
                            <div className="flex flex-col lg:flex-row items-center mb-2">
                                <label className="w-full lg:w-40 text-center lg:text-left">Stock Critico:</label>
                                <input
                                    type="number"
                                    value={35}
                                    className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col lg:flex-row items-center mb-2 col-span-2">
                                <label className="w-full lg:w-40 text-center">Desde:</label>
                                <Controller
                                    control={methods.control}
                                    name="fechaDesde"
                                    defaultValue={new Date()}
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
                                            selectsStart
                                            startDate={fechaDesde}
                                            endDate={fechaHasta}
                                            locale="es"
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col lg:flex-row items-center mb-2 col-span-2">
                                <label className="w-full lg:w-40 text-center">Hasta:</label>
                                <Controller
                                    control={methods.control}
                                    name="fechaHasta"
                                    defaultValue={new Date()}
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
                                            selectsEnd
                                            startDate={fechaDesde}
                                            endDate={fechaHasta}
                                            minDate={fechaDesde}
                                            locale="es"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        {dataSalida.length !== 0 || dataEntrada.length !== 0 ? (

                            <TableMoveArticle dataEntrada={dataEntrada} dataSalida={dataSalida}/>
                        ) : (
                            <WarningAlert message="No se han encontrado movimientos viculados este articulo en ese rango de fechas." />
                        )}
                    </div>
                    <div className="mt-4">
                        <PDFDownloadLink document={<PDFMovimientoArticulo />} fileName='Movimiento_Articulo_pdf'>
                            {
                                ({ loading, url, error, blob }) => loading ? (
                                    "Cargando.."
                                ) : (
                                    <button type="button" className="btn btn-outline btn-accent"><FaFilePdf />Exportar</button>
                                )

                            }
                        </PDFDownloadLink>
                    </div>
                </div>
            </FormProvider>
        )} 
            </div>
            
        </fieldset>
    </div>
    </>
  );
}
