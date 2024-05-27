import { IEmpresa } from "@/interfaces/creation";
import { api_getOneEmpresa } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Divider } from "react-daisyui";


export default function Index() {
   /*  const { setActive } = useContextStore()
    useEffect(() => {
        setActive("Recepcion");
    }, [])
    const router = useRouter();
    const { jwt } = useUserStore();
    console.log(router.query.slug);
    const [dataEmpresa, setDataEmpresa] = useState<IEmpresa>();
    const getEmpresa = async (id: string) => {
        try {
            const dataGet = await api_getOneEmpresa(jwt, id);
            setDataEmpresa(dataGet.data.dataList[0]);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getEmpresa(router.query.slug as string);
    }, [router.query]);
 */




    /* if (!dataEmpresa) return "cargando"; */
    return (
        <>
           {/*  <div className="flex items-center justify-center">
                <div className="container shadow-md md:mx-24 mt-2 sm:mt-4 rounded-lg">
                    <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">
                                {dataEmpresa.razonSocial}
                            </span>
                            <span className="text-left">{dataEmpresa.giro}</span>
                        </div>
                    </div>
                    <Divider />
                    <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">
                                Cotizacion 
                            </span>
                        </div>
                    </div>
                    <Cotizacion guid={slugs?.familia} />


                </div>
            </div> */}



        </>
    );
}