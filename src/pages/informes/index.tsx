
import { useContextStore } from "@/store/context.store";
import { useEffect} from "react";
import ListaEmpresasPage from "@/components/inventario-informe/ListaEmpresaPage";

export default function index() {
  
  const { setActive } = useContextStore();
  
  useEffect(() => {
    setActive("Informes");
  }, []);

  return (
    <>
      <ListaEmpresasPage label="Generar Informes" />
    </>
  );
}
