import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";
import heroBannerVideo from "@/assets/hero-banner.mp4";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";

const slides = [
  {
    id: 1,
    badge: "Premium Stationery · Since 1984",
    title: "Write Your",
    highlight: "Success Story",
    description: "Premium planners, notebooks & stationery designed to fuel your productivity and creativity.",
    cta: { label: "Shop Now", to: "/shop" },
    secondary: { label: "Explore Planners", to: "/category/planners" },
    media: { type: "video", src: heroBannerVideo, poster: heroBanner },
    stats: [
      { val: "40+", label: "Years Legacy" },
      { val: "50K+", label: "Happy Customers" },
      { val: "100+", label: "Products" },
    ],
    accentColor: "from-[hsl(220,45%,25%)] to-[hsl(220,55%,35%)]",
  },
  {
    id: 2,
    badge: "New Collection · 2025",
    title: "Plan Your",
    highlight: "Best Year Yet",
    description: "Discover our curated collection of daily & weekly planners engineered for peak performance.",
    cta: { label: "Explore Now", to: "/shop?filter=new" },
    secondary: { label: "View Best Sellers", to: "/shop?filter=bestseller" },
    media: { type: "image", src: heroSlide2 },
    stats: [
      { val: "70-90", label: "GSM Paper" },
      { val: "30+", label: "New Arrivals" },
      { val: "4.8★", label: "Avg Rating" },
    ],
    accentColor: "from-[hsl(150,25%,40%)] to-[hsl(160,30%,50%)]",
  },
  {
    id: 3,
    badge: "Gift Collection · Curated",
    title: "Give the Gift of",
    highlight: "Inspiration",
    description: "Thoughtfully curated stationery gift sets — perfect for every occasion, every milestone.",
    cta: { label: "Shop Gift Sets", to: "/category/bundles" },
    secondary: { label: "Corporate Orders", to: "/corporate" },
    media: { type: "image", src: heroSlide3 },
    stats: [
      { val: "15+", label: "Gift Sets" },
      { val: "₹499", label: "Starting At" },
      { val: "Free", label: "Gift Wrapping" },
    ],
    accentColor: "from-[hsl(350,40%,45%)] to-[hsl(340,50%,55%)]",
  },
];

const AUTOPLAY_INTERVAL = 6000;

const contentVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -60 : 60,
  }),
};

const mediaVariants = {
  enter: (dir) => ({
    opacity: 0,
    scale: 0.92,
    x: dir > 0 ? 80 : -80,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (dir) => ({
    opacity: 0,
    scale: 0.92,
    x: dir > 0 ? -80 : 80,
  }),
};

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = slides[current];

  return (
    <section
      className="hero-carousel relative overflow-hidden bg-cream"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background gradient accent tied to slide */}
      <div className="hero-carousel__bg-accent" />

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh] py-12 lg:py-0">
          {/* Left — Content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id + "-content"}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-6 relative z-10"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                {slide.badge}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                {slide.title} <br />
                <span className="text-primary">{slide.highlight}</span>
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground max-w-md leading-relaxed">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to={slide.cta.to}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {slide.cta.label} <ArrowRight size={16} />
                </Link>
                <Link
                  to={slide.secondary.to}
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-colors"
                >
                  {slide.secondary.label}
                </Link>
              </div>
              <div className="flex flex-wrap gap-5 pt-4">
                {[
                  { icon: Truck, label: "Free Shipping 999+" },
                  { icon: Shield, label: "Premium Quality" },
                  { icon: Sparkles, label: "Since 1984" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <f.icon size={16} className="text-primary" />
                    </div>
                    <span className="text-xs font-medium">{f.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right — Media */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id + "-media"}
              custom={direction}
              variants={mediaVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted shadow-2xl">
                {slide.media.type === "video" ? (
                  <video
                    src={slide.media.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    poster={slide.media.poster}
                  />
                ) : (
                  <img
                    src={slide.media.src}
                    alt={slide.highlight}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Stats overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-6 bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-border/50 shadow-lg"
              >
                <div className="grid grid-cols-3 divide-x divide-border">
                  {slide.stats.map((s) => (
                    <div key={s.label} className="text-center px-2">
                      <p className="text-lg sm:text-xl font-bold text-primary">{s.val}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hero-carousel__arrow hero-carousel__arrow--left"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="hero-carousel__arrow hero-carousel__arrow--right"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot Indicators + Progress */}
      <div className="hero-carousel__dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goToSlide(i)}
            className={`hero-carousel__dot ${i === current ? "hero-carousel__dot--active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === current && !isPaused && (
              <span
                className="hero-carousel__dot-progress"
                style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
