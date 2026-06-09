import { getImageUrl } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api";
import heroBanner from "@/assets/hero-banner.jpg";
import heroBannerVideo from "@/assets/hero-banner.mp4";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";

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

const alignmentClassMap = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const ctaAlignmentClassMap = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const featureAlignmentClassMap = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const featureHighlights = [
  { icon: Truck, label: "Free Shipping 999+" },
  { icon: Shield, label: "Premium Quality" },
  { icon: Sparkles, label: "Since 1984" },
];

const fallbackSlides = [
  {
    id: "fallback-1",
    badge: "Premium Stationery | Since 1984",
    title: "Write Your",
    highlight: "Success Story",
    description: "Premium planners, notebooks and stationery designed to fuel your productivity and creativity.",
    media: { type: "video", src: heroBannerVideo, poster: heroBanner },
    cta: { label: "Shop Now", to: "/shop" },
    secondary: { label: "Explore Planners", to: "/category/planners" },
    stats: [
      { val: "40+", label: "Years Legacy" },
      { val: "50K+", label: "Happy Customers" },
      { val: "100+", label: "Products" },
    ],
    alignment: "left",
    backgroundColor: "#f0f4f8",
    accentColor: "#0f172a",
  },
  {
    id: "fallback-2",
    badge: "New Collection | 2026",
    title: "Plan Your",
    highlight: "Best Year Yet",
    description: "Discover our curated collection of daily and weekly planners engineered for peak performance.",
    media: { type: "image", src: heroSlide2, poster: "" },
    cta: { label: "Explore Now", to: "/shop?filter=new" },
    secondary: { label: "View Best Sellers", to: "/shop?filter=bestseller" },
    stats: [
      { val: "70-90", label: "GSM Paper" },
      { val: "30+", label: "New Arrivals" },
      { val: "4.8", label: "Avg Rating" },
    ],
    alignment: "left",
    backgroundColor: "#f1f8f4",
    accentColor: "#065f46",
  },
  {
    id: "fallback-3",
    badge: "Gift Collection | Curated",
    title: "Give the Gift of",
    highlight: "Inspiration",
    description: "Thoughtfully curated stationery gift sets perfect for every occasion and milestone.",
    media: { type: "image", src: heroSlide3, poster: "" },
    cta: { label: "Shop Gift Sets", to: "/category/bundles" },
    secondary: { label: "Corporate Orders", to: "/corporate" },
    stats: [
      { val: "15+", label: "Gift Sets" },
      { val: "Rs 499", label: "Starting At" },
      { val: "Free", label: "Gift Wrapping" },
    ],
    alignment: "left",
    backgroundColor: "#fdf8f7",
    accentColor: "#991b1b",
  },
];

const isValidHex = (value) => /^#([0-9A-Fa-f]{6})$/.test(value || "");

const hexToRgba = (hex, alpha = 0.2) => {
  if (!isValidHex(hex)) {
    return `rgba(15, 23, 42, ${alpha})`;
  }

  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const normalizeStats = (stats) => {
  if (!Array.isArray(stats)) return [];

  return stats
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      val: String(item.val ?? item.value ?? "").trim(),
      label: String(item.label ?? "").trim(),
    }))
    .filter((item) => item.val !== "" && item.label !== "")
    .slice(0, 3);
};

const normalizeSlides = (rawSlides) => {
  if (!Array.isArray(rawSlides)) return [];

  return rawSlides
    .filter((slide) => slide && typeof slide === "object")
    .map((slide, index) => {
      const media = slide.media || {};
      const mediaSrc = String(media.src || "").trim();
      const mediaType = media.type === "video" ? "video" : "image";
      const alignment = ["left", "center", "right"].includes(slide.alignment) ? slide.alignment : "left";

      if (!mediaSrc) {
        return null;
      }

      return {
        id: String(slide.id || `hero-${index + 1}`),
        badge: String(slide.badge || "").trim(),
        title: String(slide.title || "").trim(),
        highlight: String(slide.highlight || "").trim(),
        description: String(slide.description || "").trim(),
        media: {
          type: mediaType,
          src: mediaSrc,
          poster: media.poster || "",
        },
        cta: {
          label: String(slide.cta?.label || "").trim(),
          to: String(slide.cta?.to || "").trim(),
        },
        secondary: {
          label: String(slide.secondary?.label || "").trim(),
          to: String(slide.secondary?.to || "").trim(),
        },
        stats: normalizeStats(slide.stats),
        alignment,
        backgroundColor: isValidHex(slide.backgroundColor) ? slide.backgroundColor : "#f8fafc",
        accentColor: isValidHex(slide.accentColor) ? slide.accentColor : "#0f172a",
      };
    })
    .filter(Boolean);
};

