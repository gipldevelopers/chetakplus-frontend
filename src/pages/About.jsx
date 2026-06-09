import { getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Heart,
  Package,
  PenTool,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import categoryPlanners from "@/assets/category-planners.jpg";
import categoryNotebooks from "@/assets/category-notebooks.jpg";
import categoryJournals from "@/assets/category-journals.jpg";
import plannerCustomizationImage from "@/assets/plannerCustomizationImage.jpeg";

const stats = [
  { icon: Award, label: "40+ Years", desc: "Crafting stationery with care since 1984" },
  { icon: Users, label: "50,000+", desc: "Students, creators, and professionals served" },
  { icon: BookOpen, label: "100+", desc: "Thoughtfully designed stationery variations" },
  { icon: Heart, label: "Trusted Quality", desc: "Made for everyday writing and planning" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Reliable Quality",
    desc: "From paper feel to binding strength, every detail is chosen for long-lasting daily use.",
  },
  {
    icon: Sparkles,
    title: "Thoughtful Design",
    desc: "We build stationery that feels clean, useful, and beautiful on your desk or in your bag.",
  },
  {
    icon: Target,
    title: "Purposeful Utility",
    desc: "Each product is designed to help people plan clearly, write better, and stay organized.",
  },
];

const journey = [
  {
    year: "1984",
    title: "A small beginning in Ahmedabad",
    desc: "ChetakPlus began with a focus on dependable paper stationery for local students and offices.",
  },
  {
    year: "1990s",
    title: "Built on consistency",
    desc: "Our reputation grew through reliable paper quality, practical formats, and strong word of mouth.",
  },
  {
    year: "Today",
    title: "A modern stationery brand",
    desc: "We continue to evolve with planners, journals, notebooks, and gifting solutions for every kind of routine.",
  },
];

const audiences = [
  {
    icon: BookOpen,
    title: "Students",
    desc: "Study-friendly notebooks, planners, and stationery built for daily academic life.",
  },
  {
    icon: Briefcase,
    title: "Professionals",
    desc: "Clean, dependable tools for meetings, planning, writing, and desk organization.",
  },
  {
    icon: PenTool,
    title: "Writers & Journalers",
    desc: "Smooth pages and elegant formats that make reflection and creativity feel effortless.",
  },
  {
    icon: Package,
    title: "Gifting & Bulk Orders",
    desc: "Thoughtful stationery sets and custom solutions for teams, schools, and corporate gifting.",
  },
];

const qualityPoints = [
  "Premium-feel paper selected for a smooth writing experience",
  "Strong binding and durable covers built for everyday use",
  "Functional layouts for planning, note-taking, and journaling",
  "Design language that feels warm, clean, and timeless",
];

const categories = [
  {
    title: "Planners",
    desc: "For structure, focus, and better daily flow.",
    image: categoryPlanners,
    href: "/category/planners",
  },
  {
    title: "Notebooks",
    desc: "For classes, meetings, ideas, and everyday writing.",
    image: categoryNotebooks,
    href: "/category/notebooks",
  },
  {
    title: "Journals",
    desc: "For reflection, creativity, and personal growth.",
    image: categoryJournals,
    href: "/category/journals",
  },
];

const About = () => {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-peach/30 blur-3xl" />
        </div>
        <div className="container-custom relative z-10 py-14 sm:py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_460px]">
            <ScrollReveal>
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  About ChetakPlus
                </span>
                <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  Stationery that makes everyday work feel more thoughtful
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                  Since 1984, ChetakPlus has created paper stationery for students, professionals,
                  and everyday writers who care about quality. We believe great notebooks,
                  planners, and journals should not only look good, but also help people think
                  clearly, stay organized, and enjoy the act of writing.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Explore Products <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="relative mx-auto w-full max-w-[460px]">
                <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-[0_24px_70px_rgba(0,0,0,0.09)]">
                  <img
                    src={getImageUrl(heroBanner)}
                    alt="ChetakPlus stationery collection"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border/50 bg-background px-4 py-3 shadow-lg sm:-left-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    Since 1984
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Crafted in Ahmedabad, Gujarat
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.08}>
                <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <stat.icon size={22} />
                  </div>
                  <p className="mt-5 font-display text-2xl font-bold text-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {stat.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
            <ScrollReveal>
              <div className="rounded-[2rem] border border-border/50 bg-card p-6 shadow-sm sm:p-8 lg:p-10">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Our Story
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
                  Built on everyday trust, not passing trends
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <p>
                    ChetakPlus started with a simple belief: stationery should be dependable,
                    practical, and pleasant to use every single day. Over the decades, that belief
                    has guided how we think about paper quality, formats, finishes, and design.
                  </p>
                  <p>
                    We serve people at very different stages of life, from students preparing for
                    exams to professionals organizing busy workdays and journal lovers creating
                    space for reflection. What connects them is the need for tools that feel
                    reliable in the hand and useful in real life.
                  </p>
                  <p>
                    Our goal is not simply to make stationery that looks premium. It is to make
                    products that support focus, planning, creativity, and everyday momentum.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="rounded-[2rem] border border-border/50 bg-gradient-to-br from-card to-secondary/40 p-6 shadow-sm sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Journey
                </p>
                <div className="mt-6 space-y-5">
                  {journey.map((step) => (
                    <div
                      key={step.year}
                      className="rounded-2xl border border-border/50 bg-background/80 p-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        {step.year}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                What Guides Us
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
                The values behind every product
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                We focus on the parts that matter most: quality that lasts, design that feels
                intentional, and products that genuinely support everyday routines.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <div className="rounded-3xl border border-border/50 bg-card p-6 text-center shadow-sm">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <value.icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
            <ScrollReveal>
              <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-sm">
                <img
                  src={getImageUrl(plannerCustomizationImage)}
                  alt="Premium stationery details"
                  className="h-full w-full object-cover"
                />
              </div>
            </ScrollReveal>

            <div className="grid gap-6">
              <ScrollReveal>
                <div className="rounded-[2rem] border border-border/50 bg-cream/60 p-6 shadow-sm sm:p-8">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                    Why People Choose Us
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold text-foreground">
                    Designed for the way people really write, plan, and work
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {qualityPoints.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background p-4"
                      >
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                        <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid gap-5 sm:grid-cols-2">
                {audiences.map((item, index) => (
                  <ScrollReveal key={item.title} delay={index * 0.08}>
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon size={22} />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex flex-col gap-4 text-center sm:gap-5">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Explore Our World
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Made for every kind of writing life
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Whether you are planning your week, filling lecture notes, or building a quiet
                journaling habit, our collections are designed to meet you where you are.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <ScrollReveal key={category.title} delay={index * 0.08}>
                <Link
                  to={category.href}
                  className="group block overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-sm transition-transform hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {category.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore Collection <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-border/50 bg-gradient-to-r from-primary to-[hsl(16_60%_46%)] px-6 py-10 text-center shadow-sm sm:px-10 lg:px-14 lg:py-14">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/80">
                Let's Connect
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold text-black sm:text-4xl">
                Discover stationery that works as beautifully as it looks
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Browse our collection, talk to us about bulk orders, or explore the ideas behind
                our notebooks, planners, and journals.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link
                  to="/corporate"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/25 bg-transparent px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-black/10"
                >
                  Corporate Orders
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default About;
