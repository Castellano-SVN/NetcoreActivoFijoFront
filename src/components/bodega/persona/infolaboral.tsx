import { Input } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { PersonaFormValues } from "../../../interfaces/creation";
import { Options } from "../../static";
import { useMixStore } from "../../../store/mix.store";
import { useUserStore } from "../../../store/user.store";
import { api_getAreaGeografica, api_getNivelEducacional } from "../../../services/tipos.service";
import { useQuery } from "react-query";
interface props {
    errors: FieldErrors<PersonaFormValues>
}
export default function InfoLaboral({ errors }: props) {
    const { jwt } = useUserStore();
    const { nivelEducacional, setNivelEducacional, areageografica, setAreaGeografica } = useMixStore();

    const {
        register,
        watch,
        setValue
    } = useFormContext();

    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Permitir solo números
        event.target.value = value;
    };

    const NEQuery = useQuery("niveleducacional", () => api_getNivelEducacional(jwt), {
        enabled: useMixStore.getState().nivelEducacional.length === 0,
        onSuccess: (data) => {
            setNivelEducacional(data.data.dataList);
        },
    });
    const AGQuery = useQuery("areageografica", () => api_getAreaGeografica(jwt), {
        enabled: useMixStore.getState().areageografica.length === 0,
        onSuccess: (data) => {
            setAreaGeografica(data.data.dataList);
        },
    });
    return (
        <div className="my-2">
            <div className="flex flex-wrap">
                <Options options={nivelEducacional} label={`nombre`} value={"codigo"} validation="NivelEducacionalCodigo" error={errors.NivelEducacionalCodigo} defaultString="Seleccione el nivel educacional" title="Nivel Educacional" />
                <Options options={areageografica} label={`nombre`} value={"codigo"} validation="AreaGeograficaCodigo" error={errors.NivelEducacionalCodigo} defaultString="Seleccione el area geografica" title="Area geografica" />
            </div>
            <div className="flex flex-wrap">
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Ocupacion</span>
                    </label>
                    <Input {...register("Ocupacion", {
                        setValueAs: (value) => value === "" ? undefined : (value)
                    })} />
                    <label className="label text-error">
                        {errors.Ocupacion ? errors.Ocupacion.message : ""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Telefono Laboral</span>
                    </label>
                    <Input {...register("TelefonoLaboral", {
                        setValueAs: (value) => value === "" ? undefined : Number(value)
                    })} onChange={handleChange}/>
                    <label className="label text-error">
                        {errors.TelefonoLaboral ? errors.TelefonoLaboral.message : ""}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
                    <label className="label">
                        <span className="label-text">Dirección Laboral</span>
                    </label>
                    <Input {...register("DireccionLaboral", {
                        setValueAs: (value) => value === "" ? undefined : (value)
                    })} />
                    <label className="label text-error">
                        {errors.DireccionLaboral ? errors.DireccionLaboral.message : ""}
                    </label>
                </div>
            </div>
        </div>
    );
}