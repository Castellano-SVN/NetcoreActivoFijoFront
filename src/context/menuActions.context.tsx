import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useMenuMeta } from "@/hooks/useMenuMeta";

const MenuActionsContext = createContext<number[]>([]);

type ProviderProps = {
  children: ReactNode;
};

export function MenuActionsProvider({ children }: ProviderProps) {
  const { actions } = useMenuMeta();

  useEffect(() => {
    console.log("MenuActionsProvider actions", actions);
  }, [actions]);

  return <MenuActionsContext.Provider value={actions}>{children}</MenuActionsContext.Provider>;
}

export function useMenuActions() {
  return useContext(MenuActionsContext);
}
