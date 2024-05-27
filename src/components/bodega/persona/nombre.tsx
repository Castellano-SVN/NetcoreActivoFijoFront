import { PersonaFormValues } from '@/interfaces/creation';
import React from 'react';
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from 'react-hook-form';

interface props {
  errors: FieldErrors<PersonaFormValues>
}

export default function Nombre({errors}: props) {
  const {
    register,
    watch,
  } = useFormContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^A-Za-\s]/ig, ''); // Permitir solo letras
    event.target.value = value;
  };

  return (
    <div className="my-2">
      <div className="flex flex-wrap">
          <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
            <label className="label">
              <span className="label-text">Nombres</span>
            </label>
            <Input {...register("Nombres", {setValueAs: (value) => value === "" ? undefined : value})} onChange={handleChange}/>
            <label className="label text-error">
            {errors.Nombres ?errors.Nombres.message:""}
            </label>
          </div>

          <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
            <label className="label">
              <span className="label-text">Apellido Paterno</span>
            </label>
            <Input {...register("ApellidoPaterno",{setValueAs: (value) => value === "" ? undefined : value})} onChange={handleChange} />
            <label className="label text-error">
            {errors.ApellidoPaterno ?errors.ApellidoPaterno.message:""}
            </label>
          </div>

          <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
            <label className="label">
              <span className="label-text">Apellido Materno</span>
            </label>
            <Input {...register("ApellidoMaterno",{setValueAs: (value) => value === "" ? undefined : value})} onChange={handleChange}/>
            <label className="label text-error">
            {errors.ApellidoMaterno ?errors.ApellidoMaterno.message:""}
            </label>
          </div>
      </div>
    </div>
  );
}
