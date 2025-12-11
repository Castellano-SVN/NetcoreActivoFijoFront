
import { useContextStore } from "@/store/context.store";
import { useEffect} from "react";
import ListaEmpresasPage from "@/components/inventario-informe/ListaEmpresaPage";

export default function Index() {

  const { setActive, currentMenu } = useContextStore();
  useEffect(() => {
    setActive("Toma inventario");
  }, []);

  const menuActions =
    currentMenu?.acciones ||
    // @ts-ignore: respuestas variadas
    currentMenu?.accions ||
    currentMenu?.accionesPermitidas ||
    (currentMenu as any)?.listAccions ||
    [];

  return (
    <>
     <ListaEmpresasPage
       label="Toma Inventario"
       activeMenuName="Toma inventario"
       accions={menuActions}
     />
    </>
  );

}
