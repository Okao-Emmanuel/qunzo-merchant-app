import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";

const DeleteConfirmationModal = ({
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
        className={`bg-white p-10 rounded-lg shadow-lg relative`}
        style={{ width: modalWidth || "100%", maxWidth: modalWidth || "350px" }}
        onClick={handleContentClick}
      >
        <button
          className="absolute top-0 right-0 p-2 cursor-pointer"
          onClick={onClose}
        >
          <Icon
            icon="lucide:x"
            width="24"
            height="24"
            className="text-user-text"
          />
        </button>

        {title && (
          <h3 className="text-xl font-bold mb-4 text-center text-user-text">
            {title}
          </h3>
        )}

        <div>{children}</div>

        {footer && (
          <div className="mt-8 flex justify-center gap-3 text-user-text">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmationModal;
