import { IConsulta} from "@/interfaces/creation";
import { Table } from "react-daisyui";
import { FaArrowLeft, FaFilePdf, FaPlus, FaSave } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

interface props {
    solicitud: IConsulta[] | undefined;
}

export default function PropiedadesConsulta(props: props) {

    return (
        <>
            {props.solicitud?.map((consulta, index) => (
                <div key={index}>
                    <div className="flex flex-col md:flex-row lg:flex-row w-full">
                        <label className="py-2 px-3 ml-4">Nombre: </label>
                        <input type="text"
                            value={consulta.nombre.toUpperCase()}
                            className="block w-full md:w-1/2 lg:w-1/2 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" disabled />
                    </div>

                    <div className="flex flex-col md:flex-row lg:flex-row justify-between w-full mt-2">
                        <div className="flex flex-col md:flex-row lg:flex-row w-full">
                            <label className="py-2 px-3 ml-4">Numero: </label>
                            <input type="number"
                            value={consulta.numero}
                            className="block w-full md:w-20 lg:w-20 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div className="flex flex-col md:flex-row lg:flex-row w-full">
                            <label className="py-2 px-3 ml-4">Fecha de ingreso: </label>
                            <input type="date"
                             value={consulta.fechaIngreso}
                             className="block w-full md:w-40 lg:w-40 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row lg:flex-row w-full mt-2">
                        <label className="py-2 px-3 ml-4">Centro de costo:</label>
                        <select className="block w-full md:w-3/2 lg:w-2/3 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" >
                        <label className="py-2 px-3 ml-4"></label>
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row lg:flex-row mt-2">
                        <label className="py-2 px-3 ml-4">Programa:</label>
                        <label className="py-2 px-3"> wdlkjdlkasajdlaksñla</label>
                    </div>

                    <div className="flex flex-col md:flex-row lg:flex-row w-full">
                        <label className="py-2 px-3 ml-4">Estado:</label>
                        <div className="flex flex-row">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="radio radio-xs radio-primary ml-2"
                                    name=""
                                    value=""
                                />
                                <span className="ml-2">Aceptado</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="radio radio-xs radio-primary ml-2"
                                    name=""
                                    value=""
                                />
                                <span className="ml-2">Rechazado</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row lg:flex-row w-full justify-center border-b mb-4">
                        <button className="btn btn-outline btn-primary mb-4"><FaPlus />Agregar</button>
                    </div>

                    <div className="flex flex-col md:flex-row lg:flex-row w-full justify-center border-b mb-2">
                        <div className="overflow-x-auto shadow-md rounded-md border mb-4">
                            <Table /* {...args} */>
                                <Table.Head className="bg-slate-200">
                                    <span>Codigo</span>
                                    <span>Nombre</span>
                                    <span>Cantidad</span>
                                    <span>Glosa</span>
                                    <span>Acciones</span>
                                </Table.Head>
                                <Table.Body>
                                    <Table.Row className="hover:bg-gray-100">
                                        <span>1</span>
                                        <span>Cy Ganderton</span>
                                        <span><input type="number"
                                            className="block w-20 py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                        </span>
                                        <span><input type="text"
                                            className="block w-auto py-1 px-1 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                        </span>
                                        <span><FaCircleXmark className="text-error cursor-pointer hover:font-bold" /></span>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row lg:flex-row w-full mt-2">
                        <label className="py-2 px-3 ml-4">Observacion:</label>
                        <textarea rows={4} className="py-2 px-3 w-full border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary "></textarea>
                    </div>
                </div>
            ))}
        </>
    );


}