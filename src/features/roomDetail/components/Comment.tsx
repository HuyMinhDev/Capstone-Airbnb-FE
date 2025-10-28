import { useState } from "react";
import { Form, Input, Rate, Select } from "antd";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  useComments,
  useAddComment,
} from "@/features/roomDetail/hooks/useComments";
import { useAuthStore } from "@/store/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const { TextArea } = Input;

interface CommentProps {
  idRoom: number;
  isBooked?: boolean;
}

interface CommentForm {
  rating: number;
  content: string;
}

export default function Comment({ idRoom }: CommentProps) {
  const { userId } = useAuthStore();
  const { data: dataUser } = useUserProfile(userId ?? undefined);
  const userProfile = dataUser?.data;

  const user = userProfile;
  const [form] = Form.useForm();
  const [sortValue, setSortValue] = useState<string>("newest");

  const { data, isLoading, isError, refetch } = useComments(idRoom);
  const addCommentMutation = useAddComment();

  const listComment = data?.data || [];

  const onFinish = async (values: CommentForm) => {
    if (!user) return toast.error("Vui lòng đăng nhập trước khi bình luận!");

    const payload = {
      ...values,
      room_id: idRoom as number,
      user_id: user.id as number,
      comment_date: dayjs().toISOString(),
    };

    try {
      await addCommentMutation.mutateAsync(payload);
      form.resetFields();
      toast.success("Thêm bình luận thành công!");
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm bình luận!");
    }
  };

  const sortedComments = [...listComment].sort((a, b) => {
    switch (sortValue) {
      case "oldest":
        return (
          new Date(a.comment_date).getTime() -
          new Date(b.comment_date).getTime()
        );
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return (
          new Date(b.comment_date).getTime() -
          new Date(a.comment_date).getTime()
        );
    }
  });

  const renderListComment = () => {
    if (isLoading) {
      return (
        <div className="w-12 h-12 border-2 border-[#FE6B6E] border-t-transparent rounded-full animate-spin"></div>
      );
    }

    if (isError || listComment.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500 italic">Chưa có bình luận nào.</p>
        </div>
      );
    }

    return sortedComments.map((item) => (
      <div key={item.id}>
        <div className="flex items-center gap-3">
          <Avatar className="w-15 h-15 mb-4">
            <AvatarImage
              src={item?.avatar ? `${item?.avatar}` : undefined}
              alt="User avatar"
            />
            <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
              {item?.user_comment?.trim()?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{item.user_comment}</h1>
              <Rate disabled defaultValue={item.rating} />
            </div>
            <p className="text-sm text-gray-500">
              {dayjs(item.comment_date).format("DD-MM-YYYY HH:mm")}
            </p>
          </div>
        </div>
        <p className="">{item.content}</p>
      </div>
    ));
  };

  return (
    <div className="py-5 divide-y-2">
      <div>
        <div className="flex gap-3 items-center">
          <Avatar className="w-16 h-16 mb-4">
            <AvatarImage
              src={user?.avatar ? `${user?.avatar}` : undefined}
              alt="User avatar"
            />
            <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
              {user?.name?.trim()?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-lg font-bold">{user?.name}</h1>
        </div>

        <Form
          form={form}
          name="commentForm"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="rating"
            rules={[{ required: true, message: "Vui lòng chọn sao đánh giá" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea placeholder="Nhập bình luận..." style={{ height: 80 }} />
          </Form.Item>

          <Form.Item>
            <button
              className="button-primary"
              type="submit"
              disabled={addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </Form.Item>
        </Form>
      </div>

      <div className="py-5">
        <h1 className="text-xl font-bold mb-3">Bình luận</h1>
        <Select
          value={sortValue}
          options={[
            { value: "newest", label: "Mới nhất" },
            { value: "oldest", label: "Cũ nhất" },
            { value: "highest", label: "Cao nhất" },
            { value: "lowest", label: "Thấp nhất" },
          ]}
          className="w-32 my-5"
          onChange={setSortValue}
          placeholder="Sắp xếp"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-80 overflow-y-scroll mt-3">
          {renderListComment()}
        </div>
      </div>
    </div>
  );
}
