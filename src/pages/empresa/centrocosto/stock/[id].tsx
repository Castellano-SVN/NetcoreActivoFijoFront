"use client";
import TablaQuiebreStock from "@/components/bodega/informes/tablas/TableQuiebreStock";
import StockBodega from "@/components/stock/stockBodega";
import { api_getBodegas_almacenes } from "@/services/bodega.service";
import { useTiposStore } from "@/store/tipos.store";
import { useUserStore } from "@/store/user.store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface dataI {
  id: string;
  nombre: string;
  codigo: null | string;
  collection: {
    codigo: string;
    nombre: string;
    stockMin: number;
    cantidad: number;
    id: string;
  }[];
}

export default function Page() {
  const { jwt } = useUserStore();
  const params = useParams();
  const [data, setData] = useState<dataI | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (params?.id) {
      getAlmacenes();
    }
  }, [params]);
  const router = useRouter();
  const getAlmacenes = async () => {
    try {
      const data = await api_getBodegas_almacenes(jwt, params.id as string);
      setData(data.data.data);
      setIsLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#169eee] text-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            type="button"
            className="
        inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-white/15 hover:bg-white/25
        transition
        focus:outline-none focus:ring-2 focus:ring-white/30
      "
            aria-label="Volver"
            title="Volver"
          >
            <FaArrowLeft className="w-4 h-4 text-white" />
          </button>

          <h1 className="text-sm md:text-base font-bold">
            Stock de bodega:
          </h1>
        </div>
      </header>

      {/* Contenido */}
      {isLoading && data && <StockBodega data={data}></StockBodega>}
    </div>
  );
}
