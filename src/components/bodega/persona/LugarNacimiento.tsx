import { Select } from "react-daisyui";
import { FieldErrors, useFormContext } from "react-hook-form";
import { useQuery } from "react-query";
import {
  api_getCiudades,
  api_getComuna,
  api_getRegiones,
} from "../../../services/tipos.service";
import { useUserStore } from "../../../store/user.store";
import { useTiposStore } from "../../../store/tipos.store";
import { PersonaFormValues } from "../../../interfaces/creation";
import { useEffect } from "react";

interface Props {
  errors: FieldErrors<PersonaFormValues>;
}

export default function LugarNacimiento({ errors }: Props) {
  const { jwt } = useUserStore();
  const { setValue, watch, register } = useFormContext();
  const { regiones, ciudades, comunas, setRegiones, setCiudades, setComunas } = useTiposStore();

  const regionNacimientoCodigo = watch("RegionNacimientoCodigo") ?? 0;
  const ciudadNacimientoCodigo = watch("CiudadNacimientoCodigo") ?? 0;

  const RegionesQuery = useQuery("regiones", () => api_getRegiones(jwt), {
    enabled: !regiones.length,
    onSuccess: (data) => {
      setRegiones(data.data.dataList);
    },
  });

  const CiudadesQuery = useQuery("ciudadesN", () => api_getCiudades(jwt, regionNacimientoCodigo), {
    enabled: false,
    onSuccess: (data) => {
      setCiudades(data.data.dataList);
    },
  });

  const ComunaQuery = useQuery("comunasN", () => api_getComuna(jwt, regionNacimientoCodigo, ciudadNacimientoCodigo), {
    enabled: false,
    onSuccess: (data) => {
      setComunas(data.data.dataList);
    },
  });

  useEffect(() => {
    if (regionNacimientoCodigo == 0) return;
    if (ciudades.filter((e) => e.regionCodigo === regionNacimientoCodigo).length !== 0) return;
    CiudadesQuery.refetch();
  }, [regionNacimientoCodigo]);

  useEffect(() => {
    if (ciudadNacimientoCodigo == 0 || regionNacimientoCodigo == 0) return;
    if (comunas.filter((e) => e.ciudadCodigo === ciudadNacimientoCodigo && e.regionCodigo === regionNacimientoCodigo).length !== 0) return;
    ComunaQuery.refetch();
  }, [ciudadNacimientoCodigo]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setValue("RegionNacimientoCodigo", value);
    setValue("CiudadNacimientoCodigo", 0);
  };

  const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setValue("CiudadNacimientoCodigo", value);
    setValue("ComunaNacimientoCodigo", 0);
  };

  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Region de nacimiento</span>
          </label>
          <Select
            {...register("RegionNacimientoCodigo", {
              valueAsNumber: true // Convertir el valor a número
            })}
            onChange={handleRegionChange}
            color={errors.RegionNacimientoCodigo ? "error" : "neutral"}
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <Select.Option key={0} value={0}>
              Seleccione la region
            </Select.Option>
            {regiones.map((option, index) => (
              <Select.Option key={index} value={option.codigo}>
                {option.nombre} - {option.nombreOficial}
              </Select.Option>
            ))}
          </Select>
          <label className="label text-error">
            {errors.RegionNacimientoCodigo && (
              <span>{errors.RegionNacimientoCodigo.message}</span>
            )}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Ciudad de nacimiento</span>
          </label>
          <Select
            {...register("CiudadNacimientoCodigo", {
              valueAsNumber: true // Convertir el valor a número
            })}
            onChange={handleCiudadChange}
            color={errors.CiudadNacimientoCodigo ? "error" : "neutral"}
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <Select.Option key={0} value={0}>
              Seleccione la ciudad
            </Select.Option>
            {ciudades.filter((ciudad) => ciudad.regionCodigo === regionNacimientoCodigo).map((option, index) => (
              <Select.Option key={index} value={option.codigo}>
                {option.nombre}
              </Select.Option>
            ))}
          </Select>
          <label className="label text-error">
            {errors.CiudadNacimientoCodigo && (
              <span>{errors.CiudadNacimientoCodigo.message}</span>
            )}
          </label>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Comuna de nacimiento</span>
          </label>
          <Select
            {...register("ComunaNacimientoCodigo", {
              valueAsNumber: true // Convertir el valor a número
            })}
            color={errors.ComunaNacimientoCodigo ? "error" : "neutral"}
            className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <Select.Option key={0} value={0}>
              Seleccione la Comuna
            </Select.Option>
            {comunas
              .filter((comuna) => comuna.regionCodigo === regionNacimientoCodigo && comuna.ciudadCodigo === ciudadNacimientoCodigo)
              .map((option, index) => (
                <Select.Option key={index} value={option.codigo}>
                  {option.nombre}
                </Select.Option>
              ))}
          </Select>
          <label className="label text-error">
            {errors.ComunaNacimientoCodigo && (
              <span>{errors.ComunaNacimientoCodigo.message}</span>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
