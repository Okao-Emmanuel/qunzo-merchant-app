"use client";

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
import { getSettingValue } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddWithdrawAccount = () => {
  const network = new NetworkService();
  const router = useRouter();
  const [wallets, setWallets] = useState([]);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [selectWallet, setSelectWallet] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState([]);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [selectMethodId, setSelectMethodId] = useState("");
  const [selectMethod, setSelectMethod] = useState(null);
  const [manualFields, setManualFields] = useState({});
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();
  const currencySymbol = getSettingValue(settings, "currency_symbol");

  // fetch wallets
  const walletsData = async () => {
    try {
      setWalletsLoading(true);
      const res = await network.get(ApiPath.wallets);
      if (res.status === "completed") {
        setWallets(res.data.data.wallets);
      }
    } finally {
      setWalletsLoading(false);
    }
  };

  // fetch withdraw methods for selected wallet
  const withdrawMethodData = async () => {
    if (!selectWallet) return;
    try {
      setMethodsLoading(true);
      const res = await network.get(ApiPath.withdrawMethods, {
        currency: selectWallet,
      });
      if (res.status === "completed") {
        setWithdrawMethod(res.data.data);
      }
    } finally {
      setMethodsLoading(false);
    }
  };

  // handle withdraw method select
  const handleMethodChange = (value) => {
    setSelectMethodId(value);
    const selected = withdrawMethod.find((m) => m.id === parseInt(value));
    setSelectMethod(selected || null);
    setManualFields({});
  };

  // handle manual text/textarea fields
  const handleManualFieldChange = (fieldName, value) => {
    setManualFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // handle file input for manual field
  const handleManualFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const preview = isImage ? URL.createObjectURL(file) : null;
      setManualFields((prev) => ({
        ...prev,
        [fieldName]: { file, preview, name: file.name, isImage },
      }));
    }
  };

  // delete uploaded file
  const handleRemoveFile = (fieldName) => {
    setManualFields((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  // create withdraw account
  const handleCreateWithdrawAccount = async () => {
    try {
      if (!selectWallet) {
        toast.error("Please select wallet");
        return;
      }

      if (!selectMethod) {
        toast.error("Please select method");
        return;
      }

      const missingRequired = selectMethod?.fields?.some(
        (f) => f.validation === "required" && !manualFields[f.name]
      );

      if (missingRequired) {
        toast.error("Please fill all required fields");
        return;
      }

      const formData = new FormData();
      formData.append(
        "wallet_id",
        selectWallet === "default" ? "default" : selectWallet
      );
      formData.append("withdraw_method_id", selectMethod.id);
      formData.append("method_name", selectMethod.name);

      selectMethod?.fields?.forEach((field) => {
        const fieldValue = manualFields[field.name];

        formData.append(`credentials[${field.name}][type]`, field.type);
        formData.append(
          `credentials[${field.name}][validation]`,
          field.validation
        );

        if (field.type === "file" && fieldValue?.file instanceof File) {
          formData.append(`credentials[${field.name}][value]`, fieldValue.file);
        } else {
          formData.append(
            `credentials[${field.name}][value]`,
            fieldValue || ""
          );
        }
      });
      setLoading(true);
      const res = await network.postFormData(ApiPath.withdrawAccount, formData);
      if (res.status === "completed") {
        toast.success("Withdraw account created successfully!");
        router.push("/dashboard/withdraw/withdraw-account");
      }
    } finally {
      setLoading(false);
    }
  };

  // selected wallets data
  const selectedWallet = selectWallet
    ? wallets.find((w) =>
        selectWallet === "default"
          ? w.is_default
          : String(w.id) === String(selectWallet)
      )
    : null;

  // effects
  useEffect(() => {
    walletsData();
  }, []);

  useEffect(() => {
    if (selectWallet) {
      withdrawMethodData();
      setSelectMethodId("");
      setSelectMethod(null);
      setManualFields({});
    }
  }, [selectWallet]);

  return (
    <div>
      <div>
        <div className="flex justify-between items-center mb-[35px]">
          <h4 className="text-[20px] font-semibold text-merchant-text">
            Add New Account
          </h4>
        </div>
        <div className="bg-white border border-[rgba(26,32,44,0.16)] rounded-[8px] p-[20px] sm:p-[30px]">
          <div>
            <div className="max-w-[514px] mx-auto border border-[rgba(26,32,44,0.16)] p-[20px] rounded-[8px]">
              <h5 className="text-[18px] font-bold text-merchant-text mb-[30px]">
                Create New Withdraw Account
              </h5>
              <div className="step-1-content">
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-12">
                    <div className="relative">
                      <Select
                        value={selectWallet}
                        onValueChange={(value) => setSelectWallet(value)}
                        disabled={walletsLoading}
                      >
                        <div className="absolute left-[16px] top-1/2 -translate-y-1/2 z-10">
                          {selectedWallet ? (
                            selectedWallet.is_default ? (
                              <div className="symbol h-[20px] w-[20px] border border-[#9E9A9F] rounded-full flex items-center justify-center bg-user-primary">
                                <p className="text-[#9E9A9F] text-[12px] font-bold">
                                  {currencySymbol}
                                </p>
                              </div>
                            ) : (
                              <Image
                                src={selectedWallet.icon}
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
                            Wallet{" "}
                            <span className="text-merchant-error">*</span>
                          </span>
                        </div>

                        <SelectTrigger className="w-full !h-[52px] border-2 border-merchant-input-border rounded-[8px] text-merchant-text pl-[42px]">
                          <SelectValue
                            placeholder={
                              walletsLoading
                                ? "Loading wallets..."
                                : "Select Wallet"
                            }
                            aria-label={
                              selectedWallet
                                ? `${selectedWallet.name} (${selectedWallet.formatted_balance} ${selectedWallet.code})`
                                : ""
                            }
                          >
                            {selectedWallet && (
                              <span>
                                {selectedWallet.name} (
                                {selectedWallet.formatted_balance}{" "}
                                {selectedWallet.code})
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent className="rounded-[8px]">
                          <SelectGroup>
                            <SelectLabel>Available Wallets</SelectLabel>
                            {wallets.map((wallet) => (
                              <SelectItem
                                key={wallet.code}
                                value={
                                  wallet.is_default ? "default" : wallet.id
                                }
                              >
                                <div className="flex items-center gap-2 w-full select-image-icon">
                                  <div className="image-or-icon">
                                    {wallet.is_default ? (
                                      <div className="symbol h-[20px] w-[20px] border border-[#9E9A9F] rounded-full flex items-center justify-center bg-user-primary">
                                        <p className="text-[#9E9A9F] text-[12px] font-bold">
                                          {currencySymbol}
                                        </p>
                                      </div>
                                    ) : (
                                      <Image
                                        src={wallet.icon}
                                        alt="wallet"
                                        width={24}
                                        height={24}
                                        unoptimized
                                        className="w-[18px] h-[18px] rounded-full"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    {wallet.name} ({wallet.formatted_balance}{" "}
                                    {wallet.code})
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="relative">
                      <Select
                        value={selectMethodId}
                        onValueChange={handleMethodChange}
                        disabled={methodsLoading}
                      >
                        <div className="absolute left-[16px] top-[50%] -translate-y-1/2">
                          <Icon
                            icon="hugeicons:align-box-middle-center"
                            width="24"
                            height="24"
                            className="w-[18px] h-[18px] text-[#9E9A9F]"
                          />
                        </div>

                        <div className="absolute left-[16px] top-[-12px]">
                          <span className="text-[13px] text-[rgba(26,32,44,0.60)] font-semibold bg-white px-[10px]">
                            Method{" "}
                            <span className="text-merchant-error">*</span>
                          </span>
                        </div>

                        <SelectTrigger className="w-full !h-[52px] border-2 border-merchant-input-border rounded-[8px] text-merchant-text pl-[42px]">
                          <SelectValue
                            placeholder={
                              methodsLoading
                                ? "Loading Methods..."
                                : "Select Method"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent className="rounded-[16px]">
                          <SelectGroup>
                            <SelectLabel>Available Currencies</SelectLabel>
                            {withdrawMethod.map((method) => (
                              <SelectItem
                                key={method.id}
                                value={method.id.toString()}
                              >
                                {method.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {selectMethod?.fields?.map((field, index) => (
                    <div className="col-span-12" key={index}>
                      {field.type === "textarea" ? (
                        <textarea
                          className="user-textarea"
                          placeholder={`${field.name} ${
                            field.validation === "required" ? "*" : ""
                          }`}
                          value={manualFields[field.name] || ""}
                          onChange={(e) =>
                            handleManualFieldChange(field.name, e.target.value)
                          }
                        />
                      ) : field.type === "file" ? (
                        <div
                          onClick={() =>
                            document
                              .getElementById(`manual-file-${index}`)
                              .click()
                          }
                          className="h-[140px] relative border-2 border-dashed border-merchant-input-border rounded-[8px] cursor-pointer flex items-center justify-center"
                        >
                          <input
                            id={`manual-file-${index}`}
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              handleManualFileChange(e, field.name)
                            }
                          />

                          {!manualFields[field.name] ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <Icon
                                icon="lucide:upload"
                                width="24"
                                height="24"
                                className="text-merchant-paragraph mb-[7px]"
                              />
                              <p className="text-merchant-paragraph font-semibold text-[14px]">
                                {field.name}
                              </p>
                            </div>
                          ) : (
                            <>
                              {manualFields[field.name].isImage ? (
                                <img
                                  src={manualFields[field.name].preview}
                                  alt={field.name}
                                  className="w-full h-full object-contain p-1.5"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full p-4">
                                  <p className="text-merchant-paragraph font-semibold text-[14px]">
                                    {manualFields[field.name].name}
                                  </p>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile(field.name);
                                }}
                                className="absolute top-2 right-2 bg-merchant-error rounded-full p-1 shadow"
                              >
                                <Icon
                                  icon="lucide:x"
                                  width="18"
                                  height="18"
                                  className="text-white"
                                />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          className="user-input"
                          placeholder={`${field.name} ${
                            field.validation === "required" ? "*" : ""
                          }`}
                          value={manualFields[field.name] || ""}
                          onChange={(e) =>
                            handleManualFieldChange(field.name, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-3 mt-[40px]">
                  <Link
                    href="/dashboard/withdraw/withdraw-account"
                    className="group primary-button secondary-color-btn w-full"
                  >
                    <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
                    <span className="primary-button-text">Back</span>
                  </Link>
                  <button
                    className="group primary-button w-full"
                    onClick={handleCreateWithdrawAccount}
                    disabled={loading}
                  >
                    <span className="primary-button-hover-effect"></span>
                    <span className="primary-button-text">
                      {loading ? "Creating..." : "Create"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWithdrawAccount;
