"use client";
import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import eDataLogo from "@/assets/e-data-logo.jpg";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  TableIcon,
  UserCircleIcon,
  Persons,
  Paymnets,
  Product,
} from "../icons/index";
import {
  navItems as navConfig,
  isPathActive,
  resolveActiveNav,
  type NavItem,
} from "./navConfig";

const iconByName: Record<string, React.ReactNode> = {
  Dashboard: <GridIcon />,
  "Course Configuration": <HorizontaLDots />,
  "Time Slot Management": <TableIcon />,
  "Billing & Payments": <Paymnets />,
  "Tee Time Management": <CalenderIcon />,
  "Member Management": <UserCircleIcon />,
  "Guest Management": <ListIcon />,
  "Staff Management": <Persons />,
  Tournament: <TableIcon />,
  "Pro Shop": <Product />,
  Reports: <PageIcon />,
  "Expiring Memberships": <UserCircleIcon />,
};

const navItems: (NavItem & { icon: React.ReactNode })[] = navConfig
  .filter((item) => item.name !== "Profile")
  .map((item) => ({
    ...item,
    icon: iconByName[item.name] ?? <GridIcon />,
  }));

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    openSubmenu: contextOpenSubmenu,
    toggleSubmenu,
    setOpenSubmenu,
    setActiveItem,
    closeMobileSidebar,
  } = useSidebar();
  const { role } = useAuth();
  const pathname = usePathname();

  const isActive = useCallback(
    (path: string) => isPathActive(pathname, path),
    [pathname]
  );

  const isParentActive = useCallback(
    (nav: NavItem) => {
      if (nav.subItems?.some((sub) => isActive(sub.path))) return true;
      if (nav.path && !nav.subItems) return isActive(nav.path);
      return false;
    },
    [isActive]
  );

  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return role ? item.roles.includes(role) : false;
  });

  // Keep submenu open + active label in sync with the current route
  useEffect(() => {
    const { parent, label } = resolveActiveNav(pathname);
    setActiveItem(label);
    setOpenSubmenu(parent);
    closeMobileSidebar();
  }, [pathname, setActiveItem, setOpenSubmenu, closeMobileSidebar]);

  const handleSubmenuToggle = (name: string) => {
    toggleSubmenu(name);
  };

  const renderMenuItems = (items: (NavItem & { icon: React.ReactNode })[]) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav) => {
        const parentActive = isParentActive(nav);
        const submenuOpen = contextOpenSubmenu === nav.name;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                type="button"
                onClick={() => handleSubmenuToggle(nav.name)}
                className={`menu-item group ${
                  parentActive ? "menu-item-active" : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={
                    parentActive
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      submenuOpen || parentActive
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  submenuOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems
                    .filter((subItem) => {
                      if (!subItem.roles) return true;
                      return role ? subItem.roles.includes(role) : false;
                    })
                    .map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-[calc(100vh-4rem)] lg:h-screen overflow-hidden transition-all duration-300 ease-in-out z-[9999] lg:z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-2 hidden lg:flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src={eDataLogo}
                alt="eData Financial Group"
                width={180}
                height={50}
                priority
              />
              <Image
                className="hidden dark:block"
                src={eDataLogo}
                alt="eData Financial Group"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src={eDataLogo}
              alt="eData Financial Group"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  " "
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(visibleNavItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
