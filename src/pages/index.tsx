import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useUserStore } from "@/store/user.store";
import { api_getAnoMes } from "@/services/bodega.service";
import { Loading } from "react-daisyui";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { jwt } = useUserStore();
  return <AnoMes jwt={jwt} />;
}

interface anoMesProp {
  jwt: string;
}

function AnoMes({ jwt }: anoMesProp) {
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


  if (loading)
    return (
      <>
        <div className="text-primary text-center mt-4 md:col-span-2">
          <Loading size="lg" />
        </div>
      </>
    );

  return (
    <>
      {!loading && dataAnoMes ? (
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
                    {dataAnoMes.anoNumero}
                  </div>
                </div>
                  <div className="text-3xl text-center place-items-center">
                    <div className="border rounded-lg grid grid-rows-2 gap-2 w-full p-2">
                      <span>Mes</span>
                        {dataAnoMes.mes}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