const HeroCarousel = () => {
  const [slides, setSlides] = useState(fallbackSlides);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroSlides = async () => {
      try {
        const data = await api.getHeroSlides();
        if (!isMounted) return;
        const normalized = normalizeSlides(data);
        setSlides(normalized.length > 0 ? normalized : fallbackSlides);
      } catch (error) {
        if (!isMounted) return;
        console.error("Unable to load hero slides", error);
        setSlides(fallbackSlides);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHeroSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const goToSlide = useCallback(
    (index) => {
      if (index < 0 || index >= slides.length || index === current) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current, slides.length],
  );

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#f8fafc]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh] py-12 lg:py-0 animate-pulse">
            <div className="space-y-5">
              <div className="h-7 w-56 rounded-full bg-slate-200" />
              <div className="h-14 w-3/4 rounded-xl bg-slate-200" />
              <div className="h-6 w-2/3 rounded-xl bg-slate-200" />
              <div className="h-24 w-full max-w-md rounded-xl bg-slate-200" />
            </div>
            <div className="h-[320px] rounded-3xl bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[current];
  const contentAlignmentClass = alignmentClassMap[slide.alignment] || alignmentClassMap.left;
  const ctaAlignmentClass = ctaAlignmentClassMap[slide.alignment] || ctaAlignmentClassMap.left;
  const featureAlignmentClass = featureAlignmentClassMap[slide.alignment] || featureAlignmentClassMap.left;

  return (
    <section
      className="hero-carousel relative overflow-hidden transition-all duration-700 ease-in-out"
      style={{ backgroundColor: slide.backgroundColor }}
    >
      <div
        className="hero-carousel__bg-accent opacity-10 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 80% 40%, ${hexToRgba(slide.accentColor, 0.3)}, transparent)`,
        }}
      />

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh] py-12 lg:py-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${slide.id}-content`}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`space-y-6 relative z-10 flex flex-col ${contentAlignmentClass}`}
            >
              {slide.badge ? (
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                  {slide.badge}
                </span>
              ) : null}

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                {slide.title}
                {slide.highlight ? (
                  <>
                    <br />
                    <span className="text-primary">{slide.highlight}</span>
                  </>
                ) : null}
              </h1>

              {slide.description ? (
                <p className="text-base lg:text-lg text-muted-foreground max-w-md leading-relaxed">
                  {slide.description}
                </p>
              ) : null}

              <div className={`flex flex-wrap gap-3 pt-2 ${ctaAlignmentClass}`}>
                {slide.cta.label && slide.cta.to ? (
                  <Link
                    to={slide.cta.to}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    {slide.cta.label} <ArrowRight size={16} />
                  </Link>
                ) : null}

                {slide.secondary.label && slide.secondary.to ? (
                  <Link
                    to={slide.secondary.to}
                    className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {slide.secondary.label}
                  </Link>
                ) : null}
              </div>

              <div className={`flex flex-wrap gap-5 pt-4 ${featureAlignmentClass}`}>
                {featureHighlights.map((feature) => (
                  <div key={feature.label} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon size={16} className="text-primary" />
                    </div>
                    <span className="text-xs font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${slide.id}-media`}
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
                    poster={slide.media.poster || undefined}
                  />
                ) : (
                  <img
                    src={getImageUrl(slide.media.src)}
                    alt={slide.highlight || slide.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {slide.stats.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-6 bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-border/50 shadow-lg"
                >
                  <div className="grid grid-cols-3 divide-x divide-border">
                    {slide.stats.map((stat) => (
                      <div key={stat.label} className="text-center px-2">
                        <p className="text-lg sm:text-xl font-bold text-primary">{stat.val}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 ? (
        <>
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
        </>
      ) : null}

      {slides.length > 1 ? (
        <div className="hero-carousel__dots">
          {slides.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`hero-carousel__dot ${index === current ? "hero-carousel__dot--active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === current ? (
                <span
                  className="hero-carousel__dot-progress"
                  style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }}
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default HeroCarousel;
