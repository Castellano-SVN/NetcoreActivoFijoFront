import GuiaDepacho from "@/components/bodega/salida/guiaDespacho";
import React from "react";

export default function Index() {
    return (
        <React.Fragment>
            <div className="flex items-center justify-center">
                <div className="container shadow">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Guia de despacho</h1>

                        <GuiaDepacho />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


