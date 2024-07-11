import TableMoveArticle from "@/components/bodega/informes/tablemovartic";
import PDFMovimientoArticulo from "@/components/pdf/informes/pdfmovimientoarticulo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";
import { api_getAllAlmacenArticuloByEmpByCenByBodByAlm, api_getAllAlmacenByEmpByCenByBod, api_getAllBodegaByEmpresaYCentroCosto, api_getAllBodegas, api_getAllCentroCostoByEmpresa, api_getAllEmpresas } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { useCallback, useEffect, useRef, useState } from "react";
import { IBodega, ICentroCosto, IEmpresa } from "@/interfaces/creation";
import { Button, Modal, Table } from "react-daisyui";
import { IAlmacen, IAlmacenArticulo } from "@/interfaces/modules/IAlmacen.interface";

export default function MovimientoArticulos() {
    const ref = useRef<HTMLDialogElement>(null);
    const handleShow = useCallback(() => {
        ref.current?.showModal();
    }, [ref]);

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
    const [getDataAlmacenArticulo, setGetDataAlmacenArticulo] = useState('');
    const [nameArticulo, setNameArticulo] = useState('');
    const [codigoArticulo, setCodigoArticulo] = useState('');
    const [DescripcionArticulo, setDescripcionArticulo] = useState('');

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

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Registro movimiento de artículos en unidades</h1>
            <div className="flex flex-col md:flex-row lg:flex-row md:justify-around lg:justify-around w-full">
                <div className="flex flex-col mr-4">
                    <div className="flex flex-col lg:flex-row items-center mb-2">
                        <label className="w-full lg:w-40 text-center lg:text-left">Codigo de Articulo:</label>
                        <input
                            type="text"
                            value={codigoArticulo}
                            className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            readOnly
                        />
                        <button type="button" className="btn btn-outline btn-accent w-1/2 mt-2" onClick={handleShow}>Seleccione Articulo</button>
                    </div>
                    <Modal ref={ref}>
                        <Modal.Header className="font-bold">Seleccione el articulo</Modal.Header>
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
                                <div className="col-span-4">
                                    <label className="block text-left mb-2" htmlFor="almacen">Articulo:</label>
                                    <select className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        onChange={(e) => {
                                            setGetDataAlmacenArticulo(e.target.value);
                                            const selectedArticulo = dataAlmacenArticulo.find((almacenAarticulo) => almacenAarticulo.articulo.id === e.target.value);
                                            if (selectedArticulo) {
                                                setNameArticulo(selectedArticulo.articulo.nombre);
                                                setCodigoArticulo(selectedArticulo.articulo.codigo);
                                                setDescripcionArticulo(selectedArticulo.articulo.descripcion);
                                            }
                                        }}
                                    >
                                        <option key={0} value={0} disabled selected>Seleccione una opción</option>
                                        {dataAlmacenArticulo.map((almacenArticulo, index) => (
                                            <option key={index} value={almacenArticulo.articulo.id}>{almacenArticulo.articulo.codigo}  -  {almacenArticulo.articulo.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Actions>
                            <form method="dialog">
                                <Button className="btn btn-outline btn-primary">Aceptar</Button>
                            </form>
                        </Modal.Actions>
                    </Modal>
                    <div className="flex flex-col lg:flex-row items-center mb-2">
                        <label className="w-full lg:w-40 text-center lg:text-left">Descripcion del Articulo:</label>
                        <input
                            type="text"
                            value={DescripcionArticulo}
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center mb-2">
                        <label className="w-full lg:w-40 text-center lg:text-left">Stock Critico:</label>
                        <input
                            type="number"
                            value={35}
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-col lg:flex-row items-center mb-2">
                        <label className="w-full lg:w-40 text-center">Desde:</label>
                        <input
                            type="text"
                            value="01-07-2024"
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center mb-2">
                        <label className="w-full lg:w-40 text-center">Hasta:</label>
                        <input
                            type="text"
                            value="02-07-2024"
                            className="input input-bordered input-primary flex-grow"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <TableMoveArticle />
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
    );
}
