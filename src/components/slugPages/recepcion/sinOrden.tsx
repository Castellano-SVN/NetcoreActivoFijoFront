import PDFSinOrden from "@/components/pdf/recepcion/recepcionSinOrden";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect } from "react";
import { Table } from "react-daisyui";
import { FaFilePdf } from "react-icons/fa";
import { ICotizacion } from "@/interfaces/creation";
interface props {
    dataSinOrdenCompra: ICotizacion[];
}

export default function SinOrden(props: props) {
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Recepcion");
    }, []);
    const data = props.dataSinOrdenCompra;
    //hasta aqui

    return (
        <div className="flex justify-center items-cente">
            {data.map((sinOrden, index) => (
                <div className="p-6 bg-white rounded w-full max-w-3xl">
                    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                        <div>
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Número documento:</label>
                            <input id="numeroDocumento" type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-left mb-2" htmlFor="centroDeCosto">Centro de costo:</label>
                            <select id="centroDeCosto" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                <option key={0} value={0} selected disabled>Seleccione una opción</option>

                                {sinOrden.cotizacionDetalles.map((cotizacion, cotizacionIndex) => (
                                    <option key={cotizacionIndex} value={cotizacion.solicitudDetalle.centroCosto.id}>
                                        {cotizacion.solicitudDetalle.centroCosto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                        <div>
                            <label className="block text-left mb-2" htmlFor="bodega">Bodega:</label>
                            <select id="bodega" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                <option key={0} value={0} selected disabled>Seleccione una opción</option>

                                {sinOrden.cotizacionDetalles.map((cotizacion, cotizacionIndex) => (
                                    cotizacion.solicitudDetalle.centroCosto.bodegas.map((bodegas, bodegaIndex) => (

                                        <option key={index} value={bodegas.id}>
                                            {bodegas.nombre}
                                        </option>
                                    ))))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-left mb-2" htmlFor="fechaDocumento">Fecha de documento:</label>
                            <input id="fechaDocumento" type="date" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label className="block text-center mb-2">Tipo de documento:</label>
                            <div className="flex justify-center">
                                <label className="mr-4">
                                    <input type="radio" name="tipoDocumento" value="tipo1" className="radio radio-xs radio-primary ml-2 mr-2" />
                                    Factura
                                </label>
                                <label>
                                    <input type="radio" name="tipoDocumento" value="tipo2" className="radio radio-xs radio-primary ml-2 mr-2" />
                                    Guia de despacho
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4 lg:grid lg:grid-cols-3 lg:gap-4 mb-4">
                        <div>
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Numero de documento:</label>
                            <input id="numeroDocumento" value='' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Area:</label>
                            <input id="numeroDocumento" value='' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                        </div>
                        <div>
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Proveedor:</label>
                            <input id="numeroDocumento" value={sinOrden.proveedor.nombreComercial} type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                        </div>
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                        <div>
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Rut encargado bodega:</label>
                            <input id="numeroDocumento" value='' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-left mb-2" htmlFor="numeroDocumento">Nombre encargado bodega:</label>
                            <input id="numeroDocumento" value='' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>


                    <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-4">
                        <Table className='border shadow-lg'>
                            <Table.Head className="bg-primary text-white">

                                <span>Código articulo</span>
                                <span>Descripción articulo</span>
                                <span>Código familia</span>
                                <span>Familia</span>
                                <span>Código sub-familia</span>
                                <span>Sub-familia</span>
                                <span>Precio compra</span>
                                <span>Cantidad recibida</span>
                                <span>Observaciones</span>

                            </Table.Head>
                            <Table.Body>

                                {sinOrden.cotizacionDetalles.map((cotizacion, cotizacionIndex) => (
                                    <Table.Row hover={true}>
                                        <span>{cotizacion.articulo.codigo}</span>
                                        <span>{cotizacion.articulo.nombre}</span>
                                        <span>{cotizacion.articulo.subFamilium.familium.codigo}</span>
                                        <span>{cotizacion.articulo.subFamilium.familium.nombre}</span>
                                        <span>{cotizacion.articulo.subFamilium.codigo}</span>
                                        <span>{cotizacion.articulo.subFamilium.nombre}</span>
                                        <span>{cotizacion.valorUnitario}</span>
                                        <span>
                                            <input type="number"
                                                className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                        </span>
                                        <span>
                                            <input type="text"
                                                className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                        </span>
                                    </Table.Row>
                                ))}

                            </Table.Body>
                        </Table>
                    </div>
                    <PDFDownloadLink document={<PDFSinOrden />} fileName='sinOrdenDeCompra_pdf'>
                        {
                            ({ loading, url, error, blob }) => loading ? (
                                "Cargando.."
                            ) : (
                                <button type="button" className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Guardar</button>
                            )

                        }
                    </PDFDownloadLink>
                </div>
            ))}
        </div>
    );
}
