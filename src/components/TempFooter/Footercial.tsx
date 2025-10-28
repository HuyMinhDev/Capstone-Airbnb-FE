"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import airbnbLogo from "../../shared/assets/image/airbnb-1.png";

import trip from "../../shared/assets/logo/trip.png";
import klook from "../../shared/assets/logo/Klook.png";
import traveloka from "../../shared/assets/logo/traveloka.png";
import ivivu from "../../shared/assets/logo/ivivu.png";
import mytour from "../../shared/assets/logo/mytour.png";
import booking from "../../shared/assets/logo/Booking.svg";
import tiket from "../../shared/assets/logo/tiket.png";
import Image from "next/image";
import Link from "next/link";
import googlePlay from "../../shared/assets/Footer/google-play.webp";
import appStore from "../../shared/assets/Footer/apple.webp";

const Footer: React.FC = () => {
  const navigate = useRouter();
  const handleLinkClick = () => {
    window.location.href = "https://www.airbnb.com.vn/";
  };

  return (
    <footer id="contactSection" className="bg-footer text-white py-12 ">
      <div className="container mx-auto px-4">
        <div className="bg-footer-top grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Contact */}
          <div>
            <div className="space-y-2">
              <div
                className="flex text-2xl font-bold cursor-pointer items-center"
                onClick={() => navigate.push("/")}
              >
                <Image
                  src={airbnbLogo}
                  className="w-10 h-8 object-contain mr-2"
                  alt="Airbnb logo"
                />
                <span className="text-3xl text-primary">airbnb</span>
              </div>
              <p>
                Email:
                <span className="text-white"> nguyenminhhuy2410@gmail.com</span>
              </p>
              <p className="uppercase text-sm">Dịch Vụ Khách Hàng</p>
              <p className="text-white">+(84) 344375201</p>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold text-lg mb-4">Đối Tác</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-4">
                {/* <Link
                  href="https://www.agoda.com/vi-vn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Agoda_logo_2019.svg/2560px-Agoda_logo_2019.svg.png"
                    className="w-10 h-10 object-contain"
                    alt="agoda"
                  />
                </Link> */}
                <Link
                  href="https://www.trip.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={trip}
                    className="w-10 h-10 object-contain"
                    alt="trip"
                  />
                </Link>
                <Link
                  href="https://www.klook.com/vi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={klook}
                    className="w-10 h-10 object-contain"
                    alt="klook"
                  />
                </Link>
                <Link
                  href="https://www.traveloka.com/vi-vn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={traveloka}
                    className="w-10 h-10 object-contain"
                    alt="traveloka"
                  />
                </Link>
                <Link
                  href="https://www.ivivu.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={ivivu}
                    className="w-10 h-10 object-contain"
                    alt="ivivu"
                  />
                </Link>
                <Link
                  href="https://mytour.vn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={mytour}
                    className="w-10 h-10 object-contain"
                    alt="mytour"
                  />
                </Link>
                <Link
                  href="https://www.booking.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={booking}
                    className="w-10 h-10 object-contain"
                    alt="booking"
                  />
                </Link>
                <Link
                  href="https://www.tiket.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={tiket}
                    className="w-10 h-10 object-contain"
                    alt="tiket"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Giới Thiệu</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Phương Thức Hoạt Động Của Airbnb",
                "Trang Tin Tức",
                "Nhà Đầu Tư",
                "Airbnb Plus",
                "Airbnb Luxe",
                "HotelTonight",
                "Airbnb For Work",
                "Nhờ Có Host, Mọi Điều Đều Có Thể",
                "Cơ Hội Nghề Nghiệp",
              ].map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer flex items-center gap-2 hover:text-[#FE6B6E] transition-colors duration-200"
                  onClick={handleLinkClick}
                >
                  <ChevronRight size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Informational Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Cộng Đồng</h4>
            <ul className="space-y-2 text-sm mb-5">
              {[
                "Sự Đa Dạng Và Cảm Giác Thân Thuộc",
                "Tiện Nghi Phù Hợp Cho Người Khuyết Tật",
                "Đối Tác Liên Kết Airbnb",
                "Chỗ Ở Cho Tuyến Đầu",
                "Lượt Giới Thiệu Của Khách",
                "Airbnb.org",
              ].map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer flex items-center gap-2 hover:text-[#FE6B6E] transition-colors duration-200"
                  onClick={handleLinkClick}
                >
                  <ChevronRight size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Đón Tiếp Khách</h4>
            <ul className="space-y-2 text-sm mb-5">
              {[
                "Cho Thuê Nhà",
                "Tổ Chức Trải Nghiệm Trực Tuyến",
                "Tổ Chức Trải Nghiệm",
                "Đón Tiếp Khách Có Trách Nhiệm",
                "Trung Tâm Tài Nguyên",
                "Trung Tâm Cộng Đồng",
              ].map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer flex items-center gap-2 hover:text-[#FE6B6E] transition-colors duration-200"
                  onClick={handleLinkClick}
                >
                  <ChevronRight size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-2">Đăng Ký Nhận Bản Tin</h4>
            <div className="subscribe-item flex flex-col sm:flex-row items-stretch sm:items-center">
              <input
                type="text"
                placeholder="Email*"
                className="p-2 text-black text-sm rounded-t-md sm:rounded-l-md sm:rounded-tr-none w-full sm:w-auto"
              />
              <button className="bg-primary px-4 py-2 text-sm rounded-b-md sm:rounded-r-md sm:rounded-bl-none w-full sm:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-footer-end mt-12 pt-6 text-sm flex flex-col gap-4 md:flex-row justify-between items-center text-center md:text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {["/terms-of-use", "/privacyPolicy", "/faq", "/playlist"].map(
                (path) => (
                  <Link key={path} href={path} className="text-footer">
                    {path.replace("/", "").replace(/-/g, " ")}
                  </Link>
                )
              )}
            </div>
            <p>
              © <span className="currentYear">2025</span>{" "}
              <span className="text-primary">AIRPNP</span>. All Rights Reserved.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/videos">
              <Image
                src={googlePlay}
                alt="Google Play"
                width={120}
                height={120}
              />
            </Link>
            <Link href="/videos">
              <Image src={appStore} alt="App Store" width={120} height={120} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
