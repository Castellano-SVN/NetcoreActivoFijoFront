import { PersonaFormValues } from "@/interfaces/creation";
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";

interface props {
    errors: FieldErrors<PersonaFormValues>
  }
  
export default function Observaciones({errors}: props) {
    const {
        register,
        watch,
      } = useFormContext();
      
    return (
        <div className="my-2">
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                    <label className="label">
                        <span className="label-text">Anote Las Observaciones</span>
                    </label>
                    <textarea {...register("Observaciones", {setValueAs: (value) => value === "" ? undefined : (value)})} className="mt-1 block w-full  rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows={10}>
                    </textarea>
                    <label className="label text-error">
                    {errors.Observaciones ?errors.Observaciones.message:""}
                    </label>
                </div>
            </div>
        </div>
    );
}
