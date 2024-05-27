import { CentroFormValues } from '@/interfaces/creation';
import React from 'react';
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from 'react-hook-form';

interface props {
    errors: FieldErrors<CentroFormValues>
  }

export default function ContactoCentro({ errors }: props){
    const {
        register,
        setValue,
        watch,
    } = useFormContext<CentroFormValues>();

    return(
        <div className="my-2">
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                    <span className="label-text">Email</span>
                    </label>
                    <Input {...register("Email", { setValueAs: (value) => value === "" ? undefined : value })} />
                    <label className="label text-error">
                    {errors.Email ?errors.Email.message:""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                    <span className="label-text">Celular</span>
                    </label>
                    <Input {...register("Celular",{ setValueAs: (value) => value === "" ? undefined : value })} />
                    <label className="label text-error">
                    {errors.Celular ?errors.Celular.message:""}
                    </label>
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                    <span className="label-text">Telefono 1</span>
                    </label>
                    <Input {...register("Telefono1",{ setValueAs: (value) => value === "" ? undefined : value })} />
                    <label className="label text-error">
                    {errors.Telefono1 ?errors.Telefono1.message:""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                    <span className="label-text">Telefono 2</span>
                    </label>
                    <Input {...register("Telefono2",{ setValueAs: (value) => value === "" ? undefined : value })} />
                    <label className="label text-error">
                    {errors.Telefono2 ?errors.Telefono2.message:""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                    <span className="label-text">Fax</span>
                    </label>
                    <Input {...register("Fax",{ setValueAs: (value) => value === "" ? undefined : value })} />
                    <label className="label text-error">
                    {errors.Fax ?errors.Fax.message:""}
                    </label>
                </div>
            </div>
        </div>
    )

;}