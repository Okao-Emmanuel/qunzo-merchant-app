"use client";
import authBg from "@/assets/auth/auth-bg.png";
import authElem1 from "@/assets/auth/auth-elem-1.svg";
import authElem2 from "@/assets/auth/auth-elem-2.svg";
import logo from "@/assets/logo/logo.png";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import TokenService from "@/network/service/tokenService";
import { decrypt } from "@/utils/crypto";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const IdVerificationChoose = () => {
  const network = new NetworkService();
  const tokenService = new TokenService();
  const router = useRouter();
  const [documentType, setDocumentType] = useState("");
  const [documentTypeLoading, setDocumentTypeLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const searchParams = useSearchParams();
  const encryptedToken = searchParams.get("token");
  const token = encryptedToken ? decrypt(encryptedToken) : null;

  const handleToken = async () => {
    if (!token) return;
    try {
      await tokenService.saveAccessToken(token);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch document types
  const fetchDocumentTypes = async () => {
    try {
      setDocumentTypeLoading(true);
      const res = await network.get(ApiPath.documentTypes, {
        for: "merchant",
      });
      if (res.status === "completed") {
        setDocumentTypes(res.data.data);
      }
    } finally {
      setDocumentTypeLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!documentType) {
      toast.error("Please select a document type");
      return;
    }

    const selectedType = documentTypes.find(
      (type) => type.id === Number(documentType)
    );
    localStorage.setItem("selectedDocumentType", JSON.stringify(selectedType));

    router.push("/auth/step-verification/id-verification-files");
  };

  useEffect(() => {
    handleToken();
    fetchDocumentTypes();
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
              Choose ID Type
            </h2>
            <div className="mt-[40px]">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-3.5 sm:gap-5">
                  <div className="col-span-12">
                    <div className="relative">
                      <Select
                        value={documentType}
                        onValueChange={(value) => setDocumentType(value)}
                        disabled={documentTypeLoading}
                      >
                        <div className="absolute left-[16px] top-1/2 -translate-y-1/2 z-10">
                          <Icon
                            icon="basil:shield-solid"
                            width="24"
                            height="24"
                            className="w-[18px] h-[18px] text-[#9E9A9F]"
                          />
                        </div>
                        <div className="absolute left-[16px] top-[-12px]">
                          <span className="text-[13px] text-[rgba(26,32,44,0.60)] font-semibold bg-white px-[10px]">
                            Select Type{" "}
                            <span className="text-merchant-error">*</span>
                          </span>
                        </div>
                        <SelectTrigger className="w-full !h-[52px] border-2 border-[rgba(26,32,44,0.10)] text-agent-text focus:outline-none focus:shadow-outline pl-[42px]">
                          <SelectValue
                            placeholder={
                              documentTypeLoading
                                ? "Loading Type..."
                                : "Choose Type"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-[8px]">
                          <SelectGroup>
                            <SelectLabel>Select Type</SelectLabel>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.id} value={String(type.id)}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-3.5 mt-5 sm:mt-[30px] lg:mt-[40px]">
                  <button type="submit" className="group primary-button w-full">
                    <span className="primary-button-hover-effect"></span>
                    <span className="primary-button-text">Next</span>
                  </button>
                </div>
              </form>
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

export default IdVerificationChoose;
