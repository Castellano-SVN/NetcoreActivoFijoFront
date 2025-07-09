import { PersonaFormValues } from "@/interfaces/creation";
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { formatRut } from "../../../helpers/validations";
import { ChangeEvent, useEffect, useState } from "react";
import { clean, getCheckDigit, validate } from "rut.js";

interface props {
  errors: FieldErrors<PersonaFormValues>;
}

export default function Run({ errors }: props) {
  const { setValue } = useFormContext<PersonaFormValues>();
  const [rutvalue,setrutvalue] = useState("")
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (!validate(value)) setValue("RunCuerpo",0)
    if (validate(value)) {
      const newvalue = clean(value)
      setValue("RunCuerpo",Number(newvalue.slice(0, -1)));
      console.log(newvalue.charAt(newvalue.length - 1))
      setValue("RunDigito",newvalue.charAt(newvalue.length - 1));
    } 
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setrutvalue(event.target.value);
  }
  
  useEffect(() => {
    const rutEditLS = sessionStorage.getItem("rutedit");
    if (!rutEditLS) return;
    const rutedit: { runcuerpo:number, rundigito:string } = JSON.parse(rutEditLS);
    console.log(rutedit)
    setValue("RunCuerpo", rutedit.runcuerpo);
    setValue("RunDigito", rutedit.rundigito);
    setrutvalue(`${rutedit.runcuerpo}-${rutedit.rundigito}`)
  }, []);
  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Run</span>
          </label>
          <Input value={rutvalue} onChange={(event) => handleInputChange(event)} onBlur={handleBlur} />
          <label className="label text-error">
            {errors.RunCuerpo && !errors.RunDigito && (
              <span>{errors.RunCuerpo.message}</span>
            )}
            {!errors.RunCuerpo && errors.RunDigito && (
              <span>{errors.RunDigito.message}</span>
            )}
            {errors.RunCuerpo && errors.RunDigito && (
              <span>{errors.RunCuerpo.message}</span>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
