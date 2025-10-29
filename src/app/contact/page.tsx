"use client";

import Image from "next/image";
import banner_Contact from "../../shared/assets/image/banner_contact.png";
import contact_1 from "../../shared/assets/image/contact_1.png";
import contact_2 from "../../shared/assets/image/contact_2.png";
import { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTripadvisor,
} from "react-icons/fa";
function FeatureCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string | StaticImageData;
}) {
  return (
    <div className="relative p-6 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="absolute top-12 -left-12">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border shadow-md">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="py-4 px-8 w-80">
          {" "}
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a simple map using an iframe (no API key required)
    const mapIframe = document.createElement("iframe");
    mapIframe.src =
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4863.21508480317!2d106.70000834999999!3d10.799882850000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b7ff0b40af%3A0xf91b701e2d54e4f4!2zMjgwIMSQLiBCw7lpIEjhu691IE5naMSpYSwgUGjGsOG7nW5nIDIsIELDrG5oIFRo4bqhbmgsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e1!3m2!1svi!2s!4v1761761933868!5m2!1svi!2s";
    mapIframe.width = "100%";
    mapIframe.height = "100%";
    mapIframe.style.border = "0";
    mapIframe.allowFullscreen = true;
    mapIframe.loading = "lazy";
    mapIframe.referrerPolicy = "no-referrer-when-downgrade";

    mapContainer.current.appendChild(mapIframe);

    return () => {
      if (
        mapContainer.current &&
        mapIframe.parentNode === mapContainer.current
      ) {
        mapContainer.current.removeChild(mapIframe);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-foreground text-background p-8 rounded-lg shadow-2xl max-w-sm pointer-events-auto">
          <h3 className="text-2xl font-serif mb-6">Hotel Info</h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                280/99/10 Bùi Hữu Nghĩa, P.Gia Định, Q.Bình Thạnh
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">+84 0344 375 201</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">HuyDev@hotel.com</p>
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-background text-foreground font-semibold text-sm tracking-wide hover:bg-background/90 transition-colors">
            CONTACT US
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const features = [
    {
      id: 1,
      title: "Reception Always Open",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      image: contact_1,
    },
    {
      id: 2,
      title: "Online Reservations",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      image: contact_2,
    },
  ];
  const icons = [
    { id: 1, icon: <FaFacebookF />, href: "#" },
    { id: 2, icon: <FaInstagram />, href: "#" },
    { id: 3, icon: <FaTwitter />, href: "#" },
    { id: 4, icon: <FaYoutube />, href: "#" },
    { id: 5, icon: <FaTripadvisor />, href: "#" },
  ];
  return (
    <section>
      {/* Banner */}
      <div className="relative h-[572px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={banner_Contact}
            alt="Poolside background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-balance font-sans text-6xl font-normal tracking-tight md:text-7xl lg:text-8xl">
              Contact Us
            </h1>
          </div>
        </div>
      </div>

      {/* Blog */}
      <div className="container mx-auto px-4 py-16 max-w-[1248px]">
        <div className="flex justify-center items-center md:flex-row flex-col gap-32">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
        <div className="p-8 md:mt-20 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-4">
                CONTACT US
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
                Get In Touch
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                porttitor tellus vel mauris scelerisque accumsan. Maecenas quis
                nunc sed sapien dignissim pulvinar. Se d at gravida.
              </p>
              <button className="px-6 py-3 bg-[#FE6B6E] hover:bg-[#f36062] text-white font-semibold text-sm tracking-wide transition-colors">
                VIEW PRICES
              </button>
              <div className="flex items-center justify-start gap-4 mt-5">
                {icons.map(({ id, icon, href }) => (
                  <a
                    key={id}
                    href={href}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FE6B6E] text-white hover:bg-white hover:text-black border border-[#FE6B6E] hover:border-black transition"
                  >
                    <span className="text-lg">{icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FE6B6E]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FE6B6E]"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FE6B6E] resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-foreground hover:bg-foreground/90 text-background font-semibold text-sm tracking-wide transition-colors"
                >
                  SEND
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-96 md:h-screen border-t border-border overflow-hidden">
        <MapSection />
      </div>
    </section>
  );
}
