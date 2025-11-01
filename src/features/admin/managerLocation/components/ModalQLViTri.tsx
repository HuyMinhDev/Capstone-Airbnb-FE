"use client";

import { useState } from "react";
import { Modal, Form, Input, Upload } from "antd";
import type { UploadFile, UploadChangeParam } from "antd/es/upload";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { locationApi } from "@/shared/services/locationServices";
import { useQueryClient } from "@tanstack/react-query";
import { fileApi } from "@/lib/api/services/fileImage";
import ImageLoader from "@/shared/component/ImageLoader";

interface ModalQLViTriProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateLocationPayload {
  location_name: string;
  province: string;
  country: string;
  hinhAnh?: UploadFile[];
}

export default function ModalQLViTri({
  open,
  onClose,
  onSuccess,
}: ModalQLViTriProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileImageNew, setFileImageNew] = useState<string | null>(null);

  const normFile = (e: UploadChangeParam): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList ?? [];
  };

  function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = async (values: CreateLocationPayload) => {
    console.log("Check submit");

    try {
      setLoading(true);
      const file = values.hinhAnh?.[0]?.originFileObj as File | undefined;

      setFileImage(file ?? null);

      if (!fileImageNew) return;

      const fileToUpload =
        typeof fileImageNew === "string"
          ? dataURLtoFile(fileImageNew, "image.jpg")
          : fileImageNew;
      const uploadRes = await fileApi.upload(fileToUpload);

      // Gửi dữ liệu cơ bản trước
      console.log("Check submit");
      const res = await locationApi.createLocation({
        location_name: values.location_name,
        province: values.province,
        country: values.country,
        image: uploadRes.fileKey,
      });

      toast.success(res.message ?? "Thêm vị trí thành công!");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      form.resetFields();
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Thêm vị trí thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm vị trí mới"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="hinhAnh"
          label="Thêm hình"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng chọn hình!" }]}
          hasFeedback
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
            disabled={loading}
            className={`px-4 py-1 rounded-md text-white bg-[#fe6b6e] hover:bg-[#ff8284]`}
          >
            {loading ? <LoadingOutlined /> : "Thêm"}
          </button>
        </div>
      </Form>
      {fileImage && (
        <ImageLoader
          file={fileImage}
          size={400}
          aspect={16 / 9}
          cropShape="rect"
          onDone={(newImage) => {
            setFileImageNew(newImage);

            const fileList = [
              {
                uid: String(Date.now()),
                name: "cropped_image.jpg",
                status: "done",
                url:
                  typeof newImage === "string"
                    ? newImage
                    : URL.createObjectURL(newImage),
              },
            ];

            // Cập nhật lại field hinhAnh trong form
            form.setFieldsValue({ hinhAnh: fileList });

            // Ẩn ImageLoader sau khi crop xong
            setFileImage(null);
          }}
          onCancel={() => setFileImage(null)}
          uploadImage={false}
        />
      )}
    </Modal>
  );
}
