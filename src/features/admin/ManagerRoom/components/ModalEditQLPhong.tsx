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
import { Room } from "@/features/room/types/room";
import { useLocations } from "@/shared/hooks/useLocations";
import { toast } from "sonner";
import Image from "next/image";
import { LoadingOutlined } from "@ant-design/icons";
import ImageLoader from "@/shared/component/ImageLoader";
import { fileApi } from "@/lib/api/services/fileImage";
import { useUpdateRoom } from "@/shared/hooks/useRoom";
import { useQueryClient } from "@tanstack/react-query";

interface ModalEditQLPhongProps {
  open: boolean;
  room: Room | null;
  onClose: () => void;
}

interface FormValues extends Omit<Room, "image"> {
  image: UploadFile[] | string;
}

export default function ModalEditQLPhong({
  open,
  room,
  onClose,
}: ModalEditQLPhongProps) {
  const [form] = Form.useForm();
  const { data: dataLocation } = useLocations();
  const locationList = dataLocation?.items ?? [];
  const updateRoom = useUpdateRoom();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [fileImageNew, setFileImageNew] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      form.setFieldsValue({
        id: room.id,
        room_name: room.room_name,
        guest_count: room.guest_count,
        bedroom_count: room.bedroom_count,
        bed_count: room.bed_count,
        bathroom_count: room.bathroom_count,
        description: room.description,
        price: room.price,
        washing_machine: room.washing_machine,
        iron: room.iron,
        tv: room.tv,
        air_conditioner: room.air_conditioner,
        wifi: room.wifi,
        kitchen: room.kitchen,
        parking: room.parking,
        pool: room.pool,
        desk: room.desk,
        location_id: room.location_id,
        image: room.image
          ? [
              {
                uid: "-1",
                name: "current-image.jpg",
                status: "done",
                url: room.image,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [room, form, open]);

  // ✅ Chuẩn hóa file upload
  const normFile = (e: UploadChangeParam): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList ?? [];
  };

  function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  // ✅ Đóng modal
  const hideModal = () => {
    form.resetFields();
    onClose();
  };

  // ✅ Gửi form (API update)
  const handleOk = async (values: FormValues) => {
    try {
      setLoading(true);
      let uploadedFileKey = room?.image;

      if (fileImageNew) {
        // Xóa ảnh cũ nếu có
        if (room?.image) {
          const oldKey = room?.image.split("/").pop();
          if (oldKey) await fileApi.remove(oldKey);
        }

        // Upload ảnh mới từ base64
        const fileToUpload = dataURLtoFile(fileImageNew, "cropped_image.jpg");
        const uploadRes = await fileApi.upload(fileToUpload);
        uploadedFileKey = uploadRes.fileKey;
      }

      const payload = {
        // id: values.id,
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
        image: uploadedFileKey,
      };
      console.log("Cập nhật phòng:", payload);
      updateRoom.mutate(
        { id: room!.id, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            onClose();
          },
        }
      );
      // toast.success("Cập nhật phòng thành công!");
      hideModal();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Danh sách vị trí
  const renderSelectOption = () =>
    locationList.map((location) => ({
      value: Number(location.id),
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

  console.log("room.location_id:", room?.location_id, typeof room?.location_id);
  console.log(
    "locationList:",
    locationList.map((l) => [l.id, typeof l.id])
  );

  return (
    <Modal
      title="Cập nhật phòng thuê"
      open={open}
      onCancel={onClose}
      footer={null}
      forceRender
    >
      <Form
        layout="vertical"
        form={form}
        name="form_edit_room"
        onFinish={handleOk}
      >
        {room?.image && (
          <div className="relative w-full h-52">
            <Image
              src={room.image}
              alt={room.room_name}
              fill
              className="object-cover rounded-md mb-2"
            />
          </div>
        )}

        <Form.Item
          label="Hình ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
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
              Chọn hình mới
            </button>
          </Upload>
        </Form.Item>

        <Row gutter={24}>
          <Col span={24} md={12}>
            <Form.Item name="id" hidden>
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input.TextArea rows={5} placeholder="Nhập mô tả phòng..." />
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
              className="w-full"
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
              name="room_name"
              label="Tên phòng"
              rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
            >
              <Input placeholder="Nhập tên phòng..." />
            </Form.Item>

            <Form.Item
              name="location_id"
              label="Vị trí"
              rules={[
                { required: true, message: "Vui lòng chọn vị trí phòng!" },
              ]}
              className="w-full"
            >
              <Select
                showSearch
                allowClear
                placeholder="Chọn vị trí"
                loading={!locationList.length}
                options={renderSelectOption()}
                style={{
                  width: "100%",
                  height: "100%",
                }}
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
            onClick={hideModal}
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
