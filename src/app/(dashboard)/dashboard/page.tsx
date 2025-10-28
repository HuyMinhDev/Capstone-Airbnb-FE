"use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { imagesApi } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

export default function DashboardPage() {
  // const qc = useQueryClient();
  // const { data: me } = useQuery({
  //   queryKey: ["me"],
  //   queryFn: async () => (await usersApi.me()).data,
  // });
  // const { data: saved } = useQuery({
  //   queryKey: ["me-saved"],
  //   queryFn: async () => (await usersApi.saved()).data,
  // });
  // const { data: created } = useQuery({
  //   queryKey: ["me-created"],
  //   queryFn: async () => (await usersApi.created()).data,
  // });

  // const removeImage = useMutation({
  //   mutationFn: (id: string | number) => imagesApi.remove(id),
  //   onSuccess: () => {
  //     qc.invalidateQueries({ queryKey: ["me-created"] });
  //   },
  // });

  return (
    <div>Hello</div>
    // <div className="mx-auto max-w-5xl py-8 space-y-8">
    //   <div>
    //     <h1 className="text-2xl font-semibold mb-2">
    //       Xin chào, {me?.name || me?.email || "User"}
    //     </h1>
    //     <Link href="/dashboard/edit" className="text-sm underline">
    //       Chỉnh sửa hồ sơ
    //     </Link>
    //   </div>

    //   <section className="space-y-3">
    //     <h2 className="text-xl font-medium">Ảnh đã lưu</h2>
    //     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    //       {Array.isArray(saved)
    //         ? saved.map((img: any) => (
    //             <Link key={img.id} href={`/images/${img.id}`} className="block">
    //               {/* eslint-disable @next/next/no-img-element */}
    //               <img
    //                 alt={img.name}
    //                 src={img.url}
    //                 className="w-full h-40 object-cover rounded-md"
    //               />
    //               <p className="mt-1 text-sm">{img.name}</p>
    //             </Link>
    //           ))
    //         : null}
    //     </div>
    //   </section>

    //   <section className="space-y-3">
    //     <div className="flex items-center justify-between">
    //       <h2 className="text-xl font-medium">Ảnh của tôi</h2>
    //       <Link href="/dashboard/new" className="text-sm underline">
    //         Thêm ảnh
    //       </Link>
    //     </div>
    //     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    //       {Array.isArray(created)
    //         ? created.map((img: any) => (
    //             <div key={img.id} className="group">
    //               <Link href={`/images/${img.id}`} className="block">
    //                 {/* eslint-disable @next/next/no-img-element */}
    //                 <img
    //                   alt={img.name}
    //                   src={img.url}
    //                   className="w-full h-40 object-cover rounded-md"
    //                 />
    //                 <p className="mt-1 text-sm">{img.name}</p>
    //               </Link>
    //               <Button
    //                 variant="destructive"
    //                 className="mt-2"
    //                 disabled={removeImage.isPending}
    //                 onClick={() => removeImage.mutate(img.id)}
    //               >
    //                 Xoá
    //               </Button>
    //             </div>
    //           ))
    //         : null}
    //     </div>
    //   </section>
    // </div>
  );
}
