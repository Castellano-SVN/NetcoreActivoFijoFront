import { IEmpresa } from "@/interfaces/creation";
import { useRouter } from "next/router";
import { FaEye, FaFile } from "react-icons/fa";

interface ElementProps {
  element: IEmpresa;
  label: string;
}

export default function Element({ element, label }: ElementProps) {
  const router = useRouter();

  const handleClick = () => {
    if (label === "Generar Informes") {
      router.push(`/informes/lista?empresa=${element.id}`);
    } else if (label === "Ver") {
      router.push(`/inventario/lista?empresa=${element.id}`);
    }
  };

  return (
    <div className="hover:shado-wmd border rounded-md shadow animate-fadein">
      <div className="flex flex-row justify-between p-2">
        <div className="basis-1/2 flex flex-col justify-left text-left">
          <span className="font-bold mb-2">Razon social</span>
          <span className="text-sm align-left">{element.razonSocial}</span>
        </div>
        <div className="basis-1/2 flex flex-col justify-left text-right ">
          <span className="font-bold mb-2">Giro</span>
          <span className="text-sm align-left">
            {element.giro ? element.giro : "No informado"}
          </span>
        </div>
      </div>
      <div className="flex flex-row p-3 bg-[#FAF6FF] justify-around">
        <span className="basis-1/2 font-bold text-sm text-left">Acciones</span>
        <div className="flex flex-wrap justify-end space-x-4">
          {label === "Toma Inventario" && (
            <a
              onClick={() =>
                router.push(`/inventario/lista?empresa=${element.id}`)
              }
              className="flex items-center cursor-pointer hover:font-bold bg-primary text-primary-content p-1 px-2 rounded-md"
            >
              <span className="text-sm">Ver</span>
              <FaEye className="ml-2" />
            </a>
          )}
          {label === "Generar Informes" && (
            <a
                onClick={() =>
                  router.push(`/informes/disponibles?empresa=${element.id}`)
                }
              className="flex items-center cursor-pointer hover:font-bold bg-primary text-primary-content p-1 px-2 rounded-md"
            >
              <span className="text-sm">Informes</span>
              <FaFile className="ml-2"/>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
