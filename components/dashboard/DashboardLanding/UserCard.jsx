"use client";

import merchantCardBg from "@/assets/dashboard/merchant/merchant-bg.png";
import { useUser } from "@/context/UserContext";
import NetworkService from "@/network/service/networkService";
import { Icon } from "@iconify/react";
import { useState } from "react";

const UserCard = () => {
  const network = new NetworkService();
  const [copied, setCopied] = useState(false);
  const { user, loading } = useUser();

  const handleCopy = async () => {
    if (user?.user?.account_number) {
      await navigator.clipboard.writeText(user?.user?.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const SkeletonCard = () => (
    <div className="flex justify-between items-center gap-[10px]">
      <div>
        <div className="h-[20px] bg-gray-200 rounded-[5px] w-[120px] mb-[8px] animate-pulse"></div>
        <div className="h-[40px] bg-gray-200 rounded-xl w-[180px] mb-[15px] animate-pulse"></div>
      </div>
      <div className="h-[40px] bg-gray-200 rounded-[8px] w-[180px] animate-pulse"></div>
    </div>
  );
  return (
    <div
      className="bg-center bg-cover bg-no-repeat w-full rounded-[8px] relative"
      style={{ backgroundImage: `url(${merchantCardBg.src})` }}
    >
      <div className="p-[20px] sm:p-[30px]">
        {loading ? (
          <SkeletonCard />
        ) : (
          <div className="flex flex-wrap justify-between items-center gap-[16px]">
            <div>
              <p className="text-[20px] font-light text-white mb-0 sm:mb-[8px]">
                {user?.user?.greetings}
              </p>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-white">
                {user?.user?.full_name}
              </h2>
            </div>
            <div className="inline-flex items-center gap-[10px] bg-merchant-primary px-[14px] py-[10px] rounded-[8px]">
              <h6 className="text-[14px] font-bold text-white">
                MID: {user?.user?.account_number}
              </h6>
              <button className="copy-btn relative" onClick={handleCopy}>
                <Icon
                  icon="hugeicons:copy-01"
                  width="24"
                  height="24"
                  className="w-[16px] h-[16px] text-white"
                />
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
