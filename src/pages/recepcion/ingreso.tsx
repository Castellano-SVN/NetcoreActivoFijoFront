import Requerimiento from "@/components/slugPages/ingresos/requerimientos";
import { ArticuloFormValues, ICentroCosto, IFamilia, ISubFamilia } from "@/interfaces/creation";
import { api_getAllCentroCostos, api_getAllFamilias, api_getAllSubFamilias } from "@/services/bodega.service";
import { api_Ingresos } from "@/services/ingreso.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface ISearch {
  Type: "Codigo" | "Nombre",
  Input: string | number,
  match?: string;
  CentroCosto?: string;
  Familia?: string;
  SubFamilia?: string
}


export default function Ingreso() {
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
    }).optional(),
    Familia: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
    SubFamilia: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),

  });


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
  const { jwt } = useUserStore();
  const [searchBy, setSearchBy] = useState('codigo');
  const [showTable, setShowTable] = useState(false);
  const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>();
  const [dataFamilia, setDataFamilia] = useState<IFamilia[]>();
  const [dataSubFamilia, setDataSubFamilia] = useState<ISubFamilia[]>();
  const handleSearch = () => {
    setShowTable(true);
  };
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
      console.log("Mostrando Familia:")
      console.log(dataGet.data.dataList)
    } catch (error) {
      console.log(error);
    }
  };
  const getSubFamilia = async () => {
    try {
      const dataGet = await api_getAllSubFamilias(jwt);
      setDataSubFamilia(dataGet.data.dataList);
      console.log("Mostrando SubFamilia:")
      console.log(dataGet.data.dataList)
    } catch (error) {
      console.log(error);
    }
  };
  const removeUndefined = (key: string, value: string) => {
    if (value === undefined) {
      return undefined; // Omitir el valor undefined
    }
    return value; // Mantener el valor original
  };
  const SearchArticulo: SubmitHandler<ISearch> = async (
    data: ISearch
  ) => {
    console.log("buscando...")


    const dataClean = JSON.parse(JSON.stringify(data, removeUndefined));
    await api_Ingresos(jwt, dataClean)
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
    <div className="flex flex-col md:flex-row justify-center">
      <div className="w-full md:w-1/2 md:pr-2">
        <form
          onSubmit={handleSubmit(SearchArticulo)}
        >
          <div className="container mx-auto mt-2 sm:mt-4 rounded-lg">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-md">
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
                    onChange={() => { setSearchBy('nombre'); setValue("Type", "Nombre"); setValue("Input", "") }}
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
                  <div className="mb-4 animate-fadein">
                    <span className="font-medium">Filtrar por: </span>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="radio radio-xs radio-primary ml-2"
                        name="name_search_option"
                        value="comienza"
                        checked={radioMatch === 'comienza'}
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
                        checked={radioMatch === 'contiene'}
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
                        checked={radioMatch === 'termina'}
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
                        checked={radioMatch === 'exacto'}
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
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Buscar
                </button>
              </div>
              {showTable && (
                <div className="mt-6 flex justify-center animate-fadein">
                  <div className="w-full max-w-4xl overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Familia</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-familia</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">001</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Familia 1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Subfamilia 1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nombre 1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Descripción 1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div >
      <Requerimiento />
    </div >
  );
}
