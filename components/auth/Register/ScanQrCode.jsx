"use client";
import { useEffect } from "react";
import NetworkService from "@/network/service/networkService";
import ApiPath from "@/network/api/apiPath";

const ScanQrCode = () => {
  const network = new NetworkService();

  useEffect(() => {
    // QR verification is disabled - redirect immediately using hard redirect
    const redirectToKYC = async () => {
      try {
        const res = await network.get(ApiPath.documentTypes, {
          for: "merchant",
        });
        if (res.status === "completed" && res.data.data.length > 0) {
          const firstDocType = res.data.data[0];
          localStorage.setItem("selectedDocumentType", JSON.stringify(firstDocType));
          window.location.href = "/auth/step-verification/id-verification-files";
        } else {
          window.location.href = "/auth/step-verification/id-verification-choose";
        }
      } catch (error) {
        console.error("Error fetching document types:", error);
        window.location.href = "/auth/step-verification/id-verification-choose";
      }
    };

    redirectToKYC();
  }, []);
  
  return null;
};

export default ScanQrCode;
