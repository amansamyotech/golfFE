import { useSidebar } from "@/context/SidebarContext";
import React from "react";

const Backdrop: React.FC = () => {
  const { isMobileOpen, closeMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] bg-gray-900/50 overscroll-none touch-none lg:hidden"
      onClick={closeMobileSidebar}
      aria-hidden="true"
    />
  );
};

export default Backdrop;
