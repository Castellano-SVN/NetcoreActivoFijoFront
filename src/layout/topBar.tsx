import { useCallback, useEffect, useState } from "react";
import { Button, Modal, Navbar } from "react-daisyui";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { FaAlignJustify } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";
import { useContextStore } from "../store/context.store";
import { useUserStore } from "@/store/user.store";
import { toast } from "react-toastify";
import { api_getMyNotifys } from "@/services/informes.service";
import { api_getAnoMes } from "@/services/bodega.service";

interface Props {
  open: () => void;
}

type MenuEntry = {
  aplicacionId?: string;
  menuId?: string;
  id: string;
  nombre: string;
  url: string;
  menuItems: MenuEntry[];
};

export default function TopBar(props: Props) {
  const { apps, currentAppId, setCurrentApp, setMenus } = useContextStore();
  const router = useRouter();
  const { jwt } = useUserStore();

  const normalizeHref = (url?: string) => {
    if (!url) return "/";
    const lower = url.toString().toLowerCase();
    return lower.replace(/^\/inventario/, "");
  };

  const mapMenuItems = (items: any[] = []): MenuEntry[] =>
    items.map((item: any): MenuEntry => ({
      aplicacionId: item.aplicacionId,
      menuId: item.menuId,
      id: item.id || item.menuId || item.nombre,
      nombre: item.nombre || item.name || item.title || "Menú",
      url: normalizeHref(item.url || item.path || "/"),
      menuItems: mapMenuItems(item.menuItems || []),
    }));

  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState<string>("");

  const fetchNotificationCount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api_getMyNotifys(jwt);
      setNotificationCount(response.data.data.count);
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al obtener las notificaciones");
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount, router.pathname]);

  useEffect(() => {
    const fetchPeriodo = async () => {
      if (!jwt) return;
      try {
        const data = await api_getAnoMes(jwt);
        if (data?.data?.code == 200) {
          setPeriodo(data?.data?.data?.nombre || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPeriodo();
  }, [jwt]);

  const handleClickIrInventario = () => {
    router.push("/inventario");
    setIsModalOpen(false);
  };

  const handleAppClick = (app: any) => {
    setCurrentApp(app.aplicacionId);
    setMenus(mapMenuItems(app.listMenuPhone || []) as any);
  };

  useEffect(() => {
    if (!currentAppId && apps.length > 0) {
      handleAppClick(apps[0]);
    }
  }, [apps, currentAppId]);

  return (
  <>
    <nav className="shadow-md bg-primary text-base-100 w-full">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Button
              tag="a"
              color="ghost"
              tabIndex={0}
              onClick={() => props.open()}
            >
              <FaAlignJustify className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {apps.map((app, index) => {
              const active = app.aplicacionId === currentAppId;
              return (
                <button
                  key={app.aplicacionId || index}
                  className={`btn btn-link px-0 !normal-case ${
                    active ? "font-bold !text-base-100" : "!text-base-100"
                  }`}
                  onClick={() => handleAppClick(app)}
                >
                  {app.nombreAplicacion || "Aplicación"}
                </button>
              );
            })}
          </div>
        </div>

        {/* DERECHA: periodo + campana */}
        <div className="flex items-center gap-4 flex-none">
          {periodo && (
            <span className="nav-link color-black bg-base-100 text-primary rounded-full px-3 py-1">
              {periodo}
            </span>
          )}

          <div className="relative">
            <Button
              shape="circle"
              color="ghost"
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
            >
              {loading ? (
                <ArrowPathRoundedSquareIcon className="w-5 h-5 animate-spin" />
              ) : (
                <FiBell className="w-6 h-6" />
              )}
            </Button>

            {!loading && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                {notificationCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>

    <Modal open={isModalOpen}>
      <Modal.Header className="font-bold">Notificaciones</Modal.Header>
      <Modal.Body>
        <p>
          Tienes{" "}
          <span className="font-bold">{notificationCount}</span>{" "}
          inventario(s) por registrar
        </p>
      </Modal.Body>
      <Modal.Actions>
        <Button color="primary" onClick={handleClickIrInventario}>
          Ir a inventario
        </Button>
        <Button color="secondary" onClick={() => setIsModalOpen(false)}>
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  </>
);

  // return (
  //   <>
  //     <nav className="shadow-md bg-primary text-base-100">
  //       <div className="flex flex-1 flex-wrap items-center gap-4">
  //         <div className="flex flex-wrap items-center gap-4">
            
  //           {apps.map((app, index) => {
  //             const active = app.aplicacionId === currentAppId;
  //             return (
  //               <button
  //                 key={app.aplicacionId || index}
  //                 className={`btn btn-link text-base-100 px-0 ${active ? "fw-bold" : ""}`}
  //                 onClick={() => handleAppClick(app)}
  //               >
  //                 {app.nombreAplicacion || "Aplicación"}
  //               </button>
  //             );
  //           })}
  //         </div>
  //       </div>
  //       <div className="lg:hidden flex flex-1 justify-end">
  //         <Button
  //           tag="a"
  //           color="ghost"
  //           tabIndex={0}
  //           className="lg:hidden"
  //           onClick={() => props.open()}
  //         >
  //           <FaAlignJustify className="w-6 h-6" />
  //         </Button>
  //       </div>
  //       <div className="flex-none">
  //         {periodo && (
  //           <span className="nav-link color-black">
  //             {periodo}
  //           </span>
  //         )}
  //         <div className="relative">
  //           <Button
  //             shape="circle"
  //             color="ghost"
  //             onClick={() => setIsModalOpen(true)}
  //             disabled={loading}
  //           >
  //             {loading ? (
  //               <ArrowPathRoundedSquareIcon className="w-5 h-5 animate-spin" />
  //             ) : (
  //               <FiBell className="w-6 h-6" />
  //             )}
  //           </Button>
  //           {loading ? null : notificationCount > 0 ? (
  //             <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
  //               {notificationCount}
  //             </span>
  //           ) : null}
  //         </div>
  //       </div>
  //     </nav>

  //     <Modal open={isModalOpen}>
  //       <Modal.Header className="font-bold">Notificaciones</Modal.Header>
  //       <Modal.Body>
  //         <p>
  //           Tienes <span className="font-bold">{notificationCount}</span> inventario(s) por registrar
  //         </p>
  //       </Modal.Body>
  //       <Modal.Actions>
  //         <Button color="primary" onClick={handleClickIrInventario}>
  //           Ir a inventario
  //         </Button>
  //         <Button color="secondary" onClick={() => setIsModalOpen(false)}>
  //           Cerrar
  //         </Button>
  //       </Modal.Actions>
  //     </Modal>
  //   </>
  // );
}
