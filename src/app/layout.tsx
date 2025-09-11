
'use client'
import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider> */}

        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SidebarProvider>{children}</SidebarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
