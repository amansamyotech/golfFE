import React from "react";

export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white text-sm">
        eData Financial Group
      </h3>
      <p className="text-gray-500 text-theme-xs dark:text-gray-400 leading-relaxed">
        +1-888-395-9554<br />
        info@edatapay.com<br />
        Boca Raton, FL 33498
      </p>
    </div>
  );
}
