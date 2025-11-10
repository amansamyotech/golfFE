"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { getAllCustomer } from "@/services/customerService";
import { getBooking } from "@/services/bookingService";


export const EcommerceMetrics = () => {
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [bookingStats, setBookingStats] = useState<any>({
    total: 0,
    complete: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomer() as any[];
      const customers = response || [];
      setCustomerCount(customers.length);
      const active = customers.filter(
        (c: any) => c.status === "ACTIVE"
      ).length;
      setActiveCount(active);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBooking() as any[];
      const bookings = response || [];
      const total = bookings.length;
      const complete = bookings.filter((b: any) => b.bookingStatus === "completed").length;
      setBookingStats({ total, complete });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchCustomers();
    fetchBookings();
  }, []);

  const activePercent =
    customerCount > 0 ? ((activeCount / customerCount) * 100).toFixed(2) : "0.00";

  const completedPercent =
    bookingStats.total > 0
      ? ((bookingStats.complete / bookingStats.total) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Customers & Activity %
            </span>
            {/* <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              3,782
            </h4> */}
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "Loading..." : customerCount?.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {activePercent}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {/* Orders */}
              Total Bookings & Completed %
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {/* 5,359 */}
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {loading ? "Loading..." : bookingStats.total.toLocaleString()}
              </h4>
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            {/* 9.05% */}
            {completedPercent}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
