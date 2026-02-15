"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import logo from "@/assets/logo/logo.png";
import { useUser } from "@/context/UserContext";
import { encrypt } from "@/utils/crypto";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const ScanQrCode = () => {
  const rawToken = Cookies.get("token");
  const encryptedToken = rawToken ? encrypt(rawToken) : "";
  const [qrCodeValue, setQrCodeValue] = useState("");
  const { user } = useUser();
  const router = useRouter();
  // console.log("user", user?.id);

  // const qrCodeValue = `${window.location.origin}/auth/step-verification/id-verification-choose`;
  // console.log("saas", qrCodeValue);
  // console.log("token is", tokenId);

  useEffect(() => {
    if (!encryptedToken) return;

    const qrCodeValue = `${
      window.location.origin
    }/auth/step-verification/id-verification-choose?token=${encodeURIComponent(
      encryptedToken
    )}`;

    setQrCodeValue(qrCodeValue);
  }, []);

  // useEffect(() => {
  //   if (!user?.id) return;
  //   const channel = pusherClient.subscribe(`register.${user?.id}`);
  //   channel.bind("pusher:subscription_succeeded", () => {
  //     console.log("Subscribed successfully!");
  //   });
  //   channel.bind("register.process.completed", function (data) {
  //     console.log("data", data);
  //     router.push("/auth/step-verification/success-status");
  //   });
  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, [user?.id]);

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
            <h2 className="text-[24px] text-merchant-text font-bold mb-[8px]">
              To Complete Registration Scan <br /> QR Code In your Mobile
            </h2>
            <p className="text-[14px] text-merchant-paragraph font-semibold w-[80%]">
              Now we need camera access to verify your identity. <br /> Scan
              this QR code and Complete your registration Process.
            </p>
            <div className="mt-[40px]">
              <div
                style={{
                  height: "auto",
                  margin: "0 auto",
                  maxWidth: 200,
                  width: "100%",
                }}
              >
                <QRCode
                  size={200}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                  value={qrCodeValue}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <div className="mt-5 sm:mt-[30px] lg:mt-[40px] w-full">
                <Link
                  href="/auth/login"
                  className="group primary-button w-full"
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">Back to Login</span>
                </Link>
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

export default ScanQrCode;
