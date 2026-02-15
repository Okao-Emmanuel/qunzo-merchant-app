"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import logo from "@/assets/logo/logo.png";
import Image from "next/image";

import fileIcon from "@/assets/dashboard/icon/file.png";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { compressAndResizeFile } from "@/utils/fileCompressor";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const IdVerificationFilesShow = () => {
  const network = new NetworkService();
  const [allImages, setAllImages] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [isLastField, setIsLastField] = useState(false);
  const fileInputRefs = useRef({});
  const router = useRouter();

  // Fetch all images from local storage
  useEffect(() => {
    const storedImages = localStorage.getItem("allCapturedImages");
    const storedFiles = localStorage.getItem("allCapturedFiles");
    if (storedImages) {
      try {
        const parsed = JSON.parse(storedImages);
        setAllImages(parsed);
      } catch {
        console.error("Invalid stored images data");
      }
    }
    if (storedFiles) {
      try {
        setAllFiles(JSON.parse(storedFiles));
      } catch {
        console.error("Invalid file data");
      }
    }
  }, []);

  // Retake specific image
  const handleRetake = (index) => {
    const ref = fileInputRefs.current[index];
    if (ref) {
      ref.value = "";
      ref.click();
    }
  };

  // Handle capture/retake for specific image
  const handleCapture = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64Image = await compressAndResizeFile(file);

    const updatedImages = [...allImages];
    updatedImages[index] = {
      ...updatedImages[index],
      image: base64Image,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("allCapturedImages", JSON.stringify(updatedImages));
    setAllImages(updatedImages);
  };

  // Retake specific file
  const handleFileRetake = (index) => {
    const ref = fileInputRefs.current[`file-${index}`];
    if (ref) {
      ref.value = "";
      ref.click();
    }
  };

  // Handle file capture/retake
  const handleFileCapture = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64Data = await compressAndResizeFile(file);

    const updatedFiles = [...allFiles];
    updatedFiles[index] = {
      ...updatedFiles[index],
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileData: base64Data,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("allCapturedFiles", JSON.stringify(updatedFiles));
    setAllFiles(updatedFiles);
  };

  // Go to next step
  const handleNext = async () => {
    const selectedDoc = JSON.parse(
      localStorage.getItem("selectedDocumentType")
    );
    const currentField = JSON.parse(localStorage.getItem("currentFieldData"));
    if (!selectedDoc || !currentField) return;

    const fields = selectedDoc.fields || [];
    const currentFieldIndex = fields.findIndex(
      (f) => f.name === currentField.name
    );

    const nextField = fields[currentFieldIndex + 1];

    if (nextField) {
      localStorage.setItem("currentFieldData", JSON.stringify(nextField));

      switch (nextField.type) {
        case "camera":
          router.push("/auth/step-verification/id-verification-files/camera");
          break;
        case "front_camera":
          router.push(
            "/auth/step-verification/id-verification-files/front-camera"
          );
          break;
        case "file":
          router.push("/auth/step-verification/id-verification-files/file");
          break;
        default:
          console.warn("Unknown field type:", nextField.type);
      }
    } else {
      await handleFormSubmit();
    }
  };

  // helper to convert base64 to File
  const base64ToFile = (base64String, fileName, mimeType) => {
    const byteString = atob(base64String.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], fileName, { type: mimeType });
  };

  const handleFormSubmit = async () => {
    try {
      const selectedDoc = JSON.parse(
        localStorage.getItem("selectedDocumentType")
      );

      const formData = new FormData();
      formData.append("kyc_id", selectedDoc.id);

      // Convert images base64 back to File
      allImages.forEach((img) => {
        if (img.image) {
          const file = base64ToFile(
            img.image,
            `${img.fieldName}.jpg`,
            "image/jpeg"
          );
          formData.append(`fields[${img.fieldName}]`, file);
        }
      });

      // Convert uploaded files base64 back to File
      allFiles.forEach((fileObj) => {
        if (fileObj.fileData) {
          const file = base64ToFile(
            fileObj.fileData,
            fileObj.fileName,
            fileObj.fileType
          );
          formData.append(`fields[${fileObj.fieldName}]`, file);
        }
      });

      const res = await network.postFormData(ApiPath.idVerification, formData);
      if (res.status === "completed") {
        localStorage.removeItem("allCapturedImages");
        localStorage.removeItem("allCapturedFiles");
        localStorage.removeItem("selectedDocumentType");
        localStorage.removeItem("currentFieldData");
        Cookies.set("kycVerify", "false");
        router.push("/auth/step-verification/success-status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const selectedDoc = JSON.parse(
      localStorage.getItem("selectedDocumentType")
    );
    const currentField = JSON.parse(localStorage.getItem("currentFieldData"));
    if (selectedDoc && currentField) {
      const fields = selectedDoc.fields || [];
      const currentFieldIndex = fields.findIndex(
        (f) => f.name === currentField.name
      );
      setIsLastField(currentFieldIndex === fields.length - 1);
    }
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
              Review Documents
            </h2>
            <div className="mt-[40px]">
              {allImages.length || allFiles.length > 0 ? (
                <>
                  <div className="flex flex-col flex-wrap gap-5 items-center justify-center">
                    <>
                      {allImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-full max-w-[250px] sm:max-w-[320px] bg-gray-50 rounded-[10px] border border-user-input-border"
                        >
                          <h3 className="text-user-text font-bold text-[14px] mb-1 p-2 border-b border-user-border pb-2">
                            {img.fieldName}
                          </h3>
                          <div className="p-2">
                            <div className="image w-full h-[150px] sm:h-[220px] mb-3">
                              <Image
                                src={img.image}
                                height={500}
                                width={500}
                                alt="image"
                                className="w-full h-full object-contain rounded-[10px]"
                              />
                            </div>
                            <button
                              onClick={() => handleRetake(idx)}
                              className="group primary-button primary-border primary-button-md w-full"
                            >
                              <span className="primary-button-hover-effect"></span>
                              <span className="primary-button-text">
                                Retake
                              </span>
                            </button>
                            <input
                              ref={(el) => (fileInputRefs.current[idx] = el)}
                              type="file"
                              accept="image/*"
                              capture={
                                img.fieldType === "front_camera"
                                  ? "user"
                                  : img.fieldType === "camera"
                                  ? "environment"
                                  : undefined
                              }
                              onChange={(e) => handleCapture(e, idx)}
                              className="hidden"
                            />
                          </div>
                        </div>
                      ))}
                    </>
                    <>
                      {allFiles.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-full max-w-[250px] sm:max-w-[320px] bg-gray-50 rounded-[10px] border border-user-input-border"
                        >
                          <h3 className="text-user-text font-bold text-[13px] mb-1 p-2 border-b border-user-border pb-2">
                            {img.fieldName}
                          </h3>
                          <div className="p-2">
                            <div className="image w-full h-[150px] sm:h-[220px] mb-3">
                              <Image
                                src={fileIcon}
                                height={500}
                                width={500}
                                alt="image"
                                className="w-full h-full object-contain rounded-[10px]"
                              />
                            </div>
                            <button
                              onClick={() => handleFileRetake(idx)}
                              className="group primary-button primary-border primary-button-md w-full"
                            >
                              <span className="primary-button-hover-effect"></span>
                              <span className="primary-button-text">
                                Retake
                              </span>
                            </button>
                            <input
                              ref={(el) =>
                                (fileInputRefs.current[`file-${idx}`] = el)
                              }
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileCapture(e, idx)}
                              className="hidden"
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  </div>

                  <div className="flex justify-between gap-3.5 mt-8">
                    <button
                      type="button"
                      className="group primary-button w-full"
                      onClick={isLastField ? handleFormSubmit : handleNext}
                    >
                      <span className="primary-button-hover-effect"></span>
                      <span className="primary-button-text">
                        {isLastField ? "Submit" : "Next"}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">No files captured yet.</p>
                </div>
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

export default IdVerificationFilesShow;
