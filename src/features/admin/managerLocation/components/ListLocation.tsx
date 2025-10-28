"use client";

import { useState } from "react";
import { Table, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { useUser } from "@/shared/hooks/useUser";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Location } from "@/shared/services/locationServices";
import {
  useDeleteLocation,
  useLocationsByKeyword,
} from "@/shared/hooks/useLocations";
// import { useQueryClient } from "@tanstack/react-query";

interface ListLocationProps {
  valueInput: string;
  onEdit: (location: Location) => void;
}

export default function ListLocation({
  valueInput,
  onEdit,
}: ListLocationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { deleteLocation } = useDeleteLocation();
  // const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useLocationsByKeyword({
    page: currentPage,
    pageSize,
    keyword: valueInput,
  });
  const dataLocation = data?.items;

  const handleDeleteUser = async (id: number): Promise<void> => {
    try {
      deleteLocation(id);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Table<Location>
      style={{ tableLayout: "fixed" }}
      loading={isLoading}
      dataSource={dataLocation?.map((u) => ({ ...u, key: u.id })) ?? []}
      scroll={{ x: "max-content" }}
      pagination={{
        total: data?.totalItem ?? 0,
        current: currentPage,
        pageSize,
        showSizeChanger: true,
        onChange: (page, newPageSize) => {
          setCurrentPage(page);
          if (newPageSize) setPageSize(newPageSize);
        },
      }}
      columns={[
        {
          title: "STT",
          key: "index",
          render: (_, __, index) => (
            <span>{(currentPage - 1) * pageSize + index + 1}</span>
          ),
          width: 80,
        },
        {
          title: "Tên",
          dataIndex: "name",
          key: "name",
          render: (_, record) => (
            <div className="flex items-center gap-2">
              <Avatar className="w-30 h-18 rounded-sm">
                <AvatarImage
                  src={record?.image ? `${record?.image}` : undefined}
                  alt="User avatar"
                />
                <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                  {record?.location_name?.trim()?.charAt(0).toUpperCase() ||
                    "?"}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{record.location_name}</span>
            </div>
          ),
        },

        {
          title: "Tỉnh/Thành phố",
          dataIndex: "province",
          key: "province",
          render: (value) => <p className="truncate">{value}</p>,
        },
        {
          title: "Quốc gia",
          dataIndex: "country",
          key: "country",
          render: (value) => <p className="underline truncate">{value}</p>,
        },
        {
          title: "Thao tác",
          key: "action",
          render: (_, record) => (
            <div>
              <EditOutlined
                onClick={() => onEdit(record)}
                className="text-2xl cursor-pointer mr-2"
              />
              <Popconfirm
                title="Xoá người dùng"
                description="Bạn có chắc muốn xoá người dùng này?"
                onConfirm={() => handleDeleteUser(record.id)}
                okText="Có"
                cancelText="Không"
                okButtonProps={{ danger: true }}
              >
                <DeleteOutlined className="text-2xl cursor-pointer" />
              </Popconfirm>
            </div>
          ),
        },
      ]}
    />
  );
}
