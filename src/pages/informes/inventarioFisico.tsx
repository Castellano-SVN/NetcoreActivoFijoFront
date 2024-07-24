import TablaInventarioFisico from "@/components/bodega/informes/tablainventariofisico";
import PDFInventarioFisico from "@/components/pdf/informes/pdfinventariofisico";
import { api_getAllAlmacenArticuloByEmpByCenByBodByAlm, api_getAllAlmacenByEmpByCenByBod, api_getAllBodegaByEmpresaYCentroCosto, api_getAllCentroCostoByEmpresa, api_getAllEmpresas, api_getInventario } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Controller, useForm } from "react-hook-form";
import { FaFilePdf } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IBodega, ICentroCosto, IEmpresa, InventarioFormValues } from "@/interfaces/creation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "react-daisyui";
import { IAlmacen, IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
export default function InventarioFisico() {
    const ref = useRef<HTMLDialogElement>(null);
    const handleShow = useCallback(() => {
        ref.current?.showModal();
    }, [ref]);
    const [dataEmpresa, setDataEmpresa] = useState<IEmpresa[]>([]);
    const [getDataEmpresa, setGetDataEmpresa] = useState('');

    const getAllEmpresas = async () => {
        try {
            const data = await api_getAllEmpresas(jwt);
            setDataEmpresa(data.data.dataList);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllEmpresas();
    }, []);

    const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>([]);
    const [getDataCentroCosto, setGetDataCentroCosto] = useState('');
    const getAllCentroCostosByEmpresa = async () => {
        try {
            const data2 = await api_getAllCentroCostoByEmpresa(jwt, getDataEmpresa);
            setDataCentroCosto(data2.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (getDataEmpresa !== '') {
            getAllCentroCostosByEmpresa();
        }
    }, [getDataEmpresa]);

    const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
    const [getDataBodega, setGetDataBodega] = useState('');
    const getAllBodegasByEmpresaYCentroCosto = async () => {
        try {
            const data3 = await api_getAllBodegaByEmpresaYCentroCosto(jwt, getDataEmpresa, getDataCentroCosto);
            setDataBodega(data3.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (getDataEmpresa !== '' && getDataCentroCosto !== '') {
            getAllBodegasByEmpresaYCentroCosto();
        }
    }, [getDataEmpresa, getDataCentroCosto]);

    const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
    const [getDataAlmacen, setGetDataAlmacen] = useState('');

    const getAllAlmacenByEmpByCenByBod = async () => {
        try {
            const data4 = await api_getAllAlmacenByEmpByCenByBod(jwt, getDataEmpresa, getDataCentroCosto, getDataBodega);
            setDataAlmacen(data4.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (getDataEmpresa !== '' && getDataCentroCosto !== '' && getDataBodega !== '') {
            getAllAlmacenByEmpByCenByBod();
        }
    }, [getDataEmpresa, getDataCentroCosto, getDataBodega]);

    const [dataAlmacenArticulo, setDataAlmacenArticulo] = useState<IAlmacenArticulo[]>([]);
    const getAllAlmacenArticuloByEmpByCenByBodByAlm = async () => {
        try {
            const data5 = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(jwt, getDataEmpresa, getDataCentroCosto, getDataBodega, getDataAlmacen);
            setDataAlmacenArticulo(data5.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (getDataEmpresa !== '' && getDataCentroCosto !== '' && getDataBodega !== '' && getDataAlmacen !== '') {
            getAllAlmacenArticuloByEmpByCenByBodByAlm();
        }
    }, [getDataEmpresa, getDataCentroCosto, getDataBodega, getDataAlmacen]);

    const { jwt } = useUserStore();

    const InventarioDataSchema = z.object({
        NombreEncargado: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),
        FechaInventario: z.date({ required_error: "Campo requerido", invalid_type_error: "Tipo inválido" }),

    });
    const methods = useForm<InventarioFormValues>({
        resolver: zodResolver(InventarioDataSchema),
    });;
    const { register, handleSubmit, formState: { errors }, control, setValue, reset } = methods;

    // const [dataInventario, setDataInventrario] = useState<>();

    const onSubmit = async (data: InventarioFormValues) => {
        try {
            const formattedFechaInventario = data.FechaInventario.toISOString().split('T')[0];
            console.log("Este es el nombre del encargado:" + data.NombreEncargado)
            console.log("Esta es la fecha:" + formattedFechaInventario)
            const response = await api_getInventario(jwt, data.NombreEncargado, formattedFechaInventario);

            // if (response) {
            //     setDataInventrario(response.data.dataList);
            // }

        } catch (error) {
            console.error('Error al buscar: ', error);
            toast.error('ha ocurrido un error');
        }
    };

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="p-6 rounded w-full">
                    <h1 className="text-2xl font-bold mb-4">Informe Inventario Fisico</h1>
                    <button type="button" className="btn btn-outline btn-accent mt-2 mb-4" onClick={handleShow}>Seleccione un Almacen</button>
                    {getDataAlmacen !== '' && (

                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                                    <div>
                                        <label className="block text-left mb-2" htmlFor="Folio Recepcion">Encargado toma inventario fisico</label>
                                        <input {...register(`NombreEncargado`, { setValueAs: (value) => value === '' ? undefined : value })} type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                        <span className="text-red-600">{errors.NombreEncargado?.message}</span>
                                    </div>

                                    <div>
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Fecha inventario</label>
                                        <Controller
                                            control={methods.control}
                                            name="FechaInventario"
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
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.FechaInventario && <span className="text-red-600">{errors.FechaInventario?.message}</span>}
                                </div>
                                <button type="submit" className="btn btn-primary mb-4">Buscar inventario</button>
                            </form>
                            {/* {dataInventario !== '' &&(
                                <div className="overflow-x-auto">
                                    <TablaInventarioFisico />
                                </div>
                            )} */}
                            <div className="mt-4">
                                <PDFDownloadLink document={<PDFInventarioFisico />} fileName='inventario_fisico'>
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
                    )}


                </div>
            </div>
            <Modal ref={ref}>
                <Modal.Header className="font-bold">Seleccione el Almacen</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="empresa">Empresa:</label>
                            <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                onChange={(e) => {
                                    setGetDataEmpresa(e.target.value);
                                }}>
                                <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                {dataEmpresa.map((empresa, index) => (
                                    <option key={index} value={empresa.id}>{empresa.razonSocial}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="centrocosto">CentroCosto:</label>
                            <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                onChange={(e) => {
                                    setGetDataCentroCosto(e.target.value);
                                }}>
                                <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                {dataCentroCosto.map((centroCosto, index) => (
                                    <option key={index} value={centroCosto.id}>{centroCosto.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="bodega">Bodega:</label>
                            <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                onChange={(e) => {
                                    setGetDataBodega(e.target.value);
                                }}
                            >
                                <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                {dataBodega.map((bodega, index) => (
                                    <option key={index} value={bodega.id}>{bodega.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="almacen">Almacen:</label>
                            <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                onChange={(e) => {
                                    setGetDataAlmacen(e.target.value);
                                }}
                            >
                                <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                {dataAlmacen.map((almacen, index) => (
                                    <option key={index} value={almacen.id}>{almacen.nombre}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Actions>
                    <form method="dialog">
                        <Button className="btn btn-outline btn-primary">Cerrar</Button>
                    </form>
                </Modal.Actions>
            </Modal>
        </>
    );
}