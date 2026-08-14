"use client";
import React, { useEffect, useState } from "react";
import { getBooking } from "@/services/bookingService";
import Link from "next/link";

interface Booking {
  _id: string;
  customerId?: { name?: string; role?: string };
  name?: string;
  bookingStatus?: string;
  bookingType?: string;
  startDateTime?: string;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
};

export default function PendingTasks() {
  const [tasks, setTasks] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = (await getBooking()) as Booking[];
        const pending = res
          .filter((b) => b.bookingStatus === "pending" || b.bookingStatus === "confirmed")
          .slice(0, 6);
        setTasks(pending);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">Pending Tasks</h3>
        <Link href="/tee-time-management" className="text-xs text-brand-500 hover:underline font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No pending tasks</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => {
            const name = task.customerId?.name || task.name || "Guest";
            const status = task.bookingStatus || "pending";
            const type = task.bookingType
              ? task.bookingType.charAt(0).toUpperCase() + task.bookingType.slice(1)
              : "Booking";
            return (
              <li
                key={task._id}
                className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-brand-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {name} — {type}
                  </span>
                </div>
                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[status] || "bg-gray-100 text-gray-600"}`}
                >
                  {status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
