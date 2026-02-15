"use client";
import withdrawIcon from "@/assets/dashboard/icon/withdraw-icon.svg";
import walletBg1 from "@/assets/dashboard/wallets-bg/wallet-bg-1.png";
import walletBg2 from "@/assets/dashboard/wallets-bg/wallet-bg-2.png";
import walletBg3 from "@/assets/dashboard/wallets-bg/wallet-bg-3.png";
import walletBg4 from "@/assets/dashboard/wallets-bg/wallet-bg-4.png";
import walletBg5 from "@/assets/dashboard/wallets-bg/wallet-bg-5.png";
import AddWalletModal from "@/components/common/AddWalletModal";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/context/settingsContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { dynamicDecimals, getSettingValue } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MyWallets = () => {
  const networkService = new NetworkService();
  const [walletsCardsData, setWalletsCardsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  const [deleteWalletLoading, setDeleteWalletLoading] = useState(false);
  const { settings } = useSettings();
  const currencySymbol = getSettingValue(settings, "currency_symbol");
  const siteCurrency = getSettingValue(settings, "site_currency");
  const siteCurrencyDecimals = getSettingValue(
    settings,
    "site_currency_decimals"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const walletBackgrounds = [
    walletBg1,
    walletBg2,
    walletBg3,
    walletBg4,
    walletBg5,
  ];

  // fetch wallets
  const fetchWalletsCardsData = async () => {
    try {
      setLoading(true);
      const response = await networkService.get(ApiPath.wallets);
      setWalletsCardsData(response.data.data.wallets);
    } finally {
      setLoading(false);
    }
  };

  // fetch all currency list
  const fetchCurrencyList = async () => {
    try {
      const res = await networkService.globalGet(ApiPath.allCurrency);
      if (res.status === "completed") {
        setCurrencies(res.data.data);
      }
    } finally {
    }
  };

  // add new wallet
  const handleAddWallet = async (selectedCurrencyId) => {
    if (!selectedCurrencyId) return;
    setCreateWalletLoading(true);
    try {
      const res = await networkService.post(ApiPath.wallets, {
        currency_id: selectedCurrencyId,
      });
      if (res.status === "completed") {
        setShowAddModal(false);
        setSelectedCurrencyId("");
        await fetchWalletsCardsData();
        toast.success("Wallet created successfully!");
      }
    } finally {
      setCreateWalletLoading(false);
    }
  };

  // delete wallet
  const handleDeleteWallet = async () => {
    setDeleteWalletLoading(true);
    try {
      const res = await networkService.delete(
        ApiPath.deleteWallet(walletToDelete)
      );

      if (res.status === "completed") {
        setShowDeleteModal(false);
        setWalletToDelete(null);
        fetchWalletsCardsData();
        toast.success(res.data.message);
      }
    } finally {
      setDeleteWalletLoading(false);
    }
  };

  const selectedCurrency = selectedCurrencyId
    ? currencies.find((w) => String(w.id) === String(selectedCurrencyId))
    : null;

  // console.log("selectedCurrency", selectedCurrency);

  useEffect(() => {
    fetchWalletsCardsData();
    fetchCurrencyList();
  }, []);

  const SkeletonCard = () => (
    <div className="relative w-[100%] animate-pulse">
      <div className="h-[190px] rounded-[8px] bg-gray-200 p-[24px]">
        <div className="flex gap-[10px] items-center">
          <div className="flex flex-col gap-2">
            <div className="h-[14px] w-[100px] bg-gray-300 rounded"></div>
            <div className="h-[12px] w-[60px] bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="mt-[20px] h-[18px] w-[150px] bg-gray-300 rounded"></div>

        <div className="mt-[30px] flex items-center gap-[10px]">
          <div className="h-[26px] w-[70px] bg-gray-300 rounded-sm"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-[8px] p-[20px] sm:p-[30px] border border-[rgba(26,32,44,0.16)]">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-[30px]">
          <h4 className="text-[24px] font-semibold text-merchant-text">
            My Wallet
          </h4>
          <div>
            <button
              className="primary-button-3"
              onClick={() => {
                setShowAddModal(true);
              }}
            >
              <Icon icon="basil:add-outline" width="24" height="24" />
              Add Wallet
            </button>
          </div>
        </div>
        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-[30px]">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            ) : (
              <>
                {walletsCardsData?.map((wallet, index) => (
                  <div
                    className="bg-center bg-cover bg-no-repeat rounded-[8px] p-[18px] relative"
                    style={{
                      backgroundImage: `url(${
                        walletBackgrounds[index % walletBackgrounds.length].src
                      })`,
                    }}
                  >
                    <div className="flex justify-between items-start mb-[24px]">
                      <div>
                        <h6 className="text-[16px] font-bold text-white mb-0.5">
                          {wallet.name}
                        </h6>
                        <p className="text-[14px] font-medium text-white">
                          {wallet.code}
                        </p>
                      </div>
                      <div>
                        {wallet.is_default ? (
                          <div className="symbol h-[26px] w-[26px] border-2 border-white rounded-full flex items-center justify-center">
                            <p className="text-white text-[12px] font-bold">
                              {currencySymbol}
                            </p>
                          </div>
                        ) : (
                          <div className="icon-image">
                            <Image
                              src={wallet.icon}
                              alt="wallet"
                              width={100}
                              height={100}
                              unoptimized
                              className="w-[24px] h-[24px]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-[16px] sm:text-[20px] font-bold text-white mb-[33px]">
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
                    </h3>
                    <div className="flex items-start sm:items-center flex-col sm:flex-row gap-2 sm:gap-[16px]">
                      <Link
                        href="/dashboard/withdraw"
                        className="text-[10px] sm:text-[12px] font-bold text-white flex items-center gap-1 h-[30px] px-[12px] rounded-[4px] bg-[rgba(12,3,16,0.16)]"
                      >
                        <Image
                          src={withdrawIcon}
                          alt="top up"
                          width={16}
                          height={16}
                        />
                        Withdraw
                      </Link>
                    </div>
                    {!wallet.is_default && (
                      <button
                        className="absolute bottom-[18px] right-[18px] h-[30px] rounded-[4px] bg-merchant-error flex items-center justify-center cursor-pointer text-[12px] font-bold text-white px-[10px]"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setWalletToDelete(wallet.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Wallet Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete!"
        footer={
          <>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="group primary-button primary-button-md primary-border w-full"
            >
              <span className="primary-button-hover-effect"></span>
              <span className="primary-button-text">Cancel</span>
            </button>
            <button
              onClick={handleDeleteWallet}
              className="group primary-button primary-button-md error-color-btn w-full"
              disabled={deleteWalletLoading}
            >
              <span className="primary-button-hover-effect error-button-hover-effect"></span>
              <span className="primary-button-text">
                {deleteWalletLoading ? "Deleting..." : "Delete"}
              </span>
            </button>
          </>
        }
      >
        <p className="text-center">
          Are you sure you want to delete this wallet?
        </p>
      </DeleteConfirmationModal>

      {/* Add Wallet Modal */}
      <AddWalletModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Wallet"
        footer={
          <>
            <button
              onClick={() => handleAddWallet(selectedCurrencyId)}
              disabled={!selectedCurrencyId}
              className="group primary-button w-full"
              disabled={createWalletLoading}
            >
              <span className="primary-button-hover-effect"></span>
              <span className="primary-button-text">
                {createWalletLoading ? "Creating..." : "Create"}
              </span>
            </button>
          </>
        }
      >
        <div className="relative">
          <Select
            onValueChange={(value) => setSelectedCurrencyId(value)}
            value={selectedCurrencyId || ""}
          >
            <div className="absolute left-[16px] top-1/2 -translate-y-1/2 z-10">
              {selectedCurrency ? (
                selectedCurrency.is_default ? (
                  <div className="symbol h-[20px] w-[20px] border border-[#9E9A9F] rounded-full flex items-center justify-center bg-user-primary">
                    <p className="text-[#9E9A9F] text-[12px] font-bold">
                      {currencySymbol}
                    </p>
                  </div>
                ) : (
                  <Image
                    src={selectedCurrency.icon}
                    alt="wallet"
                    width={24}
                    height={24}
                    unoptimized
                    className="w-[18px] h-[18px] rounded-full"
                  />
                )
              ) : (
                <Icon
                  icon="hugeicons:wallet-01"
                  width="24"
                  height="24"
                  className="w-[18px] h-[18px] text-[#9E9A9F]"
                />
              )}
            </div>
            <div className="absolute left-[16px] top-[-12px]">
              <span className="text-[13px] text-[rgba(26,32,44,0.60)] font-semibold bg-white px-[10px]">
                Currency
              </span>
            </div>
            <SelectTrigger className="w-full !h-[52px] border-2 border-[rgba(26,32,44,0.10)] text-agent-text focus:outline-none focus:shadow-outline pl-[42px]">
              <SelectValue
                placeholder="Select Currency"
                aria-label={
                  selectedCurrency
                    ? `${selectedCurrency.name} (${selectedCurrency.formatted_balance} ${selectedCurrency.code})`
                    : ""
                }
              >
                {selectedCurrency && (
                  <span>
                    {selectedCurrency.name} (
                    {selectedCurrency.formatted_balance} {selectedCurrency.code}
                    )
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Currencies</SelectLabel>
                {currencies
                  ?.filter(
                    (currency) =>
                      !walletsCardsData?.some(
                        (wallet) => wallet.code === currency.code
                      )
                  )
                  .map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id.toString()}
                      textValue={`${currency.name} (${currency.formatted_balance} ${currency.code})`}
                    >
                      <div className="flex items-center gap-2 w-full select-image-icon">
                        <div className="image-or-icon">
                          {currency.is_default ? (
                            <div className="symbol h-[20px] w-[20px] border border-[#9E9A9F] rounded-full flex items-center justify-center bg-user-primary">
                              <p className="text-[#9E9A9F] text-[12px] font-bold">
                                {currencySymbol}
                              </p>
                            </div>
                          ) : (
                            <Image
                              src={currency?.icon}
                              alt="wallet"
                              width={24}
                              height={24}
                              unoptimized
                              className="w-[18px] h-[18px] rounded-full"
                            />
                          )}
                        </div>
                        <div>
                          {currency.name} ({currency.formatted_balance}{" "}
                          {currency.code})
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </AddWalletModal>
    </>
  );
};

export default MyWallets;
