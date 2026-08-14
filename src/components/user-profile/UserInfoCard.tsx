"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { getUserProfile, editUserProfileData } from "@/services/userService";
import { getStaffByEmail } from "@/services/staffService";
import * as Yup from "yup";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
}

interface StaffProfile {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  jobTitle?: string;
  department?: string;
  employmentType?: string;
  dateOfJoining?: string;
  workShift?: string;
  salary?: number | string;
  role?: string;
  availabilityStatus?: string;
  profileImg?: string;
}

const formatLabel = (value?: string) => {
  if (!value) return "-";
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<User>({});
  const [staff, setStaff] = useState<StaffProfile | null>(null);

  const fetchData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!storedUser?._id) return;

      const response = (await getUserProfile(storedUser._id)) as User;
      setUser(response || {});

      const role = response?.role || storedUser.role;
      if ((role === "Staff" || role === "Manager") && (response?.email || storedUser.email)) {
        try {
          const staffData = (await getStaffByEmail(
            response?.email || storedUser.email
          )) as StaffProfile | null;
          if (staffData) {
            setStaff(staffData);
          }
        } catch (err) {
          console.error("Failed to fetch staff profile:", err);
        }
      } else {
        setStaff(null);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || staff?.phone || "",
      address: user?.address || staff?.address || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string(),
      address: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser._id) throw new Error("User ID not found");
        await editUserProfileData(storedUser._id, values);
        await fetchData();
        closeModal();
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    },
  });

  const isStaffProfile = !!staff;
  const canEditProfile = user?.role === "Admin" || user?.role === "SuperAdmin";

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {isStaffProfile ? "Staff Information" : "Personal Information"}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {isStaffProfile ? (
              <>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{staff?.name || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{staff?.email || user?.email || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{staff?.phone || user?.phone || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formatLabel(staff?.gender)}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{staff?.address || user?.address || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{staff?.role || user?.role || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Job Title</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{staff?.jobTitle || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formatLabel(staff?.department)}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Employment Type</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formatLabel(staff?.employmentType)}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Date of Joining</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {staff?.dateOfJoining ? moment(staff.dateOfJoining).format("DD MMM YYYY") : "-"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Work Shift</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formatLabel(staff?.workShift)}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Salary</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {staff?.salary !== undefined && staff?.salary !== null && staff?.salary !== ""
                      ? staff.salary
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Availability</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatLabel(staff?.availabilityStatus)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.firstName || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.lastName || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email address</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.email || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.phone || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.address || "-"}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.role || "-"}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {canEditProfile && (
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-5">
            <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>First Name</Label>
                  <Input name="firstName" type="text" value={formik.values.firstName} onChange={formik.handleChange} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Last Name</Label>
                  <Input name="lastName" type="text" value={formik.values.lastName} onChange={formik.handleChange} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Email Address</Label>
                  <Input name="email" type="text" value={formik.values.email} onChange={formik.handleChange} disabled />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Phone</Label>
                  <Input name="phone" type="text" value={formik.values.phone} onChange={formik.handleChange} />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input name="address" type="text" value={formik.values.address} onChange={formik.handleChange} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={closeModal}>
                Close
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
