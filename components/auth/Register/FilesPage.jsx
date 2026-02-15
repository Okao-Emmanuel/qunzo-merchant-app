"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import uploadImage from "@/assets/dashboard/id-verification/back-image.png";
import logo from "@/assets/logo/logo.png";
import { compressAndResizeFile } from "@/utils/fileCompressor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const FilesPage = () => {
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64Data = await compressAndResizeFile(file);

    const existingFiles = JSON.parse(
      localStorage.getItem("allCapturedFiles") || "[]"
    );

    const newFileData = {
      fieldName: fieldData?.name || "Unknown",
      fieldType: fieldData?.type || "file",
      fileName: file.name,
      fileType: file.type,
      fileData: base64Data,
      timestamp: new Date().toISOString(),
    };

    existingFiles.push(newFileData);
    localStorage.setItem("allCapturedFiles", JSON.stringify(existingFiles));

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
                  src={uploadImage}
                  width={1000}
                  height={1000}
                  alt="Upload Icon"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="mt-5 sm:mt-[30px] lg:mt-[40px]">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  className="group primary-button w-full"
                  onClick={handleUploadClick}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">Upload File</span>
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

export default FilesPage;
