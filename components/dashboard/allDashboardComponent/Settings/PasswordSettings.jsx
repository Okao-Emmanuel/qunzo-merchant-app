"use client";

import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const PasswordSettings = () => {
  const network = new NetworkService();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleValidated = () => {
    if (currentPassword === "") {
      toast.error("Current password is required.");
      return false;
    }
    if (newPassword === "") {
      toast.error("New password is required.");
      return false;
    }
    if (confirmPassword === "") {
      toast.error("Confirm password is required.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    if (newPassword === currentPassword) {
      toast.error("New password cannot be same as current password.");
      return false;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return false;
    }

    return true;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!handleValidated()) return;

    try {
      setLoading(true);
      const requestBody = {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      };
      const res = await network.post(ApiPath.changePassword, requestBody);
      if (res.status === "completed") {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[20px] font-bold text-merchant-text mb-[32px]">
        Change Password
      </h2>
      <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.16)]">
        <div className="max-w-[514px] mx-auto border border-[rgba(26,32,44,0.16)] p-[20px] rounded-[8px]">
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="password"
                  id="current_password"
                  className={`user-input peer`}
                  placeholder=" "
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <label
                  htmlFor="current_password"
                  className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                >
                  Current Password{" "}
                  <span className="text-merchant-error">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="new_password"
                  className={`user-input peer`}
                  placeholder=" "
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label
                  htmlFor="new_password"
                  className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                >
                  New Password <span className="text-merchant-error">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="confirm_password"
                  className={`user-input peer`}
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label
                  htmlFor="confirm_password"
                  className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                >
                  Confirm Password{" "}
                  <span className="text-merchant-error">*</span>
                </label>
              </div>

              <div className="flex items-center gap-3 mt-[30px]">
                <Link
                  href="/dashboard/settings"
                  className="group primary-button secondary-color-btn w-full"
                >
                  <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
                  <span className="primary-button-text">Back</span>
                </Link>
                <button
                  className="group primary-button w-full"
                  type="submit"
                  disabled={loading}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">
                    {loading ? "Changing..." : "Change Password"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettings;
