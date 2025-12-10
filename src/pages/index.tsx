import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.store";
import { api_getAnoMes } from "@/services/bodega.service";
import { Loading } from "react-daisyui";

export default function Home() {
  const { jwt } = useUserStore();
  return <AnoMes jwt={jwt} />;
}

interface AnoMesProps {
  jwt: string;
}

const monthName = (m: number) =>
  ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][Math.max(0, Math.min(11, m - 1))] || m;

function AnoMes({ jwt }: AnoMesProps) {
  const [dataAnoMes, setDataAnoMes] = useState<{ anoNumero: number; mes: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const getAnoMes = async () => {
    try {
      setLoading(true);
      const data = await api_getAnoMes(jwt);
      const first = data?.data?.data;
      if (first) {
        setDataAnoMes({
          anoNumero: first.anoNumero,
          mes: first.mes,
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnoMes();
  }, []);

  if (loading) {
    return (
      <div className="text-primary text-center mt-4">
        <Loading size="lg" />
      </div>
    );
  }

  if (!dataAnoMes) return null;

  return (
    <div className="w-full flex justify-center m-4 px-4">
      <div className="w-full max-w-xl p-4 border-2 border-primary rounded-lg shadow-md bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <h1 className="text-xl text-black">Periodo del proceso actual:</h1>
          </div>
          <div className="text-3xl flex items-center justify-center">
            <div className="border rounded-lg flex flex-col items-center justify-center gap-1 w-full p-3">
              <span className="text-base text-neutral-600">Año</span>
              <span className="font-semibold text-primary">{dataAnoMes.anoNumero}</span>
            </div>
          </div>
          <div className="text-3xl flex items-center justify-center">
            <div className="border rounded-lg flex flex-col items-center justify-center gap-1 w-full p-3">
              <span className="text-base text-neutral-600">Mes</span>
              <span className="font-semibold text-primary">{monthName(dataAnoMes.mes)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
