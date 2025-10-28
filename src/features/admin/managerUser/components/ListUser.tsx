"use client";

import { useState } from "react";
import { Table, Tag, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { User } from "@/shared/types/user";
import { useUser, useUsers } from "@/shared/hooks/useUser";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

interface ListUserProps {
  valueInput: string;
  onEdit: (user: User) => void;
}

export default function ListUser({ valueInput, onEdit }: ListUserProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { deleteUser } = useUser();
  // const { message } = AntdApp.useApp();

  const { data, isLoading, refetch } = useUsers({
    page: currentPage,
    pageSize,
    keyword: valueInput,
  });
  const dataUser = data?.items;
  console.log("dataUser", dataUser);

  const handleDeleteUser = async (id: number): Promise<void> => {
    try {
      deleteUser(id);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Table<User>
      style={{ tableLayout: "fixed" }}
      loading={isLoading}
      dataSource={dataUser?.map((u) => ({ ...u, key: u.id })) ?? []}
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
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={record?.avatar ? `${record?.avatar}` : undefined}
                  alt="User avatar"
                />
                <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                  {record?.name?.trim()?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{record.name}</span>
            </div>
          ),
        },
        {
          title: "Ngày sinh",
          dataIndex: "birth_day",
          key: "birth_day",
          render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "—"),
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          render: (value) => <p className="underline truncate">{value}</p>,
        },
        {
          title: "Người dùng",
          dataIndex: "role",
          key: "role",
          render: (role) =>
            role === "admin" ? (
              <Tag color="red">ADMIN</Tag>
            ) : (
              <Tag color="green">USER</Tag>
            ),
        },
        {
          title: "Số điện thoại",
          dataIndex: "phone",
          key: "phone",
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
