"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { monthlySalesReport } from "@/services/reportService";
import { getBooking } from "@/services/bookingService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function StatisticsChart() {
  const [salesData, setSalesData] = useState<number[]>(new Array(12).fill(0));
  const [bookingData, setBookingData] = useState<number[]>(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResult, bookingsResult] = await Promise.allSettled([
          monthlySalesReport() as Promise<any[]>,
          getBooking() as Promise<any[]>,
        ]);

        if (salesResult.status === "fulfilled" && Array.isArray(salesResult.value)) {
          const monthly = MONTHS.map((m) => {
            const entry = salesResult.value.find((d: any) => d.month === m);
            return entry ? entry.totalSales : 0;
          });
          setSalesData(monthly);
        }

        if (bookingsResult.status === "fulfilled" && Array.isArray(bookingsResult.value)) {
          const monthly = new Array(12).fill(0);
          bookingsResult.value.forEach((b: any) => {
            const date = new Date(b.createdAt || b.startDateTime);
            if (!isNaN(date.getTime())) {
              monthly[date.getMonth()]++;
            }
          });
          setBookingData(monthly);
        }
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#1F9FD9", "#96d5f1"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      y: [
        { formatter: (val: number) => `$${val?.toLocaleString()}` },
        { formatter: (val: number) => `${val} bookings` },
      ],
    },
    xaxis: {
      type: "category",
      categories: MONTHS,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: [
      {
        labels: {
          style: { fontSize: "12px", colors: ["#6B7280"] },
          formatter: (val: number) => `$${val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}`,
        },
        title: { text: "" },
      },
      {
        opposite: true,
        labels: {
          style: { fontSize: "12px", colors: ["#6B7280"] },
        },
        title: { text: "" },
      },
    ],
  };

  const series = [
    {
      name: "Revenue ($)",
      data: loading ? new Array(12).fill(0) : salesData,
    },
    {
      name: "Bookings",
      data: loading ? new Array(12).fill(0) : bookingData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenue & Bookings
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monthly revenue vs. booking volume for the current year
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[310px]">
          <p className="text-gray-500 dark:text-gray-400">Loading statistics...</p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[600px] xl:min-w-full">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          </div>
        </div>
      )}
    </div>
  );
}
