import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-dim-sum.dim_1200x600.jpg"
          alt="Delicious dim sum"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          SUMOJI
          <span className="block text-secondary mt-2">Steam. Snap. Repeat.</span>
        </h1>
        <Button
          size="lg"
          onClick={scrollToMenu}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Order Now
        </Button>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll to menu"
      >
        <ChevronDown size={40} />
      </button>
    </section>
  );
}
