import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
interface codeName {
    codigo: number;
    nombre: string;
}
interface IEstadoCivil extends codeName {}
interface IAreaGeografica extends codeName {}
interface country extends codeName {
    Extranjero: boolean;
    CodigoDipress: number | null;
    OrigenLatino: boolean;
    CodigoPais: string;
    Pais: string;
    CodigoLibreClaseElectronico: number;
}
interface INivelEducacional extends codeName {
    CodigoDIPRES: string;
}
interface ISexos extends codeName {
    letra: string;
}
interface State {
    country: country[];
    estadoCivil: IEstadoCivil[]
    nivelEducacional: INivelEducacional[]
    sexos: ISexos[]
    areageografica: IAreaGeografica[]
}

type Actions = {
    setCountry(elements: country[]): void;
    setEstadoCivil(elements: IEstadoCivil[]): void;
    setNivelEducacional(elements:INivelEducacional[]) : void;
    setAreaGeografica(elements: IAreaGeografica[]): void;
    setSexos(elements: ISexos[]): void;
    getCountry(): country[];
};

export const useMixStore = create<State & Actions>()(
    devtools(
        (set, get) => ({
            country: [],
            estadoCivil: [],
            nivelEducacional:[],
            sexos:[],
            areageografica:[],
            setAreaGeografica: (elements: IAreaGeografica[]) => set({ areageografica: elements }),
            setCountry: (elements: country[]) => set({ country: elements }),
            setSexos: (elements: ISexos[]) => set({ sexos: elements }),
            setEstadoCivil: (elements: IEstadoCivil[]) => set({ estadoCivil: elements }),
            setNivelEducacional: (elements: INivelEducacional[]) => set({ nivelEducacional: elements }),
            getCountry: () => {
                const { country } = get()
                return country
            },
        }),
        {
            name: 'mix-Store',

        })
);