import { ReactNode } from "react";
import { useMenuMeta } from "@/hooks/useMenuMeta";

type Props = {
  children: ReactNode;
};

export default function MenuContainer({ children }: Props) {
  const { title } = useMenuMeta();

  return (
    <div className="cont-section-admin">
      <div className="d-flex justify-content-between align-items-center my-4 border-bottom pb-2">
        <h3 className="titulo-seccion">{title}</h3>
      </div>
      {children}
    </div>
  );
}
