"use client";

import { useState, useRef } from "react";

interface AvatarUploadProps {
  readonly onFileSelect: (file: File) => void;
  readonly onRemovePhoto?: () => void;
}

export default function AvatarUpload({ onFileSelect }: AvatarUploadProps) {
  const [avatarError, setAvatarError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setAvatarError("");
      onFileSelect(selectedFile);
      e.target.value = "";
    }
    setShowModal(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLabelClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex justify-center pt-3">
      <button
        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer bg-transparent border-none p-0"
        onClick={handleLabelClick}
        type="button"
      >
        <span className="font-inter font-medium text-[14px] leading-[20px] underline underline-offset-[4px] text-[#002D6D]">
          Upload Avatar
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileChange}
      />

      {avatarError && (
        <p className="text-red-500 text-xs mt-1">Lỗi upload avatar</p>
      )}

      {/* Modal */}
      {showModal && (
        <div
          onClick={handleCloseModal}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleCloseModal();
            }
          }}
          className="fixed inset-0 bg-transparent !bg-opacity-80 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="bg-white rounded-[12px] h-[288px] w-[500px] border border-[#D1D5DB] flex flex-col items-center justify-center"
          >
            <div className="py-5 relative flex items-center justify-center w-full border-b-[0.5px] border-[#D1D5DB]">
              <p className="font-inter font-semibold text-2xl leading-8 tracking-normal text-[#111827]">
                Change Avatar
              </p>
              <button
                onClick={handleCloseModal}
                className="bg-[#E2E5E9] w-10 h-10 rounded-full flex items-center justify-center absolute right-0 me-4 transition-all hover:bg-[#D1D5DB] cursor-pointer"
                aria-label="Close dialog"
              >
                x
              </button>
            </div>
            <div className="h-full flex flex-col items-center justify-center gap-8 bg-white rounded-[12px]">
              <button
                onClick={handleUploadClick}
                className="py-4 px-7 bg-[#002D6D] w-[436px] rounded-[100px] border border-[#002D6D] hover:bg-[#00265E] transition cursor-pointer font-inter font-medium text-lg leading-7 tracking-normal text-white"
              >
                Upload Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
