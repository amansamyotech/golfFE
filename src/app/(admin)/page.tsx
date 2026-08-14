import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import PendingTasks from "@/components/ecommerce/PendingTasks";
import NotificationsWidget from "@/components/ecommerce/NotificationsWidget";

export const metadata: Metadata = {
  title: "Dashboard | eData Financial Group Golf Club CRM",
  description: "eData Financial Group Golf Club CRM – Smart and easy way to manage your golf club and members.",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <PendingTasks />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <NotificationsWidget />
      </div>

      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
