"use client";

import { useEffect, useState } from "react";
import { Modal, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/es/date-picker/locale/vi_VN";
import { addDays } from "date-fns";
import type { RangePickerProps } from "antd/es/date-picker";
import {
  setIsModalCalendarOpen,
  setCheck_in,
  setCheck_out,
  setTotalDay,
} from "@/store/slices/bookingSlice";
import type { RootState, AppDispatch } from "@/store/store";

const { RangePicker } = DatePicker;

export default function ModalCalendar() {
  const dispatch = useDispatch<AppDispatch>();
  const { check_in, check_out, totalDay, isModalCalendarOpen } = useSelector(
    (state: RootState) => state.bookingSlice
  );

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    check_in && check_out
      ? [dayjs(check_in), dayjs(check_out)]
      : [dayjs(), dayjs().add(1, "day")]
  );

  // Cập nhật khi Redux thay đổi (nếu user chọn lại từ nơi khác)
  useEffect(() => {
    if (check_in && check_out) {
      setDateRange([dayjs(check_in), dayjs(check_out)]);
    }
  }, [check_in, check_out]);

  // const handleChange = (dates: any) => {
  //   if (!dates || !dates[0] || !dates[1]) return;

  //   const [start, end] = dates;
  //   setDateRange([start, end]);

  //   // Dispatch về Redux
  //   dispatch(setCheck_in(start.toISOString()));
  //   dispatch(setCheck_out(end.toISOString()));

  //   const diffDays = Math.max(
  //     1,
  //     end.startOf("day").diff(start.startOf("day"), "day")
  //   );
  //   dispatch(setTotalDay(diffDays));
  // };
  const handleChange: RangePickerProps["onChange"] = (dates) => {
    if (!dates || !dates[0] || !dates[1]) return;

    const [start, end] = dates;
    setDateRange([start, end]);

    // Dispatch về Redux
    dispatch(setCheck_in(start.toISOString()));
    dispatch(setCheck_out(end.toISOString()));

    const diffDays = Math.max(
      1,
      end.startOf("day").diff(start.startOf("day"), "day")
    );
    dispatch(setTotalDay(diffDays));
  };

  const handleClose = () => {
    dispatch(setIsModalCalendarOpen(false));
  };

  return (
    <Modal
      title={`${totalDay} đêm`}
      open={isModalCalendarOpen}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <div className="custom-range-picker w-full">
        <RangePicker
          className="w-full"
          value={dateRange}
          onChange={handleChange}
          locale={viVN}
          format="DD MMM YYYY"
          allowClear={false}
          disabledDate={(current) =>
            !!(
              current &&
              (current.isBefore(dayjs().startOf("day")) ||
                current.isAfter(dayjs(addDays(new Date(), 180))))
            )
          }
          classNames={{
            popup: {
              root: "custom-range-picker-dropdown",
            },
          }}
        />
      </div>
    </Modal>
  );
}
