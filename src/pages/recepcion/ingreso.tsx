import Requerimiento from "@/components/slugPages/ingresos/requerimientos";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ArticuloFormValues, IArticulo, IArticuloIngreso, ICentroCosto, IFamilia, ISubFamilia, RequerimientosFormValues } from "@/interfaces/creation";
import { api_getAllCentroCostos, api_getAllFamilias, api_getAllSubFamilias } from "@/services/bodega.service";

import ArticulosSearch from "../../components/slugPages/ingresos/articulosSearch";
import ArticuloList from "../../components/slugPages/ingresos/articulosList";
import { useSearchParams } from 'next/navigation'
import { useUserStore } from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, FormProvider, useFormContext, useFieldArray, useWatch, } from "react-hook-form";
interface ArticleCuantity extends IArticuloIngreso {
  CentroCostoId: string;
  EmpresaId: string;
  Cantidad: number | undefined;
  Glosa: string | undefined;
}

const ArticuloSchema = z.object({
  EmpresaId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
  CentroCostoId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
  Codigo: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }).optional(),
  nombre: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
  Cantidad: z.number({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).min(1, "Minimo de 1"),
  Glosa: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
  id: z.string()
})



const RequerimientoSchema = z.object({
  CentroCostoId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
  EmpresaId: z.string({ required_error: "Opción inválida", invalid_type_error: "Opción inválida" }),
  Nombre: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
  Articulo: z.array(ArticuloSchema),
  ProgramaId: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }),
  Observaciones: z.string({ required_error: "Campo inválido", invalid_type_error: "Campo inválido" }).optional(),
});



const validationSchema = z.object({
  Type: z.string({
    required_error: "Campo requerido",
    invalid_type_error: "Campo requerido",
  }).optional().default("Codigo"),
  CentroCosto: z.string({
    required_error: "Campo requerido",
    invalid_type_error: "Campo requerido",
  }),
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



export default function Ingreso() {
  interface ISearch {
    Type: "Codigo" | "Nombre",
    Input: string | number,
    match?: string;
    CentroCosto?: string;
    Familia?: string;
    SubFamilia?: string;
    empresa: string;
  }


  const searchParams = useSearchParams()
  const search = searchParams.get('empresa')

  const methodsRequerimientos = useForm<RequerimientosFormValues>({ resolver: zodResolver(RequerimientoSchema), defaultValues: { Articulo: [] } });
  const { handleSubmit, setValue, register, getValues, formState: { errors }, control } = methodsRequerimientos;
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'Articulo',
    keyName: 'idKey'
  });


  const methodsArticulo = useForm<ISearch>({ resolver: zodResolver(validationSchema) });
  const centroCostoWatcher = methodsArticulo.watch("CentroCosto");

  const [showTable, setShowTable] = useState(false);
  const [ArticleList, SetArticleList] = useState<IArticuloIngreso[]>([]);
  const [ArticleSelected, SetArticleSelected] = useState<ArticleCuantity[]>([]);
  const [showRequerimiento, setShowRequerimiento] = useState(false);
  const [dataCentroCosto, setDataCentroCosto] = useState<ICentroCosto[]>([]);
  const [dataFamilia, setDataFamilia] = useState<IFamilia[]>([]);
  const [dataSubFamilia, setDataSubFamilia] = useState<ISubFamilia[]>([]);
  const { jwt } = useUserStore();

  useEffect(() => {
    if (!search) return;
    getCentroCosto(search);
    getFamilia(search);
    getSubFamilia(search);
    setValue('EmpresaId', search);

  }, [search]);

  useEffect(() => {
    remove();
    if (!centroCostoWatcher) return;
    methodsRequerimientos.setValue("CentroCostoId", centroCostoWatcher);
  }, [centroCostoWatcher])

  const getCentroCosto = async (search: string) => {
    try {
      const dataGet = await api_getAllCentroCostos(jwt, search);
      setDataCentroCosto(dataGet.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };
  const getFamilia = async (search: string) => {
    try {
      const dataGet = await api_getAllFamilias(jwt, search);
      setDataFamilia(dataGet.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };
  const getSubFamilia = async (search: string) => {
    try {
      const dataGet = await api_getAllSubFamilias(jwt);
      setDataSubFamilia(dataGet.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  const addArticle = (article: IArticuloIngreso) => {
    if (!search) return;
    if (!centroCostoWatcher) return;
    const articleReq: ArticleCuantity = { ...article, Glosa: '', Cantidad: 0, EmpresaId: search, CentroCostoId: centroCostoWatcher };
    append(articleReq);
  };



  const handleButtonClick = () => {
    setShowRequerimiento(true);
  };
  const handleButtonBackClick = () => {
    setShowRequerimiento(false);
  };

  const removeArticle = (article: string) => {
    const indice = fields.findIndex(e => e.id === article);
    remove(indice)

  };


  if (!search) return '';

  return (
    <div className="flex flex-row justify-center w-full mx-auto">
      <div className="shadow-md basis-7/8 flex-grow ">
        {showRequerimiento === false ? (
          <FormProvider {...methodsArticulo}>
            <ArticulosSearch setList={SetArticleList} empresa={search} cc={dataCentroCosto} familia={dataFamilia} subfamilia={dataSubFamilia} />
            <ArticuloList list={ArticleList} addArticulo={addArticle} articlesSelected={fields} remove={removeArticle} />
            <div>
              <button className="btn btn-outline btn-primary my-4" onClick={handleButtonClick}>Ver Requerimientos</button>
            </div>
          </FormProvider>
        ) :
          (
            <FormProvider {...methodsRequerimientos}>
              <Requerimiento removeArticulo={removeArticle} selectArticle={ArticleSelected} empresa={search} />
              <div>
                <button className="btn btn-outline btn-primary my-4" onClick={handleButtonBackClick}>Volver a artículos</button>
              </div>
            </FormProvider>
          )}
      </div>

    </div >
  );
}
