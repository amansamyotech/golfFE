"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, GroupIcon } from "@/icons";
import { getAllCustomer } from "@/services/customerService";
import { getBooking } from "@/services/bookingService";
import { getAllCourses } from "@/services/courseService";
import { getAllStaff } from "@/services/staffService";
import { getAllPayments } from "@/services/paymentService";

const StatCard = ({
  title,
  value,
  sub,
  badge,
  icon,
}: {
  title: string;
  value: string | number;
  sub?: string;
  badge?: { color: "success" | "error" | "warning" | "info"; label: string };
  icon: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/10">
        {icon}
      </div>
      {badge && (
        <Badge color={badge.color}>
          <ArrowUpIcon />
          {badge.label}
        </Badge>
      )}
    </div>
    <div className="mt-5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
        {value}
      </h4>
      {sub && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  </div>
);

export const EcommerceMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newMembers: 0,
    totalCourses: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalStaff: 0,
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [customers, bookings, courses, staff, payments] = await Promise.allSettled([
          getAllCustomer() as Promise<any[]>,
          getBooking() as Promise<any[]>,
          getAllCourses() as Promise<any[]>,
          getAllStaff() as Promise<any[]>,
          getAllPayments() as Promise<any[]>,
        ]);

        const customerList = customers.status === "fulfilled" ? customers.value || [] : [];
        const bookingList = bookings.status === "fulfilled" ? bookings.value || [] : [];
        const courseList = courses.status === "fulfilled" ? courses.value || [] : [];
        const staffList = staff.status === "fulfilled" ? staff.value || [] : [];
        const paymentList = payments.status === "fulfilled" ? payments.value || [] : [];

        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeMembers = customerList.filter((c: any) => c.status === "ACTIVE").length;
        const newMembers = customerList.filter((c: any) => {
          const created = new Date(c.createdAt);
          return created >= thirtyDaysAgo;
        }).length;

        const upcomingBookings = bookingList.filter((b: any) => new Date(b.startDateTime) > now).length;
        const completedBookings = bookingList.filter((b: any) => b.bookingStatus === "completed" || new Date(b.endDateTime) < now).length;

        const totalRevenue = paymentList
          .filter((p: any) => p.status === "success")
          .reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0);

        setStats({
          totalMembers: customerList.length,
          activeMembers,
          newMembers,
          totalCourses: courseList.length,
          upcomingBookings,
          completedBookings,
          totalRevenue,
          totalStaff: staffList.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const fmt = (n: number) => (loading ? "—" : n.toLocaleString());
  const fmtCurrency = (n: number) =>
    loading ? "—" : `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const MembersIcon = () => (
    <svg className="size-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
  const ActiveIcon = () => (
    <svg className="size-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
  const CourseIcon = () => (
    <svg className="size-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21V7l9-4 9 4v14M3 21h18M12 3v18M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  );
  const BookingIcon = () => (
    <svg className="size-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  const RevenueIcon = () => (
    <svg className="size-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  const StaffIcon = () => (
    <svg className="size-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6a4 4 0 11-8 0 4 4 0 018 0zM12 14v7" />
    </svg>
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <StatCard
        title="Total Members"
        value={fmt(stats.totalMembers)}
        sub={`${fmt(stats.newMembers)} new this month`}
        badge={{ color: "success", label: `${stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}% active` }}
        icon={<MembersIcon />}
      />
      <StatCard
        title="Active Members"
        value={fmt(stats.activeMembers)}
        sub={`of ${fmt(stats.totalMembers)} total`}
        icon={<ActiveIcon />}
      />
      <StatCard
        title="Golf Courses"
        value={fmt(stats.totalCourses)}
        sub="Active USA locations"
        icon={<CourseIcon />}
      />
      <StatCard
        title="Upcoming Bookings"
        value={fmt(stats.upcomingBookings)}
        sub={`${fmt(stats.completedBookings)} completed`}
        icon={<BookingIcon />}
      />
      <StatCard
        title="Total Revenue"
        value={fmtCurrency(stats.totalRevenue)}
        sub="All time payments"
        icon={<RevenueIcon />}
      />
      <StatCard
        title="Staff Members"
        value={fmt(stats.totalStaff)}
        sub="Across all departments"
        icon={<StaffIcon />}
      />
      <StatCard
        title="New Members"
        value={fmt(stats.newMembers)}
        sub="Last 30 days"
        badge={{ color: "success", label: "This month" }}
        icon={<MembersIcon />}
      />
      <StatCard
        title="Total Bookings"
        value={fmt(stats.upcomingBookings + stats.completedBookings)}
        sub={`${fmt(stats.upcomingBookings)} upcoming`}
        icon={<BookingIcon />}
      />
    </div>
  );
};
