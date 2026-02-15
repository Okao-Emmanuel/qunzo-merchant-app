"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import logo from "@/assets/logo/logo.png";
import { useSettings } from "@/context/settingsContext";
import { useUser } from "@/context/UserContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import TokenService from "@/network/service/tokenService";
import { getSettingValue } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Login = () => {
  const network = new NetworkService();
  const tokenService = new TokenService();
  const [showPassword, setShowPassword] = useState(false);
  const { refreshUser } = useUser();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { settings } = useSettings();
  const siteFaVerification = getSettingValue(settings, "fa_verification");

  // handle form validation
  const handleFormValidation = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Please fill Email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!form.password) {
      newErrors.password = "Please fill Password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!handleFormValidation()) return;

    try {
      setLoading(true);
      const requestBody = { email: form.email, password: form.password };
      const res = await network.globalPost(ApiPath.login, requestBody);
      if (res.status === "completed") {
        const token = res.data.data.token;
        await network.tokenService.saveAccessToken(token);
        await refreshUser();
        await setRedirectPath();
      }
    } finally {
      setLoading(false);
    }
  };

  // after login get user data and do condition where to go
  const setRedirectPath = async () => {
    try {
      const res = await network.get(ApiPath.user);
      if (res.status === "completed") {
        Cookies.set("kycVerify", "true");
        Cookies.set("personalInfo", "true");
        const steps = res?.data?.data?.user?.boarding_steps;
        if (steps?.completed === true) {
          if (
            siteFaVerification === "1" &&
            res?.data?.data?.user?.two_fa === true
          ) {
            router.push("/auth/login/two-fa-verification-page");
          } else {
            router.push("/dashboard");
          }
        } else if (steps?.personal_info === true) {
          router.push("/auth/step-verification/success-status");
        } else {
          router.push("/auth/step-verification/success-status");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/dashboard");
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
              Welcome to Merchant
            </h2>
            <p className="text-[14px] text-merchant-paragraph font-medium mb-[30px]">
              Manage payments, track sales, and grow your business
            </p>
            <div className="mt-[40px]">
              <form onSubmit={handleLoginSubmit}>
                <div className="grid grid-cols-12 gap-4 sm:gap-6">
                  <div className="col-span-12">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="email"
                          className={`user-input user-input-left peer ${
                            errors.email
                              ? "!border-merchant-error focus:!border-merchant-error"
                              : ""
                          }`}
                          placeholder=" "
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
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
                      {errors.email && (
                        <p className="text-[13px] text-merchant-error mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className={`user-input user-input-left peer ${
                            errors.password
                              ? "!border-merchant-error focus:!border-merchant-error"
                              : ""
                          }`}
                          placeholder=" "
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                        />
                        <label
                          htmlFor="password"
                          className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[30px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                        >
                          Password{" "}
                          <span className="text-merchant-error">*</span>
                        </label>
                        <div className="absolute left-[16px] top-[50%] -translate-y-1/2 z-[21]">
                          <Icon
                            icon="basil:lock-solid"
                            width="24"
                            height="24"
                            className="text-[#9A9DA2] h-[20px] w-[20px]"
                          />
                        </div>
                        <div
                          className="absolute right-[16px] top-1/2 -translate-y-1/2 z-20 cursor-pointer"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            icon={
                              showPassword
                                ? "basil:eye-solid"
                                : "basil:eye-closed-solid"
                            }
                            width="24"
                            height="24"
                            className="text-[#9A9DA2] h-[20px] w-[20px]"
                          />
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-[13px] text-merchant-error mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox-colored"
                          id="colored-checkbox"
                          checked={form.rememberMe}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              rememberMe: e.target.checked,
                            })
                          }
                        />
                        <label
                          htmlFor="colored-checkbox"
                          className="text-[13px] text-merchant-text font-semibold cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                      <div>
                        <Link
                          href="/auth/login/forget-password"
                          className="text-[13px] text-merchant-primary font-semibold transition-all"
                        >
                          Forget Password?
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="group primary-button w-full mt-5 sm:mt-[30px] lg:mt-[40px]"
                  disabled={loading}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">
                    {loading ? "Sign In..." : "Sign In"}
                  </span>
                </button>
              </form>
            </div>
            <div className="path-switch mt-[30px] md:mt-[60px]">
              <p className="text-center text-[14px] sm:text-[16px] font-medium text-merchant-paragraph">
                Don’t have an account?{" "}
                <Link href="/auth/register" className="text-merchant-primary">
                  Create One
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

export default Login;
