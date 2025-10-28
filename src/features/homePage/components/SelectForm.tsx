"use client";

import React, { useEffect, useState } from "react";
import { Button, Popover } from "antd";
import { SearchOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import type { Range } from "react-date-range";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import { useDispatch, useSelector } from "react-redux";

import {
  setCheck_in,
  setCheck_out,
  setGuest_quantity,
  setTotalDay,
  setLocation_id,
} from "@/store/slices/bookingSlice";
import type { RootState, AppDispatch } from "@/store/store";
import type { SelectFormProps } from "../types";
import { useLocations } from "@/shared/hooks/useLocations";
import { Location } from "@/shared/services/locationServices";
import { DatePicker } from "antd";
import { Skeleton } from "antd";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SelectForm: React.FC<SelectFormProps> = ({
  isRoompage,
  handleSelectRoomByLocation,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { RangePicker } = DatePicker;
  // Lấy danh sách địa điểm
  const { data, isLoading, isError } = useLocations(1, 100);
  const locations = data?.items ?? [];

  const dispatch = useDispatch<AppDispatch>();
  const { check_in, check_out, guest_quantity } = useSelector(
    (state: RootState) => state.bookingSlice
  );

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [openLocation, setOpenLocation] = useState<boolean>(false);

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(check_in),
      endDate: new Date(check_out),
      key: "selection",
    },
  ]);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const booking = useSelector((state: RootState) => state.bookingSlice);

  useEffect(() => {}, [booking]);

  useEffect(() => {
    if (booking.location_id !== null) {
      setSelectedLocationId(booking.location_id);
    }
  }, [booking.location_id]);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (selectedLocationId === null) {
      if (pathname === "/") {
        router.push("/rooms");
        return;
      }
      if (pathname.startsWith("/rooms")) {
        toast.warning("Vui lòng chọn địa điểm trước khi tìm kiếm!");
        return;
      }
    }
    router.push(`/rooms/${selectedLocationId}`);
  };

  // Xử lý chọn địa điểm
  const handleSelectLocation = (id: number | null) => {
    setSelectedLocationId(id);
    dispatch(setLocation_id(id));
    setOpenLocation(false);
    if (isRoompage && handleSelectRoomByLocation) {
      handleSelectRoomByLocation(id);
    }
  };

  // Popover chọn địa điểm
  const locationContent = (
    <div className="p-4">
      <p className="font-bold text-lg mb-2">Tìm kiếm địa điểm</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${
            selectedLocationId === null ? "opacity-50" : ""
          }`}
          onClick={() => handleSelectLocation(null)}
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-300">
            <span className="text-gray-500 font-medium">Không</span>
          </div>
          <p className="mt-2 text-sm font-medium">Không</p>
        </div>
        {isError && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 5a7 7 0 110 14a7 7 0 010-14z"
              />
            </svg>
            <p>Không tìm thấy địa điểm. Vui lòng thử lại.</p>
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Skeleton.Avatar active shape="square" size={80} />
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 60, marginTop: 8 }}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            {locations?.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  selectedLocationId === item.id ? "opacity-50" : ""
                }`}
                onClick={() => handleSelectLocation(item.id)}
              >
                {/* <Image
                  src={item.image}
                  alt={item.province}
                  className="object-cover rounded-md shadow-sm"
                  width={84}
                  height={84}
                /> */}
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={item.image ? `${item.image}` : undefined}
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                    {item?.province?.trim()?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-2 text-sm font-medium">{item.province}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

  const guestContent = (
    <div className="flex items-center justify-between w-40 p-2">
      <p className="text-gray-800 font-medium">Khách</p>
      <div className="flex items-center gap-2">
        <Button
          shape="circle"
          icon={<MinusOutlined />}
          size="small"
          disabled={guest_quantity <= 1}
          onClick={() => dispatch(setGuest_quantity(guest_quantity - 1))}
        />
        <span className="font-semibold">{guest_quantity}</span>
        <Button
          shape="circle"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => dispatch(setGuest_quantity(guest_quantity + 1))}
        />
      </div>
    </div>
  );

  // Popover chọn ngày
  const dateContent = (
    <div className="p-4">
      <div className="custom-range-picker w-full">
        <RangePicker
          className="w-full"
          allowClear={false}
          format="DD MMM YYYY"
          value={[
            dateRange[0].startDate ? dayjs(dateRange[0].startDate) : undefined,
            dateRange[0].endDate ? dayjs(dateRange[0].endDate) : undefined,
          ]}
          disabledDate={(current) =>
            !!(
              current &&
              (current.isBefore(dayjs().startOf("day")) ||
                current.isAfter(dayjs().add(180, "day").endOf("day")))
            )
          }
          onChange={(dates) => {
            if (!dates || !dates[0] || !dates[1]) return;
            const start = dates[0].toDate();
            const end = dates[1].toDate();
            setDateRange([
              { startDate: start, endDate: end, key: "selection" },
            ]);
            const formattedStart = dayjs(start).format("YYYY-MM-DDTHH:mm:ss");
            const formattedEnd = dayjs(end).format("YYYY-MM-DDTHH:mm:ss");

            dispatch(setCheck_in(formattedStart));
            dispatch(setCheck_out(formattedEnd));
            dispatch(
              setTotalDay(
                Math.round(
                  (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
                )
              )
            );
          }}
          classNames={{
            popup: {
              root: "custom-range-picker-dropdown",
            },
          }}
        />
      </div>
    </div>
  );

  const selectedLocation = locations?.find(
    (loc: Location) => loc.id === selectedLocationId
  );

  return (
    <div className="mt-16 mb-10 px-2">
      <div className="container w-full bg-white border rounded-lg md:rounded-full shadow-sm py-2 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
        {/* Địa điểm */}
        <Popover
          content={locationContent}
          trigger="click"
          placement="bottom"
          open={openLocation}
          onOpenChange={(visible) => setOpenLocation(visible)}
        >
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r px-4 cursor-pointer">
            <p className="text-sm font-semibold text-gray-600 mb-1">Địa điểm</p>
            <span className="text-black text-lg sm:text-xl">
              {selectedLocation ? selectedLocation.province : "Chọn địa điểm"}
            </span>
          </div>
        </Popover>

        {/* Thời gian */}
        {/* <Popover content={dateContent} trigger="click" placement="bottom">
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r px-4 cursor-pointer">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Thời gian
            </p>
            <span className="text-gray-800 text-base sm:text-lg">
              {dayjs(dateRange[0].startDate).format("DD MMMM YYYY")} -{" "}
              {dayjs(dateRange[0].endDate).format("DD MMMM YYYY")}
            </span>
          </div>
        </Popover> */}
        <Popover content={dateContent} trigger="click" placement="bottom">
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r px-4 cursor-pointer">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Thời gian
            </p>

            {isClient ? (
              <span className="text-gray-800 text-base sm:text-lg">
                {dayjs(dateRange[0].startDate).format("DD MMMM YYYY")} -{" "}
                {dayjs(dateRange[0].endDate).format("DD MMMM YYYY")}
              </span>
            ) : (
              <span className="text-gray-400 text-base sm:text-lg">
                Đang tải...
              </span>
            )}
          </div>
        </Popover>

        {/* Thêm khách */}
        <div className="flex items-center justify-center text-center px-4">
          <Popover content={guestContent} trigger="click" placement="bottom">
            <div className="flex items-center cursor-pointer">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Thêm khách
                </p>
                <span className="text-gray-800 text-base sm:text-lg">
                  {guest_quantity} khách
                </span>
              </div>
              <div className="ml-10">
                <Button
                  shape="circle"
                  icon={<SearchOutlined />}
                  className="icon-search  cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default SelectForm;
