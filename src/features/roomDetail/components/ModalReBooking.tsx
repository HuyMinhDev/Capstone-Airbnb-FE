import React from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
} from "@/store/slices/bookingSlice";
import type { RootState } from "@/store/store";

const ModalReBooking: React.FC = () => {
  const dispatch = useDispatch();
  const { isModalReBookingOpen } = useSelector(
    (state: RootState) => state.bookingSlice
  );

  const handleOk = () => {
    dispatch(setIsModalReBookingOpen(false));
    dispatch(setIsModalPaymentOpen(true));
  };

  const handleCancel = () => {
    dispatch(setIsModalReBookingOpen(false));
  };

  return (
    <Modal
      title="Đặt lại lịch"
      okText="Xác nhận"
      cancelText="Hủy"
      open={isModalReBookingOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Bạn có chắc chắn muốn đặt lại lịch này không?</p>
    </Modal>
  );
};

export default ModalReBooking;
