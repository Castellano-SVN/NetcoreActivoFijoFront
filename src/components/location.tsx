import { FieldErrors, useFormContext } from "react-hook-form";
import { InputForm, Options, Title } from "./static";
import { Divider, Select } from "react-daisyui";
import { useQuery } from "react-query";
import { api_getCiudades, api_getComuna, api_getRegiones } from "../services/tipos.service";
import { useUserStore } from "../store/user.store";
import { useTiposStore } from "../store/tipos.store";
import { PersonaFormValues } from "../interfaces/creation";
import { useEffect } from "react";
interface props {
  errors: FieldErrors<PersonaFormValues>
}
export function Location({errors}: props) {
  const { jwt } = useUserStore();
  const {
    regiones,
    setRegiones,
    getRegiones,
    ciudades,
    setCiudades,
    getCiudades,
    getComunas,
    setComunas
  } = useTiposStore();
  const { setValue, getValues, watch, register } = useFormContext();


  const regionCodigo = watch("RegionCodigo") ?? 0;
  const CiudadCodigo = watch("CiudadCodigo") ?? 0;


  const CiudadesQuery = useQuery("ciudades", () => api_getCiudades(jwt,regionCodigo), {
    enabled: false,
    onSuccess: (data) => {
      setCiudades(data.data.dataList);
    },
  });

  const ComunaQuery = useQuery("comunas", () => api_getComuna(jwt,regionCodigo,CiudadCodigo), {
    enabled: false,
    onSuccess: (data) => {
      setComunas(data.data.dataList);
    },
  });

  useEffect(() =>{
    // setValue("ComunaCodigo",0);
    // setValue("CiudadCodigo",0);
    if (regionCodigo == '0') return;
    if (useTiposStore.getState().regiones.length === 0) return ;
    if (useTiposStore.getState().ciudades.filter(e => e.regionCodigo === Number(regionCodigo)).length !== 0) return;
    CiudadesQuery.refetch();
  },[regionCodigo])

  useEffect(() =>{
    // setValue("ComunaCodigo",0);
    if (CiudadCodigo == 0) return;
    if (regionCodigo == 0) return;
    if (useTiposStore.getState().ciudades.length === 0) return ;

    if (useTiposStore.getState().comunas.filter(e => e.ciudadCodigo === Number(CiudadCodigo) && e.regionCodigo === Number(regionCodigo)).length !== 0) return;
    ComunaQuery.refetch();
  },[CiudadCodigo])

    return (
    <div className="my-2">
    <Divider ></Divider>
      <div className="flex flex-wrap">
    
        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Region </span>
          </label>

          <Select
            {...register("RegionCodigo",{
              setValueAs: (value) => value === "" ? undefined : Number(value),
              onChange:(e) => {
                setValue("CiudadCodigo",0)
              }
          })}
            color={errors.RegionCodigo ? "error" : "neutral"}
            className="mt-1 block w-full  rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            {errors.RegionCodigo && (
              <span>{errors.RegionCodigo.message}</span>
            )}
          </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Ciudad</span>
          </label>
          <Select
            {...register("CiudadCodigo",{
              setValueAs: (value) => value === "" ? undefined : Number(value),
              onChange:(e) => {
                setValue("ComunaCodigo",0)
              }
          })}
            value={getValues("CiudadCodigo")}
            color={errors.CiudadCodigo ? "error" : "neutral"}
            className="mt-1 block w-full  rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <Select.Option key={0} value={0}>
              Seleccione la ciudad
            </Select.Option>
            {useTiposStore.getState().ciudades.filter(e => e.regionCodigo === getValues("RegionCodigo")).map((option, index) => (
              <Select.Option key={index} value={option.codigo}>
                {option.nombre} 
              </Select.Option>
            ))}
          </Select>
          <label className="label text-error">
            {errors.CiudadCodigo && (
              <span>{errors.CiudadCodigo.message}</span>
            )}
          </label>
        </div>

        <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
          <label className="label">
            <span className="label-text">Ciudad</span>
          </label>
          <Select
            {...register("ComunaCodigo",{
              setValueAs: (value) => value === "" ? undefined : Number(value)
          })}
            // value={getValues("ComunaCodigo")}
            color={errors.CiudadCodigo ? "error" : "neutral"}
            className="mt-1 block w-full  rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <Select.Option key={0} value={0}>
              Seleccione la ciudad
            </Select.Option>
            {useTiposStore.getState().comunas.filter(e => e.regionCodigo === regionCodigo).filter(e => e.ciudadCodigo === CiudadCodigo).map((option, index) => (
              <Select.Option key={index} value={option.codigo}>
                {option.nombre} 
              </Select.Option>
            ))}
          </Select>
          <label className="label text-error">
            {errors.ComunaCodigo && (
              <span>{errors.ComunaCodigo.message}</span>
            )}
          </label>
        </div>     
     

      </div>
      <div className="flex flex-wrap">
      <InputForm  label={"Villa/Poblacion"} validation="VillaPoblacion" defaultString={"Direccion"} error={errors.ComunaCodigo} title={"Villa/Poblacion"}/>  
      <InputForm  label={"Nro Departamento"} validation="NroDepartamento" defaultString={"NroDepartamento"} error={errors.NroDepartamento} title={"Nro Departamento"}/>  
      <InputForm  label={"Direccion"} validation="Direccion" defaultString={"Direccion"} error={errors.ComunaCodigo} title={"Direccion"}/>  

      </div>
      <Divider ></Divider>
    </div>
    )
}