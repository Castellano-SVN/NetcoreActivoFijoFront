import { FamiliaFormValues, IEmpresa, IFamilia, IYears, ICuenta } from "@/interfaces/creation";
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
import Familia from "@/components/slugPages/familia";
import SubFamilia from "@/components/slugPages/subfamilia";

import { useContextStore } from "../../../store/context.store";
import CreateSubFamily from "../../../components/slugPages/createSubfamilia";
export default function Index() {

  const { setActive } = useContextStore()
  useEffect(() => {
    setActive("Prestadores");
  }, [])

  const router = useRouter();
  const { jwt } = useUserStore();
  const [slugs, setSlugs] = useState<{ familia: string; subFamilia: string }>();
  const [dataEmpresa, setDataEmpresa] = useState<IEmpresa>();
  const [dataFamilia, setDataFamilia] = useState<IFamilia>();
  const [dataCuentas, setDataCuentas] = useState<ICuenta[]>([]);
  const [dataYears, setDataYears] = useState<IYears[]>([]);
  const [createSubFamily, SetCreateSubFamily] = useState<Boolean>(false);
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
  }

  useEffect(() => {
    if (!router.query.slug) return;
    const familia = router.query.slug[0];
    const subFamilia = router.query.slug[1];
    getEmpresa(familia);
    if (subFamilia) SubfamiliasQuerys(familia, subFamilia);
    setSlugs({
      familia: familia as string,
      subFamilia: subFamilia as string,
    });
  }, [router.query]);

  if (!dataEmpresa) return "cargando";
  if (!router.query) return "cargando";
  if (!slugs?.familia) return "cargando";
  if (slugs?.subFamilia)
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
