"use client";

import { Modal, Form, Input, Row, Col, Radio, Select, DatePicker } from "antd";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUpdateUser } from "@/shared/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface ModalEditQLNguoiDungProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  gender: "male" | "female" | "other" | string;
  birth_day: string | Dayjs;
  avatar: string;
  created_at: string;
  phone?: string;
}

export default function ModalEditQLNguoiDung({
  open,
  user,
  onClose,
}: ModalEditQLNguoiDungProps) {
  const queryClient = useQueryClient();
  const updateUser = useUpdateUser();
  const [radioValue, setRadioValue] = useState<"admin" | "user">("user");

  // ✅ Tạo form instance
  const [form] = Form.useForm();

  // ✅ Cập nhật form mỗi khi `user` thay đổi
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender === "male" ? "male" : "female",
        birth_day: user.birth_day ? dayjs(user.birth_day) : null,
        role: user.role?.toLowerCase() || "user",
      });
      setRadioValue(user.role?.toLowerCase() as "admin" | "user");
    } else {
      form.resetFields();
      setRadioValue("user");
    }
  }, [user, open, form]);

  const handleSubmit = (values: User) => {
    if (!user) return;
    const payload = {
      ...values,
      birth_day: (values.birth_day as dayjs.Dayjs)?.format("YYYY-MM-DD"),
    };

    updateUser.mutate(
      { id: user.id, data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      title="Cập nhật người dùng"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên người dùng"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^\d{10}$/, message: "Phải có đúng 10 số!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select
                placeholder="Chọn giới tính"
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="birth_day"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                maxDate={dayjs()}
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Chức vụ"
              rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
            >
              <Radio.Group
                onChange={(e) => setRadioValue(e.target.value)}
                value={radioValue}
              >
                <Radio value="admin">Admin</Radio>
                <Radio value="user">User</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

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
            disabled={updateUser.isPending}
          >
            Cập nhật
          </button>
        </div>
      </Form>
    </Modal>
  );
}
