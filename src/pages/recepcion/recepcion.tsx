import { useEffect, useState } from "react";
import ConOrden from "./conOrden";
import SinOrden from "./sinOrden";
import React from "react";
import { useSearchParams } from "next/navigation";


export default function recepcion() {
   
   
    const [conOrden, setConOrden] = useState(true);

    return (
        <React.Fragment>
            <div className="flex items-center justify-center">
                <div className="container shadow">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Recepción de Artículos</h1>
                        <div className="mb-2">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="orden"
                                    value="conOrden"
                                    checked={conOrden}
                                    onChange={() => setConOrden(true)}
                                    className="radio radio-xs radio-primary ml-2 mr-2"
                                />
                                Con orden de compra
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="orden"
                                    value="sinOrden"
                                    checked={!conOrden}
                                    onChange={() => setConOrden(false)}
                                    className="radio radio-xs radio-primary ml-2 mr-2"
                                />
                                Sin orden de compra
                            </label>
                        </div>
                        <div>
                            {conOrden ? (
                                <div className="transition duration-300 opacity-100">
                                    <ConOrden valorPdf={conOrden}/>
                                </div>
                            ) : (
                                <div className="transition duration-300 opacity-100">
                                    <SinOrden />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}