import React from 'react';
import { Table } from 'react-daisyui';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function SinOrden() {
    return (
        <div className="flex justify-center items-cente">
            <div className="p-6 bg-white rounded w-full max-w-3xl">
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                        <label className="block text-left mb-2">Tipo de documento:</label>
                        <div className="flex items-center">
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

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Numero de documento:</label>
                        <input id="numeroDocumento" value='3567' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Area</label>
                        <input id="numeroDocumento" value='Salud' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Proveedor:</label>
                        <input id="numeroDocumento" value='NEUMANN LTDA' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />

                    </div>

                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Rut encargado bodega:</label>
                        <input id="numeroDocumento" value='12.587.987-3' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-left mb-2" htmlFor="numeroDocumento">Nombre encargado bodega:</label>
                        <input id="numeroDocumento" value='JUAN GONZALEZ' type="text" className="mt-1 block w-full py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>


                </div>


                <div className="overflow-x-auto">
                    <Table /* {...args} */>
                        <Table.Head className="bg-primary text-white">
                            <span>Código articulo</span>
                            <span>Descripción articulo</span>
                            <span>Codigo familia</span>
                            <span>Familia</span>
                            <span>Código sub-familia</span>
                            <span>Sub-familia</span>
                            <span>Precio compra</span>
                            <span>Cantidad recibida</span>
                            <span>Observaciones</span>

                        </Table.Head>
                        <Table.Body>

                            <Table.Row className="hover:bg-gray-100">
                                <span>20001001</span>
                                <span>APOSITO COLAGENO 10X11</span>
                                <span>200</span>
                                <span>CURACIONES Y EXAMENES</span>
                                <span>200001</span>
                                <span>INSUMOS MEDICOS</span>
                                <span>11.500</span>
                                <span>15</span>
                                <span></span>


                            </Table.Row>

                            <Table.Row className="hover:bg-gray-100">
                                <span>20001002</span>
                                <span>CREMA HUMECTANTE UREA</span>
                                <span>200</span>
                                <span>CURACIONES Y EXAMENES</span>
                                <span>200001</span>
                                <span>INSUMOS MEDICOS</span>
                                <span>4.200</span>
                                <span>50</span>
                                <span></span>


                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
}
