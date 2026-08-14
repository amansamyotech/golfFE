"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getAllPayments } from "@/services/paymentService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const MONTHLY_TARGET = 20000; // USD monthly revenue target

const getPaymentAmount = (p: any) =>
  Number(p?.paidAmount ?? p?.totalAmount ?? p?.amount ?? 0) || 0;

const isSuccessful = (p: any) => {
  const status = String(p?.status || p?.paymentStatus || "").toLowerCase();
  return !status || status === "success" || status === "paid" || status === "completed";
};

export default function MonthlyTarget() {
  const [loading, setLoading] = useState(true);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const payments = ((await getAllPayments()) as any[]) || [];
        const list = Array.isArray(payments) ? payments : [];

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        let thisMonth = 0;
        let today = 0;
        let lastMonth = 0;

        list.filter(isSuccessful).forEach((p) => {
          const amount = getPaymentAmount(p);
          const date = new Date(p.createdAt || p.paymentDate || p.date || 0);
          if (Number.isNaN(date.getTime())) return;

          if (date >= startOfMonth) thisMonth += amount;
          if (date >= startOfToday) today += amount;
          if (date >= startOfLastMonth && date <= endOfLastMonth) lastMonth += amount;
        });

        setMonthRevenue(thisMonth);
        setTodayRevenue(today);
        setLastMonthRevenue(lastMonth);
      } catch (err) {
        console.error("Failed to load monthly target data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const progress = Math.min(100, Math.round((monthRevenue / MONTHLY_TARGET) * 1000) / 10);
  const vsLastMonth =
    lastMonthRevenue === 0
      ? monthRevenue > 0
        ? 100
        : 0
      : Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
  const isUp = vsLastMonth >= 0;

  const series = [loading ? 0 : progress];
  const options: ApexOptions = useMemo(
    () => ({
      colors: ["#1F9FD9"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "radialBar",
        height: 330,
        sparkline: { enabled: true },
      },
      plotOptions: {
        radialBar: {
          startAngle: -85,
          endAngle: 85,
          hollow: { size: "80%" },
          track: {
            background: "#E4E7EC",
            strokeWidth: "100%",
            margin: 5,
          },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: "36px",
              fontWeight: "600",
              offsetY: -40,
              color: "#1D2939",
              formatter: (val) => `${val}%`,
            },
          },
        },
      },
      fill: { type: "solid", colors: ["#1F9FD9"] },
      stroke: { lineCap: "round" },
      labels: ["Progress"],
    }),
    []
  );

  const fmt = (n: number) =>
    loading
      ? "—"
      : `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Revenue progress toward this month&apos;s goal
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span
            className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${
              isUp
                ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
            }`}
          >
            {loading ? "…" : `${isUp ? "+" : ""}${vsLastMonth}% vs last month`}
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {loading
            ? "Loading revenue…"
            : `You earned ${fmt(todayRevenue)} today. This month: ${fmt(monthRevenue)} of ${fmt(MONTHLY_TARGET)} target.`}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Target
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {fmt(MONTHLY_TARGET)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            This Month
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {fmt(monthRevenue)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Today
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {fmt(todayRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
