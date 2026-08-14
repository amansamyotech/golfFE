"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { changePassword } from "@/services/userService";
import { toast } from "react-toastify";

export default function ChangePasswordCard() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Please confirm your new password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser._id) {
          toast.error("User session not found. Please log in again.");
          return;
        }
        await changePassword(storedUser._id, {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toast.success("Password changed successfully");
        resetForm();
      } catch (error) {
        toast.error("Failed to change password. Please check your current password.");
        console.error("Change password error:", error);
      }
    },
  });

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Change Password
      </h4>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showCurrent ? "Hide" : "Show"}
              </button>
            </div>
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.currentPassword}</p>
            )}
          </div>

          <div>
            <Label>New Password</Label>
            <div className="relative">
              <Input
                name="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.newPassword}</p>
            )}
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ backgroundColor: "#1F9FD9" }}
          >
            {formik.isSubmitting ? "Saving..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
