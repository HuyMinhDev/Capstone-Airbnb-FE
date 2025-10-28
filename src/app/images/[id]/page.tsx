"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imagesApi } from "@/lib/api/services/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Upload,
  Link as LinkIcon,
  ChevronDown,
  Heart,
} from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { NEXT_PUBLIC_API_IMAGE_URL } from "@/shared/config/env";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getUserId } from "@/helper/auth";
import { commentApi } from "@/lib/api/services/comment";
import { Comment } from "@/shared/types/commen";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
export default function ImageDetailPage() {
  const params = useParams<{ id: string }>();
  const imageId = params?.id;
  const qc = useQueryClient();
  const userId = getUserId();

  // gọi API lấy chi tiết ảnh
  const { data } = useQuery({
    queryKey: ["image-detail", imageId],
    queryFn: () => imagesApi.detail(imageId),
    enabled: !!imageId,
  });

  const { data: user } = useUserProfile(userId ?? undefined);
  const userProfile = user?.data;

  // fetch danh sách comments
  const { data: commentsRes, isLoading: commentsLoading } = useQuery({
    queryKey: ["image-comments", imageId],
    queryFn: () => commentApi.getComments(imageId, 1, 10),
    enabled: !!imageId,
  });

  const comments = commentsRes?.items ?? [];

  // state input comment
  const [content, setContent] = useState("");

  // mutation thêm comment
  const addComment = useMutation({
    mutationFn: (data: {
      user_id: number | string;
      image_id: number;
      content: string;
    }) => commentApi.createComment(data),
    onSuccess: (res) => {
      toast.success(res.message);
      setContent("");
      qc.invalidateQueries({ queryKey: ["image-comments", imageId] });
    },
  });
  const [saved, setSaved] = useState(false);
  const { data: savedRes } = useQuery({
    queryKey: ["image-saved", imageId, userId],
    queryFn: () => imagesApi.saved(imageId, userId),
    enabled: !!imageId && !!userId,
  });
  useEffect(() => {
    if (savedRes?.isSaved !== undefined) {
      setSaved(savedRes.isSaved);
    }
  }, [savedRes]);

  const toggleSave = useMutation({
    mutationFn: async () => {
      return imagesApi.toggleSave(Number(imageId), Number(userId));
    },
    onSuccess: (res) => {
      toast.success(res.message);
      setSaved((prev) => !prev);
      qc.invalidateQueries({ queryKey: ["image-saved", imageId, userId] });
    },
    onError: () => {
      toast.error("Có lỗi khi lưu ảnh");
    },
  });
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-white rounded-2xl h-auto">
              <CardContent className="p-0">
                <div className="relative group cursor-zoom-in">
                  {data ? (
                    <Zoom>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${NEXT_PUBLIC_API_IMAGE_URL}/${data.path}`}
                        alt={data.image_name}
                        className="block w-full h-auto transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    </Zoom>
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 rounded-lg" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Info + Comments */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md h-fit">
              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant={saved ? "destructive" : "default"}
                  onClick={() => toggleSave.mutate()}
                  disabled={toggleSave.isPending}
                  className="cursor-pointer"
                >
                  {saved ? "Bỏ lưu ảnh" : "Lưu ảnh"}
                </Button>
              </div>

              {/* Source */}
              <div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  threadless.com
                </a>
              </div>

              {/* Title + description */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {data?.image_name || "..."}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {data?.description || "..."}
                </p>
              </div>

              {/* Uploader */}
              <div className="flex items-center gap-3 mt-5">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      data?.users
                        ? `${NEXT_PUBLIC_API_IMAGE_URL}/${data?.users.avatar}`
                        : undefined
                    }
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                    {data?.users.full_name?.trim()?.charAt(0).toUpperCase() ||
                      "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {data?.users?.full_name || "Threadless"}
                  </p>
                  <p className="text-sm text-gray-500">Người đăng ảnh</p>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {comments?.length || 0} nhận xét
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>

                <div className="space-y-3">
                  {commentsLoading ? (
                    <p>Đang tải...</p>
                  ) : comments.length ? (
                    comments.map((c: Comment) => (
                      <div
                        key={c.comment_id}
                        className="flex items-start gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              c?.users.avatar
                                ? `${NEXT_PUBLIC_API_IMAGE_URL}/${c?.users.avatar}`
                                : undefined
                            }
                            alt="User avatar"
                          />
                          <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                            {c?.users.full_name
                              ?.trim()
                              ?.charAt(0)
                              .toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {c.users?.full_name || "Ẩn danh"}
                            </span>
                            <span className="text-sm text-gray-600">
                              {c.content}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {dayjs(c.comment_date).fromNow()}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 cursor-pointer"
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                              <span className="text-xs text-gray-400">
                                Hữu ích
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Chưa có bình luận nào</p>
                  )}
                </div>

                {/* Input thêm comment */}
                <div className="flex items-center gap-3 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        userProfile?.avatar
                          ? `${userProfile?.avatar}`
                          : undefined
                      }
                      alt="User avatar"
                    />
                    <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
                      {userProfile?.name?.trim()?.charAt(0).toUpperCase() ||
                        "?"}
                    </AvatarFallback>
                  </Avatar>

                  <form
                    className="flex-1 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (content.trim()) {
                        addComment.mutate({
                          user_id: userId!,
                          image_id: Number(imageId),
                          content,
                        });
                      }
                    }}
                  >
                    <Input
                      placeholder="Thêm nhận xét"
                      className="flex-1"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />

                    <Button
                      type="submit"
                      className="px-4"
                      disabled={addComment.isPending || !content.trim()}
                    >
                      Gửi
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
