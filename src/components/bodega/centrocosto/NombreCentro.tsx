import { CentroFormValues } from '@/interfaces/creation';
import React from 'react';
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from 'react-hook-form';

interface props {
    errors: FieldErrors<CentroFormValues>
  }

export default function NombreCentro({errors}: props){
    const {
        register,
        setValue,
        watch,
    } = useFormContext<CentroFormValues>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^A-Za-\s]/ig, ''); // Permitir solo letras
        event.target.value = value;
    };
    return(
        <div className="my-2">
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                    <span className="label-text">Nombre</span>
                    </label>
                    <Input {...register("Nombre",{setValueAs: (value) => value === "" ? undefined : value})  } onChange={handleChange} />
                    <label className="label text-error">
                        {errors.Nombre ?errors.Nombre.message:""}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                    <span className="label-text">Sigla</span>
                    </label>
                    <Input {...register("Sigla",{setValueAs: (value) => value === "" ? undefined : value})  }  />
                    <label className="label text-error">
                    {errors.Sigla ?errors.Sigla.message:""}
                    </label>
                </div>
            </div>
        </div>
    )

;}