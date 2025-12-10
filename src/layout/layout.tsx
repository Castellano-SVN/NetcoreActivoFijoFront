import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import TopBar from "./topBar";
import Body from "./body";
import InfoBar from "./infoBar";
import { useUserStore } from "../store/user.store";
import { useContextStore } from "../store/context.store";
import { generateToken } from "../services/jwt.service";
import { api_getModeloMenusPermisos } from "@/services/membresia.service";
import { Loading } from "react-daisyui";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setJwt, jwt, setUserProfile } = useUserStore();
  const { setApps, setCurrentApp, setMenus, menus } = useContextStore();
  const mutation = useMutation(generateToken);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userToken = searchParams.get("user");

    if (userToken) {
      setJwt(userToken);
      const params = new URLSearchParams(window.location.search);
      params.delete("user");
      router.replace(
        { pathname: router.pathname, query: Object.fromEntries(params.entries()) },
        undefined,
        { shallow: true },
      );
      setLoading(false);
      return;
    }

    if (jwt) {
      setLoading(false);
      return;
    }
  }, [searchParams, router, jwt, setJwt]);

  // useEffect(() => {
  //   const loadMenus = async () => {
  //     if (!jwt) return;
  //     try {
  //       const data = await api_getModeloMenusPermisos(jwt);
  //       const apps = data?.data?.aplicacionPerfiles || data?.aplicacionPerfiles || [];
  //       setApps(apps);
  //       // Dejamos seleccionada la primera app para tener currentAppId disponible
  //       setCurrentApp(apps[0]?.aplicacionId || null);
  //       // Menús se cargarán al hacer clic (o en TopBar si queremos auto-cargar)
  //       setMenus([]);
  //       const usuario = data?.data?.usuario || data?.usuario || "";
  //       const empresa = data?.data?.empresa || data?.empresa || "";
  //       setUserProfile(usuario, empresa, "");
  //     } catch (error) {
  //       console.error("No se pudieron obtener los menús desde Membresía", error);
  //     }
  //   };

  //   loadMenus();
  // }, [jwt, setApps, setCurrentApp, setMenus, setUserProfile]);

  useEffect(() => {
    const loadMenus = async () => {
      if (!jwt) return;
      try {
        const data = await api_getModeloMenusPermisos(jwt);
        const apps = data?.data?.aplicacionPerfiles || data?.aplicacionPerfiles || [];
        setApps(apps);
        setMenus([]);

        const usuario = data?.data?.usuario || data?.usuario || "";
        const empresa = data?.data?.empresa || data?.empresa || "";
        setUserProfile(usuario, empresa, "");
      } catch (error) {
        console.error("No se pudieron obtener los menús desde Membresía", error);
      }
    };

    loadMenus();
  }, [jwt, setApps, setMenus, setUserProfile]);


  if (!jwt || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" color="primary" />
      </div>
    );
  }



  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-base-100 flex flex-col">
        <InfoBar />
        <TopBar open={() => setSidebarOpen((prev) => !prev)} />
      </header>
      <div className="h-[90px]" />
      {/* <Body menus={menus}>{props.children}</Body> */}
      <Body menus={menus} sidebarOpen={sidebarOpen} onCloseSidebar={() => setSidebarOpen(false)} >{props.children}</Body>
    </>
  );
}
