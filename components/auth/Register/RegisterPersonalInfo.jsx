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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RegisterPersonalInfo = () => {
  const network = new NetworkService();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [registerFieldsValidation, setRegisterFieldsValidation] = useState([]);
  const [loading, setLoading] = useState(true);
  const { personalInfo, setPersonalInfo } = useRegisterInfo();
  const router = useRouter();

  // Get register fields validation data
  const getRegisterFieldsValidation = async () => {
    try {
      const res = await network.globalGet(ApiPath.registerFieldsValidation);
      if (res.status === "completed") {
        setRegisterFieldsValidation(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Field visibility and validation settings
  const fieldSettings = {
    username: {
      show: getFieldStatus(registerFieldsValidation, "merchant_username_show"),
      required: getFieldStatus(
        registerFieldsValidation,
        "merchant_username_validation"
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

  // Validate form based on dynamic rules
  const validateForm = () => {
    if (!firstName.trim()) {
      toast.error("Please enter your first name");
      return false;
    } else if (!lastName.trim()) {
      toast.error("Please enter your last name");
      return false;
    } else if (fieldSettings.username.required && !userName) {
      toast.error("Please enter your username");
      return false;
    } else if (fieldSettings.gender.required && !gender) {
      toast.error("Please select your gender");
      return false;
    }
    return true;
  };

  // Handle step one submission
  const handlePersonalInfoStepOne = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPersonalInfo({
      first_name: firstName,
      last_name: lastName,
      username: userName,
      gender,
    });

    router.push("/auth/step-verification/setup-personal-info-two");
  };

  useEffect(() => {
    getRegisterFieldsValidation();
  }, []);

  useEffect(() => {
    if (personalInfo.first_name) setFirstName(personalInfo.first_name);
    if (personalInfo.last_name) setLastName(personalInfo.last_name);
    if (personalInfo.username) setUserName(personalInfo.username);
    if (personalInfo.gender) setGender(personalInfo.gender);
  }, [personalInfo]);

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
              Your Information
            </h2>
            <div className="mt-[40px]">
              {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <LoadingSpinner />
                </div>
              ) : (
                <form onSubmit={handlePersonalInfoStepOne}>
                  <div className="grid grid-cols-12 gap-4 sm:gap-6">
                    <div className="col-span-12">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="first_name"
                            className={`user-input user-input-left peer`}
                            placeholder=" "
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <label
                            htmlFor="first_name"
                            className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[30px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                          >
                            First Name{" "}
                            <span className="text-merchant-error">*</span>
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
                    <div className="col-span-12">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="last_name"
                            className={`user-input user-input-left peer`}
                            placeholder=" "
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          <label
                            htmlFor="last_name"
                            className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[30px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                          >
                            Last Name{" "}
                            <span className="text-merchant-error">*</span>
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
                    {fieldSettings.username.show && (
                      <div className="col-span-12">
                        <div>
                          <div className="relative">
                            <input
                              type="text"
                              id="username"
                              className={`user-input user-input-left peer`}
                              placeholder=" "
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                            />
                            <label
                              htmlFor="username"
                              className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[30px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                            >
                              Username{" "}
                              {fieldSettings.username.required && (
                                <span className="text-merchant-error">*</span>
                              )}
                            </label>
                            <div className="absolute left-[16px] top-[50%] -translate-y-1/2 z-20">
                              <Icon
                                icon="basil:file-user-solid"
                                width="24"
                                height="24"
                                className="text-[#9A9DA2] h-[20px] w-[20px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {fieldSettings.gender.show && (
                      <div className="col-span-12">
                        <div className="relative">
                          <Select
                            value={gender}
                            onValueChange={(value) => setGender(value)}
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
                                Gender{" "}
                                {fieldSettings.gender.required && (
                                  <span className="text-merchant-error">*</span>
                                )}
                              </span>
                            </div>
                            <SelectTrigger className="w-full !h-[52px] border-2 border-[rgba(26,32,44,0.10)] text-agent-text focus:outline-none focus:shadow-outline pl-[42px]">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[8px]">
                              <SelectGroup>
                                <SelectLabel>Select Gender</SelectLabel>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="group primary-button w-full mt-5 sm:mt-[30px] lg:mt-[40px]"
                  >
                    <span className="primary-button-hover-effect"></span>
                    <span className="primary-button-text">Continue</span>
                  </button>
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

export default RegisterPersonalInfo;
