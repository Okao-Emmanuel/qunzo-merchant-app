"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import logo from "@/assets/logo/logo.png";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterInfo } from "@/context/RegisterInfoContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { getFieldStatus } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RegisterPersonalInfoTwo = () => {
  const network = new NetworkService();
  const [allCountry, setAllCountry] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [registerFieldsValidation, setRegisterFieldsValidation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    personalInfo,
    additionalInfo,
    setAdditionalInfo,
    clearRegistrationData,
  } = useRegisterInfo();
  const router = useRouter();

  // Fetch all countries
  const fetchAllCountry = async () => {
    try {
      setCountryLoading(true);
      const res = await network.globalGet(ApiPath.allCountry);
      if (res.status === "completed") {
        setAllCountry(res.data.data);
      }
    } finally {
      setCountryLoading(false);
    }
  };

  // Fetch field validation settings
  const getRegisterFieldsValidation = async () => {
    setLoading(true);
    try {
      const res = await network.globalGet(ApiPath.registerFieldsValidation);
      if (res.status === "completed") {
        setRegisterFieldsValidation(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Field visibility and validation configuration
  const fieldSettings = {
    username: {
      show: getFieldStatus(registerFieldsValidation, "merchant_username_show"),
      required: getFieldStatus(
        registerFieldsValidation,
        "merchant_username_validation"
      ),
    },
    country: {
      show: getFieldStatus(registerFieldsValidation, "merchant_country_show"),
      required: getFieldStatus(
        registerFieldsValidation,
        "merchant_country_validation"
      ),
    },
    phone: {
      show: getFieldStatus(registerFieldsValidation, "merchant_phone_show"),
      required: getFieldStatus(
        registerFieldsValidation,
        "merchant_phone_validation"
      ),
    },
    referralCode: {
      show: getFieldStatus(
        registerFieldsValidation,
        "merchant_referral_code_show"
      ),
      required: getFieldStatus(
        registerFieldsValidation,
        "referral_code_validation"
      ),
    },
    gender: {
      show: getFieldStatus(registerFieldsValidation, "merchant_gender_show"),
      required: getFieldStatus(
        registerFieldsValidation,
        "merchant_gender_validation"
      ),
    },
  };

  // Load saved values
  useEffect(() => {
    if (additionalInfo.country) setCountry(additionalInfo.country);
    if (additionalInfo.phone) setPhone(additionalInfo.phone);
    if (additionalInfo.referralCode)
      setReferralCode(additionalInfo.referralCode);
  }, [additionalInfo]);

  // Dynamic form validation
  const validateForm = () => {
    if (fieldSettings.country.required && !country) {
      toast.error("Please select your country");
      return false;
    } else if (fieldSettings.phone.required && !phone) {
      toast.error("Please enter your phone number");
      return false;
    } else if (!termsAndConditions) {
      toast.error("Please check the terms and conditions");
      return false;
    }
    return true;
  };

  // Handle final submit
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAdditionalInfo({ country, phone, referralCode });

    try {
      const requestBody = {
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
      };

      if (fieldSettings.username.required || personalInfo.username) {
        requestBody.username = personalInfo.username.trim();
      }

      if (fieldSettings.gender.required || personalInfo.gender) {
        requestBody.gender = personalInfo.gender.trim();
      }

      if (fieldSettings.country.required || country) {
        requestBody.country = country.trim();
      }

      if (fieldSettings.phone.required || phone) {
        requestBody.phone = phone.trim();
      }

      if (fieldSettings.referralCode.required || referralCode) {
        requestBody.invite = referralCode.trim();
      }
      setIsSubmitting(true);
      const res = await network.post(ApiPath.updatePersonalInfo, requestBody);
      if (res.status === "completed") {
        toast.success(res.data.message);
        Cookies.set("personalInfo", "true");
        router.push("/auth/step-verification/success-status");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchAllCountry();
    getRegisterFieldsValidation();
  }, []);

  return (
    <div className="flex">
      <div className="left w-full lg:w-[50%] mr-0 lg:mr-[50%] min-h-screen relative">
        <div className="logo absolute top-[30px] left-[30px] md:top-[50px] md:left-[50px]">
          <div className="w-[100px] xl:w-[100px] h-auto">
            <Image
              src={logo}
              alt="logo"
              width={205}
              height={50}
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="left-content flex justify-center items-center min-h-screen pt-[100px] xl:pt-24 pb-[100px] xl:pb-24">
          <div className="min-w-full sm:min-w-[450px] mx-auto px-4 xl:px-0">
            <h2 className="text-[24px] text-merchant-text font-bold mb-[12px]">
              More Information
            </h2>
            <div className="mt-[40px]">
              {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <LoadingSpinner />
                </div>
              ) : (
                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="grid grid-cols-12 gap-4 sm:gap-6">
                    {fieldSettings.country.show && (
                      <div className="col-span-12">
                        <div className="relative">
                          <Select
                            disabled={countryLoading}
                            value={country}
                            onValueChange={(value) => setCountry(value)}
                          >
                            <div className="absolute left-[16px] top-1/2 -translate-y-1/2 z-10">
                              <Icon
                                icon="famicons:man"
                                width="24"
                                height="24"
                                className="w-[18px] h-[18px] text-[#9E9A9F]"
                              />
                            </div>
                            <div className="absolute left-[16px] top-[-12px]">
                              <span className="text-[13px] text-[rgba(26,32,44,0.60)] font-semibold bg-white px-[10px]">
                                Country{" "}
                                {fieldSettings.country.required && (
                                  <span className="text-merchant-error">*</span>
                                )}
                              </span>
                            </div>
                            <SelectTrigger className="w-full !h-[52px] border-2 border-[rgba(26,32,44,0.10)] text-agent-text focus:outline-none focus:shadow-outline pl-[42px]">
                              <SelectValue
                                placeholder={
                                  countryLoading
                                    ? "Loading Country..."
                                    : "Select Country"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="rounded-[8px]">
                              <SelectGroup>
                                <SelectLabel>Select Gender</SelectLabel>
                                {allCountry.map((countryItem) => (
                                  <SelectItem
                                    key={countryItem.code}
                                    value={`${countryItem.dial_code}:${countryItem.code}`}
                                  >
                                    {countryItem.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    {fieldSettings.phone.show && (
                      <div className="col-span-12">
                        <div>
                          <div className="relative">
                            <input
                              type="text"
                              id="phone"
                              className={`user-input user-input-left peer`}
                              placeholder=" "
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                            <label
                              htmlFor="phone"
                              className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[30px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                            >
                              Phone{" "}
                              {fieldSettings.phone.required && (
                                <span className="text-merchant-error">*</span>
                              )}
                            </label>
                            <div className="absolute left-[16px] top-[50%] -translate-y-1/2 z-20">
                              <Icon
                                icon="basil:user-solid"
                                width="24"
                                height="24"
                                className="text-[#9A9DA2] h-[20px] w-[20px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-span-12">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox-colored"
                          id="colored-checkbox"
                          checked={termsAndConditions}
                          onChange={(e) =>
                            setTermsAndConditions(e.target.checked)
                          }
                        />
                        <label
                          htmlFor="colored-checkbox"
                          className="text-[14px] text-merchant-paragraph font-semibold cursor-pointer"
                        >
                          I agree with the{" "}
                          <Link
                            href="/terms-and-conditions"
                            className="text-merchant-primary"
                          >
                            Terms & Condition
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-3.5 mt-5 sm:mt-[30px] lg:mt-[40px]">
                    <Link
                      href="/auth/step-verification/setup-personal-info"
                      className="group primary-button primary-border w-full"
                    >
                      <span className="primary-button-hover-effect"></span>
                      <span className="primary-button-text">Back</span>
                    </Link>
                    <button
                      type="submit"
                      className="group primary-button w-full"
                      disabled={isSubmitting}
                    >
                      <span className="primary-button-hover-effect"></span>
                      <span className="primary-button-text">
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="auth-elements">
          <div className="auth-elem-up absolute top-0 right-[30px]">
            <div className="w-[40px] md:w-[60px] xl:w-[80px] 3xl:w-[122px] h-auto">
              <Image
                src={authElem1}
                alt="Auth Element 1"
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="auth-elem-bottom absolute bottom-0 left-0">
            <div className="w-[60px] xl:w-[80px] 3xl:w-[122px] h-auto">
              <Image
                src={authElem2}
                alt="Auth Element 2"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="right w-[50%] min-h-screen fixed top-0 right-0 hidden lg:block">
        <div
          className="right-content bg-center bg-cover bg-no-repeat h-screen w-full"
          style={{ backgroundImage: `url(${authBg.src})` }}
        ></div>
      </div>
    </div>
  );
};

export default RegisterPersonalInfoTwo;
