"use client";

const CommonModal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={handleContentClick}
      >
        {title && (
          <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
        )}

        <div>{children}</div>

        {footer && (
          <div className="mt-4 flex justify-center gap-3">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default CommonModal;
