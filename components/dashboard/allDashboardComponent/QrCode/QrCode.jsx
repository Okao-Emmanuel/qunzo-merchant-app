"use client";

import { useUser } from "@/context/UserContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const QrCode = () => {
  const network = new NetworkService();
  const [qrCode, setQrCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { user } = useUser();

  // fetch qr code
  const fetchQrCode = async () => {
    try {
      const res = await network.get(ApiPath.qrCode);
      if (res.status === "completed") {
        setQrCode(res.data.data);
      }
    } finally {
    }
  };

  // download the qr code
  const downloadSVG = () => {
    const blob = new Blob([qrCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // handle copy
  const handleCopy = async () => {
    if (user?.user?.account_number) {
      await navigator.clipboard.writeText(user?.user?.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  useEffect(() => {
    fetchQrCode();
  }, []);

  const SkeletonCard = () => (
    <div className="flex flex-col items-center">
      <div className="w-[250px] h-[250px] bg-gray-200 rounded-lg mb-[30px] animate-pulse"></div>
      <div className="h-[52px] w-[80%] rounded-[8px] bg-gray-200 gap-[16px] px-[16px] mb-[40px] animate-pulse"></div>
      <div className="w-full h-[48px] bg-gray-200 rounded-[8px] animate-pulse"></div>
    </div>
  );

  return (
    <div>
      <h2 className="text-[20px] font-bold text-merchant-text mb-[32px]">
        My QR Code
      </h2>
      <div className="bg-white rounded-[8px] px-[20px] py-[20px] sm:py-[80px] border border-[rgba(26,32,44,0.16)]">
        <div className="max-w-[256px] mx-auto">
          {qrCode ? (
            <div className="flex flex-col items-center w-full">
              <div className="border border-[rgba(26,32,44,0.16)] w-full p-[16px] rounded-[8px] mb-[23px]">
                <div className="bg-white rounded-lg">
                  <div
                    className="w-full h-full svg-container"
                    dangerouslySetInnerHTML={{ __html: qrCode }}
                  />
                </div>
              </div>
              <div className="h-[52px] rounded-[8px] bg-[#EFFAF3] flex justify-center gap-[16px] items-center px-[16px] mb-[23px] relative">
                <p className="text-[16px] font-semibold text-merchant-text">
                  MID: {user?.user?.account_number}
                </p>
                <button
                  className="copy-btn relative cursor-pointer"
                  onClick={handleCopy}
                >
                  <Icon icon="basil:copy-outline" width="20" height="20" />
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={downloadSVG}
                className="group primary-button w-full"
              >
                <span className="primary-button-hover-effect"></span>
                <span className="primary-button-text">Download</span>
              </button>
            </div>
          ) : (
            <>
              <SkeletonCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrCode;
