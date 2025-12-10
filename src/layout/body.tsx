import { useState } from "react";
import MenusAccordion from "./MenusAccordion";

type BodyProps = {
  children: React.ReactNode;
  menus: any[];
  sidebarOpen?: boolean;
  onCloseSidebar?: () => void;
};

export default function Body({ children, menus, sidebarOpen = false, onCloseSidebar }: BodyProps) {
  const [sw, setSw] = useState(false);
  const [margenes, setMargenes] = useState(true);
  const hasMenus = Array.isArray(menus) && menus.length > 0;

  const mobileClass = sidebarOpen ? "d-block" : "d-none";
  const desktopClass = sw ? "d-lg-none" : "d-lg-block";
 
  return (
   <main className="mt-2">
      <div className={`${margenes ? "container py-2" : "px-5"} productos-cont-interior`}>
        <div className="row">
          <div className="col-12 mt-2 d-flex justify-content-between">
            <span className="material-icons fs-3 d-none d-lg-block" style={{ color: "#212529" }} onClick={() => setSw(!sw)}>
              {sw ? "menu" : "menu_open"}
            </span>
            <span className="material-icons fs-3 d-none d-lg-block" style={{ color: "#212529" }} onClick={() => setMargenes(!margenes)}>
              {margenes ? "fullscreen" : "fullscreen_exit"}
            </span>
          </div>
        </div>

        <div className="row align-items-start">
          {hasMenus && (
            <section className={`col-12 col-lg-3 ${mobileClass} ${desktopClass}`}>
              <div id="accordion-menus" className="accordion nav-interior-pdt h-100">
                <MenusAccordion menus={menus} idnav="accordion-menus" />
              </div>
            </section>
          )}

          <section className={`col-12 ${hasMenus && !sw ? "col-lg-9" : "col-lg-12"} card-shadow px-4`}>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
