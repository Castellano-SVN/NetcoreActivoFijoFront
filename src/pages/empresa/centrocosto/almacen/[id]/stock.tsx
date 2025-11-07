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
      const data = await api_getBodegas_almacenes(
        jwt,
        params.id as string,
        true,
      );
      setData(data.data.data);
      setIsLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 bg-white shadow-sm px-4 py-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Volver"
        >
          <FaArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          Quiebre de stock de Bodega
        </h1>
      </header>

      {/* Contenido */}
      {isLoading && data && <StockBodega data={data}></StockBodega>}
    </div>
  );
}
