import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import breadI from '../interfaces/bread.interface';

interface IMenu {
  name: string;
  active: boolean;
  href: string;
}

interface IMenuChildren extends IMenu {
  children: IMenu[]
}

const Menus: IMenuChildren[] = [
  { name: "Prestadores", active: false, href: "/empresa", children: [] },
  {
    name: "Recepción", active: false, href: "/recepcion",
    children: [
      { name: "Ingreso", active: false, href: '/recepcion/ingreso' }
    ]
  },
  /* { name: "Despacho", active: false, href: "/despacho", children: [] }, */
  { name: "Salidas", active: false, href: "/salida", children: [] },
  { name: "Toma inventario", active: false, href: "/inventario", children: [] },
  { name: "Informes", active: false, href: "/informes", children: [] },
]
interface State {
  bread: breadI[];
  menus: IMenuChildren[];
}

type Actions = {
  setBread(bread: breadI[]): void;
  setActive(item: "Prestadores" | "Recepcion" | "Despacho" | "Salidas" | "Toma inventario" | "Informes"): void;
};

export const useContextStore = create<State & Actions>()(
  devtools(
    (set) => ({
      bread: [],
      menus: Menus,
      setActive: (item: "Prestadores" | "Recepcion" | "Despacho" | "Salidas" | "Toma inventario" | "Informes") =>
        set((state) => ({
          menus: state.menus.map(menu =>
            menu.name === item
              ? { ...menu, active: true }
              : { ...menu, active: false }
          ),
        })),
      setBread: (newBread: breadI[]) => set({ bread: newBread }),
    }),
    {
      name: 'bread-Store',
    })
);