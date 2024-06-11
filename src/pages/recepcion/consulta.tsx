import PropiedadesConsulta from "@/components/slugPages/consultas/propiedadesConsulta";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";


export default function Consulta() {


    return (
        <>
            <div className="flex flex-row justify-center p-4">
                <div className="flex flex-col shadow-md border rounded-md w-full md:w-5/6 lg:w-3/5 p-6">
                    <h5 className="text-2xl font-bold mb-4">Selección de requerimiento</h5>
                    <div className="flex flex-col w-full items-center">
                        <label className="py-2 px-3 ml-4">Ingrese numero del requerimiento</label>
                        <input type="number"
                            className="block w-full md:w-1/2 lg:w-8/12 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="flex flex-col items-center mt-4">
                        <button className="btn btn-outline w-full md:w-1/4 lg:w-1/4 btn-primary"><FaSearch />Buscar</button>
                    </div>
                    <br />

                    <PropiedadesConsulta />
                </div>
            </div>
        </>
    );


}