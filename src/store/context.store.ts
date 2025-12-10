import { create } from "zustand";
import { devtools } from "zustand/middleware";
import breadI from "../interfaces/bread.interface";

interface IMenu {
  name: string;
  active: boolean;
  href: string;
}

interface IMenuChildren extends IMenu {
  children: IMenu[];
}

interface IAplicacionPerfil {
  aplicacionId: string;
  nombreAplicacion?: string;
  listMenuPhone?: any[];
}

const Menus: IMenuChildren[] = [
  { name: "Prestadores", active: false, href: "/empresa", children: [] },
  {
    name: "Recepción",
    active: false,
    href: "/recepcion",
    children: [{ name: "Ingreso", active: false, href: "/recepcion/ingreso" }],
  },
  { name: "Salidas", active: false, href: "/salida", children: [] },
  { name: "Toma inventario", active: false, href: "/inventario", children: [] },
  { name: "Informes", active: false, href: "/informes", children: [] },
];

interface State {
  bread: breadI[];
  menus: IMenuChildren[];
  apps: IAplicacionPerfil[];
  currentAppId: string | null;
}

type Actions = {
  setBread(bread: breadI[]): void;
  setActive(
    item:
      | "Prestadores"
      | "Recepcion"
      | "Despacho"
      | "Salidas"
      | "Toma inventario"
      | "Informes",
  ): void;
  setMenus(menus: IMenuChildren[]): void;
  setApps(apps: IAplicacionPerfil[]): void;
  setCurrentApp(appId: string | null): void;
};

export const useContextStore = create<State & Actions>()(
  devtools(
    (set) => ({
      bread: [],
      menus: Menus,
      apps: [],
      currentAppId: null,
      setActive: (
        item:
          | "Prestadores"
          | "Recepcion"
          | "Despacho"
          | "Salidas"
          | "Toma inventario"
          | "Informes",
      ) =>
        set((state) => ({
          menus: state.menus.map((menu) =>
            menu.name === item
              ? { ...menu, active: true }
              : { ...menu, active: false },
          ),
        })),
      setMenus: (menus: IMenuChildren[]) =>
        set(() => ({
          menus: menus, // permitimos vacío para ocultar hasta que se seleccione app
        })),
      setApps: (apps: IAplicacionPerfil[]) => set(() => ({ apps })),
      setCurrentApp: (appId: string | null) => set(() => ({ currentAppId: appId })),
      setBread: (newBread: breadI[]) => set({ bread: newBread }),
    }),
    {
      name: "bread-Store",
    },
  ),
);
