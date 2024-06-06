import { z } from "zod";
import { ArticuloFormValues, IArticulo, IArticuloIngreso, ICentroCosto, IFamilia, ISubFamilia } from "@/interfaces/creation";
import { api_getAllCentroCostos, api_getAllFamilias, api_getAllSubFamilias } from "@/services/bodega.service";
import { api_Ingresos } from "@/services/ingreso.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
interface ISearch {
    Type: "Codigo" | "Nombre",
    Input: string | number,
    match?: string;
    CentroCosto?: string;
    Familia?: string;
    SubFamilia?: string
  }

  const validationSchema = z.object({
    Type: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional().default("Codigo"),
    CentroCosto: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    Input: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }),

    match: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional().default("comienza"),
    Familia: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    SubFamilia: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),

  });

interface props {
  setList: Dispatch<SetStateAction<IArticuloIngreso[]>>}
export default function ArticulosSearch(props:props) {
    const { jwt } = useUserStore();
    const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>();
    const [dataFamilia, setDataFamilia] = useState<IFamilia[]>();
    const [dataSubFamilia, setDataSubFamilia] = useState<ISubFamilia[]>();
    const [searchBy, setSearchBy] = useState('codigo');


    const removeUndefined = (key: string, value: string) => {
        if (value === undefined) {
          return undefined; // Omitir el valor undefined
        }
        return value; // Mantener el valor original
      }
    const getCentroCosto = async () => {
        try {
          const dataGet = await api_getAllCentroCostos(jwt);
          setDataCentroCosto(dataGet.data.dataList);
        } catch (error) {
          console.log(error);
        }
      };
      const getFamilia = async () => {
        try {
          const dataGet = await api_getAllFamilias(jwt);
          setDataFamilia(dataGet.data.dataList);
        } catch (error) {
          console.log(error);
        }
      };
      const getSubFamilia = async () => {
        try {
          const dataGet = await api_getAllSubFamilias(jwt);
          setDataSubFamilia(dataGet.data.dataList);
        } catch (error) {
          console.log(error);
        }
      };
  const methods = useForm<ISearch>({
    resolver: zodResolver(validationSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const [isLoading, SetisLoading] = useState<boolean>(false);

  const SearchArticulo: SubmitHandler<ISearch> = async (
    data: ISearch
  ) => {
    try {
      SetisLoading(true);
      // console.log(fil)
      console.log(filteredSubFamilias?.find(e => e.id == data.SubFamilia));
      const dataClean = JSON.parse(JSON.stringify(data, removeUndefined));
      const articles = await api_Ingresos(jwt, dataClean);
      props.setList(articles.data.dataList)
      SetisLoading(false)
      
    } catch (error) {
      SetisLoading(false)
    }
  };
  useEffect(() => {
    getCentroCosto();
    getFamilia();
    getSubFamilia();
  }, []);

  const family = watch("Familia")
  const filteredSubFamilias = dataSubFamilia?.filter(
    (subfamilia) => subfamilia.familiaId === family
  );


  const radioMatch = watch("match")
    return (
        <form className="" 
         onSubmit={handleSubmit(SearchArticulo)}
      >
        <div className="container mx-auto mt-2 sm:mt-4 rounded-lg">
          <div className="max-w-3xl mx-auto bg-white p-8  rounded-md">
            <h5 className="text-2xl font-bold mb-4">Selección de artículos</h5>
            <div className="mb-4 mt-2 flex justify-center align-center">
              <span className="font-medium">Buscar por: </span>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="radio radio-xs radio-primary ml-2"
                  name="search_by"
                  value="codigo"
                  checked={searchBy === 'codigo'}
                  onChange={() => { setSearchBy('codigo'); setValue("Type", "Codigo"); setValue("Input", "") }}
                />
                <span className="ml-2">Código</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="radio radio-xs radio-primary ml-2"
                  name="search_by"
                  value="nombre"
                  checked={searchBy === 'nombre'}
                  onChange={() => { setSearchBy('nombre'); setValue("Type", "Nombre"); setValue("Input", "");setValue("match","contiene") }}
                />
                <span className="ml-2">Nombre</span>
              </label>
            </div>
            {searchBy === 'codigo' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ingrese Código</label>
                <div className="flex justify-center">
                  <input
                    {...register("Input", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                    type="text"
                    className="mt-1 block w-3/4 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <label className=" block text-sm label text-error">
                  {errors.Input && <span>{errors.Input.message}</span>}
                </label>
              </div>
            )}
            {searchBy === 'nombre' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Ingrese Nombre</label>
                  <div className="flex justify-center">
                    <input
                      {...register("Input", {
                        setValueAs: (value) => (value === "" ? undefined : value),
                      })}
                      type="text"
                      className="mt-1 block w-3/4 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <label className=" block text-sm label text-error">
                    {errors.Input && <span>{errors.Input.message}</span>}
                  </label>
                </div>
                {getValues("match")}
                <div className="mb-4 animate-fadein">
                  <span className="font-medium">Filtrar por: </span>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="radio radio-xs radio-primary ml-2"
                      name="name_search_option"
                      value="comienza"
                      checked={getValues("match") === 'comienza'}
                      onChange={() => setValue("match", 'comienza')}
                    />
                    <span className="ml-2">Comienza con</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="radio radio-xs radio-primary ml-2"
                      name="name_search_option"
                      value="contiene"
                      checked={getValues("match") === 'contiene'}
                      onChange={() => setValue("match", 'contiene')}
                    />
                    <span className="ml-2">Contiene</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="radio radio-xs radio-primary ml-2"
                      name="name_search_option"
                      value="termina"
                      checked={getValues("match") === 'termina'}
                      onChange={() => setValue("match", 'termina')}
                    />
                    <span className="ml-2">Termina con</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="radio radio-xs radio-primary ml-2"
                      name="name_search_option"
                      value="exacto"
                      checked={getValues("match") === 'exacto'}
                      onChange={() => setValue("match", 'exacto')}
                    />
                    <span className="ml-2">Exacto</span>
                  </label>
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Centro de Costo</label>
              <div className="flex justify-center">
                <select
                  {...register("CentroCosto", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                  id="centro_costo"
                  className="mt-1 block w-3/4 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option key={0} value="">Seleccione un centro de costo</option>
                  {dataCentroCosto?.map((option: ICentroCosto, index) => (
                    <option key={index} value={option.id}>
                      {option.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Familia</label>
              <div className="flex justify-center">
                <select
                  className="mt-1 block w-3/4 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  {...register("Familia", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                >
                  <option value="">Seleccione una familia</option>
                  {dataFamilia?.map((familia) => (
                    <option key={familia.id} value={familia.id}>
                      {familia.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Subfamilia</label>
              <div className="flex justify-center">
                <select
                  id="subfamilia"
                  className="mt-1 block w-3/4 py-2 px-3 border border-primary bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  {...register("SubFamilia", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                >
                  <option value="">Seleccione una subfamilia</option>
                  {filteredSubFamilias?.map((subfamilia) => (
                    <option key={subfamilia.id} value={subfamilia.id}>
                      {subfamilia.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
            <button disabled={isLoading} className="btn btn-primary" type="submit">
              {isLoading && <span className="loading loading-spinner "></span>}
              Buscar
            </button>
            </div>
          </div>
        </div>
      </form>
    )
}