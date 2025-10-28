import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerEscape from "@/shared/assets/image/bannerEscape.jpg";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden mb-16">
      {/* Fixed Background Image */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerEscape.src})`,
        }}
      >
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Play Button */}
        <Button
          size="icon"
          //   variant="secondary"
          className="h-16 w-16 rounded-full bg-[#FE6B6E] hover:bg-[#FE6B6E] transition-all duration-300 hover:scale-110 mb-6"
          aria-label="Play video"
        >
          <Play className="h-6 w-6 fill-current text-white" />
        </Button>

        {/* Tagline */}
        <p className="mb-4 text-sm font-medium tracking-wider text-white/90 sm:text-base">
          Explore. Wander. Disappear.
        </p>

        {/* Main Heading */}
        <h1 className="mb-8 max-w-4xl font-poppins font-serif text-4xl font-normal leading-tight text-white sm:text-5xl md:text-6xl lg:text-5xl text-balance">
          The Great Escape
          <br />
          {"You'll Remember."}
        </h1>
      </div>

      {/* Scroll Indicator (optional) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-[#FE6B6E]">
          <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-[#FE6B6E]" />
        </div>
      </div>
    </section>
  );
}
