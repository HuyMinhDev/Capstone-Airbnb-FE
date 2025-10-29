"use client";

import Image from "next/image";
import banner_Blog from "../../shared/assets/image/banner_blog.jpg";
import blog1 from "../../shared/assets/image/blog1.jpg";
import blog2 from "../../shared/assets/image/blog2.jpg";
import blog3 from "../../shared/assets/image/blog3.png";
import blog4 from "../../shared/assets/image/blog4.png";
import blog5 from "../../shared/assets/image/blog5.png";
import blog6 from "../../shared/assets/image/blog6.png";
import blog7 from "../../shared/assets/image/blog7.png";
import blog8 from "../../shared/assets/image/blog8.png";
import blog9 from "../../shared/assets/image/blog9.png";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Link from "next/link";

const contentData = [
  {
    date: { month: "APR", day: "26" },
    category: "NEWS · SIGHTSEEING",
    title: "Pacific Scenery in Summer",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ...",
    images: [blog1, blog2, blog3],
    reverse: false,
    link: "#",
  },
  {
    date: { month: "APR", day: "16" },
    category: "DINING · NEWS",
    title: "Our New Chef and Spring Special Menu",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ...",
    images: [blog4, blog5, blog6],
    reverse: true,
    link: "#",
  },
  {
    date: { month: "MAR", day: "20" },
    category: "DINING · NEWS · WELLNESS",
    title: "Maintain Your Fitness Routine on Vacation",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ...",
    images: [blog7, blog8, blog9],
    reverse: false,
    link: "#",
  },
];

export default function Blog() {
  return (
    <section>
      {/* Banner */}
      <div className="relative h-[572px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={banner_Blog}
            alt="Poolside background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center text-white">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest">
              Latest News & Blog
            </p>
            <h1 className="text-balance font-sans text-6xl font-normal tracking-tight md:text-7xl lg:text-8xl">
              Our News
            </h1>
          </div>
        </div>
      </div>

      {/* Blog */}
      <div className="container mx-auto px-4 py-16 max-w-[1248px]">
        {contentData.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col lg:flex-row mb-10 border",
              item.reverse && "lg:flex-row-reverse"
            )}
          >
            {/* Carousel Section */}
            <div className="relative w-full lg:w-1/2 ">
              <Carousel className="w-full ">
                <CarouselContent>
                  {item.images.map((image, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden group">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${item.title} - Image ${idx + 1}`}
                          fill
                          className="object-cover absolute inset-0 transition-transform duration-500 ease-in-out transform-gpu will-change-transform group-hover:scale-110"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 cursor-pointer" />
                <CarouselNext className="right-4 cursor-pointer" />
              </Carousel>

              {/* Date Badge */}
              <div className="absolute left-0 top-0 bg-white px-4 py-3 text-center shadow-md">
                <div className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                  {item.date.month}
                </div>
                <div className="text-3xl font-light leading-none text-foreground">
                  {item.date.day}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex w-full items-center justify-center bg-muted/30 p-8 lg:w-1/2 lg:p-16 ">
              <div className="max-w-xl">
                <div className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {item.category}
                </div>
                <h2 className="mb-6 font-serif text-4xl font-light leading-tight text-foreground lg:text-5xl">
                  {item.title}
                </h2>
                <p className="mb-6 leading-relaxed text-foreground/80">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="group inline-flex items-center text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:text-foreground/70"
                >
                  Read More
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
