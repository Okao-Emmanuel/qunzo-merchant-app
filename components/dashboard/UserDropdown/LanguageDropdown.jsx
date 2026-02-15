"use client";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LanguageDropdown = () => {
  const [languageDropdown, setLAnguageDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLAnguageDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close on route change
  useEffect(() => {
    setLAnguageDropdown(false);
  }, [pathname]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="h-[35px] sm:h-[40px] flex items-center space-x-[5px] sm:space-x-[10px] cursor-pointer bg-white px-[6px] sm:px-[22px] rounded-[8px]"
        onClick={() => setLAnguageDropdown((prev) => !prev)}
      >
        <Icon
          icon="lucide:globe"
          width="18"
          height="18"
          className="text-merchant-text w-[10px] sm:w-[18px] h-[10px] sm:h-[18px]"
        />
        <span className="text-merchant-text text-[12px] sm:text-[14px] font-semibold">
          English
        </span>
      </button>

      {/* Dropdown with animation */}
      <div
        className={`absolute right-0 mt-[10px] w-[153px] bg-white border-2 border-[rgba(26,32,44,0.16)] p-[10px] rounded-[8px] shadow-lg z-10 transform transition-all duration-300 origin-top ${
          languageDropdown
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <ul>
          <li>
            <button className="w-full px-[16px] py-[10px] text-left cursor-pointer text-[14px] rounded-[8px] font-semibold text-merchant-text border-l-2 border-transparent hover:bg-[rgba(76,208,128,0.10)] hover:border-l-2 hover:border-merchant-primary">
              Arabic
            </button>
          </li>
          <li>
            <button className="w-full px-[16px] py-[10px] text-left cursor-pointer text-[14px] rounded-[8px] font-semibold text-merchant-text border-l-2 border-transparent hover:bg-[rgba(76,208,128,0.10)] hover:border-l-2 hover:border-merchant-primary">
              English
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LanguageDropdown;
