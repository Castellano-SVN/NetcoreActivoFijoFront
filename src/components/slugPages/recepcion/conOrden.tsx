import PDFConOrden from "@/components/pdf/recepcion/recepcionConOrden";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Table, Textarea } from "react-daisyui";
import { FaFilePdf } from "react-icons/fa";

interface props {
    valorPdf: boolean;
}


export default function ConOrden(props: props) {
    const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Recepcion");
    }, []);

    const searchParams = useSearchParams();
    const id = searchParams.get('empresa'); //obtenemos la empresa
    const empresaId = id?.toString();

    const estado = props.valorPdf;
    const { jwt } = useUserStore();

    // const getPDF = async (empresaId: string, estado: boolean) => {
    //     /* ReactPDF.renderToStream(<PDFConsulta />); */
    //     try {
    //         //const response = await api_pdf_recepcion(jwt, empresaId, estado);

    //         // Crear una URL para el Blob
    //         //const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));


    //         // Crear un enlace temporal y simular un clic para descargar el archivo
    //         //const link = document.createElement('a');
    //         //link.href = url;
    //         //link.setAttribute('download', `documento_${valorEstado}.pdf`); // Nombre del archivo
    //         //document.body.appendChild(link);
    //         //link.click();

    //         // Limpiar el enlace temporal y revocar la URL
    //         //link.parentNode?.removeChild(link);
    //         //window.URL.revokeObjectURL(url); // Libera memoria utilizada por el Blob
    //     } catch (error) {
    //         console.error('Error al descargar el PDF:', error);

    //     }
    // }

    const guardarPdf = () => {
        const valorEstado = estado == true ? "con_orden" : "sin_orden";

        console.log('su estado es: ' + valorEstado);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="p-6 bg-white rounded w-full max-w-3xl">
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                    <div>
                        <label className="block text-left mb-2" htmlFor="Folio Recepcion">Folio Recepcion:</label>
                        <input id="folioRecepcion" type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Fecha:</label>
                        <input id="fecha" type="date" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-left mb-2" htmlFor="centroDeCosto">Centro de costo:</label>
                        <select id="centroDeCosto" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="1">Centro costo 1</option>
                            <option value="2">Centro costo 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-left mb-2" htmlFor="bodega">Bodega:</label>
                        <select id="bodega" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="">Bodega 1</option>
                            <option value="">Bodega 2</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-6">
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Número documento:</label>
                        <input id="numeroDocumento" type="text" className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-left mb-2" htmlFor="fechaDocumento">Fecha de documento:</label>
                        <input id="fechaDocumento" type="date" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>

                </div>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 text-center">Tipo de documento:</label>
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


                <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible lg:flex lg:justify-center mb-4">
                    <Table className='border shadow-lg'>
                        <Table.Head className="bg-primary text-white">
                            <span>Codigo</span>
                            <span>Nombre</span>
                            <span>Cantidad</span>
                            <span>Precio</span>
                            <span>Observación</span>
                            <span>Recepcionado</span>
                            <span>Por recepcionar</span>
                            <span>Cantidad recibida</span>
                            <span>Observaciones</span>
                        </Table.Head>

                        <Table.Body>

                            <Table.Row hover={true}>
                                <span>534333</span>
                                <span>APOSITO COLAGENO 10X11</span>
                                <span>36,000</span>
                                <span>11.043</span>
                                <span>--</span>
                                <span>36,00</span>
                                <span>0.000</span>
                                <span>
                                    <input type="number"
                                        placeholder="36,000"
                                        className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                </span>
                                <span>
                                    <input type="text"
                                        className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                </span>
                            </Table.Row>

                            <Table.Row hover={true}>
                                <span>43356</span>
                                <span>TULL NO ADEHERENTE CON SILICONA</span>
                                <span>100,000</span>
                                <span>2.242</span>
                                <span>--</span>
                                <span>0.000</span>
                                <span>100.000</span>
                                <span>
                                    <input type="number"
                                        placeholder='0,000'
                                        className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                </span>
                                <span>
                                    <input type="text"
                                        className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                </span>

                            </Table.Row>

                        </Table.Body>
                    </Table>
                </div>

                <div className="mb-4">
                    <label className="block text-left mb-2" htmlFor="Descripcion_generals">Descripcion General:</label>
                    <Textarea rows={4} className="mt-1 block w-full py-1 md:py-2 lg:py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                   
                </div>

                <PDFDownloadLink document={<PDFConOrden />} fileName='conOrdenDeCompra_pdf'>
                    {
                        ({ loading, url, error, blob }) => loading ? (
                            "Cargando.."
                        ) : (
                            <button type="button" className="btn btn-outline btn-accent md:my-0 lg:my-0 md:mx-2 lg:mx-2"><FaFilePdf />Guardar</button>
                        )

                    }
                </PDFDownloadLink>
            </div>
        </div>
    );
}
