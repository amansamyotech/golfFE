"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getUserProfile } from "@/services/userService";
import { getStaffByEmail } from "@/services/staffService";

interface ProfileUser {
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface StaffProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  jobTitle?: string;
  department?: string;
  role?: string;
  profileImg?: string;
  availabilityStatus?: string;
}

export default function UserMetaCard() {
  const [user, setUser] = useState<ProfileUser>({});
  const [staff, setStaff] = useState<StaffProfile | null>(null);

  const fetchData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!storedUser?._id) return;

      const response = (await getUserProfile(storedUser._id)) as ProfileUser;
      setUser(response || {});

      const role = response?.role || storedUser.role;
      if ((role === "Staff" || role === "Manager") && (response?.email || storedUser.email)) {
        try {
          const staffData = (await getStaffByEmail(
            response?.email || storedUser.email
          )) as StaffProfile | null;
          if (staffData) setStaff(staffData);
        } catch (err) {
          console.error("Failed to fetch staff profile:", err);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayName = staff?.name
    || [user.firstName, user.lastName].filter(Boolean).join(" ")
    || "User";
  const displayRole = staff?.role || user.role || "-";
  const displayJob = staff?.jobTitle || "";
  const displayAddress = staff?.address || user.address || "";
  const imgSrc = staff?.profileImg
    ? `${process.env.NEXT_PUBLIC_API_IMG_URL}${staff.profileImg}`
    : "/images/user/owner.jpg";

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image
              width={80}
              height={80}
              src={imgSrc}
              alt={displayName}
              className="object-cover w-full h-full"
              unoptimized={!!staff?.profileImg}
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {displayName}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {displayRole}
                {displayJob ? ` · ${displayJob}` : ""}
              </p>
              {displayAddress && (
                <>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {displayAddress}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
