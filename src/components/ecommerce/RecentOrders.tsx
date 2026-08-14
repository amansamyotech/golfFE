"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { getAllPayments } from "@/services/paymentService";

export default function RecentOrders() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = (await getAllPayments()) as any[];
        const sorted = (data || [])
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8);
        setPayments(sorted);
      } catch (e) {
        console.error("Error fetching payments:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const fmtAmount = (n: number) =>
    `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Transactions
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest 8 payment records</p>
        </div>
        <Link
          href="/payment-management"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          View All
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-400 py-8 text-sm">Loading transactions...</p>
        ) : payments.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No transactions found.</p>
        ) : (
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Date
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Mode
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Total
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Paid
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Pending
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {payments.map((p: any) => (
                <TableRow key={p._id}>
                  <TableCell className="py-3 text-gray-600 text-theme-sm dark:text-gray-400">
                    {fmtDate(p.createdAt)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-600 text-theme-sm dark:text-gray-400 capitalize">
                    {p.paymentMode}
                  </TableCell>
                  <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                    {fmtAmount(p.totalAmount)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-600 text-theme-sm dark:text-gray-400">
                    {fmtAmount(p.paidAmount)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-600 text-theme-sm dark:text-gray-400">
                    {fmtAmount(p.pendingAmount)}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={
                        p.status === "success"
                          ? "success"
                          : p.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {p.status === "success" ? "Paid" : p.status === "pending" ? "Pending" : "Failed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
