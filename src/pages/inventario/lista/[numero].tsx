import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import router, { useRouter } from "next/router";
import { useUserStore } from "../../../store/user.store";
import {
  api_getAllPersonasByEmpresa,
  api_getValidation,
} from "../../../services/inventario.service";
import { useContextStore } from "../../../store/context.store";
import { api_getAllBodegaByEmpresaYCentroCosto, api_getAllCentroCostoByEmpresa } from "../../../services/bodega.service";
import { IBodega, ICentroCosto } from "../../../interfaces/creation";
import { IFuncionarioEmpresa } from "../../../interfaces/inventario.interface";
import Select from "react-select";

export default function ShowInventarioFisico() {
  const { jwt } = useUserStore();
  const { empresa, numero } = router.query;
  const { setActive } = useContextStore();
  useEffect(() => {
    setActive("Toma inventario");
  }, []);

  const validateParams = async () => {
    try {
      await api_getValidation(jwt, empresa as string, Number(numero));
    } catch (error) {
      console.error(error);
      router.back();
    }
  };

  const [dataPersona, setDataPersona] = useState<IFuncionarioEmpresa[]>();
  const getFuncionarios = async () => {
    try {
      const data = await api_getAllPersonasByEmpresa(jwt, empresa as string);
      setDataPersona(data.data.dataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!numero) return;
    if (!empresa) return;
    validateParams();
  }, [numero, empresa]);

  const [dataCc, setDataCc] = useState<ICentroCosto[]>();
  const getCentroCostos = async () => {
    try {
      const cc = await api_getAllCentroCostoByEmpresa(jwt, empresa as string);
      setDataCc(cc.data.dataList);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCentroCostos();
    getFuncionarios();
  }, [empresa]);
  
  const [selectedPersona, setSelectedPersona] = useState<IFuncionarioEmpresa | null>(null);
  const [selectedCc, setSelectedCc] = useState<ICentroCosto | null>(null);
  const [selectedBodega, setSelectedBodega] = useState<IBodega | null>(null);
  
  const [dataBodega, setDataBodega] = useState<IBodega[]>();
  const getBodegas = async () => {
    try{
      const bodega = await api_getAllBodegaByEmpresaYCentroCosto(jwt, empresa as string, selectedCc?.id as string);
      console.log(bodega)
      setDataBodega(bodega.data.dataList);
    }catch (error){
      console.error(error);
    }
  }
  useEffect(()=>{
    if(empresa && selectedCc?.id){
      getBodegas()
    }
  },[selectedCc])
  return (
    <>
      <div className="border rounded-lg shadow-md w-10/12 grid grid-cols-12 gap-4 mx-auto">
        <div className="col-span-4">
          {dataPersona?.length !== 0 && (
            <>
              <Select
                className="my-2 w-full px-0 md:px-8 "
                placeholder="Seleccione el Funcionario "
                options={dataPersona}
                onChange={(option) => setSelectedPersona(option)}
                value={selectedPersona} 
                loadingMessage={() => "Cargando opciones..."}
                isLoading={dataPersona?.length === 0}
                getOptionValue={(option) => option.funcionarioId}
                getOptionLabel={(option) => option.persona.nombres +" "+ option.persona.apellidoPaterno} 
                menuPortalTarget={document.body}
                isClearable
              />
            </>
          )}
        </div>
        
        <div className="col-span-4">
        {dataCc?.length !== 0 && (
          <Select
            className="my-2 w-full px-0 md:px-8 "
            placeholder="Seleccione el Centro de costo "
            options={dataCc}
            onChange={(option) => setSelectedCc(option)}
            value={selectedCc} 
            loadingMessage={() => "Cargando opciones..."}
            isLoading={dataCc?.length === 0}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.nombre} 
            menuPortalTarget={document.body}
            isClearable
          />
        )}
        </div>

        <div className="col-span-4">
        {dataBodega?.length !== 0 && (
          <Select
            className="my-2 w-full px-0 md:px-8 "
            placeholder="Seleccione la bodega"
            options={dataBodega}
            onChange={(option) => setSelectedBodega(option)}
            value={selectedBodega} 
            loadingMessage={() => "Cargando opciones..."}
            isLoading={dataBodega?.length === 0}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.nombre} 
            menuPortalTarget={document.body}
            isClearable
          />
        )}
        </div>
      </div>
    </>
  );
}
