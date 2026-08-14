import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import eDataLogo from "@/assets/e-data-logo.jpg";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Image
                  width={231}
                  height={80}
                  src={eDataLogo}
                  alt="eData Financial Group Logo"
                />
                <p className="text-center text-gray-400 dark:text-white/60 mt-3">
                  Smart and easy way to manage your golf club and members.
                </p>
                <div className="mt-8 text-center text-sm text-gray-400 dark:text-white/50 space-y-1">
                  <p className="font-semibold text-gray-300">eData Financial Group</p>
                  <p>+1-888-395-9554</p>
                  <p>info@edatapay.com</p>
                  <p>20423 State Road 7, Suite F6-524</p>
                  <p>Boca Raton, FL 33498, USA</p>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>

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
      </ThemeProvider>
    </div>
  );
}
