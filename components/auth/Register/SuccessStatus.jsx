"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import completeIcon from "@/assets/auth/complete-icon.svg";
import logo from "@/assets/logo/logo.png";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

const SuccessStatus = () => {
  const network = new NetworkService();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const userData = async () => {
    try {
      const res = await network.get(ApiPath.user);
      if (res.status === "completed") {
        setUser(res.data.data.user);
      }
    } finally {
    }
  };

  useEffect(() => {
    userData();
  }, []);

  const steps = [
    {
      step: 1,
      title: "Email Verification",
      completed: true,
      icon: "basil:envelope-solid",
    },
    {
      step: 2,
      title: "Setup Password",
      completed: true,
      icon: "basil:lock-solid",
    },
    {
      step: 3,
      title: "Personal Info",
      completed: user?.boarding_steps?.personal_info || false,
      icon: "basil:user-solid",
    },
    {
      step: 4,
      title: "Verification",
      completed: user?.boarding_steps?.completed || false,
      icon: "basil:shield-solid",
    },
  ];

  //pick icons dynamically
  const getIcon = (stepObj) => {
    if (stepObj.completed) return "basil:check-outline";
    if (stepObj.step === 2) return "basil:lock-solid";
    if (stepObj.step === 4) return "basil:document-solid";
    return "basil:user-solid";
  };
  const getBgClass = (completed) =>
    completed ? "bg-user-success" : "bg-gray-200";
  const getIconColorClass = (completed) =>
    completed ? "text-white" : "text-[#A3A3A3]";

  const renderNextButton = () => {
    if (user?.merchant?.is_rejected && user?.kyc == "3") {
      return (
        <Link
          href="/auth/step-verification/id-verification-choose"
          className="group primary-button w-full"
        >
          <span className="primary-button-hover-effect"></span>
          <span className="primary-button-text">Submit Again</span>
        </Link>
      );
    } else if (user?.boarding_steps?.completed) {
      return (
        <Link href="/dashboard" className="group primary-button w-full">
          <span className="primary-button-hover-effect"></span>
          <span className="primary-button-text">Dashboard</span>
        </Link>
      );
    } else if (user?.kyc == "0" || user?.kyc == "4") {
      const link = !isMobile
        ? "/auth/step-verification/scan-qrcode"
        : "/auth/step-verification/id-verification-choose";
      return (
        <Link href={link} className="group primary-button w-full">
          <span className="primary-button-hover-effect"></span>
          <span className="primary-button-text">Next Step</span>
        </Link>
      );
    }
    return null;
  };

  useEffect(() => {
    if (user?.boarding_steps?.completed) {
      localStorage.removeItem("register_personal_info");
      localStorage.removeItem("register_additional_info");
      if (user?.boarding_steps?.completed === true) {
        Cookies.set("kycVerify", "true");
      }
    }
  }, [user?.boarding_steps?.completed]);

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
            <h2 className="text-[24px] text-merchant-text font-bold mb-[40px]">
              Your Current Status
            </h2>
            <div>
              {steps.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    item.completed
                      ? "bg-[#EDF4F1] border-[rgba(20,174,111,0.20)]"
                      : "bg-transparent border-[rgba(26,32,44,0.10)] "
                  } flex justify-between items-center mb-[30px] border-2 rounded-[16px] px-[16px] py-[10px]`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`${
                        item.completed
                          ? "bg-[rgba(20,174,111,0.08)]"
                          : "bg-[rgba(26,32,44,0.08)]"
                      } w-[40px] h-[40px] rounded-full flex items-center justify-center`}
                    >
                      <Icon
                        icon={item.icon}
                        width="24"
                        height="24"
                        className={`${
                          item.completed ? "text-[#84D2B2]" : "text-[#AEB0B4]"
                        } w-[20px] h-[20px]`}
                      />
                    </div>
                    <p className="text-[14px] font-semibold text-[rgba(26,32,44,0.30)]">
                      {item.title}
                    </p>
                  </div>
                  {item.step === 4 && (
                    <>
                      {user?.kyc == "3" ? (
                        <span className="text-red-500 font-medium text-sm mt-1">
                          Rejected
                        </span>
                      ) : user?.kyc == "1" ? (
                        <span className="text-merchant-success font-medium text-sm mt-1"></span>
                      ) : user?.kyc == "2" ? (
                        <span className="text-[#FFAA00] font-medium text-sm mt-1">
                          In Review
                        </span>
                      ) : (
                        <span className="text-[#FFAA00] font-medium text-sm mt-1"></span>
                      )}
                    </>
                  )}
                  {item.completed && (
                    <div>
                      <Image
                        src={completeIcon}
                        alt="complete"
                        width={100}
                        height={100}
                        className="w-[32px] h-[32px]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Rejection Reason */}
            {user?.merchant?.is_rejected && (
              <div className="mt-[20px] w-full">
                <p className="text-user-text text-center">
                  {user?.merchant?.rejection_reason}
                </p>
              </div>
            )}

            <div className="mt-[20px] sm:mt-[40px] w-full">
              {renderNextButton()}
            </div>

            {user?.kyc == "0" || user?.kyc == "3" || user?.kyc == "2" ? null : (
              <>
                {user?.boarding_steps?.personal_info &&
                  !user?.boarding_steps?.completed && (
                    <div className="mt-[20px] w-full">
                      <Link
                        href="/auth/step-verification/setup-personal-info"
                        className="group primary-button primary-border w-full"
                      >
                        <span className="primary-button-hover-effect"></span>
                        <span className="primary-button-text">Back</span>
                      </Link>
                    </div>
                  )}
              </>
            )}
            {/* Refresh Button */}
            {user?.kyc == "2" && (
              <div className="mt-[20px] w-full">
                <button
                  className="group primary-button primary-border w-full"
                  onClick={() => window.location.reload()}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">Refresh</span>
                </button>
              </div>
            )}
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

export default SuccessStatus;
