"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import logo from "@/assets/logo/logo.png";
import { useSettings } from "@/context/settingsContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { getSettingValue } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const RegisterEmail = () => {
  const network = new NetworkService();
  const [email, setEmail] = useState("");
  const [emailSendResponse, setEmailSendResponse] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();
  const isEmailVerificationEnabled = getSettingValue(
    settings,
    "email_verification"
  );

  // handle email submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const requestBody = { email: email };
      const res = await network.post(ApiPath.emailVerify, requestBody);
      if (res.status === "completed") {
        if (isEmailVerificationEnabled === "1") {
          toast.success(res.data.message);
          router.push(
            `/auth/register/otp-verification?email=${encodeURIComponent(email)}`
          );
        } else {
          router.push(
            `/auth/register/email-verification-success?email=${encodeURIComponent(
              email
            )}`
          );
        }
      }
    } finally {
    }
  };

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
              Email Verifications
            </h2>
            <div className="mt-[40px]">
              <form onSubmit={handleEmailSubmit}>
                <div className="grid grid-cols-12 gap-4 sm:gap-6">
                  <div className="col-span-12">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="email"
                          className={`user-input user-input-left peer`}
                          placeholder=" "
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label
                          htmlFor="email"
                          className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[30px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                        >
                          Email <span className="text-merchant-error">*</span>
                        </label>
                        <div className="absolute left-[16px] top-[50%] -translate-y-1/2 z-20">
                          <Icon
                            icon="basil:envelope-solid"
                            width="24"
                            height="24"
                            className="text-[#9A9DA2] h-[20px] w-[20px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="group primary-button w-full mt-5 sm:mt-[30px] lg:mt-[40px]"
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">Continue</span>
                </button>
              </form>
            </div>
            <div className="path-switch mt-[30px] md:mt-[60px]">
              <p className="text-center text-[14px] sm:text-[16px] font-medium text-merchant-paragraph">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-merchant-primary">
                  Sign In
                </Link>
              </p>
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

export default RegisterEmail;
