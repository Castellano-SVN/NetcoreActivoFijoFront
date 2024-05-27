import { EmpresaFormValues } from "@/interfaces/creation";
import { register } from "module";
import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { number } from "zod";

interface props {
  errors: FieldErrors<EmpresaFormValues>;
}

export default function ContactoEmpresa({ errors }: props) {
  const { register, setValue } = useFormContext<EmpresaFormValues>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Permitir solo numeros
    event.target.value = value;
};

  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <Input {...register("Email", { setValueAs: (value) => value === "" ? undefined : value })} />
          <label className="label text-error">
            {errors.Email ? errors.Email.message : ""}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Pagina Web</span>
          </label>
          <Input {...register("PaginaWeb",{ setValueAs: (value) => value === "" ? undefined : value } )} />
          <label className="label text-error">
            {errors.PaginaWeb ? errors.PaginaWeb.message : ""}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Fax</span>
          </label>
          <Input {...register("Fax",{ setValueAs: (value) => value === "" ? undefined : Number(value) })} />
          <label className="label text-error">
            {errors.Fax ? errors.Fax.message : ""}
          </label>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Teléfono 1</span>
          </label>
          <Input {...register("Telefono1",{ setValueAs: (value) => value === "" ? undefined : Number(value) })} onChange={handleChange} />
          <label className="label text-error">
            {errors.Telefono1 ? errors.Telefono1.message : ""}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Teléfono 2</span>
          </label>
          <Input {...register("Telefono2",{ setValueAs: (value) => value === "" ? undefined : Number(value) })} onChange={handleChange}/>
          <label className="label text-error">
            {errors.Telefono2 ? errors.Telefono2.message : ""}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Celular</span>
          </label>
          <Input {...register("Celular",{ setValueAs: (value) => value === "" ? undefined : Number(value) })} onChange={handleChange} />
          <label className="label text-error">
            {errors.Celular ? errors.Celular.message : ""}
          </label>
        </div>
      </div>
    </div>
  );
}