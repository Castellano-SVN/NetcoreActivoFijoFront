import { EmpresaFormValues } from "@/interfaces/creation";
import { register } from "module";
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";

interface props {
    errors: FieldErrors<EmpresaFormValues>;
}

export default function PieFirma({ errors }: props) {
    const { register, setValue } = useFormContext<EmpresaFormValues>();

    return (
        <div className="my-2">
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full">
                    <label className="label">
                        <span className="label-text">Firma Liquidacion</span>
                    </label>
                    <Input {...register("PieFirmaLiquidacion", { setValueAs: (value) => value === "" ? undefined : value })} />
                    <label className="label text-error">
                    {errors.PieFirmaLiquidacion ?errors.PieFirmaLiquidacion.message:""}
                    </label>
                </div>
            </div>
        </div>
    );
}