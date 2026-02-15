import line from "@/assets/dashboard/user/user-line.png";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { createPortal } from "react-dom";

const AddWalletModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  modalWidth,
}) => {
  if (!isOpen) return null;

  const handleContentClick = (e) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 z-[99] flex items-center justify-center bg-[#00000050]"
      onClick={onClose}
    >
      <div
        className={`bg-white p-[20px] rounded-[16px] shadow-lg relative`}
        style={{ width: modalWidth || "100%", maxWidth: modalWidth || "514px" }}
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center">
          {title && (
            <h3 className="text-[20px] font-semibold text-agent-text">
              {title}
            </h3>
          )}
          <button onClick={onClose} className="cursor-pointer">
            <Icon
              icon="lucide:x"
              width="26"
              height="26"
              className="text-agent-paragraph"
            />
          </button>
        </div>
        <div className="line mt-[16px] mb-[20px]">
          <Image
            src={line}
            alt="line"
            width={100}
            height={100}
            className="w-full h-[2px]"
          />
        </div>

        <div>{children}</div>

        {footer && (
          <div className="mt-[40px] flex justify-center">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default AddWalletModal;
