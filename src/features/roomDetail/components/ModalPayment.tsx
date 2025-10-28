import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalPaymentOpen } from "@/store/slices/bookingSlice";
import { DatePicker, Form, Input, Modal, Radio, Space, Tabs } from "antd";
import dayjs from "dayjs";
import type { TabsProps } from "antd";
import type { RadioChangeEvent } from "antd";
import type { RootState } from "@/store/store";

type ModalPaymentProps = {
  bookingAction: () => void;
};

type PaymentOnlineForm = {
  soThe1: string;
  soThe2: string;
  soThe3: string;
  soThe4: string;
  maThe: string;
  HSD: string;
  chuThe: string;
};

const ModalPayment: React.FC<ModalPaymentProps> = ({ bookingAction }) => {
  const { isModalPaymentOpen } = useSelector(
    (state: RootState) => state.bookingSlice
  );

  const [value, setValue] = useState<"online" | "offline">("online");
  const [activeTab, setActiveTab] = useState("1");
  const [optionTab1, setOptionTab] = useState<"online" | "offline">("online");
  const dispatch = useDispatch();
  const booking = useSelector((state: RootState) => state.bookingSlice);

  const handleOk = () => {
    dispatch(setIsModalPaymentOpen(false));
  };

  const handleCancel = () => {
    dispatch(setIsModalPaymentOpen(false));
  };

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    const selected = e.target.value as "online" | "offline";
    setValue(selected);
    setOptionTab(selected);
  };

  const onFinish = (values: PaymentOnlineForm) => {
    console.log(values);
    bookingAction();
  };

  const onFinishFailed = () => {
    bookingAction();
  };

  // --- Tab 1: Chọn hình thức thanh toán ---
  const renderContentTab1 = () => (
    <div>
      <Radio.Group onChange={onChangeRadio} value={value}>
        <Space direction="vertical">
          <Radio value="online">
            <div className="grid grid-cols-1 md:flex justify-center items-center gap-3 text-xl">
              <p>Thanh toán trực tuyến</p>
              <div>
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amazon-pay"></i>
                <i className="fa fa-credit-card"></i>
              </div>
            </div>
          </Radio>
          <Radio value="offline">
            <div className="grid grid-cols-1 md:flex justify-center items-center gap-3 text-xl">
              <p>Thanh toán tiền mặt</p>
              <div>
                <i className="fa fa-money-bill"></i>
              </div>
            </div>
          </Radio>
        </Space>
      </Radio.Group>

      <div className="w-full mt-5">
        <button className="button-primary" onClick={() => setActiveTab("2")}>
          Tiếp tục
        </button>
      </div>
    </div>
  );

  // --- Tab 2: Nhập thông tin thanh toán ---
  const renderContentTab2 = () => {
    if (optionTab1 === "online") {
      return (
        <Form
          name="paymentForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          {/* Số thẻ */}
          <Form.Item label="Số thẻ">
            <Space>
              {["soThe1", "soThe2", "soThe3", "soThe4"].map((name) => (
                <Form.Item
                  key={name}
                  name={name}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập đủ 4 nhóm số thẻ",
                    },
                    {
                      pattern: /^\d{4}$/,
                      message: "Mỗi nhóm số phải gồm 4 chữ số",
                    },
                  ]}
                  noStyle={false}
                >
                  <Input maxLength={4} placeholder="XXXX" inputMode="numeric" />
                </Form.Item>
              ))}
            </Space>
          </Form.Item>

          {/* Mã CVV */}
          <Form.Item
            label="Mã CVV"
            name="maThe"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã CVV",
              },
              {
                pattern: /^\d{3,4}$/,
                message: "Mã CVV gồm 3 hoặc 4 chữ số",
              },
            ]}
          >
            <Input maxLength={4} placeholder="CVV" inputMode="numeric" />
          </Form.Item>

          {/* Hạn sử dụng */}
          <Form.Item
            label="Hạn sử dụng"
            name="HSD"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hạn sử dụng của thẻ",
              },
            ]}
          >
            <DatePicker
              format="MM/YYYY"
              picker="month"
              minDate={dayjs()}
              placeholder="Chọn tháng/năm hết hạn"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Tên chủ thẻ */}
          <Form.Item
            label="Tên chủ thẻ"
            name="chuThe"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên chủ thẻ",
              },
              {
                pattern: /^[a-zA-Z\s.'-]+$/,
                message: "Tên chủ thẻ chỉ được chứa chữ cái và khoảng trắng",
              },
            ]}
          >
            <Input placeholder="Nhập tên chủ thẻ (viết hoa không dấu)" />
          </Form.Item>

          {/* Nút hành động */}
          <div className="flex justify-between mt-5">
            <button
              className="button-outline-primary"
              onClick={() => setActiveTab("1")}
              type="button"
            >
              Quay lại
            </button>
            <button className="button-primary" type="submit">
              Thanh toán
            </button>
          </div>
        </Form>
      );
    }

    // --- Nếu chọn thanh toán tiền mặt ---
    return (
      <div>
        <p>
          Số tiền cần thanh toán:{" "}
          <span className="font-bold">
            {new Intl.NumberFormat("vi-VN").format(booking.tienTruocThue)}₫
          </span>
        </p>
        <div className="flex justify-between mt-5">
          <button
            className="button-outline-primary"
            onClick={() => setActiveTab("1")}
          >
            Quay lại
          </button>
          <button className="button-primary" onClick={bookingAction}>
            Xác nhận
          </button>
        </div>
      </div>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Chọn hình thức thanh toán",
      children: renderContentTab1(),
    },
    {
      key: "2",
      label: "Nhập thông tin thanh toán",
      children: renderContentTab2(),
    },
  ];

  return (
    <Modal
      open={isModalPaymentOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      title="Thanh toán đặt sân"
    >
      <Tabs activeKey={activeTab} items={items} onChange={onChange} />
    </Modal>
  );
};

export default ModalPayment;
