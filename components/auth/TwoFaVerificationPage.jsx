"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import logo from "@/assets/logo/logo.png";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const TwoFaVerificationPage = () => {
  const network = new NetworkService();
  const [timeLeft, setTimeLeft] = useState(30);
  const pathname = usePathname();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // handle otp input
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasteData[i] || "";
    }
    setOtp(newOtp);
    t;
    const lastFilledIndex = Math.min(pasteData.length, 6) - 1;
    if (lastFilledIndex >= 0) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // validate otp
  const validateOtp = () => {
    const isFilled = otp.every((digit) => digit !== "");
    if (!isFilled) {
      toast.error("Please enter all 6 digits of the OTP.");
      return false;
    }
    return true;
  };

  // handle otp submit
  const handleOtpSubmit = async () => {
    if (!validateOtp()) return;
    const fullOtp = otp.join("");
    try {
      setLoading(true);
      const requestBody = { code: fullOtp };
      const res = await network.post(ApiPath.twoFaVerification, requestBody);
      if (res.status === "completed") {
        toast.success(res.data.message);
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // effects
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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
              Verify Two FA
            </h2>
            <div className="mt-[40px]">
              <div>
                <div className="grid grid-cols-12 gap-4 sm:gap-6">
                  <div className="col-span-12">
                    <div
                      className="flex flex-wrap items-center justify-between gap-3"
                      onPaste={handlePaste}
                    >
                      {otp.map((value, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={value}
                          ref={(el) => (inputRefs.current[index] = el)}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className={`otp-input text-center ${
                            value ? "user-focus" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="group primary-button w-full mt-5 sm:mt-[30px] lg:mt-[40px]"
                  onClick={handleOtpSubmit}
                  disabled={loading}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">
                    {loading ? "Verifying..." : "Verify"}
                  </span>
                </button>
              </div>
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

export default TwoFaVerificationPage;
