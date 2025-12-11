import { useContextStore } from "@/store/context.store";
import { useMemo } from "react";

export function useMenuMeta() {
  const { currentMenu } = useContextStore();

  const actions = useMemo(() => {
    const accs =
      currentMenu?.acciones ||
      currentMenu?.accions ||
      currentMenu?.accionesPermitidas ||
      // @ts-ignore: algunos backends usan listAccions
      (currentMenu as any)?.listAccions ||
      [];
    return Array.isArray(accs) ? accs : [];
  }, [currentMenu]);

  const title = useMemo(() => currentMenu?.titulo || currentMenu?.nombre || "", [currentMenu]);

  return { currentMenu, actions, title };
}
