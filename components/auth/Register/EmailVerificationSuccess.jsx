"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import completeIcon from "@/assets/auth/complete-icon.svg";
import logo from "@/assets/logo/logo.png";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const EmailVerificationSuccess = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  // effects
  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);
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
              <div className="bg-[#EDF4F1] flex justify-between items-center mb-[30px] border-2 border-[rgba(20,174,111,0.20)] rounded-[16px] px-[16px] py-[10px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-[40px] h-[40px] rounded-full bg-[rgba(20,174,111,0.08)] flex items-center justify-center">
                    <Icon
                      icon="basil:envelope-solid"
                      width="24"
                      height="24"
                      className="text-[#84D2B2] w-[20px] h-[20px]"
                    />
                  </div>
                  <p className="text-[14px] font-semibold text-merchant-text">
                    Email Verification
                  </p>
                </div>
                <div>
                  <Image
                    src={completeIcon}
                    alt="complete"
                    width={100}
                    height={100}
                    className="w-[32px] h-[32px]"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mb-[30px] border-2 border-[rgba(26,32,44,0.10)] rounded-[16px] px-[16px] py-[10px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-[40px] h-[40px] rounded-full bg-[rgba(26,32,44,0.08)] flex items-center justify-center">
                    <Icon
                      icon="basil:lock-solid"
                      width="24"
                      height="24"
                      className="text-[#AEB0B4] w-[20px] h-[20px]"
                    />
                  </div>
                  <p className="text-[14px] font-semibold text-[rgba(26,32,44,0.30)]">
                    Setup Password
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-[30px] border-2 border-[rgba(26,32,44,0.10)] rounded-[16px] px-[16px] py-[10px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-[40px] h-[40px] rounded-full bg-[rgba(26,32,44,0.08)] flex items-center justify-center">
                    <Icon
                      icon="basil:user-solid"
                      width="24"
                      height="24"
                      className="text-[#AEB0B4] w-[20px] h-[20px]"
                    />
                  </div>
                  <p className="text-[14px] font-semibold text-[rgba(26,32,44,0.30)]">
                    Personal Info
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-[30px] border-2 border-[rgba(26,32,44,0.10)] rounded-[16px] px-[16px] py-[10px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-[40px] h-[40px] rounded-full bg-[rgba(26,32,44,0.08)] flex items-center justify-center">
                    <Icon
                      icon="basil:shield-solid"
                      width="24"
                      height="24"
                      className="text-[#AEB0B4] w-[20px] h-[20px]"
                    />
                  </div>
                  <p className="text-[14px] font-semibold text-[rgba(26,32,44,0.30)]">
                    ID Verification
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[30px] lg:mt-[40px]">
              <Link
                href={`/auth/register/set-password?email=${encodeURIComponent(
                  email
                )}`}
                className="group primary-button w-full"
              >
                <span className="primary-button-hover-effect"></span>
                <span className="primary-button-text">Continue</span>
              </Link>
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

export default EmailVerificationSuccess;
