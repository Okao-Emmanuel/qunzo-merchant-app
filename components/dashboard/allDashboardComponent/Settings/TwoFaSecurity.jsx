"use client";

import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const TwoFaSecurity = () => {
  const network = new NetworkService();
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  const fetchTwoFAStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await network.get(ApiPath.user, { google2fa_secret: 1 });
      if (res.status === "completed") {
        setUserData(res.data.data.user);
      }
    } catch (error) {
      toast.error("Failed to fetch 2FA status.");
    } finally {
      setLoading(false);
    }
  }, [network]);

  useEffect(() => {
    const loadData = async () => {
      await fetchTwoFAStatus();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (userData?.google2fa_secret) {
      // console.log("2FA secret exists:", userData.google2fa_secret);
      handleGenerateQrCode();
    }
  }, [userData]);

  const handleGenerateQrCode = async () => {
    setLoading(true);
    try {
      const res = await network.post(ApiPath.qrCodeGenerate, {});
      if (res.status === "completed") {
        setQrCode(res.data.data.qr_code);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!pin) return toast.error("Please enter the PIN.");
    if (pin.length !== 6) return toast.error("PIN must be 6 digits.");
    setLoading(true);
    try {
      const res = await network.post(ApiPath.enable2FA, {
        one_time_password: pin,
      });
      if (res.status === "completed") {
        toast.success("2FA enabled successfully!");
        setPin("");
        setQrCode(null);
        await fetchTwoFAStatus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!password) return toast.error("Please enter your password.");
    setLoading(true);
    try {
      const res = await network.post(ApiPath.disable2FA, {
        one_time_password: password,
      });
      if (res.status === "completed") {
        toast.success("2FA disabled successfully!");
        setPassword("");
        await fetchTwoFAStatus();
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 w-[200px] bg-gray-300 rounded mb-3"></div>
        <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.16)]">
          <div className="max-w-[614px] mx-auto border border-[rgba(26,32,44,0.16)] p-[10px] sm:p-[20px] rounded-[8px]">
            <div className="animate-pulse space-y-4 max-w-md">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-40 bg-gray-200 rounded-xl"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userData?.two_fa === true) {
    return (
      <div>
        <h3 className="text-merchant-text font-semibold text-xl mb-3">
          2FA is enabled
        </h3>
        <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.16)]">
          <div className="max-w-[614px] mx-auto border border-[rgba(26,32,44,0.16)] p-[10px] sm:p-[20px] rounded-[8px]">
            <div className="mb-8 max-w-md">
              <div className="relative w-full">
                <input
                  type="password"
                  id="publicKey"
                  className={`user-input peer w-full`}
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="publicKey"
                  className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[10px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                >
                  Enter password to disable 2FA{" "}
                  <span className="text-merchant-error">*</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleDisable2FA}
              className="group primary-button primary-error-btn"
            >
              <span className="primary-button-hover-effect primary-button-hover-effect-error"></span>
              <span className="primary-button-text">Disable 2FA</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData?.google2fa_secret && !qrCode) {
    return (
      <div>
        <p className="text-merchant-text font-semibold text-xl mb-3">
          2FA Authentication
        </p>
        <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.16)]">
          <div className="max-w-[614px] mx-auto border border-[rgba(26,32,44,0.16)] p-[10px] sm:p-[20px] rounded-[8px]">
            <p className="text-merchant-paragraph font-medium text-base mb-8 max-w-4xl">
              Two Factor Authentication (2FA) strengthens access security by
              requiring two methods to verify your identity.
            </p>
            <button
              className="group primary-button"
              onClick={handleGenerateQrCode}
            >
              <span className="primary-button-hover-effect"></span>
              <span className="primary-button-text">Generate QR Code</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-merchant-text font-semibold text-xl mb-3">
        2FA Authentication
      </p>
      <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.16)]">
        <div className="max-w-[614px] mx-auto border border-[rgba(26,32,44,0.16)] p-[10px] sm:p-[20px] rounded-[8px]">
          <p className="text-merchant-paragraph font-medium text-base mb-8 max-w-4xl">
            Scan the QR code with Google Authenticator App to enable 2FA.
          </p>
          {qrCode && (
            <div
              className="inline-block mb-8 border border-merchant-input-border rounded-xl overflow-hidden"
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
          )}
          <div className="mb-8 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                id="publicKey"
                className={`user-input peer w-full`}
                placeholder=" "
                vvalue={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <label
                htmlFor="publicKey"
                className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[10px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
              >
                Enter 6-digit PIN <span className="text-merchant-error">*</span>
              </label>
            </div>
          </div>
          <button
            type="button"
            className="group primary-button"
            onClick={handleEnable2FA}
          >
            <span className="primary-button-hover-effect"></span>
            <span className="primary-button-text">Enable 2FA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFaSecurity;
