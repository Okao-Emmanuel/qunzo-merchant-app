import { createPortal } from "react-dom";

const CommonLogoutModal = ({ isOpen, onClose, children, footer }) => {
  if (!isOpen) return null;

  const handleContentClick = (e) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00000034]"
      onClick={onClose}
    >
      <div
        className={`bg-white p-[20px] sm:p-[30px] rounded-[12px] shadow-lg relative w-[300px] sm:w-[430px]`}
        onClick={handleContentClick}
      >
        <div>{children}</div>
        {footer && (
          <div className="mt-[40px] flex justify-center gap-3">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CommonLogoutModal;
