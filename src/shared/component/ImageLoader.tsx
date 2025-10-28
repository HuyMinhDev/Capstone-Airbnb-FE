"use client";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

import { X } from "lucide-react";
import { Plus, Minus, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { fileApi } from "@/lib/api/services/fileImage";
// convert base64 -> HTMLImageElement
function image64ToImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
  });
}

// crop image
async function cropImage64(
  base64: string,
  x: number,
  y: number,
  newWidth: number,
  newHeight: number
): Promise<string> {
  const img = await image64ToImage(base64);
  // Canvas to crop
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.drawImage(img, x, y, newWidth, newHeight, 0, 0, newWidth, newHeight);
  }

  return canvas.toDataURL("image/jpeg");
}

// compress base64 image down to <= maxSizeKB
async function compressImage(
  base64: string,
  maxSizeKB: number = 1024
): Promise<string> {
  let quality = 0.9;
  let compressed = base64;

  while (true) {
    const img = await image64ToImage(base64);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;

    ctx.drawImage(img, 0, 0);

    compressed = canvas.toDataURL("image/jpeg", quality);

    const sizeKB = Math.round((compressed.length * 3) / 4 / 1024);
    if (sizeKB <= maxSizeKB || quality <= 0.3) break;

    quality -= 0.1;
  }

  return compressed;
}

// scale base64 image to desired size
async function resizeImageBase64(
  base64: string,
  targetSize: number
): Promise<string> {
  const img = await image64ToImage(base64);
  const canvas = document.createElement("canvas");

  // scale so that the smallest dimension >= targetSize
  const scale = Math.max(targetSize / img.width, targetSize / img.height);
  const newWidth = img.width * scale;
  const newHeight = img.height * scale;

  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
  }

  return canvas.toDataURL("image/jpeg");
}

function base64ToFile(base64: string, filename: string): File {
  const arr = base64?.split(",");
  const mimeMatch = /:(.*?);/.exec(arr[0]);
  const mime = mimeMatch?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * ImageLoader component props
 *
 * @property file       The uploaded image file (required)
 * @property size       Optional resize size (max width/height in px)
 * @property onDone     Called when done, returns Base64 image
 * @property onCancel   Called when cancel is clicked
 * @property aspect     Optional crop aspect ratio (e.g. 1, 16/9)
 * @property cropShape  Crop shape: "rect" or "round"
 */
interface ImageLoaderProps {
  readonly file: File;
  readonly size?: number;
  readonly onDone: (img: string) => void;
  readonly onCancel: () => void;
  readonly aspect?: number;
  readonly cropShape?: "rect" | "round";
  readonly uploadImage?: boolean;
}

export default function ImageLoader({
  file,
  size = 400,
  onDone,
  onCancel,
  aspect = 1,
  cropShape = "round",
  uploadImage = false,
}: ImageLoaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Read file -> base64
  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const img = await image64ToImage(base64);

      // If the image is too small in one dimension, scale it up
      if (img.width < size || img.height < size) {
        const resized = await resizeImageBase64(base64, size);
        setImageSrc(resized);
      } else {
        setImageSrc(base64);
      }
    };
    reader.readAsDataURL(file);
  }, [file, size]);

  // Save cropped area (in pixels) when cropping is done
  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  // Generate final Base64 image, compress, and call onDone callback
  const handleDone = async () => {
    if (!croppedArea || !imageSrc) return;

    setIsUploading(true);
    try {
      const cropped = await cropImage64(
        imageSrc,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height
      );
      const compressed = await compressImage(cropped, 1024);

      if (uploadImage) {
        try {
          const fileToUpload = base64ToFile(compressed, "avatar.jpg");
          const res = await fileApi.upload(fileToUpload);

          if (res.fileKey) {
            onDone(res.fileKey);
          } else {
            console.error("Upload successful but no fileKey:", res);
            toast.error("Lỗi khi upload hình ảnh!");
          }
        } catch (uploadErr) {
          console.error("Avatar upload error:", uploadErr);
          toast.error("Lỗi khi upload hình ảnh!");
        }
      } else {
        onDone(compressed);
      }
    } catch (err) {
      console.error("Image processing error:", err);
      toast.error("Lỗi khi upload hình ảnh!");
    } finally {
      setIsUploading(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <div
      onClick={onCancel}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onCancel();
        }
      }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-20"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-xl flex flex-col items-center gap-16 w-[45.75rem]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="py-5 relative flex items-center w-full h-[4.5rem] border-b border-[#D1D5DB]">
          <p className="font-inter font-semibold text-2xl leading-8 tracking-normal absolute left-1/2 -translate-x-1/2">
            uploadImage
          </p>
          <button
            onClick={onCancel}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onCancel();
              }
            }}
            className="bg-[#E2E5E9] w-10 h-10 rounded-full flex items-center justify-center absolute right-0 me-4 transition-all hover:bg-[#D1D5DB] cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center gap-5 w-full">
              {/* Cropper */}
              <div className="relative" style={{ width: size, height: size }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  cropShape={cropShape}
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  onInteractionStart={() => setShowGuide(false)}
                />
                {/* Guide overlay */}
                {showGuide && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                      <p className="font-inter font-semibold text-base leading-6 tracking-normal">
                        moveImage
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Zoom Controls */}
            </div>
            <div className="flex items-center gap-3 w-ful w-[505px] mx-auto">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                disabled={zoom <= 1}
                className={`w-8 h-8 flex items-center justify-center rounded-full  ${
                  zoom <= 1 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <Minus size={24} />
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 rounded-lg cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #2C64F6 ${
                    ((zoom - 1) / (3 - 1)) * 100
                  }%, #E5E7EB ${((zoom - 1) / (3 - 1)) * 100}%)`,
                }}
              />

              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                disabled={zoom >= 3}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  zoom >= 3 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <Plus size={24} />
              </button>
            </div>
            {/* Actions */}
          </div>
          <div className="flex justify-end items-end gap-3 w-full pb-8 pe-4">
            <button
              onClick={onCancel}
              disabled={isUploading}
              className="px-4 py-2 bg-[#FFFFFF] rounded-[4px] hover:bg-[#F9FAFB] border border-[#D1D5DB] font-inter font-medium text-base leading-6 tracking-normal text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              disabled={isUploading}
              className="px-4 py-2 bg-[#002D6D] rounded-[4px] hover:bg-[#00265E] border border-transparent font-inter font-medium text-base leading-6 tracking-normal text-[#FFFFFF] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
