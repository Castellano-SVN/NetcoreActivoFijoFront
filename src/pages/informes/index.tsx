
import { useContextStore } from "@/store/context.store";
import { useEffect} from "react";
import ListaEmpresasPage from "@/components/inventario-informe/ListaEmpresaPage";

export default function index() {
  
  const { setActive, currentMenu } = useContextStore();
  
  useEffect(() => {
    setActive("Informes");
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
        label="Generar Informes"
        activeMenuName="Informes"
        accions={menuActions}
      />
    </>
  );
}
