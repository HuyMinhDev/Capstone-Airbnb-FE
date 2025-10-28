"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, Upload } from "antd";
import type { UploadFile, UploadChangeParam } from "antd/es/upload";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Location } from "@/shared/services/locationServices";
import Image from "next/image";
import { useUpdateLocation } from "@/shared/hooks/useLocations";
import { fileApi } from "@/lib/api/services/fileImage";
import ImageLoader from "@/shared/component/ImageLoader";
import { LoadingOutlined } from "@ant-design/icons";

interface ModalEditQLViTriProps {
  open: boolean;
  location: Location | null;
  onClose: () => void;
}

export default function ModalEditQLViTri({
  open,
  location,
  onClose,
}: ModalEditQLViTriProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const updateLocation = useUpdateLocation();

  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileImageNew, setFileImageNew] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      form.setFieldsValue({
        location_name: location.location_name ?? "",
        province: location.province ?? "",
        country: location.country ?? "",
        image: location.image
          ? [
              {
                uid: "-1",
                name: "current-image.jpg",
                status: "done",
                url: location.image,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [location, open, form]);

  const normFile = (e: UploadChangeParam): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList ?? [];
  };

  // Chuyển base64 → File
  function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = async (values: Location) => {
    if (!location) return;
    try {
      setLoading(true);

      let uploadedFileKey = location.image;

      // 🧩 Nếu có ảnh mới được crop
      if (fileImageNew) {
        // Xóa ảnh cũ nếu có
        if (location.image) {
          const oldKey = location.image.split("/").pop();
          if (oldKey) await fileApi.remove(oldKey);
        }

        // Upload ảnh mới từ base64
        const fileToUpload = dataURLtoFile(fileImageNew, "cropped_image.jpg");
        const uploadRes = await fileApi.upload(fileToUpload);
        uploadedFileKey = uploadRes.fileKey;
      }

      const payload = {
        location_name: values.location_name,
        province: values.province,
        country: values.country,
        image: uploadedFileKey,
      };

      updateLocation.mutate(
        { id: location.id, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] });
            onClose();
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật vị trí thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật vị trí"
      open={open}
      onCancel={onClose}
      footer={null}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {location?.image && (
          <div className="relative w-full h-52">
            <Image
              src={location.image}
              alt={location.location_name}
              fill
              className="object-cover rounded-md mb-2"
            />
          </div>
        )}

        <Form.Item
          name="image"
          label="Đổi hình"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture"
            maxCount={1}
            accept="image/*"
            beforeUpload={() => false} // phải có return false
            onChange={(info) => {
              const rawFile = info.fileList?.[0]?.originFileObj;
              if (rawFile instanceof File) {
                setFileImage(rawFile);
              }
            }}
          >
            <button
              className="border-2 bg-[#FE6B6E] border-[#FE6B6E] text-white py-2 px-3 rounded-md"
              type="button"
            >
              Đổi hình
            </button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="location_name"
          label="Tên vị trí"
          rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="province"
          label="Tỉnh thành"
          rules={[{ required: true, message: "Vui lòng nhập tỉnh thành!" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="country"
          label="Quốc gia"
          rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-1 rounded-md"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-[#fe6b6e] text-white px-4 py-1 rounded-md"
            disabled={loading}
          >
            {loading ? <LoadingOutlined /> : "Cập nhật"}
          </button>
        </div>
      </Form>

      {fileImage && (
        <ImageLoader
          file={fileImage}
          size={400}
          aspect={16 / 9} // 👈 Hình chữ nhật ngang
          cropShape="rect"
          onDone={(newImage) => {
            setFileImageNew(newImage);

            // Hiển thị preview ngay trong field Upload
            const fileList = [
              {
                uid: String(Date.now()),
                name: "cropped_image.jpg",
                status: "done",
                url: newImage,
              },
            ];
            form.setFieldsValue({ image: fileList });

            // Đóng cropper
            setFileImage(null);
          }}
          onCancel={() => setFileImage(null)}
          uploadImage={false}
        />
      )}
    </Modal>
  );
}
