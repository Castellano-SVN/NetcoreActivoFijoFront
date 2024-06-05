import { FaFileExport } from "react-icons/fa";
import { FaCircleXmark, FaPlus, FaRegFloppyDisk } from "react-icons/fa6";

export default function Requerimiento() {
    return (
        <>
            <div className="w-full md:w-1/2 md:pl-2">
                <div className="container mx-auto mt-2 sm:mt-4 rounded-lg">
                    <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-md">
                        <h5 className="text-2xl font-bold mb-4">Requerimiento</h5>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Ingrese Nombre</label>
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <div className="w-full max-w-4xl overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Glosa</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">001</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nombre 1</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                                                <input
                                                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                                                <input
                                                    className="mt-1 block w-4/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                                                <FaCircleXmark className="text-error" />

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Programa</label>
                            <div className="flex justify-center">
                                <select
                                    id="centro_costo"
                                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Seleccione Programa</option>
                                    <option value="centro_1">Programa 1</option>
                                    <option value="centro_2">Programa 2</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Observación</label>
                            <div className="flex justify-center">
                                <textarea
                                    placeholder="Escriba aqui..."
                                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button className="my-2 mx-0 md:mx-2 btn bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <FaPlus />
                                Nuevo
                            </button>
                            <button className="my-2 mx-0 md:mx-2 btn bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <FaFileExport />
                                Exportar
                            </button>
                            <button className="my-2 mx-0 md:mx-2 btn bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <FaRegFloppyDisk />
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}