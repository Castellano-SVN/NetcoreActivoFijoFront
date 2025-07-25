import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
interface State {
    jwt: string;
}

type Actions = {
  setJwt(token: string): void;
  getJwt() : string;
};

export const useUserStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        jwt: "",
        bread: [],
        getJwt() {
            const {jwt} = get()
            return jwt;
        },
        setJwt: (token: string) => set((state) => ({ ...state, jwt:token })),
      }),
      { name: 'token-Store',
      storage: createJSONStorage(() => sessionStorage), 
       }))
);