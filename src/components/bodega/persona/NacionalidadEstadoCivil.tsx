import { Input } from "react-daisyui";
import { useQuery } from "react-query";
import {
  api_getNacionalidades,
  api_getEstadoCivil,
} from "../../../services/tipos.service";
import { useUserStore } from "../../../store/user.store";
import { useMixStore } from "../../../store/mix.store";
import { Options } from "../../static";
import { FieldErrors } from "react-hook-form";
import { PersonaFormValues } from "../../../interfaces/creation";
interface props {
  errors: FieldErrors<PersonaFormValues>;
}
export default function NacionalidadEstadoCivil({ errors }: props) {
  const { jwt } = useUserStore();
  const { setCountry, country,setEstadoCivil,estadoCivil } = useMixStore();
  const CountryQuery = useQuery("country", () => api_getNacionalidades(jwt), {
    enabled: useMixStore.getState().country.length === 0,
    onSuccess: (data) => {
      setCountry(data.data.dataList);
    },
  });
  const EstadoCivilQuery = useQuery("estadocivil", () => api_getEstadoCivil(jwt), {
    enabled: useMixStore.getState().estadoCivil.length === 0,
    onSuccess: (data) => {
        setEstadoCivil(data.data.dataList);
    },
  });
  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        <Options
          options={country}
          label={"nombre"}
          validation="NacionalidadCodigo"
          value={"codigo"}
          defaultString={"Seleccione Su Nacionalidad"}
          error={errors.NacionalidadCodigo}
          title={"Nacionalidad"}
        />
        <Options
          options={estadoCivil}
          label={"nombre"}
          validation="EstadoCivilCodigo"
          value={"codigo"}
          defaultString={"Seleccione el estado civil"}
          error={errors.EstadoCivilCodigo}
          title={"Estado civil"}
        />

      </div>
    </div>
  );
}
