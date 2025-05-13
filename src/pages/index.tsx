import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useUserStore } from "@/store/user.store";
import { api_getAnoMes } from "@/services/bodega.service";
import { Loading } from "react-daisyui";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { jwt } = useUserStore();
  // return <AnoMes jwt={jwt} />;
}

interface anoMesProp {
  jwt: string;
}

interface IAnoMes {
  anoNumero: number;
  mesNumero: number;
}

function AnoMes({ jwt }: anoMesProp) {
  const [dataAnoMes, setDataAnoMes] = useState<IAnoMes[]>();
  const [loading, setLoading] = useState(false);

  const getAnoMes = async () => {
    try {
      setLoading(true);
      const data = await api_getAnoMes(jwt);
      setDataAnoMes(data.data.dataList);
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

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <>
      {loading ? (
        <div className="text-primary text-center mt-4 md:col-span-2">
          <Loading size="lg" />
        </div>
      ) : dataAnoMes && dataAnoMes.length > 0 ? (
        <>
          <div className="w-full grid place-items-center mt-2">
            <div className="md:w-2/5 p-4 border border-primary rounded-md shadow-md">
              <div className="grid md:grid-cols-2 gap-2">
                <div className="md:col-span-2">
                  <h1 className="text-xl text-black text-start">
                    Periodo del proceso actual:
                  </h1>
                </div>
                <div className="text-3xl text-center place-items-center">
                  <div className="border rounded-lg grid grid-rows-2 gap-2 w-full p-2">
                    <span>Año</span>
                    {dataAnoMes[0]?.anoNumero}
                  </div>
                </div>
                {dataAnoMes[0]?.mesNumero != 0 && (
                  <div className="text-3xl text-center place-items-center">
                    <div className="border rounded-lg grid grid-rows-2 gap-2 w-full p-2">
                      <span>Mes</span>
                      {meses[dataAnoMes[0]?.mesNumero - 1] ||
                        dataAnoMes[0]?.mesNumero}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
