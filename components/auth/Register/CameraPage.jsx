"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import cameraImage from "@/assets/dashboard/id-verification/back-image.png";
import logo from "@/assets/logo/logo.png";
import Image from "next/image";

import { compressAndResizeFile } from "@/utils/fileCompressor";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CameraPage = () => {
  const [fieldData, setFieldData] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Fetch field data from local storage
  useEffect(() => {
    const stored = localStorage.getItem("currentFieldData");
    if (stored) {
      try {
        setFieldData(JSON.parse(stored));
      } catch {
        console.error("Invalid field data in storage");
      }
    }
  }, []);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Handle the captured image
  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64Image = await compressAndResizeFile(file);

    const existingImages = JSON.parse(
      localStorage.getItem("allCapturedImages") || "[]"
    );

    const newImageData = {
      fieldName: fieldData?.name || "Unknown",
      fieldType: fieldData?.type || "camera",
      image: base64Image,
      timestamp: new Date().toISOString(),
    };

    existingImages.push(newImageData);
    localStorage.setItem("allCapturedImages", JSON.stringify(existingImages));

    setTimeout(() => {
      try {
        router.push("/auth/step-verification/id-verification-files-show");
      } catch {
        window.location.href =
          "/auth/step-verification/id-verification-files-show";
      }
    }, 300);
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
            <h2 className="text-[24px] text-merchant-text font-bold mb-[8px]">
              {fieldData?.name}
            </h2>
            <p className="text-[14px] text-merchant-paragraph font-medium">
              {fieldData?.instructions}
            </p>
            <div className="mt-[40px]">
              <div className="image w-[200px] h-auto mx-auto">
                <Image
                  src={cameraImage}
                  width={1000}
                  height={1000}
                  alt="Background Blur"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="mt-5 sm:mt-[30px] lg:mt-[40px]">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleCapture}
                />
                <button
                  type="submit"
                  className="group primary-button w-full"
                  onClick={handleCameraClick}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">Camera</span>
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

export default CameraPage;
