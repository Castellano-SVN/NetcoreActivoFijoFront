import { FamiliaFormValues, IEmpresa, IFamilia, IYears, ICuenta, ITipoUnidad } from "@/interfaces/creation";
import {
  api_getCuenta,
  api_getFamilias,
  api_getOneEmpresa,
  api_getOneFamilias,
  api_getYears,
  api_postFamilias,
} from "@/services/bodega.service";
import { useUserStore } from "@/store/user.store";
import { PencilIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Divider, Modal } from "react-daisyui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaArchive, FaEye, FaPencilAlt } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { z } from "zod";
import { useContextStore } from "../../../store/context.store";
import CreateSubFamily from "@/components/slugPages/empresa/createSubfamilia";
import Familia from "@/components/slugPages/empresa/familia";
import CreateArticulo from "@/components/slugPages/empresa/createArticulo";
import SubFamilia from "@/components/slugPages/empresa/subfamilia"
import Articulo from "@/components/slugPages/empresa/articulo";
import { api_getTipoUnidad } from "@/services/tipos.service";

export default function Index() {

  const { setActive } = useContextStore()
  useEffect(() => {
    setActive("Prestadores");
  }, [])

  const router = useRouter();
  const { jwt } = useUserStore();
  const [slugs, setSlugs] = useState<{ familia: string; subFamilia: string, articulo: string }>(); // EMPRESA, FAMILIA, SUBFAMILIA
  const [dataEmpresa, setDataEmpresa] = useState<IEmpresa>();
  const [dataFamilia, setDataFamilia] = useState<IFamilia>();
  const [dataCuentas, setDataCuentas] = useState<ICuenta[]>([]);
  const [dataYears, setDataYears] = useState<IYears[]>([]);
  const [dataTipoUnidad, setDataTipoUnidad] = useState<ITipoUnidad[]>([]);
  const [createSubFamily, SetCreateSubFamily] = useState<Boolean>(false);
  const [createArticulo, setCreateArticulo] = useState<boolean>(false);
  const getEmpresa = async (id: string) => {
    try {
      const dataGet = await api_getOneEmpresa(jwt, id);
      setDataEmpresa(dataGet.data.dataList[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getFamilia = async (id: string, empresa: string) => {
    try {
      const dataGet = await api_getOneFamilias(jwt, id, empresa);
      setDataFamilia(dataGet.data.data);
    } catch (error) {
      console.log(error);
    }
  };


  const getYears = async () => {
    try {
      const dataGet = await api_getYears(jwt);
      setDataYears(dataGet.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  const getTipoUnidad = async () => {
    try {
      const dataGet = await api_getTipoUnidad(jwt);
      setDataTipoUnidad(dataGet.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };


  const getCuentas = async (id: string) => {
    try {
      const dataGet = await api_getCuenta(jwt, id);
      setDataCuentas(dataGet.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  const SubfamiliasQuerys = async (familia: string, subfamilia: string) => {
    await getCuentas(familia);
    await getFamilia(familia, subfamilia);
    await getYears();
    await getTipoUnidad();
  }

  useEffect(() => {
    if (!router.query.slug) return;
    const familia = router.query.slug[0];
    const subFamilia = router.query.slug[1];
    const articulo = router.query.slug[2];
    console.log(router.query.slug)
    getEmpresa(familia);
    if (subFamilia) SubfamiliasQuerys(familia, subFamilia);
    setSlugs({
      familia: familia as string,
      subFamilia: subFamilia as string,
      articulo: articulo as string,
    });
  }, [router.query]);

  if (!dataEmpresa) return "cargando";
  if (!router.query) return "cargando";
  if (!slugs?.familia) return "cargando";
  if (slugs.articulo) return (
    <div className="flex items-center justify-center">
      <div className="container shadow-md md:mx-24 mt-2 sm:mt-4 rounded-lg">
        <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
          <div className="flex flex-col">
            <span className="font-bold text-2xl">
              {dataEmpresa.razonSocial}
            </span>
            <span className="text-left">{dataEmpresa.giro}</span>
          </div>
        </div>
        <Divider />
        {!createArticulo && <Articulo create={() => setCreateArticulo(true)} guid={slugs.familia} familyGuid={slugs.articulo} subFamilyGuid={slugs.subFamilia} />}
        {createArticulo && <CreateArticulo change={() => setCreateArticulo(false)} guid={slugs.familia} subFamilyGuid={slugs.articulo} yearGuid={dataYears} familyGuid={slugs.familia} tipoUnidad={dataTipoUnidad} />}
      </div>
    </div>
  )

  if (slugs.subFamilia)
    return (
      <div className="flex items-center justify-center">
        <div className="container shadow-md md:mx-24 mt-2 sm:mt-4 rounded-lg">
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                {dataEmpresa.razonSocial}
              </span>
              <span className="text-left">{dataEmpresa.giro}</span>
            </div>
          </div>
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                Familia {dataFamilia?.nombre}
              </span>
              <span className="text-left">{dataEmpresa.giro}</span>
            </div>
          </div>
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="text-left text-md">
                {dataFamilia?.descripcion}
              </span>
              <span className="text-left">{dataEmpresa.giro}</span>
            </div>
          </div>
          <div className="animate-fadein ">
            <Divider />
            {!createSubFamily && <SubFamilia create={() => SetCreateSubFamily(true)} guid={slugs?.familia} familyGuid={slugs.subFamilia} />}
            {createSubFamily && <CreateSubFamily change={() => SetCreateSubFamily(false)} guid={slugs?.familia} familyGuid={slugs.subFamilia} yearGuid={dataYears} cuentasGuid={dataCuentas} />}
          </div>
        </div>
      </div>
    );

  if (slugs.familia) {

    return (
      <div className="flex items-center justify-center">
        <div className="container shadow-md md:mx-24 mt-2 sm:mt-4 rounded-lg">
          <div className="flex flex-row justify-center md:justify-start lg:justify-start  mt-0 md:mt-4 md:ml-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                {dataEmpresa.razonSocial}
              </span>
              <span className="text-left">{dataEmpresa.giro}</span>
            </div>
          </div>
          <Divider />
          <Familia guid={slugs?.familia} />
        </div>
      </div>
    );
  }
}
