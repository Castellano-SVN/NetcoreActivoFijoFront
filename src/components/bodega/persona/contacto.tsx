import { PersonaFormValues } from "@/interfaces/creation";
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";

interface props {
    errors: FieldErrors<PersonaFormValues>
}

export default function Contacto({ errors }: props) {
    const {
        register,
        watch,
        setValue
    } = useFormContext();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Permitir solo numeros
        event.target.value = value;
    };
    return (
        <div className="my-2">
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Telefono</span>
                    </label>
                    <Input {...register("Telefono", {
                        setValueAs: (value) => value === "" ? undefined : Number(value)
                    })} onChange={handleChange} />
                    <label className="label text-error">
                        {errors.Telefono ? errors.Telefono.message : ""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Celular</span>
                    </label>
                    <Input {...register("Celular",{
                        setValueAs: (value) => value === "" ? undefined : Number(value)
                    })} onChange={handleChange} />
                    <label className="label text-error">
                        {errors.Celular ? errors.Celular.message : ""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <Input {...register("Email",{
                        setValueAs: (value) => value === "" ? undefined : value
                    })} />
                    <label className="label text-error">
                        {errors.Email ? errors.Email.message : ""}
                    </label>
                </div>
            </div>
        </div>
    );
}