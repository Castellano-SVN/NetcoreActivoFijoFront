import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import breadI from '../interfaces/bread.interface';
import { ICiudad, IComuna, IRegion, ITipoAtencion, IGenericCodigoDescripcion, ISectorActividadEconomica, ITipoEstablecimientoSalud } from '../interfaces/location.interface';
import { number } from 'zod';


interface State {
  regiones: IRegion[];
  ciudades: ICiudad[];
  comunas: IComuna[];
  tipoAdministracion: ITipoAtencion[];
  actividadEconomicaPrincipal: IGenericCodigoDescripcion[]; //Generic USE
  sectorActividadEconomica: ISectorActividadEconomica[];
  tipoEstablecimientoSalud: ITipoEstablecimientoSalud[],

}

type Actions = {
  setRegiones(newRegion: IRegion[]): void;
  setCiudades(regiones: ICiudad[]): void;
  setComunas(comunas: IComuna[]): void;
  getCiudades(region: number): ICiudad[];
  getRegiones(): IRegion[];
  getComunas(region: number, ciudad: number): IComuna[]
  setTipoAdministracion: (tipoAtencion: ITipoAtencion[]) => void;
  setActividadEconomicaPrincipal: (actividadEconomicaPrincipal: IGenericCodigoDescripcion[]) => void;
  setSectorActividadEconomica: (sectorActividadEconomica: ISectorActividadEconomica[]) => void;
  getSectorActividadEconomica(sector: number): ISectorActividadEconomica[];
  setTipoEstablecimientoSalud(tipoestablecimientosalud:ITipoEstablecimientoSalud[]):void;
};

export const useTiposStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        regiones: [],
        ciudades: [],
        comunas: [],
        tipoAdministracion: [],
        actividadEconomicaPrincipal: [],
        sectorActividadEconomica: [],
        tipoEstablecimientoSalud:[],
        setTipoEstablecimientoSalud: (tipoestablecimientosalud: ITipoEstablecimientoSalud[]) => set({ tipoEstablecimientoSalud: tipoestablecimientosalud }),
        setRegiones: (newRegion: IRegion[]) => set({ regiones: newRegion }),
        // setCiudades: (newCiudad: ICiudad[]) => set({ ciudades: newCiudad }),
        setCiudades: (newElements: ICiudad[]) => {
          set((state) => ({
            ciudades: [...state.ciudades, ...newElements],
          }));
        },
        setComunas: (newElements: IComuna[]) => {
          set((state) => ({
            comunas: [...state.comunas, ...newElements],
          }));
        },
        setTipoAdministracion: (newElements) => set({ tipoAdministracion: newElements }),
        getCiudades: (region: any) => {
          if (typeof region !== 'number') return [];
          const { ciudades } = get()
          return ciudades.filter(e => e.regionCodigo === region)
        },
        getRegiones: () => {
          const { regiones } = get()
          return regiones
        },
        getComunas: (region: number, ciudad: number) => {
          if (typeof region !== 'number' || typeof ciudad !== 'number') return [];
          const { comunas } = get();
          return comunas.filter(e => e.regionCodigo === region && e.ciudadCodigo === ciudad);
        },
        setActividadEconomicaPrincipal: (newElements: IGenericCodigoDescripcion[]) => set({ actividadEconomicaPrincipal: newElements }),
        setSectorActividadEconomica: (newElements: ISectorActividadEconomica[]) => {
          set((state) => ({
            sectorActividadEconomica: [...state.sectorActividadEconomica, ...newElements],
          }));
        }, getSectorActividadEconomica: (sector: number) => {
          const { sectorActividadEconomica } = get();
          return sectorActividadEconomica.filter(e => e.actividadEconomicaPrincipalCodigo === sector)
        }
      }),
      {
        name: 'tipos-Store',
        storage: createJSONStorage(() => localStorage),
      }))
);