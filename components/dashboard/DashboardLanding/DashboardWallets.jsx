"use client";

import withdrawIcon from "@/assets/dashboard/icon/withdraw-icon.svg";
import { useSettings } from "@/context/settingsContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { dynamicDecimals, getSettingValue } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define gradients array separately
const cardGradients = [
  "linear-gradient(122deg, #0da6c2 -22.05%, #4cd080 77.18%)",
  "linear-gradient(104deg, #0da6c2 9.19%, #0e39c6 112.14%)",
  "linear-gradient(122deg, #eabeff -22.05%, #bc30ff 77.18%)",
  "linear-gradient(310deg, #320daf -34.39%, #9327f0 81.12%)",
  "linear-gradient(310deg, #320daf -34.39%, #ffa577 81.12%)",
];

const DashboardWallets = () => {
  const networkService = new NetworkService();
  const [walletsCardsData, setWalletsCardsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();
  const currencySymbol = getSettingValue(settings, "currency_symbol");
  const siteCurrency = getSettingValue(settings, "site_currency");
  const siteCurrencyDecimals = getSettingValue(
    settings,
    "site_currency_decimals"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const dragThreshold = 50;

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % walletsCardsData.length);
  };

  const prevCard = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + walletsCardsData.length) % walletsCardsData.length
    );
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartY(e.type === "mousedown" ? e.clientY : e.touches[0].clientY);
    setCurrentY(e.type === "mousedown" ? e.clientY : e.touches[0].clientY);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const y = e.type === "mousemove" ? e.clientY : e.touches[0].clientY;
    setCurrentY(y);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const deltaY = currentY - startY;

    if (deltaY > dragThreshold) {
      prevCard();
    } else if (deltaY < -dragThreshold) {
      nextCard();
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  const fetchWalletsCardsData = async () => {
    try {
      setLoading(true);
      const response = await networkService.get(ApiPath.wallets);
      if (response?.status === "completed" && response?.data?.data?.wallets) {
        setWalletsCardsData(response.data.data.wallets);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletsCardsData();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-gray-200 w-full h-[250px] animate-pulse rounded-[8px]"></div>
  );

  return (
    <>
      <div className="border border-[rgba(26,32,44,0.16)] rounded-[8px] p-[20px]">
        <div className="w-full">
          <div className="flex justify-between items-center pb-[17px]">
            <h1 className="text-merchant-text text-[18px] font-bold">
              My Wallets
            </h1>
            <Link
              href="/dashboard/my-wallets"
              className="text-merchant-text text-[13px] font-semibold"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <SkeletonCard />
          ) : (
            <div className="w-full sm:w-2/3 xl:w-1/2 3xl:w-full mx-auto">
              <div
                className="relative h-[200px] sm:h-[220px] 4xl:h-[200px] mb-6 cursor-grab active:cursor-grabbing mt-7"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {walletsCardsData.map((wallet, index) => {
                  const position =
                    (index - currentIndex + walletsCardsData.length) %
                    walletsCardsData.length;
                  const isActive = position === 0;
                  const dragOffset =
                    isDragging && isActive ? (currentY - startY) * 0.3 : 0;
                  let transform = "";
                  let zIndex = walletsCardsData.length - position;
                  let opacity = 1;

                  if (position === 0) {
                    transform = `translateY(${dragOffset}px) scale(1)`;
                  } else if (position === 1) {
                    transform = `translateY(${
                      -22 + dragOffset * 0.5
                    }px) scale(0.90)`;
                    opacity = 0.7;
                  } else if (position === 2) {
                    transform = `translateY(${
                      -44 + dragOffset * 0.3
                    }px) scale(0.8)`;
                    opacity = 0.4;
                  } else {
                    transform = `translateY(${
                      -45 + dragOffset * 0.1
                    }px) scale(0.85)`;
                    opacity = 0;
                  }
                  const gradient = cardGradients[index % cardGradients.length];
                  return (
                    <div
                      key={wallet.id}
                      className={`absolute inset-0 transition-all ease-out ${
                        isDragging ? "duration-0" : "duration-500"
                      }`}
                      style={{
                        transform,
                        zIndex,
                        opacity,
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div
                        className="rounded-[12px] p-[18px] h-full"
                        style={{
                          background: gradient,
                        }}
                      >
                        <div className="flex justify-between items-start mb-[20px]">
                          <div>
                            <h2 className="text-white text-[18px] font-bold mb-[5px]">
                              {wallet.name}
                            </h2>
                            <p className="text-white text-[16px] font-medium">
                              {wallet.code}
                            </p>
                          </div>
                          <div>
                            {wallet?.is_default ? (
                              <div className="h-[24px] w-[24px] rounded-full border-2 border-white flex items-center justify-center">
                                <p className="text-white text-[13px] font-bold">
                                  $
                                </p>
                              </div>
                            ) : (
                              <div className="w-[24px] h-[24px]">
                                <Image
                                  src={wallet.icon}
                                  alt="arrow"
                                  width={100}
                                  height={100}
                                  unoptimized
                                  className="w-full h-full rounded-full"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-[20px]">
                          <div>
                            <p className="text-white text-[18px] font-bold">
                              {wallet.symbol}{" "}
                              {parseFloat(wallet.balance).toFixed(
                                dynamicDecimals({
                                  currencyCode: wallet?.code,
                                  siteCurrencyCode: siteCurrency,
                                  siteCurrencyDecimals: siteCurrencyDecimals,
                                  isCrypto: wallet?.is_crypto,
                                })
                              )}{" "}
                              {wallet.code}
                            </p>
                          </div>

                          <Link
                            href={`/dashboard/withdraw`}
                            className="bg-[rgba(0,0,0,0.16)] h-[32px] inline-flex items-center justify-center gap-1 px-[8px] rounded-[8px] text-[14px] font-bold text-white"
                          >
                            <Image
                              src={withdrawIcon}
                              alt="withdraw"
                              width={100}
                              height={100}
                              className="w-[14px] h-[14px]"
                            />
                            Withdraw
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex gap-2">
                  {walletsCardsData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "w-8 bg-[#4CD080]"
                          : "w-2 bg-[#4CD080]/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardWallets;
