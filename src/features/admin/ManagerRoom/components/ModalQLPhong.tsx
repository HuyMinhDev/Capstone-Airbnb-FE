"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Upload,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Switch,
} from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import Image from "next/image";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { fileApi } from "@/lib/api/services/fileImage";
import ImageLoader from "@/shared/component/ImageLoader";
import { useLocations } from "@/shared/hooks/useLocations";
import { CreateRoomPayload, roomApi } from "@/shared/services/roomServices";
// import { Room } from "@/features/room/types/room";
// import { useCreateRoom } from "@/shared/hooks/useRoom";

export default function ModalCreateQLPhong({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { data: dataLocation } = useLocations();
  const locationList = dataLocation?.items ?? [];
  //   const createRoom = useCreateRoom();

  const [loading, setLoading] = useState(false);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileImageNew, setFileImageNew] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setFileImage(null);
      setFileImageNew(null);
    }
  }, [open, form]);

  // ✅ Chuẩn hóa file upload
  const normFile = (e: UploadChangeParam): UploadFile[] =>
    Array.isArray(e) ? e : e?.fileList ?? [];

  // ✅ Chuyển base64 sang File object
  function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  // ✅ Gửi form (API create)
  const handleOk = async (values: CreateRoomPayload) => {
    try {
      setLoading(true);
      let uploadedFileKey = null;

      if (fileImageNew) {
        const fileToUpload = dataURLtoFile(fileImageNew, "new_room.jpg");
        const uploadRes = await fileApi.upload(fileToUpload);
        uploadedFileKey = uploadRes.fileKey;
      }

      const payload = {
        room_name: values.room_name,
        guest_count: values.guest_count,
        bedroom_count: values.bedroom_count,
        bed_count: values.bed_count,
        bathroom_count: values.bathroom_count,
        description: values.description,
        price: values.price,
        washing_machine: values.washing_machine,
        iron: values.iron,
        tv: values.tv,
        air_conditioner: values.air_conditioner,
        wifi: values.wifi,
        kitchen: values.kitchen,
        parking: values.parking,
        pool: values.pool,
        desk: values.desk,
        location_id: values.location_id,
        image: uploadedFileKey ?? "",
      };
      const res = await roomApi.createRoom(payload);
      toast.success(res.message ?? "Tạo phòng mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error("Tạo phòng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đóng modal
  const handleCancel = () => {
    form.resetFields();
    setFileImage(null);
    setFileImageNew(null);
    onClose();
  };

  // ✅ Danh sách vị trí
  const renderSelectOption = () =>
    locationList.map((location) => ({
      value: location.id,
      label: (
        <div className="flex items-center gap-2">
          <Image
            src={location.image}
            alt={location.location_name}
            width={80}
            height={100}
            className="rounded object-cover"
          />
          <span className="truncate">{location.location_name}</span>
        </div>
      ),
    }));

  return (
    <Modal
      title="Thêm phòng mới"
      open={open}
      onCancel={handleCancel}
      footer={null}
      forceRender
    >
      <Form
        layout="vertical"
        form={form}
        name="form_create_room"
        onFinish={handleOk}
      >
        {/* Upload hình ảnh */}
        <Form.Item
          label="Hình ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng chọn ảnh phòng!" }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg"
            beforeUpload={() => false}
            onChange={(info) => {
              const rawFile = info.fileList?.[0]?.originFileObj;
              if (rawFile instanceof File) {
                setFileImage(rawFile);
              }
            }}
          >
            <button
              type="button"
              className="border-2 border-solid py-2 px-3 rounded-md"
            >
              Chọn hình
            </button>
          </Upload>
        </Form.Item>

        <Row gutter={24}>
          <Col span={24} md={12}>
            <Form.Item
              name="room_name"
              label="Tên phòng"
              rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
            >
              <Input placeholder="Nhập tên phòng..." />
            </Form.Item>

            <Form.Item
              name="guest_count"
              label="Số khách"
              rules={[{ required: true, message: "Nhập số khách tối đa" }]}
            >
              <InputNumber min={1} max={20} className="w-full" />
            </Form.Item>

            <Form.Item
              name="bed_count"
              label="Số giường"
              rules={[{ required: true, message: "Nhập số giường" }]}
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá phòng (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá phòng!" }]}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                min={100000}
                step={50000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) =>
                  Number(value ? value.replace(/\s?₫|(,|\.)/g, "") : "")
                }
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              name="location_id"
              label="Vị trí"
              rules={[
                { required: true, message: "Vui lòng chọn vị trí phòng!" },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Chọn vị trí"
                loading={!locationList.length}
                options={renderSelectOption()}
                style={{ width: "100%", height: "100%" }}
                className="w-full [&&_.ant-select-selector]:!py-2"
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              name="bedroom_count"
              label="Số phòng ngủ"
              rules={[{ required: true, message: "Nhập số phòng ngủ" }]}
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>

            <Form.Item
              name="bathroom_count"
              label="Số phòng tắm"
              rules={[{ required: true, message: "Nhập số phòng tắm" }]}
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả phòng..." />
            </Form.Item>
          </Col>
        </Row>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "washing_machine",
            "iron",
            "tv",
            "air_conditioner",
            "wifi",
            "kitchen",
            "parking",
            "pool",
            "desk",
          ].map((item) => (
            <Form.Item
              key={item}
              name={item}
              label={item.replace(/_/g, " ")}
              valuePropName="checked"
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="border px-4 py-1 rounded-md"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-[#fe6b6e] text-white px-4 py-1 rounded-md"
            disabled={loading}
          >
            {loading ? <LoadingOutlined /> : "Tạo phòng"}
          </button>
        </div>
      </Form>

      {/* ✅ Crop ảnh khi chọn */}
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
                name: "new_room.jpg",
                status: "done",
                url: newImage,
              },
            ];
            form.setFieldsValue({ image: fileList });
            setFileImage(null);
          }}
          onCancel={() => setFileImage(null)}
          uploadImage={false}
        />
      )}
    </Modal>
  );
}
