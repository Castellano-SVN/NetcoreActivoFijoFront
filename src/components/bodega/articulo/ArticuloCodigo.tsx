import { ArticuloFormValues, IAno, ITipoUnidad } from '@/interfaces/creation';
import { api_getAno, api_getTipoUnidad } from '@/services/tipos.service';
import { useUserStore } from '@/store/user.store';
import React, { useEffect, useState } from 'react';
import { Input, Select } from "react-daisyui";
import { FieldErrors, useFormContext } from 'react-hook-form';



interface props {
    errors: FieldErrors<ArticuloFormValues>
}

export default function ArticuloCodigo({ errors }: props) {
    const {
        register,
        setValue,
        watch,
    } = useFormContext();
    const { jwt } = useUserStore();
    const [data, setData] = useState<IAno[]>([]);
    const getElement = async () => {
        try {
            const data = await api_getAno(jwt);
            setData(data.data.dataList);
        } catch (error) {
            console.log(error);
        }
    };

    const [data2, setData2] = useState<ITipoUnidad[]>([]);
    const getelemento = async () => {
        try {
            const data2 = await api_getTipoUnidad(jwt);
            setData2(data2.data.dataList);
        } catch (error) {
            console.log(error);
        }
    }


    //se ejecuta una sola vez
    useEffect(() => {
        getElement();
    }, []);
    //useeffect para tipounidad
    useEffect(() => {
        getelemento();
    }, []);

    return (


        <div className="my-2">
            <div className="flex flex-wrap">
            <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Codigo </span>
                    </label>
                    <Input {...register("Codigo", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
                    <label className="label text-error">
                    {errors.Codigo ? errors.Codigo.message : ""}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Tipo de unidad</span>
                    </label>
                    <Select defaultValue={''} {...register("TipoUnidadCodigo", { setValueAs: (value) => value === "" ? undefined : Number(value) })} >
                        <Select.Option value={''} disabled>
                            Seleccione la unidad
                        </Select.Option>
                        {data2.map((Data2, index) => (
                            <Select.Option key={index} value={Data2.codigo}>
                                {Data2.nombre}
                            </Select.Option>
                        ))}
                    </Select>
                    <label className="label text-error">
                        {errors.TipoUnidadCodigo ? errors.TipoUnidadCodigo.message : ""}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Año</span>
                    </label>
                    <Select defaultValue={''} {...register("AnoNumero", { setValueAs: (value) => value === "" ? undefined : Number(value) })} >
                        <Select.Option value={''} disabled>
                            Seleccione el año
                        </Select.Option>
                        {data.map((Data, index) => (
                            <Select.Option key={index} value={Data.numero}>
                                {Data.nombre}
                            </Select.Option>
                        ))}
                    </Select>
                    <label className="label text-error">
                        {errors.AnoNumero ? errors.AnoNumero.message : ""}
                    </label>
                </div>
            </div>
        </div>
    );
}