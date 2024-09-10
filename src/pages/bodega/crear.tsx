import { BodegaFormValues } from "../../interfaces/creation";
import Head from "next/head";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useForm,
    FormProvider,
    SubmitHandler,
    FieldValues,
} from "react-hook-form";
import ContentForm from "../../components/contentForm";
import { Button, Modal } from "react-daisyui";
import { DiCode } from "react-icons/di";
import NomSigDes from "@/components/bodega/bodega/NomSigDes";
import { useUserStore } from "@/store/user.store";
import { useCallback, useEffect, useRef } from "react";
import { api_postBodegas } from "@/services/bodega.service";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
interface CentroCosto {
    EmpresaId: string;
    id: string;
    CentroCostoId?: string | null;
    AdministradorId?: string | null;
    Nombre: string;
    Sigla?: string | null;
    AreaGeograficaCodigo: number;
    TipoEstablecimientoSaludCodigo?: number | null;
    RegionCodigo?: number | null;
    CiudadCodigo?: number | null;
    ComunaCodigo?: number | null;
    Email?: string | null;
    Direccion?: string | null;
    Telefono1?: number | null;
    Telefono2?: number | null;
    Fax?: number | null;
    Celular?: number | null;
    CodigoContabilidad?: string | null;
    LibroRemuneraciones: boolean;
    RutaReporte?: string | null;
    DepartamentoId?: number | null;
    UnidadId?: number | null;
    CodigoPrevired?: string | null;
    CodigoGesparvu?: number | null;
    AdministracionCentral: boolean;
    CodigoDIPRES?: string | null;
    Contabilizacion: boolean;
}
interface Empresa {
    id: string
    rutCuerpo: number | null;
    rutDigito: string | null;
    razonSocial: string
    regionCodigo?: number | null;
    ciudadCodigo?: number | null;
    comunaCodigo?: number | null;
    tipoAdministracionCodigo: number;
    actividadEconomicaPrincipalCodigo?: number | null;
    sectorActividadEconomicaCodigo?: number | null;
    actividadEconomicaCodigo?: number | null;
    giro?: string | null;
    direccion?: string | null;
    email?: string | null;
    paginaWeb?: string | null;
    telefono1?: number | null;
    telefono2?: number | null;
    fax?: number | null;
    celular?: number | null;
    administradorId?: string | null;
    gerenteRRHHId?: string | null;
    bloqueada: boolean;
    rutaReporte?: string | null;
    pieFirmaLiquidacion?: string | null;
    url?: string | null;
}
interface LSDATA {empresaId: string,empresaName: string,centroCostoId: string,centroCostoName: string,
    nombre:string,
    sigla?:string,
    descripcion?:string,
    id: string
}
export default function CreateBodega() {
    const { jwt } = useUserStore();
    const  router = useRouter();

    const validationSchema = z.object({
        EmpresaId: z.string({ required_error: "Campo Requerido", invalid_type_error: "Campo Requerido" }),
        CentroCostoId: z.string({ required_error: "Campo Requerido", invalid_type_error: "Campo Requerido" }),
        Id: z.string({ required_error: "Campo Requerido", invalid_type_error: "Campo Requerido" }).optional(),
        Nombre: z.string({ required_error: "Campo Requerido", invalid_type_error: "Campo Requerido" }).min(3, { message: "Campo Requerido" }),
        Sigla: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
        Descripcion: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
    });
    const methods = useForm<BodegaFormValues>({
        resolver: zodResolver(validationSchema),
    });
    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        trigger,
        watch,
        reset,
        control,
        formState: { errors },
    } = methods;
    const exist = watch("Id");
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const save = await api_postBodegas(jwt, data);
            if (!data.Id) toast.success("Almacén guardado correctamente");
            if (data.Id) toast.success("Almacén Actualizado correctamente");
            router.back()
        } catch (error) {

        }
    };

    useEffect(() => {
        const bodegaNewLS = localStorage.getItem("BodegaNew");
        if (!bodegaNewLS) return ;
        const bodegaNew:LSDATA = JSON.parse(bodegaNewLS);
        setValue("EmpresaId",bodegaNew.empresaId);
        setValue("CentroCostoId",bodegaNew.centroCostoId);
        setValue("Nombre",bodegaNew.nombre);
        setValue("Sigla",bodegaNew.sigla ? bodegaNew.sigla : undefined);
        setValue("Descripcion",bodegaNew.descripcion ? bodegaNew.descripcion : undefined);
        setValue("Id",bodegaNew.id ? bodegaNew.id : undefined)
    },[]);


    return (
        <div className="flex items-center justify-center">
        <div className="container  flex justify-center">
            
            <Head>
                <title>Editor de bodega</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="shadow p-4">
                    <div className="">
                            <span className="font-bold">Editor de bodega</span>
                        <NomSigDes errors={errors} />
                    </div>
                    <div className="my-2">
                    {
                         exist && (
                            <div className="flex flex-row justify-center mb-6">
                            <div className="rounded-3xl	bg-[#FFF9E1] border-2 border-[#FFE476] flex items-center flex-row md:pt-4  md:pr-6  md:pb-6 md:pl-4">
                              <svg xmlns="http://www.w3.org/2000/svg"  className="w-24 h-24 md:w-12 md:h-12" viewBox="0 0 32 32" fill="none">
                            <path d="M5.96 28H26.04C28.0933 28 29.3733 25.7734 28.3467 24L18.3067 6.65336C17.28 4.88003 14.72 4.88003 13.6933 6.65336L3.65333 24C2.62667 25.7734 3.90667 28 5.96 28ZM16 18.6667C15.2667 18.6667 14.6667 18.0667 14.6667 17.3334V14.6667C14.6667 13.9334 15.2667 13.3334 16 13.3334C16.7333 13.3334 17.3333 13.9334 17.3333 14.6667V17.3334C17.3333 18.0667 16.7333 18.6667 16 18.6667ZM17.3333 24H14.6667V21.3334H17.3333V24Z" fill="#FF7E00"/>
                            </svg>
                              <div className="flex flex-col mx-4 text-sm text-left md:text-base font-bold">
                                <span>
                                    Sr Usuario.
                                </span>
                                <span>Ud se encuentra editando una bodega</span>
                              </div>
                              </div>
            
                            </div>
                        )
                    }

                        <div className="flex flex-wrap md:justify-end lg:justify-end justify-center mx-4">
                            <Button color="primary">Guardar</Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    </div>
    );
}
