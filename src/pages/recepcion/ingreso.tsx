import { ArticuloFormValues, ICentroCosto, IFamilia } from "@/interfaces/creation";
import { api_getAllCentroCostos, api_getAllFamilias } from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFileExport } from "react-icons/fa";
import { FaCircleXmark, FaPlus, FaRegFloppyDisk } from "react-icons/fa6";
import { z } from "zod";

export default function Ingreso() {
  const validationSchema = z.object({
    Codigo: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "El campo debe ser numerico",
    }).optional(),
    Nombre: z.string({
      required_error: "Campo requerido",
      invalid_type_error: "Campo requerido",
    }).optional(),
  });

  const methods = useForm<ArticuloFormValues>({
    resolver: zodResolver(validationSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = methods;
  const { jwt } = useUserStore();
  const [searchBy, setSearchBy] = useState('codigo');
  const [nameSearchOption, setNameSearchOption] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [dataFamilia, setDataFamilia] = useState<IFamilia>();
  const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto>();
  const handleSearch = () => {
    setShowTable(true);
  };
  const getCentroCosto = async () => {
    try {
      const dataGet = await api_getAllCentroCostos(jwt);
      setDataCentroCosto(dataGet.data.dataList);
      console.log("Mostrando centros de costo:")
      console.log(dataGet.data.dataList)
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


  const SearchArticulo: SubmitHandler<ArticuloFormValues> = async (
    data: ArticuloFormValues
  ) => {
    console.log("buscando...")
    console.log(data)
  };


  return (
    <div className="flex flex-col md:flex-row justify-center">
      <div className="w-full md:w-1/2 md:pr-2">
        <form
          onSubmit={handleSubmit(getFamilia)}
        >
          <div className="container mx-auto mt-2 sm:mt-4 rounded-lg">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-md">
              <h5 className="text-2xl font-bold mb-4">Selección de artículos</h5>
              <div className="mb-4">
                <span className="font-medium">Buscar por: </span>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="search_by"
                    value="codigo"
                    checked={searchBy === 'codigo'}
                    onChange={() => setSearchBy('codigo')}
                  />
                  <span className="ml-2">Código</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="search_by"
                    value="nombre"
                    checked={searchBy === 'nombre'}
                    onChange={() => setSearchBy('nombre')}
                  />
                  <span className="ml-2">Nombre</span>
                </label>
              </div>
              {searchBy === 'codigo' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Ingrese Código</label>
                  <div className="flex justify-center">
                    <input
                      {...register("Codigo", {
                        setValueAs: (value) => (value === "" ? undefined : value),
                      })}
                      type="text"
                      className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
              {searchBy === 'nombre' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ingrese Nombre</label>
                    <div className="flex justify-center">
                      <input
                        {...register("Nombre", {
                          setValueAs: (value) => (value === "" ? undefined : value),
                        })}
                        type="text"
                        className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mb-4 animate-fadein">
                    <span className="font-medium">Filtrar por: </span>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name="name_search_option"
                        value="comienza"
                        checked={nameSearchOption === 'comienza'}
                        onChange={() => setNameSearchOption('comienza')}
                      />
                      <span className="ml-2">Comienza con</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name="name_search_option"
                        value="contiene"
                        checked={nameSearchOption === 'contiene'}
                        onChange={() => setNameSearchOption('contiene')}
                      />
                      <span className="ml-2">Contiene</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name="name_search_option"
                        value="termina"
                        checked={nameSearchOption === 'termina'}
                        onChange={() => setNameSearchOption('termina')}
                      />
                      <span className="ml-2">Termina con</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name="name_search_option"
                        value="exacto"
                        checked={nameSearchOption === 'exacto'}
                        onChange={() => setNameSearchOption('exacto')}
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
                    id="centro_costo"
                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Seleccione un centro de costo</option>
                    <option value="centro_1">Centro 1</option>
                    <option value="centro_2">Centro 2</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Familia</label>
                <div className="flex justify-center">
                  <select
                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {/* <option value="">Seleccione una familia</option>
                    {dataFamilia.map((dataFamilia, index) => (
                            <option key={index} value={dataFamilia.codigo}>
                                {dataFamilia.nombre}
                            </option>
                        ))} */}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Subfamilia</label>
                <div className="flex justify-center">
                  <select
                    id="subfamilia"
                    className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Seleccione una subfamilia</option>
                    <option value="subfamilia_1">Subfamilia 1</option>
                    <option value="subfamilia_2">Subfamilia 2</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </div>
      <div className="w-full md:w-1/2 md:pl-2">
        <div className="container mx-auto mt-2 sm:mt-4 rounded-lg">
          <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-md">
            <h5 className="text-2xl font-bold mb-4">Requerimiento</h5>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Ingrese Nombre</label>
              <div className="flex justify-center">
                <input
                  type="text"
                  className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-4xl overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Glosa</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">001</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nombre 1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                        <input
                          className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                        <input
                          className="mt-1 block w-4/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" align="center">
                        <FaCircleXmark className="text-error" />

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Programa</label>
              <div className="flex justify-center">
                <select
                  id="centro_costo"
                  className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Seleccione Programa</option>
                  <option value="centro_1">Programa 1</option>
                  <option value="centro_2">Programa 2</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Observación</label>
              <div className="flex justify-center">
                <textarea
                  placeholder="Escriba aqui..."
                  className="mt-1 block w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="my-2 mx-0 md:mx-2 btn bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <FaPlus />
                Nuevo
              </button>
              <button className="my-2 mx-0 md:mx-2 btn bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <FaFileExport />
                Exportar
              </button>
              <button className="my-2 mx-0 md:mx-2 btn bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <FaRegFloppyDisk />
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
