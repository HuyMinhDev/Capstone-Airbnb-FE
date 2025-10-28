"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
  BarChart,
} from "recharts";
import { useAdminBookings } from "@/shared/hooks/useBooking";
import { useLocationsByKeyword } from "@/shared/hooks/useLocations";
import { useAdminRooms } from "@/shared/hooks/useRoom";
import { useUsers } from "@/shared/hooks/useUser";
import { BookingItem } from "@/shared/types/bookingForUser";
import CountUp from "react-countup";

export default function ManagerChart() {
  const { data: dataBookings } = useAdminBookings({ page: 1, pageSize: 100 });
  const { data: dataLocations } = useLocationsByKeyword({
    page: 1,
    pageSize: 100,
  });
  const { data: dataRooms } = useAdminRooms({ page: 1, pageSize: 100 });
  const { data: dataUsers } = useUsers({ page: 1, pageSize: 100 });

  const [stats, setStats] = useState({
    users: 0,
    locations: 0,
    rooms: 0,
    bookings: 0,
  });
  const [bookingTrend, setBookingTrend] = useState<
    { month: string; count: number }[]
  >([]);
  const [bookingByLocation, setBookingByLocation] = useState<
    { name: string; count: number }[]
  >([]);
  console.info(bookingByLocation);

  // ===== Xử lý dữ liệu =====
  useEffect(() => {
    if (!dataBookings || !dataUsers || !dataRooms || !dataLocations) return;

    const totalUsers = dataUsers?.totalItem || dataUsers?.items?.length || 0;
    const totalLocations =
      dataLocations?.totalItem || dataLocations?.items?.length || 0;
    const totalRooms = dataRooms?.totalItem || dataRooms?.items?.length || 0;
    const totalBookings =
      dataBookings?.data?.totalItem || dataBookings?.data?.items?.length || 0;

    setStats({
      users: totalUsers,
      locations: totalLocations,
      rooms: totalRooms,
      bookings: totalBookings,
    });

    // === Biểu đồ theo tháng ===
    const trendMap: Record<string, number> = {};
    const locMap: Record<string, number> = {};

    dataBookings?.data?.items?.forEach((b: BookingItem) => {
      const date = new Date(b?.created_at);
      const month = date.toLocaleString("default", { month: "short" });
      trendMap[month] = (trendMap[month] || 0) + 1;

      const roomName = b?.Rooms?.room_name ?? "Không rõ sân";
      locMap[roomName] = (locMap[roomName] || 0) + 1;
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const sortedTrend = months
      .filter((m) => trendMap[m])
      .map((m) => ({ month: m, count: trendMap[m] }));

    setBookingTrend(sortedTrend);

    const locData = Object.entries(locMap).map(([name, count]) => ({
      name,
      count,
    }));
    setBookingByLocation(locData);
  }, [dataBookings, dataUsers, dataRooms, dataLocations]);

  const colorMap: Record<string, string> = {
    bookings: "from-blue-500 to-indigo-500",
    users: "from-emerald-500 to-green-500",
    revenue: "from-amber-500 to-orange-500",
    rooms: "from-pink-500 to-rose-500",
    default: "from-gray-400 to-gray-500",
  };

  return (
    <div className="p-6 grid gap-6">
      {/* === KPI CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => {
          const gradient = colorMap[key] || colorMap.default;

          return (
            <Card
              key={key}
              className={`py-5 rounded-2xl shadow-md border-none bg-gradient-to-br ${gradient} text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className="capitalize text-center text-white text-lg font-semibold tracking-wide drop-shadow">
                  {key}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CountUp
                  end={value}
                  duration={1.8}
                  separator=","
                  decimals={key === "revenue" ? 0 : 0}
                  suffix={key === "revenue" ? " ₫" : ""}
                  className="text-4xl font-bold drop-shadow-sm"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* === Booking Trend === */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Lượt đặt sân theo tháng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={bookingTrend}
              margin={{ top: 20, right: 30, bottom: 10, left: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
              <YAxis tick={{ fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
                labelStyle={{ color: "#2563eb", fontWeight: 600 }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="url(#colorCount)"
                strokeWidth={3}
                dot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* === Booking by Room === */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Top địa điểm theo doanh thu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={
                Object.values(
                  (dataBookings?.data?.items ?? []).reduce((acc, b) => {
                    const locationName =
                      b.Rooms?.Locations?.location_name ?? "Không rõ";
                    const revenue = Number(b.total_price) || 0;

                    if (!acc[locationName]) {
                      acc[locationName] = {
                        name: locationName,
                        totalRevenue: 0,
                      };
                    }
                    acc[locationName].totalRevenue += revenue;

                    return acc;
                  }, {} as Record<string, { name: string; totalRevenue: number }>)
                )
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 6) // chỉ lấy top 6 địa điểm
              }
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0.9} />
                </linearGradient>
              </defs>

              <XAxis
                type="number"
                tickFormatter={(val) =>
                  val.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: "#374151", fontSize: 13 }}
              />
              <Tooltip
                formatter={(value) =>
                  `${Number(value).toLocaleString("vi-VN")} ₫`
                }
                labelFormatter={(label) => `Địa điểm: ${label}`}
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
              <Legend />
              <Bar
                dataKey="totalRevenue"
                fill="url(#colorRevenue)"
                barSize={18}
                radius={[6, 6, 6, 6]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
