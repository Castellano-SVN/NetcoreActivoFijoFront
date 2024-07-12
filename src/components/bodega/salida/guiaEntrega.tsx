
import PDFGuiaEntrega from "@/components/pdf/guiaEntrega";
import { IArticulo, IBodega, ICentroCosto, IEmpresa, OutPutFormValues } from "@/interfaces/creation";
import { IAlmacen, IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";
import { api_getAllAlmacenArticuloByEmpByCenByBodByAlm, api_getAllAlmacenByEmpByCenByBod, api_getAllBodegaByEmpresaYCentroCosto, api_getAllBodegas, api_getAllCentroCostoByEmpresa, api_getAllEmpresas } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Table } from "react-daisyui";
import { useFieldArray, useForm } from "react-hook-form";
import { FaFilePdf, FaSave } from "react-icons/fa";
import { z } from "zod";

export default function GuiaEntrega() {
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Salidas");
    }, []);
    const { jwt } = useUserStore();

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



    const [dataEmpresaModal, setDataEmpresaModal] = useState<IEmpresa[]>([]);
    const [getDataEmpresaModal, setGetDataEmpresaModal] = useState('');

    const getAllEmpresasModal = async () => {
        try {
            const dataModal = await api_getAllEmpresas(jwt);
            setDataEmpresaModal(dataModal.data.dataList);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllEmpresasModal();
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

    const [dataCentroCostoModal, setDataCentroCostoModal] = useState<ICentroCosto[]>([]);
    const [getDataCentroCostoModal, setGetDataCentroCostoModal] = useState('');
    const getAllCentroCostosByEmpresaModal = async () => {
        try {
            const dataModal2 = await api_getAllCentroCostoByEmpresa(jwt, getDataEmpresaModal);
            setDataCentroCostoModal(dataModal2.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (getDataEmpresaModal !== '') {
            getAllCentroCostosByEmpresaModal();
        }
    }, [getDataEmpresaModal]);

    const [dataBodega, setDataBodega] = useState<IBodega[]>([]);
    const [getDataBodega, setGetDataBodega] = useState('');
    const [nameBodega, setNameBodega] = useState('');
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

    const [dataBodegaModal, setDataBodegaModal] = useState<IBodega[]>([]);
    const [getDataBodegaModal, setGetDataBodegaModal] = useState('');
    const [nameBodegaModal, setNameBodegaModal] = useState('');
    const getAllBodegasByEmpresaYCentroCostoModal = async () => {
        try {
            const dataModal3 = await api_getAllBodegaByEmpresaYCentroCosto(jwt, getDataEmpresaModal, getDataCentroCostoModal);
            setDataBodegaModal(dataModal3.data.dataList);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (getDataEmpresaModal !== '' && getDataCentroCostoModal !== '') {
            getAllBodegasByEmpresaYCentroCostoModal();
        }
    }, [getDataEmpresaModal, getDataCentroCostoModal]);

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
    const [getDataAlmacenArticulo, setGetDataAlmacenArticulo] = useState('');
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


    const ref = useRef<HTMLDialogElement>(null);
    const handleShow = useCallback(() => {
        ref.current?.showModal();
    }, [ref]);

    const ref3 = useRef<HTMLDialogElement>(null);
    const handleShow3 = useCallback(() => {
        ref3.current?.showModal();
    }, [ref3]);



    const ParteSalidaSchema = z.array(z.object({
        AlmacenId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        ArticuloId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        Cantidad: z.number({ required_error: "Campo inválido", invalid_type_error: "Tipo inválido" })
    }));

    const RequiredSchema = z.object({
        EmpresaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        CentroCostoId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        BodegaId: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
        Direccion: z.string({ required_error: "Campo requerido", invalid_type_error: "Tipo invalido" }),
    });

    const OutPutSchema = z.object({
        ParteSalida: ParteSalidaSchema,
        Required: RequiredSchema,

    });

    const metodos = useForm<OutPutFormValues>({ resolver: zodResolver(OutPutSchema) });
    const { register, handleSubmit, formState: { errors }, setValue, reset, control } = metodos;

  /*   const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, 
        name: "ParteSalida",
    }); */


    const onSubmit = async (data: OutPutFormValues) => {
        try {
            console.log('formulario data: ', data);
        } catch (error) {

        }
    };



    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 bg-white rounded w-full max-w-3xl">
                    <div className="flex flex-col md:grid md:grid-cols-6 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega origen:</label>

                            <input type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                value={nameBodega}
                                readOnly />
                            <button type="button" className="btn btn-outline btn-accent w-1/2 mt-2" onClick={handleShow3}>Seleccione Bodega Origen</button>
                        </div>
                        <Modal ref={ref3}>
                            <Modal.Header className="font-bold">Seleccione la bodega y almacen de Origen</Modal.Header>
                            <Modal.Body>
                                <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Empresa:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('Required.EmpresaId', { setValueAs: (value) => value === '' ? undefined : value })}
                                            onChange={(e) => {
                                                setGetDataEmpresa(e.target.value);
                                            }}>
                                            <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                            {dataEmpresa.map((empresa, index) => (
                                                <option key={index} value={empresa.id}>{empresa.razonSocial}</option>
                                            ))}
                                        </select>
                                        {errors.Required?.EmpresaId && <span className="text-red-600">{errors.Required?.EmpresaId.message}</span>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Centro de costo:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('Required.CentroCostoId', { setValueAs: (value) => value === '' ? undefined : value })}
                                            onChange={(e) => {
                                                setGetDataCentroCosto(e.target.value);
                                            }}>
                                            <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                            {dataCentroCosto.map((centroCosto, index) => (
                                                <option key={index} value={centroCosto.id}>{centroCosto.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.Required?.CentroCostoId && <span className="text-red-600">{errors.Required.CentroCostoId.message}</span>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega origen:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            {...register('Required.BodegaId', { setValueAs: (value) => value === '' ? undefined : value })}
                                            onChange={(e) => {
                                                setGetDataBodega(e.target.value);
                                                const selectedBodegaOrigen = dataBodega.find((bodegaOrigen) => bodegaOrigen.id === e.target.value);
                                                if (selectedBodegaOrigen) {
                                                    setNameBodega(selectedBodegaOrigen.nombre);
                                                }
                                            }}>
                                            <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                            {dataBodega.map((bodega, index) => (
                                                <option key={index} value={bodega.id}>{bodega.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.Required?.BodegaId && <span className="text-red-600">{errors.Required.BodegaId.message}</span>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Almacenes:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            onChange={(e) => {
                                                setGetDataAlmacen(e.target.value);
                                            }}>
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
                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega destino:</label>

                            <input type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                value={nameBodegaModal}
                                readOnly />

                            <button type="button" className="btn btn-outline btn-accent w-1/2 mt-2" onClick={handleShow}>Seleccione Bodega Destino</button>
                        </div>
                        <Modal ref={ref}>
                            <Modal.Header className="font-bold">Seleccione la bodega de destino</Modal.Header>
                            <Modal.Body>
                                <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Empresa:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            onChange={(e) => {
                                                setGetDataEmpresaModal(e.target.value);
                                            }}>
                                            <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                            {dataEmpresaModal.map((empresaModal, index) => (
                                                <option key={index} value={empresaModal.id}>{empresaModal.razonSocial}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">CentroCosto:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            onChange={(e) => {
                                                setGetDataCentroCostoModal(e.target.value);
                                            }}>
                                            <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                            {dataCentroCostoModal.map((centroCostoModal, index) => (
                                                <option key={index} value={centroCostoModal.id}>{centroCostoModal.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Bodega:</label>
                                        <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            onChange={(e) => {
                                                setGetDataBodegaModal(e.target.value);
                                                const selectedBodega = dataBodegaModal.find((bodega) => bodega.id === e.target.value);
                                                if (selectedBodega) {
                                                    setNameBodegaModal(selectedBodega.nombre);
                                                }
                                            }}
                                        >
                                            <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                            {dataBodegaModal.map((bodegaModal, index) => (
                                                <option key={index} value={bodegaModal.id}>{bodegaModal.nombre}</option>
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
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Dirección de origen:</label>
                            <input id="numeroDocumento" type="text"
                                className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Dirección de destino:</label>
                            <input id="numeroDocumento" type="text"
                                className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>

                    </div>

                    <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center">
                        <Table className='border shadow-lg'>
                            <Table.Head className="bg-primary text-white">
                                <span>Selección</span>
                                <span>Código articulo</span>
                                <span>Código familia</span>
                                <span>Familia</span>
                                <span>Código sub-familia</span>
                                <span>Sub-familia</span>
                                <span>Descripción articulo</span>
                                <span>Cantidad salida</span>

                            </Table.Head>
                            <Table.Body>
                                {dataAlmacenArticulo.map((almacenArticulo, index) => (
                                    <Table.Row key={index} hover={true}>
                                        <input type="checkbox" className="form-checkbox text-green-500" />
                                        <span>{almacenArticulo.articulo.codigo}</span>
                                        <span>{almacenArticulo.articulo.subFamilium.familium.codigo}</span>
                                        <span>{almacenArticulo.articulo.subFamilium.familium.nombre}</span>
                                        <span>{almacenArticulo.articulo.subFamilium.codigo}</span>
                                        <span>{almacenArticulo.articulo.subFamilium.nombre}</span>
                                        <span>{almacenArticulo.articulo.descripcion}</span>
                                        <input type="number" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" ></input>
                                    </Table.Row>
                                ))}

                            </Table.Body>
                        </Table>
                    </div>

                    <button type="submit" className="btn btn-outline btn-primary md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaSave />Guardar</button>

                    <PDFDownloadLink document={<PDFGuiaEntrega />} fileName='prueba_pdf'>
                        {
                            ({ loading, url, error, blob }) => loading ? (
                                "Cargando.."
                            ) : (
                                <button type="button" className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Exportar</button>
                            )

                        }
                    </PDFDownloadLink>
                </div>
            </form>
        </div>
    );
}