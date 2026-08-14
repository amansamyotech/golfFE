"use client";
import React, { useEffect, useState } from "react";
import { getAllPayments } from "@/services/paymentService";
import Link from "next/link";

interface Payment {
  _id: string;
  customerId?: { name?: string; email?: string };
  totalAmount?: number;
  paidAmount?: number;
  status?: string;
  createdAt?: string;
  paymentMode?: string;
}

const statusStyle: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  partial: "bg-orange-100 text-orange-700",
};

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsWidget() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = (await getAllPayments()) as Payment[];
        setItems(res.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">Notifications</h3>
        <Link href="/payment-management" className="text-xs text-brand-500 hover:underline font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const name = item.customerId?.name || "Unknown";
            const amount = item.paidAmount ?? item.totalAmount ?? 0;
            const status = item.status || "pending";
            return (
              <li
                key={item._id}
                className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-brand-500" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      Payment from <span className="font-medium">{name}</span>
                    </p>
                    <p className="text-xs text-gray-400">${amount.toLocaleString()} · {timeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyle[status] || "bg-gray-100 text-gray-600"}`}
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
