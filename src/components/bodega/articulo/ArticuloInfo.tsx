import { ArticuloFormValues } from '@/interfaces/creation';
import React from 'react';
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from 'react-hook-form';



interface props {
    errors: FieldErrors<ArticuloFormValues>
}

export default function ArticuloInfo({ errors }: props) {
    const {
        register,
        setValue,
        watch,
    } = useFormContext();

    return (
        <div className="my-2">
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Nombre</span>
                    </label>
                    <Input {...register("Nombre", { setValueAs: (value) => value === "" ? undefined : (value) })} />
                    <label className="label text-error">
                        {errors.Nombre ? errors.Nombre.message : ""}
                    </label>
                </div>
            </div>

            <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                    <label className="label">
                        <span className="label-text">Descripción</span>
                    </label>
                    <textarea {...register("Descripcion", { setValueAs: (value) => value === "" ? undefined : (value) })} className="mt-1 block w-full  rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows={10}>
                    </textarea>
                    <label className="label text-error">
                        {errors.Descripcion ? errors.Descripcion.message : ""}
                    </label>
                </div>
            </div>
        </div>
    );
}