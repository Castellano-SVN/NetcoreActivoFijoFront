import GuiaEntrega from "@/components/bodega/salida/guiaEntrega";
import { useContextStore } from "@/store/context.store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Index() {
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Salidas");
  }, []);

  const searchParams = useSearchParams();
  const search = searchParams.get("empresa");
  const idEmpresa = String(search);

  return (
    <React.Fragment>
      <div className="flex items-center justify-center">
        <div className="container shadow-md border rounded-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Guía de Entrega</h1>
          </div>
          <div className="flex flex-row justify-center mb-4">
            <div className="flex flex-col w-full">
              <GuiaEntrega />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
