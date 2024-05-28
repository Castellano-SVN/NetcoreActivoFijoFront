import { IEmpresa } from "@/interfaces/creation";
import { api_getOneEmpresa } from "@/services/bodega.service";
import { useContextStore } from "@/store/context.store";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Divider } from "react-daisyui";
import CreateCotizacion from "../../../components/slugPages/cotizacion/create";
import Show from "../../../components/slugPages/cotizacion/show";


export default function Index() {
    const { setActive } = useContextStore()
    const router = useRouter();
    const { jwt } = useUserStore();
    useEffect(() => {
        setActive("Recepcion");
    }, [])

    const [slugs, setSlugs] = useState<{ empresa: string }>();
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
        if (!router.query.slug) return;
        const empresa = router.query.slug[0];
        getEmpresa(empresa);
    //  if (subFamilia) SubfamiliasQuerys(familia,subFamilia);
        setSlugs({
        empresa: empresa
        });
      }, [router.query]);



    if (!dataEmpresa) return "cargando"; 
    if (!slugs?.empresa) return "cargando"; 
    return (
        <>
            <div className="flex items-center justify-center">
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
                    {/* <CreateCotizacion guid={slugs?.empresa} /> */}
                    <Show  empresaId={slugs.empresa}/>

                </div>
            </div>



        </>
    );
}