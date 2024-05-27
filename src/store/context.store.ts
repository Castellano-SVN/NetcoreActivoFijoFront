import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import breadI from '../interfaces/bread.interface';

interface IMenu {
  name: string;
  active: boolean;
  href: string;
}
const Menus: IMenu[] = [
  {name:"Prestadores",active:false,href: "/empresa"},
  {name:"Recepcion",active:false,href: "/recepcion"},
  {name:"Despacho",active:false,href: "/despacho"},
]
interface State {
  bread: breadI[];
  menus: IMenu[];
}

type Actions = {
  setBread(bread: breadI[]): void;
  setActive(item: "Prestadores"| "Recepcion" | "Despacho"): void;
};

export const useContextStore = create<State & Actions>()(
  devtools(
    (set) => ({
      bread: [],
      menus:Menus,
      setActive: (item: "Prestadores" | "Recepcion" | "Despacho") =>
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