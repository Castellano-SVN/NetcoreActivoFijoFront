import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
interface State {
    jwt: string;
    displayName: string;
    companyName: string;
    appName: string;
}

type Actions = {
  setJwt(token: string): void;
  getJwt() : string;
  setUserProfile(displayName: string, companyName: string, appName?: string): void;
};

export const useUserStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        jwt: "",
        displayName: "",
        companyName: "",
        appName: "",
        bread: [],
        getJwt() {
            const {jwt} = get()
            return jwt;
        },
        setJwt: (token: string) => set((state) => ({ ...state, jwt:token })),
        setUserProfile: (displayName: string, companyName: string, appName?: string) =>
          set((state) => ({ ...state, displayName, companyName, appName: appName ?? state.appName })),
      }),
      { name: 'token-Store',
      storage: createJSONStorage(() => sessionStorage), 
       }))
);
