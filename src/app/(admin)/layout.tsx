"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <>
      {/* Toast Container absolutely positioned at top level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        toastClassName="z-[9999]"
      />

      {/* Page layout */}
      <div className="min-h-screen xl:flex relative z-0">
        <AppSidebar />
        <Backdrop />

        <div
          className={`flex flex-col flex-1 min-h-screen min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="p-4 w-full mx-auto max-w-[1536px] md:p-6 flex-1 min-w-0">
            {children}
          </div>
          <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 py-4 px-4 md:px-6">
            <div className="max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} eData Financial Group. All rights reserved.</p>
              <div className="flex flex-wrap items-center gap-4">
                <span>+1-888-395-9554</span>
                <span>info@edatapay.com</span>
                <span>20423 State Road 7, Suite F6-524, Boca Raton, FL 33498, USA</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}


