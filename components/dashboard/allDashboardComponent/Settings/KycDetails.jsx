"use client";
import Badge from "@/components/common/Badge";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { CreatedAtFormatDate } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const KycDetails = ({ kycID }) => {
  const network = new NetworkService();
  const [kycHistory, setKycHistory] = useState([]);

  const fetchKycHistory = async () => {
    try {
      const res = await network.get(ApiPath.kycHistory);
      setKycHistory(res.data.data);
    } finally {
    }
  };

  const kycDetails = kycHistory.find((item) => item.id === Number(kycID));

  useEffect(() => {
    fetchKycHistory();
  }, []);

  return (
    <div>
      <Link
        href="/dashboard/settings/kyc-history"
        className="text-merchant-text text-[14px] font-bold flex items-center gap-2 hover:underline hover:text-merchant-primary transition-all duration-300 ease-in-out mb-3"
      >
        <Icon
          icon="lucide:arrow-left"
          width="20"
          height="20"
          className="w-[20px] h-[20px]"
        />
        Back
      </Link>
      <div className="max-w-[514px] mx-auto">
        <div>
          <h2 className="text-[18px] font-bold text-merchant-text mb-[10px]">
            {kycDetails?.type}
          </h2>
          <div className="rounded-[16px] p-[20px] border border-[rgba(255,170,0,0.50)] bg-[#FFF7E6]">
            <div className="flex gap-1 justify-between items-center">
              <div>
                <p className="text-[14px] font-semibold text-merchant-text mb-[12px]">
                  Status
                </p>
                <Badge status={kycDetails?.status} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-merchant-text mb-[12px]">
                  Created Date
                </p>
                <p className="text-[14px] font-semibold text-merchant-paragraph">
                  <CreatedAtFormatDate createdAt={kycDetails?.created_at} />
                </p>
              </div>
            </div>
            {kycDetails?.message && (
              <div className="mt-[30px]">
                <h6 className="text-[14px] font-semibold text-merchant-text mb-[12px]">
                  Message
                </h6>
                <p className="text-[14px] font-medium text-merchant-paragraph">
                  {kycDetails?.message}
                </p>
              </div>
            )}
          </div>
          <div className="mt-[30px] p-[20px] bg-[#F5F7F9] border border-[rgba(45,45,45,0.16)] rounded-[22px] space-y-5">
            {Object.entries(kycDetails?.submitted_data || {}).map(
              ([fieldName, fileUrl], index) => {
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                const isPDF = /\.pdf$/i.test(fileUrl);

                return (
                  <div key={index}>
                    <div>
                      <div className="kyc-gradient p-[11px] mb-[20px]">
                        <h6 className="text-[14px] font-semibold text-merchant-text text-center">
                          {fieldName}
                        </h6>
                      </div>
                      {isImage && (
                        <Image
                          src={fileUrl}
                          alt={fieldName}
                          width={500}
                          height={500}
                          unoptimized
                          className="w-full h-auto object-contain rounded-2xl"
                        />
                      )}
                      {!isImage && !isPDF && (
                        <p className="text-red-500">Unknown File Format</p>
                      )}

                      {isPDF && (
                        <div className="flex justify-center mt-2">
                          <Link
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="text-merchant-primary underline font-semibold">
                              View File
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycDetails;
