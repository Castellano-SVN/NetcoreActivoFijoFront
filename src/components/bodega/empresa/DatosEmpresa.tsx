import { EmpresaFormValues } from "@/interfaces/creation";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { clean, getCheckDigit, validate } from "rut.js";

interface props {
  errors: FieldErrors<EmpresaFormValues>;
}

export default function DatostEmpresa({ errors }: props) {
  
  const { setValue, register,clearErrors } = useFormContext<EmpresaFormValues>();
  const [rutvalue,setrutvalue] = useState("")
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (!validate(value)) setValue("RutCuerpo", 0)
    if (validate(value)) {
      const newvalue = clean(value)
      setValue("RutCuerpo", Number(newvalue.slice(0, -1)));
      setValue("RutDigito",newvalue.charAt(newvalue.length - 1));
      clearErrors("RutCuerpo")
      clearErrors("RutDigito")
    }
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setrutvalue(event.target.value);
  }

  useEffect(() => {
    const rutempresaEditLS = sessionStorage.getItem("rutEmpresaEdit");
    if (!rutempresaEditLS) return;
    const rutEmpresaEdit: { rutCuerpo:number, rutDigito:string } = JSON.parse(rutempresaEditLS);
    console.log(rutEmpresaEdit);
    setValue("RutCuerpo", rutEmpresaEdit.rutCuerpo);
    setValue("RutDigito", rutEmpresaEdit.rutDigito);
    setrutvalue(`${rutEmpresaEdit.rutCuerpo}-${rutEmpresaEdit.rutDigito}`);
  }, []);

  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Rut de la empresa</span>
          </label>
          <Input onBlur={handleBlur}
           onChange={handleInputChange} // Agrega esta línea para manejar cambios en la entrada
           value={rutvalue} />
          <label className="label text-error">
            {errors.RutCuerpo && !errors.RutDigito && (
              <span>{errors.RutCuerpo.message}</span>
            )}
            {!errors.RutCuerpo && errors.RutDigito && (
              <span>{errors.RutDigito.message}</span>
            )}
            {errors.RutCuerpo && errors.RutDigito && (
              <span>{errors.RutCuerpo.message}</span>
            )}
          </label>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Razón social</span>
          </label>
          <Input {...register("RazonSocial", {
            setValueAs: (value) => value === "" ? undefined : value})} />
          <label className="label text-error">
            {errors.RazonSocial ? errors.RazonSocial.message : ""}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Giro comercial</span>
          </label>
          <Input {...register("Giro",{ setValueAs: (value) => value === "" ? undefined : value })} />
          <label className="label text-error">
            {errors.Giro ? errors.Giro.message : ""}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Ruta reporte</span>
          </label>
          <Input {...register("RutaReporte",{ setValueAs: (value) => value === "" ? undefined : value })} />
          <label className="label text-error">
            {errors.RutaReporte ? errors.RutaReporte.message : ""}
          </label>
        </div>
      </div>
    </div>
  );
}