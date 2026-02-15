"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const IDVerificationFiles = () => {
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("selectedDocumentType");
    if (!storedData) return;

    try {
      const parsedData = JSON.parse(storedData);
      const firstField = parsedData?.fields?.[0];
      if (!firstField) return;

      // Save field data for the next page
      localStorage.setItem("currentFieldData", JSON.stringify(firstField));

      // Redirect based on type
      switch (firstField.type) {
        case "camera":
          router.replace(
            "/auth/step-verification/id-verification-files/camera"
          );
          break;
        case "front_camera":
          router.replace(
            "/auth/step-verification/id-verification-files/front-camera"
          );
          break;
        case "file":
          router.replace("/auth/step-verification/id-verification-files/file");
          break;
        default:
          console.warn("Unknown field type:", firstField.type);
      }
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
    }
  }, [router]);

  return null;
};

export default IDVerificationFiles;
