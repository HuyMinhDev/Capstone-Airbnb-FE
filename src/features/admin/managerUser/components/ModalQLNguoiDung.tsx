"use client";

import { Modal, Form, Input, Row, Col, Radio, Select, DatePicker } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { CreateUserPayload, userApi } from "@/shared/services/userServices";
import { useQueryClient } from "@tanstack/react-query";

interface ModalQLNguoiDungProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalQLNguoiDung({
  open,
  onClose,
  onSuccess,
}: ModalQLNguoiDungProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleOk = async (values: CreateUserPayload) => {
    const payload = {
      ...values,
      birth_day: (values.birth_day as unknown as dayjs.Dayjs)?.format(
        "YYYY-MM-DD"
      ),
    };

    setLoading(true);
    try {
      await userApi.createUser(payload);
      toast.success("Thêm người dùng thành công!");
      onSuccess();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch {
      toast.error("Thêm người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm người dùng mới"
      open={open}
      onCancel={onClose}
      footer={null}
      forceRender
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleOk}>
        <Row gutter={24}>
          <Col span={24} md={12}>
            <Form.Item
              name="name"
              label="Tên người dùng"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^\d{10}$/, message: "Phải có 10 số" },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
              hasFeedback
            >
              <Select
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { pattern: /[A-Za-z]/, message: "Phải có ít nhất 1 chữ!" },
                { pattern: /\d/, message: "Phải có ít nhất 1 số!" },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="birth_day"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              hasFeedback
            >
              <DatePicker
                maxDate={dayjs()}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="role"
          label="Chức vụ"
          rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
          hasFeedback
        >
          <Radio.Group>
            <Radio value="admin">Admin</Radio>
            <Radio value="user">User</Radio>
          </Radio.Group>
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
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}
