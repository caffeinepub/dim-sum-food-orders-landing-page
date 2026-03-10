import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-dim-sum.dim_1200x600.jpg"
          alt="Delicious dim sum"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          SUMOJI
          <span className="block text-secondary mt-2 text-3xl sm:text-4xl md:text-5xl">
            Steam. Snap. Repeat.
          </span>
        </h1>
        <Button
          size="lg"
          onClick={scrollToMenu}
          data-ocid="hero.primary_button"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[44px]"
        >
          Order Now
        </Button>
      </div>

      {/* Scroll Indicator */}
      <button
        type="button"
        onClick={scrollToMenu}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-colors animate-bounce min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Scroll to menu"
      >
        <ChevronDown size={36} className="sm:w-10 sm:h-10" />
      </button>
    </section>
  );
}
