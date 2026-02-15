"use client";
import errorImg from "@/assets/error-img/page-not-found-img.png";
import Image from "next/image";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-[1015px] mx-auto text-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <div className="mb-[200px] sm:mb-[150px] md:mb-[250px]">
            <h2 className="text-[70px] md:text-[90px] lg:text-[100px] font-bold text-merchant-text">
              404
            </h2>
            <p className="text-[24px] md:text-[30px] font-bold text-merchant-primary">
              Oops
            </p>
            <p className="text-[18px] md:text-[20px] lg:text-[24px] font-semibold text-merchant-paragraph">
              Page not found
            </p>
            <button
              onClick={() => window.history.back()}
              className="text-merchant-text font-semibold mt-4"
            >
              ← Go Back
            </button>
          </div>
        </div>
        <div>
          <div className="w-full h-auto">
            <Image
              src={errorImg}
              alt="error"
              width={1000}
              height={1000}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
