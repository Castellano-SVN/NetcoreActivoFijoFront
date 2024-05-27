import { Input, Select } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { Options, Title } from "../../static";
import { useQuery } from "react-query";
import { api_getCiudades, api_getComuna, api_getRegiones } from "../../../services/tipos.service";
import { api_getAreaGeografica } from "../../../services/tipos.service";
import { useMixStore } from "../../../store/mix.store";
import { useUserStore } from "../../../store/user.store";
import { useTiposStore } from "../../../store/tipos.store";
import { CentroFormValues } from '@/interfaces/creation';
import { useEffect } from "react";

interface Props {
    errors: FieldErrors<CentroFormValues>;
}

export default function DireccionCentro({ errors }: Props) {
    const { jwt } = useUserStore();
    const { areageografica, setAreaGeografica } = useMixStore();
    const {
        regiones,
        setRegiones,
        getRegiones,
        ciudades,
        setCiudades,
        getCiudades,
        getComunas,
        setComunas
    } = useTiposStore();

    const {
        register,
        watch,
        setValue
    } = useFormContext<CentroFormValues>();
    const regionCodigo = watch("RegionCodigo") ?? 0;
    const ciudadCodigo = watch("CiudadCodigo") ?? 0;

    const RegionesQuery = useQuery("regiones", () => api_getRegiones(jwt), {
        enabled: useTiposStore.getState().regiones.length === 0,
        onSuccess: (data) => {
            setRegiones(data.data.dataList);
        },
    });

    const CiudadesQuery = useQuery("ciudadesN", () => api_getCiudades(jwt, regionCodigo), {
        enabled: false,
        onSuccess: (data) => {
            setCiudades(data.data.dataList);
        },
    });

    const ComunaQuery = useQuery("comunasN", () => api_getComuna(jwt, regionCodigo, ciudadCodigo), {
        enabled: false,
        onSuccess: (data) => {
            setComunas(data.data.dataList);
        },
    });
    const AGQuery = useQuery("areageografica", () => api_getAreaGeografica(jwt), {
        enabled: useMixStore.getState().areageografica.length === 0,
        onSuccess: (data) => {
            setAreaGeografica(data.data.dataList);
        },
    });

    useEffect(() => {
        if (regionCodigo === 0) return;
        if (useTiposStore.getState().regiones.length === 0) return;
        if (useTiposStore.getState().ciudades.filter(e => e.regionCodigo === Number(regionCodigo)).length !== 0) return;
        CiudadesQuery.refetch();
    }, [regionCodigo]);

    useEffect(() => {
        if (ciudadCodigo === 0) return;
        if (regionCodigo === 0) return;
        if (useTiposStore.getState().ciudades.length === 0) return;
        if (useTiposStore.getState().comunas.filter(e => e.ciudadCodigo === Number(ciudadCodigo) && e.regionCodigo === Number(regionCodigo)).length !== 0) return;
        ComunaQuery.refetch();
    }, [ciudadCodigo, regionCodigo]);


    return (
        <div className="my-2">
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Direccion</span>
                    </label>
                    <Input {...register("Direccion", { setValueAs: (value) => value === "" ? undefined : value })} />
                    <label className="label text-error">
                        {errors.Direccion ? errors.Direccion.message : ""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Area Geografica</span>
                    </label>
                    <Select defaultValue={''} {...register("AreaGeograficaCodigo", { setValueAs: (value) => value === "" ? undefined : Number(value) })} >
                        <Select.Option value={''} disabled>
                            Seleccione el area geografica
                        </Select.Option>
                        {areageografica.map((area, index) => (
                            <Select.Option key={index} value={area.codigo}>
                                {area.nombre}
                            </Select.Option>
                        ))}
                    </Select>
                    <label className="label text-error">
                        {errors.AreaGeograficaCodigo ? errors.AreaGeograficaCodigo.message : ""}
                    </label>
                </div>

            </div>
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Región</span>
                    </label>
                    <Select defaultValue={''} {...register("RegionCodigo", { setValueAs: (value) => value === "" ? undefined : Number(value) })} >
                        <Select.Option value={''} disabled>
                            Seleccione la región
                        </Select.Option>
                        {regiones.map((region, index) => (
                            <Select.Option key={index} value={region.codigo}>
                                {region.nombre} - {region.nombreOficial}
                            </Select.Option>
                        ))}
                    </Select>
                    <label className="label text-error">
                        {errors.RegionCodigo ? errors.RegionCodigo.message : ""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Ciudad</span>
                    </label>
                    <Select defaultValue={''} {...register("CiudadCodigo", { setValueAs: (value) => value === "" ? undefined : Number(value) })} >
                        <Select.Option value={''} disabled>
                            Seleccione la ciudad
                        </Select.Option>
                        {getCiudades(Number(regionCodigo)).map((ciudad, index) => (
                            <Select.Option key={index} value={ciudad.codigo}>
                                {ciudad.nombre}
                            </Select.Option>
                        ))}
                    </Select>
                    <label className="label text-error">
                        {errors.CiudadCodigo ? errors.CiudadCodigo.message : ""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Comuna</span>
                    </label>
                    <Select defaultValue={''} {...register("ComunaCodigo", { setValueAs: (value) => value === "" ? undefined : Number(value) })} >
                        <Select.Option value={''} disabled>
                            Seleccione la ciudad
                        </Select.Option>
                        {getComunas(Number(regionCodigo), Number(ciudadCodigo)).map((comuna, index) => (
                            <Select.Option key={index} value={comuna.codigo}>
                                {comuna.nombre}
                            </Select.Option>
                        ))}
                    </Select>
                    <label className="label text-error">
                        {errors.ComunaCodigo ? errors.ComunaCodigo.message : ""}
                    </label>
                </div>
            </div>
        </div>
    )

        ;
}