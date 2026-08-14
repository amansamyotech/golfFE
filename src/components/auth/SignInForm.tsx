"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { loginUser } from "@/services/userService";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import * as Yup from "yup";



export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});


  // ✅ Define Yup schema
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const completeLogin = (response: any) => {
    const userData = response?.data?.data;
    const role = userData?.role;
    const allowedRoles = ["Admin", "SuperAdmin", "Manager", "Staff", "Member"];
    if (!allowedRoles.includes(role)) {
      toast.error("Access denied. Your role is not permitted.");
      return;
    }
    localStorage.setItem("token", response.data.additionalData);
    localStorage.setItem("user", JSON.stringify(userData));
    document.cookie = `auth-token=${response.data.additionalData}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `auth-user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=86400; SameSite=Lax`;
    window.location.href = "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await schema.validate({ email, password }, { abortEarly: false });

      const payload = { email, password };
      const response = await loginUser(payload);

      const resStatus = response?.data?.status;
      const resMsg = response?.data?.message || "Something went wrong.";


      if (resStatus === 201) {
        toast.success(resMsg);
        completeLogin(response);
      } else {
        toast.error("Unexpected response from server.");
      }

    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || "Login failed";

        if (status === 401) {
          toast.error("User is unauthorized. Please check your credentials.");
        } else if (status === 404) {
          toast.error("User not found.");
        } else if (status === 400) {
          toast.error("Invalid request.");
        } else if (status === 409) {
          toast.error("Conflict detected.");
        } else {
          toast.error(message);
        }
      }

      // ✅ Handle validation errors
      else if (err.name === "ValidationError") {
        const fieldErrors: Record<string, string> = {};
        err.inner.forEach((validationErr: any) => {
          if (validationErr.path) {
            fieldErrors[validationErr.path] = validationErr.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "Admin@123";

    setEmail(adminEmail);
    setPassword(adminPassword);
    setLoading(true);

    try {
      const payload = {
        email: adminEmail,
        password: adminPassword,
      };

      const response = await loginUser(payload);

      const resStatus = response?.data?.status;
      const resMsg = response?.data?.message || "Something went wrong.";

      if (resStatus === 201) {
        toast.success(resMsg);
        completeLogin(response);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      toast.error("Admin login failed.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-error-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-sm text-error-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* <div>
                <Button
                  className="w-full"
                  type="button"
                  onClick={handleAdminLogin}
                  disabled={loading}
                  variant="contained"
                  sx={{
                    backgroundColor: "#115293",
                    "&:hover": {
                      backgroundColor: "#1976d2",
                    },
                  }}
                >
                  {loading ? "Signing in..." : "Auto Login"}
                </Button>
              </div> */}

              <div>
                <Button variant="contained" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>


            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
