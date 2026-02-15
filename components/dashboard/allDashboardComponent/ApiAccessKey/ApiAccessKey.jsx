"use client";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ApiAccessKey = () => {
  const networkService = new NetworkService();
  const [publicAPIKey, setPublicAPIKey] = useState("");
  const [secretAPIKey, setSecretAPIKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Fetch API keys from server
  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const res = await networkService.get(ApiPath.apiKeys);
      if (res.status === "completed") {
        const data = res.data.data;
        setPublicAPIKey(data.public_key || "");
        setSecretAPIKey(data.secret_key || "");
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate new API keys
  const generateNewKey = async () => {
    setGenerating(true);
    try {
      const res = await networkService.post(ApiPath.generateApiKey);
      if (res.status === "completed") {
        const data = res.data.data;
        setPublicAPIKey(data.public_key);
        setSecretAPIKey(data.secret_key);
        toast.success("New API keys generated successfully!");
      } else {
        toast.error("Failed to generate new API keys.");
      }
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const SkeletonCard = () => (
    <div className="flex flex-col gap-[30px]">
      <div className="w-full h-[48px] bg-gray-200 rounded-[8px] animate-pulse"></div>
      <div className="w-full h-[48px] bg-gray-200 rounded-[8px] animate-pulse"></div>
      <div className="w-full h-[48px] bg-gray-200 rounded-[8px] animate-pulse"></div>
    </div>
  );

  return (
    <div>
      <h2 className="text-[20px] font-bold text-merchant-text mb-[32px]">
        API Access Key
      </h2>
      <div className="bg-white rounded-[8px] px-[20px] py-[20px] sm:py-[80px] border border-[rgba(26,32,44,0.16)] overflow-x-auto">
        <div className="max-w-[514px] mx-auto w-full">
          {loading ? (
            <SkeletonCard />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-[30px]">
                <div className="col-span-12">
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="publicKey"
                      className={`user-input peer w-full`}
                      placeholder=" "
                      value={publicAPIKey}
                      readOnly
                    />
                    <label
                      htmlFor="publicKey"
                      className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[10px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                    >
                      Public Key <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="secretKey"
                      className={`user-input peer w-full`}
                      placeholder=" "
                      value={secretAPIKey}
                      readOnly
                    />
                    <label
                      htmlFor="secretKey"
                      className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[10px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                    >
                      Secret Key <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-12 w-full">
                  <button
                    className="group primary-button w-full"
                    onClick={generateNewKey}
                    disabled={generating}
                  >
                    <span className="primary-button-hover-effect"></span>
                    <span className="primary-button-text">
                      {generating ? "Generating..." : "Regenerate"}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiAccessKey;
