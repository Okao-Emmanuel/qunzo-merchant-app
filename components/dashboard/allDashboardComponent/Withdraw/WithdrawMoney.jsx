"use client";

import dotBg from "@/assets/dashboard/background/dot-bg.svg";
import successIcon from "@/assets/dashboard/icon/success-image.svg";
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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WithdrawMoney = () => {
  const network = new NetworkService();
  const [withdrawAccount, setWithdrawAccount] = useState([]);
  const [withdrawAccountLoading, setWithdrawAccountLoading] = useState(false);
  const [selectWithdrawAccount, setSelectWithdrawAccount] = useState("");
  const [selectAmount, setSelectAmount] = useState("");
  const [calculatedCharge, setCalculatedCharge] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [withdrawResponse, setWithdrawResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { settings } = useSettings();
  const siteCurrency = getSettingValue(settings, "site_currency");
  const siteCurrencyDecimals = getSettingValue(
    settings,
    "site_currency_decimals"
  );

  const steps = [
    { num: 1, label: "Amount", sublabel: "Step 1" },
    { num: 2, label: "Review", sublabel: "Step 2" },
    { num: 3, label: "Success", sublabel: "Step 3" },
  ];

  // Fetch withdraw account
  const withdrawAccountData = async () => {
    setWithdrawAccountLoading(true);
    try {
      const res = await network.get(ApiPath.withdrawAccount);
      if (res.status === "completed") {
        setWithdrawAccount(res.data.data);
      }
    } finally {
      setWithdrawAccountLoading(false);
    }
  };

  // find selected account data
  const selectedAccount = withdrawAccount?.accounts?.find(
    (a) => a.id === Number(selectWithdrawAccount)
  );

  const reviewCalculate = async () => {
    const baseAmount = parseFloat(selectAmount);
    let chargeValue = 0;
    if (selectedAccount?.method?.charge_type?.toLowerCase() === "percentage") {
      chargeValue =
        (baseAmount * parseFloat(selectedAccount.method.charge)) / 100;
      const total = baseAmount + chargeValue;
      setCalculatedCharge(chargeValue);
      setTotalAmount(total);
    } else if (
      selectedAccount?.method?.charge_type?.toLowerCase() === "fixed"
    ) {
      await convertFixedAmount(selectedAccount.method.charge, baseAmount);
    } else {
      toast.error("Something went wrong, please try again.");
    }
  };

  // if fixed amount
  const convertFixedAmount = async (charge, amount) => {
    try {
      const res = await network.globalGet(
        ApiPath.currencyConvert(charge, selectedAccount?.code)
      );

      if (res.status === "completed") {
        const convertedCharge = Number(res.data.data.converted_amount);
        setCalculatedCharge(convertedCharge);
        const total = amount + convertedCharge;
        setTotalAmount(total);
      }
    } catch (e) {
      console.error(e.response?.data || e.message);
    }
  };

  //handle withdraw
  const handleWithdrawSubmit = async () => {
    try {
      setLoading(true);
      const requestBody = {
        amount: selectAmount,
        withdraw_account_id: selectWithdrawAccount,
      };

      const res = await network.post(ApiPath.withdraw, requestBody);
      if (res.status === "completed") {
        toast.success("Withdraw request sent successfully!");
        setWithdrawResponse(res.data.data);
        setStep(3);
      }
    } finally {
      setLoading(false);
    }
  };

  // Validation function
  const validateStep1 = () => {
    if (!selectWithdrawAccount) {
      toast.error("Please select a account");
      return false;
    }
    if (!selectAmount || parseFloat(selectAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    // Validate amount range
    const minLimit = selectedAccount?.method?.min_withdraw;
    const maxLimit = selectedAccount?.method?.max_withdraw;

    if (minLimit && maxLimit) {
      const numAmount = parseFloat(selectAmount);
      const numMin = parseFloat(minLimit);
      const numMax = parseFloat(maxLimit);

      if (numAmount < numMin) {
        toast.error(
          `Amount must be at least ${minLimit} ${selectedAccount?.currency}`
        );
        return false;
      }

      if (numAmount > numMax) {
        toast.error(
          `Amount cannot exceed ${maxLimit} ${selectedAccount?.currency}`
        );
        return false;
      }
    }
    return true;
  };

  // Step navigation
  const nextStep = () => {
    if (step === 1) {
      if (!validateStep1()) {
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 2));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const resetSteps = () => {
    setStep(1);
    setSelectWithdrawAccount("");
    setSelectAmount("");
    setCalculatedCharge(0);
    setTotalAmount(0);
    setWithdrawResponse(null);
  };

  // Effects
  useEffect(() => {
    withdrawAccountData();
  }, []);

  useEffect(() => {
    if (selectWithdrawAccount && selectAmount) {
      reviewCalculate();
    }
  }, [selectWithdrawAccount, selectAmount]);

  return (
    <div className="w-full border border-[rgba(26,32,44,0.10)] rounded-[8px] p-[16px] sm:p-[30px] xl:p-[60px]">
      <div className="w-full max-w-[970px]">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Steps */}
          <div className="w-full lg:w-[130px] xl:w-[160px] 2xl:w-[250px] 3xl:w-[350px] flex-shrink-0">
            <div className="relative flex justify-between items-center lg:block">
              {steps.map((singleStep, index) => (
                <div key={singleStep.num} className="relative w-full">
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-1/2 lg:left-5 top-[22px] lg:top-10 w-full lg:w-0.5 h-0.5 lg:h-[100px] transition-colors duration-300 ${
                        step > singleStep.num
                          ? "bg-merchant-primary"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  )}

                  <div className="flex flex-col lg:flex-row items-center gap-4 mb-0 lg:mb-[65px] text-center lg:text-left">
                    <div
                      className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 relative after:absolute after:top-1/2 after:left-1/2 after:-translate-1/2 after:rounded-full after:content-[""] after:w-[41px] after:h-[41px] after:bg-transparent after:border-4 after:border-white ${
                        step === singleStep.num
                          ? "bg-merchant-primary"
                          : step > singleStep.num
                          ? "bg-merchant-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      {step >= singleStep.num ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <div className="w-[15px] h-[15px] rounded-full bg-white"></div>
                      )}
                    </div>

                    <div>
                      <div
                        className={`font-semibold ${
                          step >= singleStep.num
                            ? "text-merchant-text"
                            : "text-merchant-paragraph"
                        }`}
                      >
                        {singleStep.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {singleStep.sublabel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 border-l-0 lg:border-l border-l-[rgba(26,32,44,0.10)] pl-0 lg:pl-[30px] xl:pl-[80px]">
            {step === 1 && (
              <div className="step-1-content">
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-12">
                    <div className="relative">
                      <Select
                        value={selectWithdrawAccount}
                        onValueChange={(value) =>
                          setSelectWithdrawAccount(value)
                        }
                        disabled={withdrawAccountLoading}
                      >
                        <div className="absolute left-[16px] top-[50%] -translate-y-1/2">
                          <Icon
                            icon="basil:wallet-solid"
                            width="24"
                            height="24"
                            className="w-[18px] h-[18px] text-[#9E9A9F]"
                          />
                        </div>

                        <div className="absolute left-[16px] top-[-12px]">
                          <span className="text-[13px] text-[rgba(26,32,44,0.60)] font-semibold bg-white px-[10px]">
                            Withdraw Account{" "}
                            <span className="text-merchant-error">*</span>
                          </span>
                        </div>

                        <SelectTrigger className="w-full !h-[52px] border-2 border-merchant-input-border rounded-[8px] text-merchant-text pl-[42px]">
                          <SelectValue
                            placeholder={
                              withdrawAccountLoading
                                ? "Loading Withdraw Account..."
                                : "Select Withdraw Account"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent className="rounded-[8px]">
                          <SelectGroup>
                            <SelectLabel>Available Accounts</SelectLabel>

                            {withdrawAccount?.accounts?.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.method_name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="relative">
                      <input
                        type="text"
                        id="amount"
                        className={`user-input user-input-left peer`}
                        placeholder=" "
                        value={selectAmount}
                        onChange={(e) => setSelectAmount(e.target.value)}
                      />
                      <label
                        htmlFor="amount"
                        className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[30px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                      >
                        Amount <span className="text-merchant-error">*</span>
                      </label>
                      <div className="absolute left-[16px] top-[50%] -translate-y-1/2 z-20">
                        <Icon
                          icon="lets-icons:money-fill"
                          width="24"
                          height="24"
                          className="text-[#9A9DA2] h-[20px] w-[20px]"
                        />
                      </div>
                    </div>
                    {selectWithdrawAccount && (
                      <p className="text-merchant-error text-[13px] font-semibold mt-1">
                        Minimum: {selectedAccount.method.min_withdraw}{" "}
                        {selectedAccount.currency} and Maximum:{" "}
                        {selectedAccount.method.max_withdraw}{" "}
                        {selectedAccount.currency}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-[40px]">
                  <button
                    onClick={nextStep}
                    className="group primary-button w-full"
                  >
                    <span className="primary-button-hover-effect"></span>
                    <span className="primary-button-text">Next</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-2-content">
                <div className="details">
                  <h5 className="text-[18px] font-bold text-merchant-text mb-[16px]">
                    Review Details
                  </h5>
                  <div className="border border-[rgba(26,32,44,0.10)] rounded-[8px]">
                    <div className="flex flex-col sm:flex-row gap-1.5 justify-between items-start sm:items-center border-b border-[rgba(26,32,44,0.10)] px-[12px] py-[16px]">
                      <h6 className="text-[14px] font-semibold text-merchant-paragraph">
                        Amount
                      </h6>
                      <p className="text-[14px] font-semibold text-merchant-primary">
                        {Number(selectAmount).toFixed(
                          dynamicDecimals({
                            currencyCode: selectedAccount?.currency,
                            siteCurrencyCode: siteCurrency,
                            siteCurrencyDecimals: siteCurrencyDecimals,
                            isCrypto: selectedAccount?.method?.is_crypto,
                          })
                        )}{" "}
                        {selectedAccount?.currency}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1.5 justify-between items-start sm:items-center border-b border-[rgba(26,32,44,0.10)] px-[12px] py-[16px]">
                      <h6 className="text-[14px] font-semibold text-merchant-paragraph">
                        Method Name
                      </h6>
                      <p className="text-[14px] font-semibold text-merchant-text">
                        {selectedAccount?.method_name}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1.5 justify-between items-start sm:items-center border-b border-[rgba(26,32,44,0.10)] px-[12px] py-[16px]">
                      <h6 className="text-[14px] font-semibold text-merchant-paragraph">
                        Charge
                      </h6>
                      <p className="text-[14px] font-semibold text-merchant-error">
                        {Number(calculatedCharge).toFixed(
                          dynamicDecimals({
                            currencyCode: selectedAccount?.currency,
                            siteCurrencyCode: siteCurrency,
                            siteCurrencyDecimals: siteCurrencyDecimals,
                            isCrypto: selectedAccount?.method?.is_crypto,
                          })
                        )}{" "}
                        {selectedAccount?.currency}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1.5 justify-between items-start sm:items-center px-[12px] py-[16px]">
                      <h6 className="text-[14px] font-semibold text-merchant-paragraph">
                        Total
                      </h6>
                      <p className="text-[16px] font-semibold text-merchant-text">
                        {Number(totalAmount).toFixed(
                          dynamicDecimals({
                            currencyCode: selectedAccount?.currency,
                            siteCurrencyCode: siteCurrency,
                            siteCurrencyDecimals: siteCurrencyDecimals,
                            isCrypto: selectedAccount?.method?.is_crypto,
                          })
                        )}{" "}
                        {selectedAccount?.currency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col-reverse gap-4 mt-[40px]">
                  <button
                    onClick={prevStep}
                    className="group primary-button secondary-color-btn w-full"
                  >
                    <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
                    <span className="primary-button-text">Back</span>
                  </button>
                  <button
                    onClick={handleWithdrawSubmit}
                    className="group primary-button w-full"
                    disabled={loading}
                  >
                    <span className="primary-button-hover-effect"></span>
                    <span className="primary-button-text">
                      {loading ? "Withdrawing..." : "Withdraw"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-3-content">
                <div className="success-content overflow-hidden">
                  <div className="success-content-up bg-merchant-bg-one rounded-t-[8px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-auto">
                      <Image
                        src={dotBg}
                        alt="background"
                        width={100}
                        height={100}
                        className="w-full h-auto object-cover z-[1]"
                      />
                    </div>
                    <div className="relative z-[2] p-[20px] sm:p-[30px] flex flex-col items-center">
                      <div className="w-[80px] h-[80px] mb-[16px]">
                        <Image
                          src={successIcon}
                          alt="success"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="text-[20px] font-bold text-merchant-text mb-[10px]">
                          Withdraw request is sent
                        </h3>
                        <p className="text-[14px] font-medium text-merchant-paragraph">
                          Please waiting for admin approval
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="success-content-separator relative">
                    <div className="w-full border-t-2 border-dashed border-merchant-primary"></div>
                    <div className="w-[22px] h-[22px] bg-white absolute top-1/2 left-[-12px] -translate-y-1/2 rounded-full"></div>
                    <div className="w-[22px] h-[22px] bg-white absolute top-1/2 right-[-12px] -translate-y-1/2 rounded-full"></div>
                  </div>
                  <div className="success-content-down bg-merchant-bg-one rounded-b-[8px] p-[20px] sm:p-[30px]">
                    <div className="bg-white p-[20px] rounded-[8px]">
                      <div className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center gap-2 mb-[20px]">
                        <p className="text-[14px] font-semibold text-merchant-paragraph">
                          Transaction ID:
                        </p>
                        <p className="text-[14px] font-semibold text-merchant-text">
                          {withdrawResponse?.transaction?.tnx}
                        </p>
                      </div>
                      <div className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center gap-2 mb-[20px]">
                        <p className="text-[14px] font-semibold text-merchant-paragraph">
                          Transaction Type
                        </p>
                        <p className="text-[14px] font-semibold text-merchant-text">
                          {withdrawResponse?.transaction?.type}
                        </p>
                      </div>
                      <div className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center gap-2 mb-[20px]">
                        <p className="text-[14px] font-semibold text-merchant-paragraph">
                          Amount
                        </p>
                        <p className="text-[14px] font-semibold text-merchant-primary">
                          {Number(
                            withdrawResponse?.transaction?.amount
                          ).toFixed(
                            dynamicDecimals({
                              currencyCode: selectedAccount?.currency,
                              siteCurrencyCode: siteCurrency,
                              siteCurrencyDecimals: siteCurrencyDecimals,
                              isCrypto:
                                selectedAccount?.method?.is_crypto || false,
                            })
                          )}{" "}
                          {selectedAccount?.currency}
                        </p>
                      </div>
                      <div className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center gap-2 mb-[20px]">
                        <p className="text-[14px] font-semibold text-merchant-paragraph">
                          Charge
                        </p>
                        <p className="text-[14px] font-semibold text-merchant-error">
                          {Number(
                            withdrawResponse?.transaction?.charge
                          ).toFixed(
                            dynamicDecimals({
                              currencyCode: selectedAccount?.currency,
                              siteCurrencyCode: siteCurrency,
                              siteCurrencyDecimals: siteCurrencyDecimals,
                              isCrypto:
                                selectedAccount?.method?.is_crypto || false,
                            })
                          )}{" "}
                          {selectedAccount?.currency}
                        </p>
                      </div>
                      <div className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center gap-2">
                        <p className="text-[14px] font-semibold text-merchant-paragraph">
                          Total
                        </p>
                        <p className="text-[14px] font-semibold text-merchant-text">
                          {Number(
                            withdrawResponse?.transaction?.final_amount
                          ).toFixed(
                            dynamicDecimals({
                              currencyCode: selectedAccount?.currency,
                              siteCurrencyCode: siteCurrency,
                              siteCurrencyDecimals: siteCurrencyDecimals,
                              isCrypto:
                                selectedAccount?.method?.is_crypto || false,
                            })
                          )}{" "}
                          {selectedAccount?.currency}
                        </p>
                      </div>
                    </div>
                    <div className="mt-[30px]">
                      <button
                        onClick={resetSteps}
                        className="group primary-button w-full"
                      >
                        <span className="primary-button-hover-effect"></span>
                        <span className="primary-button-text">
                          Withdrawal Again
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawMoney;
