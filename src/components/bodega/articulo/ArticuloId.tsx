import { ArticuloFormValues, IArticulo, IEmpresa, ISubFamilia } from '@/interfaces/creation';
import { api_getSubFamilias } from '@/services/bodega.service';
import { useUserStore } from '@/store/user.store';
import React, { use, useEffect, useState } from 'react';
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from 'react-hook-form';
import { useQuery } from 'react-query';



interface props {
    errors: FieldErrors<ArticuloFormValues>
}

export default function ArticuloId({ errors }: props) {
    const {
        register,
        setValue,
        watch,
        getValues
    } = useFormContext<ArticuloFormValues>();

    return (
        <div className="my-2">
            <div className="flex flex-wrap">
                
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Sub Familia Id</span>
                    </label>
                    <Input />
                    <label className="label text-error">

                    </label>
                </div>
            </div>
            <div className="flex flex-wrap">

                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Id de la empresa</span>
                    </label>
                    <Input {...register("EmpresaId", { setValueAs: (value) => value === "" ? undefined : (value) })} readOnly />
                    <label className="label text-error">
                        {errors.EmpresaId ? errors.EmpresaId.message : ""}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Id</span>
                    </label>
                    <Input />
                    <label className="label text-error">

                    </label>
                </div>
            </div>
        </div>
    );
}