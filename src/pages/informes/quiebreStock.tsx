import WarningAlert from "@/components/alerts/warningAlert";
import TablaQuiebreStock from "@/components/bodega/informes/tablaquiebrestock";
import PDFQuiebreStock from "@/components/pdf/informes/pdfquiebrestock";
import { IBodega, ICentroCosto, IEmpresa, OutPutQuiebreStockFormValues } from "@/interfaces/creation";
import { IAlmacen, IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
import { api_getAllAlmacenArticuloByEmpByCenByBodByAlm, api_getAllAlmacenByEmpByCenByBod, api_getAllBodegaByEmpresaYCentroCosto, api_getAllCentroCostoByEmpresa, api_getAllEmpresas } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-daisyui";
import { FormProvider, useForm, useFieldArray, Controller } from "react-hook-form";
import { FaFilePdf } from "react-icons/fa";
import { z } from "zod";
import DatePicker, { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";
import router from "next/router";
import {es} from "date-fns/locale/es";
registerLocale("es", es);


export default function QuiebreStock() {
    const { jwt } = useUserStore();

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
    /* const [getDataAlmacenArticulo, setGetDataAlmacenArticulo] = useState(''); */
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



    const QuiebreStockSchema = z.object({
        Correlativo: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        CodigoArticulo: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }).optional(),
        CodigoFamilia: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        Familia: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        CodigoSubFamilia: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        SubFamilia: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        DescripcionArticulo: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }).optional(),
        CantidadSistema: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        StockCritico: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        ProcesoCompra: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" })
    });

    const OutPutQuiebreStockSchema = z.object({
        FechaInforme: z.date({ required_error: "Campo Requerido", invalid_type_error: "Tipo invalido" }),
        QuiebreStock: z.array(QuiebreStockSchema)
    });

    const methods = useForm<OutPutQuiebreStockFormValues>({ resolver: zodResolver(OutPutQuiebreStockSchema), defaultValues: { QuiebreStock: [] } });
    const { register, handleSubmit, formState: { errors }, setValue, reset, control } = methods;




    const [showPdf, setShowPdf] = useState(false);
    const [dataPost, setDataPost] = useState<OutPutQuiebreStockFormValues | null>(null);

    const onSubmit = async (data: OutPutQuiebreStockFormValues) => {
        const response = data;
        try {
            if (response) {
                console.log(response);
                setDataPost(response);
                setShowPdf(true);
            } else {
                toast.error('ha ocurrido un error al crear el pdf');
                console.log(errors);
                setShowPdf(false);
            }
        }
        catch (error) {
            toast.error('ha ocurrido un error al crear el pdf');
            console.log(error);
            setShowPdf(false);
        };
    };

    const handleClickClose = () => {
        setShowPdf(false);
        reset();
    };

    //fecha informe es un filtro

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="p-6 rounded w-full">
                    <h1 className="text-2xl font-bold mb-4">Informe Quiebre de Stock</h1>
                    <button type="button" className="btn btn-outline btn-accent mt-2" onClick={handleShow}>Seleccione un Almacen</button>
                    {getDataAlmacen !== '' && (
                        <>
                            <FormProvider {...methods}>
                                <form onSubmit={methods.handleSubmit(onSubmit)}>
                                    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                                        <div className="mt-6">
                                            <label className="inline-block text-left mr-2" htmlFor="numeroDocumento">Fecha Informe: </label>
                                            <Controller
                                                control={control}
                                                name="FechaInforme"// Nombre del campo para el controlador
                                                render={({ field }) => (
                                                    <DatePicker
                                                        selected={field.value} // Usar field.value para obtener el valor
                                                        onChange={(date) => field.onChange(date)} // Usar field.onChange para actualizar el valor
                                                        onBlur={field.onBlur} // Usar field.onBlur para el evento onBlur
                                                        className="inline-block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        dropdownMode="select"
                                                        yearDropdownItemNumber={15}
                                                        peekNextMonth
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dateFormat={"dd/MM/yyyy"}
                                                        locale="es"
                                                    />
                                                )}
                                            />
                                            {errors.FechaInforme && <span className="text-red-600 flex flex-col ">{errors.FechaInforme.message}</span>}
                                        </div>
                                    </div>

                                    {dataAlmacenArticulo.length !== 0 ?
                                        (<>

                                            <div className="overflow-x-auto">
                                                <TablaQuiebreStock
                                                    almacenArticulo={dataAlmacenArticulo}
                                                    setValue={setValue}
                                                    control={control}
                                                />
                                            </div>

                                            {dataPost && showPdf ?
                                                (
                                                    <Modal open={showPdf}>
                                                        <Modal.Header>¿Desea crear un reporte del quiebre de stock?</Modal.Header>
                                                        <Modal.Body>
                                                            <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                                                                <div className="col-span-2">
                                                                    <PDFDownloadLink document={<PDFQuiebreStock dataQuiebre={dataPost} />} fileName='quiebre_stock'>
                                                                        {
                                                                            ({ loading, url, error, blob }) => loading ? (
                                                                                "Cargando.."
                                                                            ) : (
                                                                                <button type="button" className="btn btn-outline btn-accent"><FaFilePdf />Exportar</button>
                                                                            )

                                                                        }
                                                                    </PDFDownloadLink>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <Button type="button" className="btn btn-outline btn-secondary w-1/2 mt-2" onClick={() => handleClickClose()}>
                                                                        salir
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
                                                )
                                                :
                                                (
                                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                                )
                                            }
                                        </>)
                                        :
                                        (
                                            <WarningAlert message="No se han encontrado Articulos en este almacen" />
                                        )
                                    }
                                </form>
                            </FormProvider>
                        </>
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
                                <option key={0} selected>Seleccione una opción</option>
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
                                <option key={0} selected>Seleccione una opción</option>
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
                                <option key={0} selected>Seleccione una opción</option>
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
                                <option key={0} selected>Seleccione una opción</option>
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