import { BodegaFormValues } from "@/interfaces/creation";
import { api_getEmpresas } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input, Table } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { useQuery } from "react-query";

interface props {
    errors: FieldErrors<BodegaFormValues>
}

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
export default function NomSigDes({ errors }: props) {
    const {
        register,
        watch,
        setValue
    } = useFormContext();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^A-Za-\s]/ig, ''); // Permitir solo letras
        event.target.value = value;
    };

    const [visual, setVisual] = useState({
        Empresa: "",
        CentroCosto:"",
    })


    useEffect(() => {
        const bodegaNewLS = sessionStorage.getItem("BodegaNew");
        if (!bodegaNewLS) return ;
        const bodegaNew:LSDATA = JSON.parse(bodegaNewLS);

        setVisual(prevVisual => ({
            ...prevVisual,
            CentroCosto: bodegaNew.centroCostoName,
            Empresa: bodegaNew.empresaName
        }));
    },[]);
    return (
        <div className="my-2">
            <div className="flex flex-wrap">

                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Nombre</span>
                    </label>
                    <Input {...register("Nombre", { setValueAs: (value) => value === "" ? undefined : value })} onChange={handleChange} />
                    <label className="label text-error">
                        {errors.Nombre ? errors.Nombre.message : ""}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Sigla</span>
                    </label>
                    <Input {...register("Sigla", { setValueAs: (value) => value === "" ? undefined : value })} onChange={handleChange}/>
                    <label className="label text-error">
                        {errors.Sigla ? errors.Sigla.message : ""}
                    </label>
                </div>

                <div className="flex flex-col w-full">
                    <label className="label">
                        <span className="label-text">Descripción</span>
                    </label>
                    <textarea {...register("Descripcion", { setValueAs: (value) => value === "" ? undefined : (value) })} className="mt-1 block w-full border border:bg-primary  rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-white" rows={10}>
                    </textarea>
                    <label className="label text-error">
                        {errors.Descripcion ? errors.Descripcion.message : ""}
                    </label>
                </div>
            </div>
        </div>
    );
}

