import PDFSinOrden from '@/components/pdf/recepcionSinOrden';
import { useUserStore } from '@/store/user.store';
import { PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react';
import { Table } from 'react-daisyui';
import { FaFilePdf, FaPlus, FaTrash } from 'react-icons/fa';

export default function SinOrden() {
    const { jwt } = useUserStore();



    return (
        <div className="flex justify-center items-cente">
            <div className="p-6 bg-white rounded w-full max-w-3xl">
                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Número documento:</label>
                        <input id="numeroDocumento" type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="centroDeCosto">Centro de costo:</label>
                        <select id="centroDeCosto" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="1">Centro costo 1</option>
                            <option value="2">Centro costo 2</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                    <div>
                        <label className="block text-left mb-2" htmlFor="bodega">Bodega:</label>
                        <select id="bodega" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="">Bodega 1</option>
                            <option value="">Bodega 2</option>
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
                        <input id="numeroDocumento" value='3567' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Area:</label>
                        <input id="numeroDocumento" value='Salud' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Proveedor:</label>
                        <input id="numeroDocumento" value='NEUMANN LTDA' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                    </div>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Rut encargado bodega:</label>
                        <input id="numeroDocumento" value='12.587.987-3' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Nombre encargado bodega:</label>
                        <input id="numeroDocumento" value='JUAN GONZALEZ' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
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
                            <Table.Row hover={true}>
                                <span>20001001</span>
                                <span>APOSITO COLAGENO 10X11</span>
                                <span>200</span>
                                <span>CURACIONES Y EXAMENES</span>
                                <span>200001</span>
                                <span>INSUMOS MEDICOS</span>
                                <span>11.500</span>
                                <span>
                                    <input type="number"
                                        placeholder='15'
                                        value="15"
                                        className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                </span>
                                <span>
                                    <input type="text"
                                        className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                </span>
                            </Table.Row>

                            <Table.Row hover={true}>
                                <span>20001002</span>
                                <span>CREMA HUMECTANTE UREA</span>
                                <span>200</span>
                                <span>CURACIONES Y EXAMENES</span>
                                <span>200001</span>
                                <span>INSUMOS MEDICOS</span>
                                <span>4.200</span>
                                <span>
                                    <input type="number"
                                        placeholder='50'
                                        value="50"
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
        </div>
    );
}
