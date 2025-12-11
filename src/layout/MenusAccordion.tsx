import { useState } from "react";
import { useRouter } from "next/router";
import { useContextStore } from "../store/context.store";

type MenuItem = {
  id?: string;
  nombre?: string;
  url?: string;
  menuItems?: MenuItem[];
};

type Props = {
  menus: MenuItem[];
  idnav: string;
  onSelectMenu?: () => void;
};

export default function MenusAccordion({ menus, idnav, onSelectMenu }: Props) {
  const [abiertos, setAbiertos] = useState<string[]>([]);
  const router = useRouter();
  const { setCurrentMenu } = useContextStore();

  const normalizeHref = (url?: string) => {
    if (!url) return "/";
    const lower = url.toString().toLowerCase();
    return lower.replace(/^\/inventario/, "");
  };

  const handleClickMenu = (menuitem: MenuItem, event: React.MouseEvent, olds: string[]) => {
    if (menuitem.menuItems?.length) {
      event.preventDefault();
    } else if (menuitem.url) {
      const path = normalizeHref(menuitem.url.replace(".aspx", ""));
      if (path) router.push(path);
      setAbiertos(olds);
    }
    setCurrentMenu(menuitem);
  };

  const isMenuOpen = (id?: string) => (id ? abiertos.includes(id) : false);

  const scrollToTop = (haveSubmenus: boolean) => {
    if (!haveSubmenus) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  const MenuItemList = ({ menuItems, parentId, olds = [] }: { menuItems: MenuItem[]; parentId: string; olds?: string[] }) => (
    <div className="accordion-body">
      <ul className="menu-interno-drop">
        {menuItems.map((item, index) => {
          const idCollapse = `${parentId}-submenu-${index}`;
          const haveSubmenus =  (item.menuItems || []).length > 0;
          const old = [...olds, item.id || ""];
          const isOpen = item.id && isMenuOpen(item.id) ? "show" : "";

          return (
            <li key={`${idnav}-${item.id || index}`} className="list-group-item">
              <a
                className={`btn w-100 text-start ${isOpen ? "fw-bold" : ""}`}
                type="button"
                data-bs-toggle={haveSubmenus ? "collapse" : ""}
                data-bs-target={`#${idCollapse}`}
                aria-expanded={isOpen ? "true" : "false"}
                aria-controls={idCollapse}
                onClick={(e) => {
                  handleClickMenu(item, e, old);
                  if (onSelectMenu && !haveSubmenus) onSelectMenu();
                  scrollToTop(haveSubmenus);
                }}
              >
                <span className="accordion-text" style={{ whiteSpace: "normal", overflowWrap: "break-word" }}>
                  {item.nombre}
                </span>
              </a>

              {haveSubmenus && (
                <div id={idCollapse} className={`collapse ${isOpen}`}>
                  <MenuItemList menuItems={item.menuItems || []} parentId={idCollapse} olds={old} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div id={idnav} className="accordion">
      {menus.map((item, index) => {
        const idCollapse = `${idnav}-${index}`;
        const idHeading = `heading-${index}`;
        const old = [item.id || ""];
        const isOpen = item.id && isMenuOpen(item.id) ? "show" : "";
        const haveSubmenus = (item.menuItems || []).length > 0;
        return (
          <div key={`${idnav}-menus-${index}`} className="accordion-item">
            <div id={idHeading} className="accordion-header">
              <button
                className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${idCollapse}`}
                aria-expanded={isOpen ? "true" : "false"}
                aria-controls={idCollapse}
                onClick={(e) => {
                  handleClickMenu(item, e, old);
                  if (onSelectMenu && !haveSubmenus) onSelectMenu();
                }}
              >
                <span className="accordion-text" style={{ whiteSpace: "normal", overflowWrap: "break-word" }}>
                  {item.nombre}
                </span>
              </button>
            </div>

            <div
              id={idCollapse}
              className={`accordion-collapse collapse ${isOpen}`}
              aria-labelledby={idHeading}
              data-bs-parent={`#${idnav}`}
            >
              {haveSubmenus && (
                <MenuItemList menuItems={item.menuItems || []} parentId={idCollapse} olds={old} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
