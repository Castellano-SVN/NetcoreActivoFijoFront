import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import TopBar from "./topBar";
import Body from "./body";
import InfoBar from "./infoBar";
import { useUserStore } from "../store/user.store";
import { useContextStore } from "../store/context.store";
import { api_getModeloMenusPermisos } from "@/services/membresia.service";
import { Loading } from "react-daisyui";
import Footer from "./Footer";
import { useMemo } from "react";
import { MenuActionsProvider } from "@/context/menuActions.context";

type LayoutProps = {
  children: React.ReactNode;
};

interface MenuItem {
  aplicacionId?: any;
  menuId?: any;
  id?: any;
  nombre?: string;
  titulo?: string;
  url?: string;
  acciones?: any[];
  menuItems?: MenuItem[];
}

export default function Layout(props: LayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setJwt, jwt, setUserProfile } = useUserStore();
  const { setApps, setMenus, menus, setCurrentMenu, setCurrentApp, currentAppId } = useContextStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mapMenuItems = useMemo(
    () =>
      (items: any[] = []) =>
        items.map((item: any) => ({
          aplicacionId: item.aplicacionId,
          menuId: item.menuId,
          id: item.id || item.menuId || item.nombre,
          nombre: item.nombre || item.name || item.title || "Menú",
          titulo: item.titulo || item.nombre || item.title,
          url: item.url,
          acciones: item.acciones || item.accions || item.accionesPermitidas || item.listAccions || [],
          menuItems: mapMenuItems(item.menuItems || []),
        })),
    [],
  );

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

  // Carga menús/aplicaciones desde Membresía.
  useEffect(() => {
    const loadMenus = async () => {
      if (!jwt) return;
      try {
        const data = await api_getModeloMenusPermisos(jwt);
        const apps = data?.data?.aplicacionPerfiles || data?.aplicacionPerfiles || [];
        setApps(apps);

        if (apps.length > 0) {
          // Si no hay app seleccionada (ej. refresh), seleccionamos la primera.
          if (!currentAppId) setCurrentApp(apps[0].aplicacionId);
          setMenus(mapMenuItems(apps[0].listMenuPhone || []));
        } else {
          setMenus([]);
        }

        console.log("Menús cargados desde Membresía:", data);
        const usuario = data?.data?.usuario || data?.usuario || "";
        const empresa = data?.data?.empresa || data?.empresa || "";
        setUserProfile(usuario, empresa, "");
      } catch (error) {
        console.error("No se pudieron obtener los menús desde Membresía", error);
      }
    };

    loadMenus();
  }, [jwt, currentAppId, mapMenuItems, setApps, setMenus, setUserProfile, setCurrentApp]);


  useEffect(() => {
    const normalize = (path: string) => {
      if (!path) return "/";
      const withoutQuery = path.split("?")[0];
      const noTrailingSlash = withoutQuery.replace(/\/+$/, "");
      const withoutInventarioPrefix = noTrailingSlash.replace(/^\/inventario\b/i, "");
      const clean = withoutInventarioPrefix === "" ? "/" : withoutInventarioPrefix;
      return clean.toLowerCase();
    };

    const findMenu = (items: any[] = [], path: string): any | null => {
      for (const item of items) {
        const itemPath = normalize(item.url || "");
        if (itemPath === path || (itemPath !== "/" && path.startsWith(itemPath))) {
          return item;
        }
        const child = findMenu(item.menuItems || [], path);
        if (child) return child;
      }
      return null;
    };

    const currentPath = normalize(router.asPath || router.pathname);
    const found = findMenu(menus, currentPath);
    setCurrentMenu(found || null);
  }, [menus, router.asPath, router.pathname, setCurrentMenu]);

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
      <MenuActionsProvider>
        <Body menus={menus} sidebarOpen={sidebarOpen} onCloseSidebar={() => setSidebarOpen(false)}>
          {props.children}
        </Body>
      </MenuActionsProvider>
      <Footer />
    </>
  );
}
