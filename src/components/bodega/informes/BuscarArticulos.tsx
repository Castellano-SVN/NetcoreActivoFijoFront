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
    api_getArticuloSalida,
    api_getArticuloEntrada,
    api_getAllArticulosByAlmacen,
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

interface props {
    label: string;
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
    const [selectedCentroCosto, setSelectedCentroCosto] =
        useState<ICentroCosto | null>(null);
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
        if (empresa !== "") {
            getAllCentroCostosByEmpresa();
        }
    }, [empresa]);

    const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
    const [selectedBodega, setSelectedBodega] = useState<IBodega | null>(null);

    const getAllBodegasByEmpresaYCentroCosto = async () => {
        try {
            if (selectedCentroCosto) {
                const data = await api_getAllBodegaByEmpresaYCentroCosto(
                    jwt,
                    empresa as string,
                    selectedCentroCosto.id
                );
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
                const data = await api_getAllAlmacenByEmpByCenByBod(
                    jwt,
                    empresa as string,
                    selectedCentroCosto.id,
                    selectedBodega.id
                );
                setDataAlmacen(data.data.dataList);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllAlmacenByEmpByCenByBod();
    }, [selectedBodega]);


    const [dataArticulo, setDataArticulo] = useState<IArticulo[]>([]);


    const getAllArticulosByAlmacen = async () => {
        try {
            if (selectedCentroCosto && selectedBodega && selectedAlmacen) {
                const responseArt = await api_getAllArticulosByAlmacen(
                    jwt,
                    selectedAlmacen.id
                );
                setDataArticulo(responseArt.data.dataList);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const [selectedArticulo, setSelectedArticulo] =
        useState<IArticulo | null>(null);

    useEffect(() => {
        getAllArticulosByAlmacen();
    }, [selectedAlmacen])

    const methods = useForm({
        defaultValues: {
            fechaDesde: new Date(),
            fechaHasta: new Date(),
        },
    });
    const { handleSubmit, control, watch } = methods;

    const idArticulo = selectedArticulo?.id
    const idAlmacen = selectedAlmacen?.id
    const fechaDesde = watch("fechaDesde");
    const fechaHasta = watch("fechaHasta");

    const [dataSalida, setDataSalida] = useState<IParteSalida[]>([]);
    const [dataEntrada, setDataEntrada] = useState<IParteEntrada[]>([]);

    const getMovimientoArticulo = async () => {
        if (!idArticulo || !idAlmacen || !fechaDesde || !fechaHasta) return;
        const formattedFechaDesde = fechaDesde.toISOString().split("T")[0];
        const formattedFechaHasta = fechaHasta.toISOString().split("T")[0];
        try {
            const salida = await api_getArticuloSalida(
                jwt,
                idAlmacen,
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

    // useEffect(() => {
    //     if (idArticulo !== "") {
    //         getMovimientoArticulo();
    //     }
    // }, [idArticulo, fechaDesde, fechaHasta]);
    return (
        <>
            <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105 mt-3">
                <legend>Busca un artículo</legend>
                <div className="grid grid-cols-2">
                    <Select
                        className="mt-2 px-0 md:px-8"
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
                        getOptionValue={(option) => option.id}
                        getOptionLabel={(option) => option.nombre}
                        options={dataArticulo}
                        menuPortalTarget={document.body}
                        loadingMessage={() => "Cargando opciones..."}
                        isLoading={dataArticulo.length === 0}
                        isClearable
                    />
                </div>
                <div className="mt-3 mb-3">
                    <h1>Rango de fecha</h1>
                    <div className="grid grid-cols-2">
                        <div className="">
                            <label className="w-full lg:w-40 text-center mr-2">
                                Desde:
                            </label>
                            <Controller
                                control={methods.control}
                                name="fechaDesde"
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
                                        selectsStart
                                        startDate={fechaDesde}
                                        endDate={fechaHasta}
                                        locale="es"
                                    />
                                )}
                            />
                        </div>
                        <div className="">
                            <label className="w-full lg:w-40 text-center mr-2">
                                Hasta:
                            </label>
                            <Controller
                                control={methods.control}
                                name="fechaHasta"
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
                    </div>
                    {props.label == "MovimientoArticulo" && (
                        <button onClick={()=> getMovimientoArticulo()} className="btn btn-outline btn-primary mt-3" >Buscar Movimiento</button>
                    )}
                    {props.label == "TarjetaExistencia" && (
                        <button onClick={()=> getMovimientoArticulo()} className="btn btn-outline btn-primary mt-3" >Buscar Tarjeta</button>
                    )}

                </div>
            </fieldset>

            {selectedArticulo && (
                <>
                    <fieldset className="border shadow-md rounded-lg p-4 transition duration-300 transform hover:scale-105 mt-3 mb-3">
                        <legend>Artículo seleccionado</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mr-5 ml-5 mb-3">
                            <div className="flex flex-col">
                                <label className="mb-1 text-center md:text-left">
                                    Nombre Artículo:
                                </label>
                                <div className="border p-1 rounded-md">
                                    <span>{selectedArticulo.nombre}</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-center md:text-left">
                                    Stock Crítico:
                                </label>
                                <div className="border p-1 rounded-md">
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    {props.label == "MovimientoArticulo" && (
                        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105 mt-3">
                            <legend>Movimientos encontrados:</legend>
                            <div className="grid grid-cols-1">
                                <div className="overflow-x-auto">
                                    {dataSalida.length !== 0 || dataEntrada.length !== 0 ? (
                                        <TableMovArtAndTarjetaExi
                                            dataEntrada={dataEntrada}
                                            dataSalida={dataSalida}
                                            label={props.label}
                                        />
                                    ) : (
                                        <WarningAlert message="No se han encontrado movimientos viculados este articulo en ese rango de fechas." />
                                    )}
                                </div>
                                <div className="mt-4">
                                    <PDFDownloadLink
                                        document={<PDFMovimientoArticulo />}
                                        fileName="Movimiento_Articulo_pdf"
                                    >
                                        {({ loading, url, error, blob }) =>
                                            loading ? (
                                                "Cargando.."
                                            ) : (
                                                <>
                                                    {dataSalida.length !== 0 || dataEntrada.length !== 0 && (

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline btn-accent"
                                                        >
                                                            <FaFilePdf />
                                                            Exportar
                                                        </button>
                                                    )}
                                                </>
                                            )
                                        }
                                    </PDFDownloadLink>
                                </div>
                            </div>
                        </fieldset>
                    )}
                    {props.label == "TarjetaExistencia" && (
                        <fieldset className="border shadow-md rounded-lg p-2 transition duration-300 transform hover:scale-105 mt-3">
                            <legend>Tarjeta existencia encontradas:</legend>
                            <div className="grid grid-cols-1">
                                <div className="overflow-x-auto">
                                    {dataSalida.length !== 0 || dataEntrada.length !== 0 ? (
                                        <TableMovArtAndTarjetaExi
                                            dataEntrada={dataEntrada}
                                            dataSalida={dataSalida}
                                            label={props.label}
                                        />
                                    ) : (
                                        <WarningAlert message="No se han encontrado tarjetas de existencia viculados este articulo en ese rango de fechas." />
                                    )}
                                </div>

                                <div className="mt-4">
                                    <PDFDownloadLink document={<PDFTarjetaExistencia />} fileName='Tarjeta_Existencia_pdf'>
                                        {
                                            ({ loading, url, error, blob }) => loading ? (
                                                "Cargando.."
                                            ) : (
                                                <>
                                                    {dataSalida.length !== 0 || dataEntrada.length !== 0 && (

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline btn-accent"
                                                        >
                                                            <FaFilePdf />
                                                            Exportar
                                                        </button>
                                                    )}
                                                </>
                                            )

                                        }
                                    </PDFDownloadLink>
                                </div>
                            </div>
                        </fieldset>
                    )}
                </>
            )}
        </>
    );
}