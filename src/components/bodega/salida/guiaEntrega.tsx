
import WarningAlert from "@/components/alerts/warningAlert";
import PDFGuiaEntrega from "@/components/pdf/guiaEntrega";
import { IArticulo, IBodega, ICentroCosto, IEmpresa, OutPutFormValues } from "@/interfaces/creation";
import { IAlmacen, IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
import { api_getAllAlmacenArticuloByEmpByCenByBodByAlm, api_getAllAlmacenByEmpByCenByBod, api_getAllBodegaByEmpresaYCentroCosto, api_getAllBodegas, api_getAllCentroCostoByEmpresa, api_getAllEmpresas } from "@/services/bodega.service";
import { api_postGuiaEntrega } from "@/services/salidas.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Table } from "react-daisyui";
import { useFieldArray, useForm } from "react-hook-form";
import { FaFilePdf, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";



export default function GuiaEntrega() {
    const { setActive } = useContextStore()
    const searchParams = useSearchParams();
    const search = searchParams.get("empresa");
    const idEmpresa = String(search); // Convertir a cadena
    useEffect(() => {
        setActive("Salidas");
    }, []);
    const { jwt } = useUserStore();

    const ParteSalidaSchema = z.object({
        AlmacenId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        ArticuloId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        Cantidad: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        CodigoArticulo: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }).optional(),
        CodigoFamilia: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        Familia: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        CodigoSubFamilia: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" }),
        SubFamilia: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        DescripcionArticulo: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }).optional(),
    });

    const OutPutSchema = z.object({
        EmpresaIdOrigen: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        EmpresaIdDestino: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        CentroCostoIdOrigen: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        CentroCostoIdDestino: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        BodegaIdOrigen: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        BodegaIdDestino: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        AlmacenIdOrigen: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        AlmacenIdDestino: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        BodegaOrigen: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        BodegaDestino: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        /* DireccionOrigen: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        DireccionDestino: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }), */
        ParteSalida: z.array(ParteSalidaSchema)
    });

    const metodos = useForm<OutPutFormValues>({ resolver: zodResolver(OutPutSchema), defaultValues: { ParteSalida: [], } });
    const { register, handleSubmit, formState: { errors }, setValue, reset, control, watch } = metodos;

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "ParteSalida",
    });

    useEffect(() => {
        if (!idEmpresa) return;
        setValue('EmpresaIdOrigen', idEmpresa);
        setValue('EmpresaIdDestino', idEmpresa);
    }, [idEmpresa]);

    // Usar watch para obtener valores reactivos
    const CCIdOrigen = watch('CentroCostoIdOrigen');
    const BodegaIdOrigen = watch('BodegaIdOrigen');
    const AlmacenIdOrigen = watch('AlmacenIdOrigen');

    const CCIdDestino = watch('CentroCostoIdDestino');
    const BodegaIdDestino = watch('BodegaIdDestino');
    const AlmacenIdDestino = watch('AlmacenIdDestino');

    //data de Centro costo origen
    const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>([]);
    const getAllCentroCostosByEmpresa = async () => {
        try {
            const data2 = await api_getAllCentroCostoByEmpresa(jwt, idEmpresa);
            setDataCentroCosto(data2.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa) return;
        getAllCentroCostosByEmpresa();
    }, [idEmpresa]);

    //data centro costo destino
    const [dataCentroCostoModal, setDataCentroCostoModal] = useState<ICentroCosto[]>([]);
    const getAllCentroCostosByEmpresaModal = async () => {
        try {
            const dataModal2 = await api_getAllCentroCostoByEmpresa(jwt, idEmpresa);
            setDataCentroCostoModal(dataModal2.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa) return;
        getAllCentroCostosByEmpresaModal();
    }, [idEmpresa]);

    // data de bodega origen
    const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
    const [nameBodega, setNameBodega] = useState('');
    const getAllBodegasByEmpresaYCentroCosto = async () => {
        try {
            const data3 = await api_getAllBodegaByEmpresaYCentroCosto(jwt, idEmpresa, CCIdOrigen);
            setDataBodega(data3.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCIdOrigen) return;
        getAllBodegasByEmpresaYCentroCosto();
    }, [idEmpresa, CCIdOrigen]);

    //data bodega destino
    const [dataBodegaModal, setDataBodegaModal] = useState<IBodega[]>([]);
    const [nameBodegaModal, setNameBodegaModal] = useState('');
    const getAllBodegasByEmpresaYCentroCostoModal = async () => {
        try {
            const dataModal3 = await api_getAllBodegaByEmpresaYCentroCosto(jwt, idEmpresa, CCIdDestino);
            setDataBodegaModal(dataModal3.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCIdDestino) return;
        getAllBodegasByEmpresaYCentroCostoModal();
    }, [idEmpresa, CCIdDestino]);

    //data almacen origen 
    const [dataAlmacen, setDataAlmacen] = useState<IAlmacen[]>([]);
    const getAllAlmacenByEmpByCenByBod = async () => {
        try {
            const data4 = await api_getAllAlmacenByEmpByCenByBod(jwt, idEmpresa, CCIdOrigen, BodegaIdOrigen);
            setDataAlmacen(data4.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCIdOrigen || !BodegaIdOrigen) return;
        getAllAlmacenByEmpByCenByBod();
    }, [idEmpresa, CCIdOrigen, BodegaIdOrigen]);

    //data almacen destino
    const [dataAlmacenModal, setDataAlmacenModal] = useState<IAlmacen[]>([]);
    const getAllAlmacenByEmpByCenByBodModal = async () => {
        try {
            const dataModal4 = await api_getAllAlmacenByEmpByCenByBod(jwt, idEmpresa, CCIdDestino, BodegaIdDestino);
            setDataAlmacenModal(dataModal4.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCIdDestino || !BodegaIdDestino) return;
        getAllAlmacenByEmpByCenByBodModal();
    }, [idEmpresa, CCIdDestino, BodegaIdDestino]);

    //data almacen articulo origen
    const [dataAlmacenArticulo, setDataAlmacenArticulo] = useState<IAlmacenArticulo[]>([]);
    const getAllAlmacenArticuloByEmpByCenByBodByAlm = async () => {
        try {
            const data5 = await api_getAllAlmacenArticuloByEmpByCenByBodByAlm(jwt, idEmpresa, CCIdOrigen, BodegaIdOrigen, AlmacenIdOrigen);
            setDataAlmacenArticulo(data5.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!idEmpresa || !CCIdOrigen || !BodegaIdOrigen || !AlmacenIdOrigen) return;
        getAllAlmacenArticuloByEmpByCenByBodByAlm();
    }, [idEmpresa, CCIdOrigen, BodegaIdOrigen, AlmacenIdOrigen]);

    const ref = useRef<HTMLDialogElement>(null);
    const handleShow = useCallback(() => {
        ref.current?.showModal();
    }, [ref]);

    const ref3 = useRef<HTMLDialogElement>(null);
    const handleShow3 = useCallback(() => {
        ref3.current?.showModal();
    }, [ref3]);


    const [showPdf, setShowPdf] = useState(false);
    const [dataPost, setDataPost] = useState<OutPutFormValues | null>(null);

    const onSubmit = async (data: OutPutFormValues) => {
        try {
            const response = await api_postGuiaEntrega(jwt, data)
            if (response) {
                toast.success('Salida creada correctamente');
                setShowPdf(true);
                setDataPost(data);
            } else {
                toast.error('ha ocurrido un error en generar la Salida');
                setShowPdf(false);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                setShowPdf(false);
            } else {
                toast.error('Ha ocurrido un error inesperado');
                setShowPdf(false);
            }
        }
        console.log(data);
    };


    return (
        <div className="flex justify-center items-center">
            <div className="p-6 w-full max-w-3xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col md:grid md:grid-cols-6 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                        <div className="col-span-3 lg:col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega origen:</label>

                            <input type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                value={nameBodega}
                                readOnly />
                            {errors.BodegaOrigen && <span className="text-red-600 block">{errors.BodegaOrigen.message}</span>}

                            <button type="button" className="btn btn-outline btn-accent w-1/2 mt-2" onClick={handleShow3}>Seleccione Bodega Origen</button>
                        </div>
                        <Modal ref={ref3}>
                            <Modal.Header className="font-bold">Seleccione la bodega y almacén de Origen</Modal.Header>
                            <Modal.Body>
                                <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Centro de costo:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('CentroCostoIdOrigen', { setValueAs: (value) => value === '' ? undefined : value })}>
                                            <option value={''} key={0} selected disabled>Seleccione una opción</option>
                                            {dataCentroCosto.map((centroCosto, index) => (
                                                <option key={index} value={centroCosto.id}>{centroCosto.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.CentroCostoIdOrigen && <span className="text-red-600">{errors.CentroCostoIdOrigen.message}</span>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega origen:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('BodegaIdOrigen', { setValueAs: (value) => value === '' ? undefined : value })}
                                            onChange={(e) => {
                                                const selectedBodegaOrigen = dataBodega.find((bodegaOrigen) => bodegaOrigen.id === e.target.value);
                                                if (selectedBodegaOrigen) {
                                                    setNameBodega(selectedBodegaOrigen.nombre);
                                                    setValue('BodegaOrigen', selectedBodegaOrigen.nombre);
                                                    setValue('BodegaIdOrigen', selectedBodegaOrigen.id); // Asegurarse de que el valor se establece correctamente
                                                }
                                            }}>
                                            <option key={0} value={''} disabled selected>Seleccione una opción</option>
                                            {dataBodega.map((bodega, index) => (
                                                <option key={index} value={bodega.id}>{bodega.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.BodegaIdOrigen && <span className="text-red-600">{errors.BodegaIdOrigen.message}</span>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Almacenes:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('AlmacenIdOrigen', { setValueAs: (value) => value === '' ? undefined : value })}>
                                            <option key={0} value={''} disabled selected>Seleccione una opción</option>
                                            {dataAlmacen.map((almacen, index) => (
                                                <option key={index} value={almacen.id}>{almacen.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.AlmacenIdOrigen && <span className="text-red-600">{errors.AlmacenIdOrigen.message}</span>}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Actions>
                                <form method="dialog">
                                    <Button className="btn btn-outline btn-primary">Cerrar</Button>
                                </form>
                            </Modal.Actions>
                        </Modal>
                        <div className="col-span-3 lg:col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega destino:</label>

                            <input type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                value={nameBodegaModal}
                                readOnly />
                            {errors.BodegaDestino && <span className="text-red-600 block">{errors.BodegaDestino.message}</span>}
                            <button type="button" className="btn btn-outline btn-accent w-1/2 mt-2" onClick={handleShow}>Seleccione Bodega Destino</button>
                        </div>
                        <Modal ref={ref}>
                            <Modal.Header className="font-bold">Seleccione la bodega y almacén de destino</Modal.Header>
                            <Modal.Body>
                                <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">CentroCosto:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('CentroCostoIdDestino', { setValueAs: (value) => value === '' ? undefined : value })}
                                        >
                                            <option key={0} value={''} disabled selected>Seleccione una opción</option>
                                            {dataCentroCostoModal.map((centroCostoModal, index) => (
                                                <option key={index} value={centroCostoModal.id}>{centroCostoModal.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.CentroCostoIdDestino && <span className="text-red-600">{errors.CentroCostoIdDestino.message}</span>}

                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('BodegaIdDestino', { setValueAs: (value) => value === '' ? undefined : value })}
                                            onChange={(e) => {
                                                const selectedBodega = dataBodegaModal.find((bodega) => bodega.id === e.target.value);
                                                if (selectedBodega) {
                                                    setNameBodegaModal(selectedBodega.nombre);
                                                    setValue('BodegaDestino', selectedBodega.nombre);
                                                    setValue('BodegaIdDestino', selectedBodega.id);
                                                }
                                            }}
                                        >
                                            <option key={0} value={''} disabled selected>Seleccione una opción</option>
                                            {dataBodegaModal.map((bodegaModal, index) => (
                                                <option key={index} value={bodegaModal.id}>{bodegaModal.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.BodegaIdDestino && <span className="text-red-600">{errors.BodegaIdDestino.message}</span>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Almacen Destino:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('AlmacenIdDestino', { setValueAs: (value) => value === '' ? undefined : value })}
                                        >
                                            <option key={0} value={''} disabled selected>Seleccione una opción</option>
                                            {dataAlmacenModal.map((almacenModal, index) => (
                                                <option key={index} value={almacenModal.id}>{almacenModal.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.AlmacenIdDestino && <span className="text-red-600">{errors.AlmacenIdDestino.message}</span>}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Actions>
                                <form method="dialog">
                                    <Button className="btn btn-outline btn-primary">Cerrar</Button>
                                </form>
                            </Modal.Actions>
                        </Modal>
                    </div>
                    {/*  <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Dirección de origen:</label>
                            <input type="text"
                                {...register('DireccionOrigen', {
                                    setValueAs: (value) => value === "" ? undefined : value
                                })}
                                className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            {errors.DireccionOrigen && <span className="text-red-600">{errors.DireccionOrigen.message}</span>}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Dirección de destino:</label>
                            <input id="numeroDocumento" type="text"
                                {...register('DireccionDestino', {
                                    setValueAs: (value) => value === "" ? undefined : value
                                })}
                                className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            {errors.DireccionDestino && <span className="text-red-600">{errors.DireccionDestino.message}</span>}
                        </div>
                    </div> */}

                    <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-2">
                        {AlmacenIdOrigen && dataAlmacenArticulo.length > 0 ? (
                            <Table className='border shadow-lg'>
                                <Table.Head className="bg-primary text-white">
                                    <span>Selección</span>
                                    <span>Código artículo</span>
                                    <span>Código familia</span>
                                    <span>Familia</span>
                                    <span>Código sub-familia</span>
                                    <span>Sub-familia</span>
                                    <span>Descripción artículo</span>
                                    <span>Cantidad sistema</span>
                                    <span>Cantidad salida</span>

                                </Table.Head>
                                <Table.Body>
                                    {dataAlmacenArticulo.map((almacenArticulo, index) => {
                                        const fieldsIndex = fields.findIndex((field) => field.ArticuloId === almacenArticulo.articuloId);
                                        return (
                                            <Table.Row key={index} hover={true}>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={false}
                                                    className="checkbox checkbox-primary"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            append({
                                                                AlmacenId: almacenArticulo.almacenId,
                                                                ArticuloId: almacenArticulo.articuloId,
                                                                Cantidad: 0,
                                                                CodigoArticulo: almacenArticulo.articulo.codigo,
                                                                CodigoFamilia: almacenArticulo.articulo.subFamilium.familium.codigo,
                                                                Familia: almacenArticulo.articulo.subFamilium.familium.nombre,
                                                                CodigoSubFamilia: almacenArticulo.articulo.subFamilium.codigo,
                                                                SubFamilia: almacenArticulo.articulo.subFamilium.nombre,
                                                                DescripcionArticulo: almacenArticulo.articulo.descripcion
                                                            });
                                                        } else {
                                                            remove(fieldsIndex);
                                                        }
                                                    }}
                                                />
                                                <span>{almacenArticulo.articulo.codigo}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.familium.codigo}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.familium.nombre}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.codigo}</span>
                                                <span>{almacenArticulo.articulo.subFamilium.nombre}</span>
                                                <span>{almacenArticulo.articulo.descripcion}</span>
                                                <span>{almacenArticulo.cantidad}</span>
                                                {fields.find((field, fieldIndex) => fieldIndex === fieldsIndex) ? (
                                                    <input
                                                        type="number"
                                                        {...register(`ParteSalida.${fieldsIndex}.Cantidad`, {
                                                            setValueAs: (value) => value === "" ? undefined : Number(value)
                                                        })}
                                                        className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table>
                        ) : AlmacenIdOrigen && dataAlmacenArticulo.length === 0 ? (
                            <WarningAlert message={"No hay artículos disponibles en este almacén"} />
                        ) : (
                            <></>
                        )}
                    </div>




                    {showPdf && dataPost ?
                        <Modal open={showPdf}>
                            <Modal.Header>¿Desea crear un reporte de la guía de despacho?</Modal.Header>
                            <Modal.Body>
                                <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                                    <div className="col-span-2">
                                        <PDFDownloadLink document={<PDFGuiaEntrega data={dataPost} />} fileName={`Pdf_guia_de_entrega_bodega_${nameBodega}_a_bodega_${nameBodegaModal}`}>
                                            {
                                                ({ loading, url, error, blob }) => loading ? (
                                                    "Cargando.."
                                                ) : (
                                                    <button type="button" className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Exportar</button>
                                                )

                                            }
                                        </PDFDownloadLink>
                                    </div>
                                    <div className="col-span-2">
                                        <Button type="button" className="btn btn-outline btn-secondary w-1/2 mt-2" onClick={() => router.reload()}>
                                            salir
                                        </Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                        :
                        <button type="submit" className="btn btn-outline btn-primary md:my-0 lg:my-0 md:mx-2 lg:mx-2 inline-block">Guardar</button>
                    }


                </form>
            </div>
        </div>
    );
}