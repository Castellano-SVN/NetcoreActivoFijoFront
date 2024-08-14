import React, { ChangeEvent, useState } from "react";
import { Input } from "react-daisyui";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "react-query";
import { api_getSexos } from "../../../services/tipos.service";
import { useUserStore } from "../../../store/user.store";
import { useMixStore } from "../../../store/mix.store";
import { FieldErrors, useFormContext, Controller } from "react-hook-form";
import { PersonaFormValues } from "../../../interfaces/creation";
import {es} from "date-fns/locale/es";
registerLocale("es", es);

interface props {
  errors: FieldErrors<PersonaFormValues>
}
export default function Nacimiento({ errors }: props) {
  const { jwt } = useUserStore();

  const { sexos, setSexos } = useMixStore();

  const {
    register,
    watch,
    getValues,
    setValue,
    control
  } = useFormContext();

  const [startDate, setStartDate] = useState(new Date());
  const Query = useQuery("sexos", () => api_getSexos(jwt), {
    enabled: useMixStore.getState().sexos.length === 0,
    onSuccess: (data) => {
      setSexos(data.data.dataList);
    },
  });

  const radioOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setValue("SexoCodigo", Number(value))
  }
  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Fecha de Nacimiento</span>
          </label>
          <Controller
            control={control}
            name="FechaNacimiento" // Nombre del campo para el controlador
            render={({ field }) => (
              <DatePicker
                selected={field.value} // Usar field.value para obtener el valor
                onChange={(date) => field.onChange(date)} // Usar field.onChange para actualizar el valor
                onBlur={field.onBlur} // Usar field.onBlur para el evento onBlur
                className="input input-bordered focus:outline-offset-0 w-full"
                dropdownMode="select"
                yearDropdownItemNumber={15}
                peekNextMonth
                showYearDropdown
                showMonthDropdown
                dateFormat={"dd/MM/yyyy"}
                locale='es'
              />
            )}
          />
          <label className="label text-error">
            {errors.FechaNacimiento ? errors.FechaNacimiento.message : ""}
          </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Sexo {getValues("SexoCodigo")}</span>
          </label>
          <Controller
    name="SexoCodigo"
    control={control}
    defaultValue={''} // Valor por defecto, si lo necesitas
    render={({ field }) => (
      <>
        {sexos.map((option, index) => (
          <div key={index} className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{option.nombre}</span>
              <input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  radioOnChange(e); // Llama a tu función radioOnChange si es necesario
                }}
                type="radio"
                className="radio checked:bg-red-500"
                value={option.codigo}
                checked={field.value === option.codigo}
              />
            </label>
          </div>
        ))}
      </>
    )}
  />
          <label className="label text-error">
            {errors.SexoCodigo ? errors.SexoCodigo.message : ""}
          </label>
        </div>
      </div>
    </div>
  );
}
