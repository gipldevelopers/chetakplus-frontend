import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Target, Calendar, Award, Star, ChevronRight, Truck, Shield, Sparkles, GraduationCap, Briefcase, ListChecks, PenTool, Layers, Gem, BookHeart, Package, Notebook, FileText, StickyNote, Gift, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { getBestSellers, getTrending, getNewArrivals, getBundles, getFeaturedProduct, products } from "@/data/products";
import categoryPlanners from "@/assets/category-planners.jpg";
import categoryNotebooks from "@/assets/category-notebooks.jpg";
import categoryJournals from "@/assets/category-journals.jpg";
import categoryOffice from "@/assets/category-office.jpg";
import catWeeklyPlanners from "@/assets/categories/weekly-planners.jpg";
import catWeeklyPlannersVid from "@/assets/categories/weekly-planners.mp4";
import catDailyPlanners from "@/assets/categories/daily-planners.jpg";
import catSpiralNotebooks from "@/assets/categories/spiral-notebooks.jpg";
import catSpiralNotebooksVid from "@/assets/categories/spiral-notebooks.mp4";
import catJournals from "@/assets/categories/journals.jpg";
import catJournalsVid from "@/assets/categories/journals.mp4";
import catArchFiles from "@/assets/categories/arch-files.jpg";
import catStickyNotes from "@/assets/categories/sticky-notes.jpg";
import catLongBooks from "@/assets/categories/long-books.jpg";
import catGiftBundles from "@/assets/categories/gift-bundles.jpg";
import catGiftBundlesVid from "@/assets/categories/gift-bundles.mp4";
import catPremiumDiaries from "@/assets/categories/premium-diaries.jpg";
import catGratitudeJournals from "@/assets/categories/gratitude-journals.jpg";
import catOfficeEssentials from "@/assets/categories/office-essentials.jpg";
import catStudyKits from "@/assets/categories/study-kits.jpg";
import bestSellersBanner from "@/assets/banners/best-sellers-banner.mp4";
import newArrivalsBanner from "@/assets/banners/new-arrivals-banner.mp4";
import giftHampersBanner from "@/assets/banners/gift-hampers-banner.mp4";
import plannersIcon from "@/assets/icons/planners-icon.png";
import notebooksIcon from "@/assets/icons/notebooks-icon.png";
import journalsIcon from "@/assets/icons/journals-icon.png";
import filesIcon from "@/assets/icons/files-icon.png";
import stickyNotesIcon from "@/assets/icons/sticky-notes-icon.png";
import giftSetsIcon from "@/assets/icons/gift-sets-icon.png";
import newInIcon from "@/assets/icons/new-in-icon.png";
import bestSellersIcon from "@/assets/icons/best-sellers-icon.png";
import catOfficeStationery from "@/assets/cat-office-stationery.png";
import catSchoolStationery from "@/assets/cat-school-stationery.png";
import catCorporateGifts from "@/assets/cat-corporate-gifts.png";

// Quick browse icon strip — now with product images
const quickBrowse = [
  // { image: plannersIcon, label: "Planners", href: "/category/planners", bg: "bg-[hsl(16_60%_52%/0.12)]" },
  { image: notebooksIcon, label: "Notebooks", href: "/category/notebooks", bg: "bg-[hsl(160_30%_45%/0.12)]" },
  { image: journalsIcon, label: "Journals", href: "/category/journals", bg: "bg-[hsl(40_60%_50%/0.12)]" },
  { image: filesIcon, label: "Files", href: "/shop?category=office-stationery&type=files", bg: "bg-[hsl(160_30%_45%/0.12)]" },
  { image: stickyNotesIcon, label: "Sticky Notes", href: "/shop?category=office-stationery&type=sticky", bg: "bg-primary/10" },
  { image: giftSetsIcon, label: "Gift Sets", href: "/category/bundles", bg: "bg-[hsl(350_30%_55%/0.12)]" },
  { image: newInIcon, label: "New In", href: "/shop?filter=new", bg: "bg-[hsl(16_60%_52%/0.12)]" },
  { image: bestSellersIcon, label: "Best Sellers", href: "/shop?filter=bestseller", bg: "bg-[hsl(160_30%_45%/0.12)]" },
];

// Expanded category grid with vibrant colored backgrounds
const allCategories = [
  { label: "Weekly Planners", href: "/category/planners", image: catWeeklyPlanners, video: catWeeklyPlannersVid, bgColor: "bg-[hsl(16_60%_92%)]" },
  { label: "Daily Planners", href: "/category/planners", image: catDailyPlanners, video: null, bgColor: "bg-[hsl(45_80%_90%)]" },
  { label: "Spiral Notebooks", href: "/category/notebooks", image: catSpiralNotebooks, video: catSpiralNotebooksVid, bgColor: "bg-[hsl(160_40%_90%)]" },
  { label: "Journals", href: "/category/journals", image: catJournals, video: catJournalsVid, bgColor: "bg-[hsl(200_50%_90%)]" },
  { label: "Arch Files", href: "/category/office-stationery", image: catArchFiles, video: null, bgColor: "bg-[hsl(280_40%_92%)]" },
  { label: "Sticky Notes", href: "/category/office-stationery", image: catStickyNotes, video: null, bgColor: "bg-[hsl(50_80%_88%)]" },
  { label: "Long Books", href: "/category/notebooks", image: catLongBooks, video: null, bgColor: "bg-[hsl(120_30%_90%)]" },
  { label: "Gift Bundles", href: "/category/bundles", image: catGiftBundles, video: catGiftBundlesVid, bgColor: "bg-[hsl(350_50%_92%)]" },
  { label: "Premium Diaries", href: "/category/journals", image: catPremiumDiaries, video: null, bgColor: "bg-[hsl(30_60%_90%)]" },
  { label: "Gratitude Journals", href: "/category/journals", image: catGratitudeJournals, video: null, bgColor: "bg-[hsl(170_40%_90%)]" },
  { label: "Office Essentials", href: "/category/office-stationery", image: catOfficeEssentials, video: null, bgColor: "bg-[hsl(220_40%_92%)]" },
  { label: "Study Kits", href: "/category/bundles", image: catStudyKits, video: null, bgColor: "bg-[hsl(0_50%_93%)]" },
];

// Shop by budget
const budgetPicks = [
  { label: "Under ₹99", max: 99, bg: "from-primary/20 to-primary/5", border: "border-primary/20" },
  { label: "Under ₹199", max: 199, bg: "from-accent/20 to-accent/5", border: "border-accent/20" },
  { label: "Under ₹299", max: 299, bg: "from-[hsl(40_60%_50%/0.2)] to-[hsl(40_60%_50%/0.05)]", border: "border-[hsl(40_60%_50%/0.2)]" },
  { label: "Under ₹499", max: 499, bg: "from-[hsl(350_30%_55%/0.2)] to-[hsl(350_30%_55%/0.05)]", border: "border-[hsl(350_30%_55%/0.2)]" },
];

const categories = [
  { name: "Planners", image: categoryPlanners, href: "/category/planners", count: "12+ Products", desc: "Organise your life" },
  { name: "Notebooks", image: categoryNotebooks, href: "/category/notebooks", count: "15+ Products", desc: "Write your ideas" },
  { name: "Journals", image: categoryJournals, href: "/category/journals", count: "8+ Products", desc: "Reflect & grow" },
  { name: "Office Stationery", image: categoryOffice, href: "/category/office-stationery", count: "20+ Products", desc: "Desk essentials" },
];

const useCases = [
  { icon: GraduationCap, title: "For Students", desc: "Study planners & notebooks for academic success", href: "/category/planners" },
  { icon: Briefcase, title: "For Professionals", desc: "Daily planners & office essentials for your career", href: "/category/office-stationery" },
  { icon: ListChecks, title: "For Daily Planning", desc: "Weekly & daily layouts to organize every day", href: "/shop?filter=planners" },
  { icon: Target, title: "For Goal Tracking", desc: "Habit trackers & goal-setting frameworks", href: "/shop" },
  { icon: PenTool, title: "For Journaling", desc: "Gratitude journals & creative writing diaries", href: "/category/journals" },
];

const qualityCards = [
  { icon: Layers, title: "Premium Paper", desc: "70-90 GSM paper for smooth, bleed-free writing" },
  { icon: BookHeart, title: "Smooth Writing", desc: "Natural shade & cream pages for a delightful feel" },
  { icon: Gem, title: "Durable Binding", desc: "Wiro, thread-sewn & hard-bound options built to last" },
  { icon: Sparkles, title: "Elegant Designs", desc: "Thoughtfully designed covers with motivational art" },
];

const testimonials = [
  { name: "Priya Sharma", role: "College Student", text: "The study planner has completely transformed how I prepare for exams. Love the quality!", rating: 5 },
  { name: "Rahul Patel", role: "Business Professional", text: "ChetakPlus notebooks are my go-to for meetings. The paper quality is excellent.", rating: 5 },
  { name: "Anita Desai", role: "Content Creator", text: "Beautiful designs and premium feel. These journals make me want to write every day.", rating: 4 },
  { name: "Vikram Singh", role: "Teacher", text: "I've been using ChetakPlus for years. The consistency in quality is unmatched.", rating: 5 },
];

const Index = () => {
  const bestSellers = getBestSellers();
  const trending = getTrending();
  const newArrivals = getNewArrivals();
  const bundles = getBundles();
  const featured = getFeaturedProduct();

  const getProductsByBudget = (max) =>
    products.filter((p) => p.price <= max && p.inStock).slice(0, 4);

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Top Category Cards — Office, School, Corporate */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {[
              {
                title: "Office Stationery",
                desc: "Desk essentials for the modern workspace",
                image: catOfficeStationery,
                href: "/category/office-stationery",
                gradient: "from-[hsl(220,45%,20%/0.85)] to-[hsl(220,40%,30%/0.4)]",
              },
              {
                title: "School Stationery",
                desc: "Everything students need to excel",
                image: catSchoolStationery,
                href: "/shop?category=school",
                gradient: "from-[hsl(160,35%,25%/0.85)] to-[hsl(150,30%,35%/0.4)]",
              },
              {
                title: "Corporate Gifts",
                desc: "Premium gifting for every milestone",
                image: catCorporateGifts,
                href: "/corporate",
                gradient: "from-[hsl(30,40%,20%/0.85)] to-[hsl(35,35%,30%/0.4)]",
              },
            ].map((cat, i) => (
              <ScrollReveal key={cat.title} delay={i * 0.1}>
                <Link
                  to={cat.href}
                  className="group relative block rounded-2xl overflow-hidden hover-lift shadow-sm"
                >
                  <div className="aspect-[16/10] sm:aspect-[4/3] relative">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md">
                      {cat.title}
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm mt-1 drop-shadow-sm max-w-[90%] font-medium">
                      {cat.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-white font-semibold text-xs mt-4 group-hover:text-primary-foreground bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 transition-all">
                      Explore <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Browse Icon Strip */}
      <section className="py-8 border-b border-border/50 bg-card">
        <div className="container-custom">
          <div className="flex justify-center gap-6 sm:gap-8 lg:gap-10 overflow-x-auto pb-2 scrollbar-hide">
            {quickBrowse.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  to={item.href}
                  className="flex flex-col items-center gap-2.5 min-w-[72px] group"
                >
                  <div className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300 overflow-hidden`}>
                    <img src={item.image} alt={item.label} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground whitespace-nowrap transition-colors">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore All Categories — Scooboo-inspired vibrant grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Tools That Inspire Every Day</h2>
              <p className="text-muted-foreground mt-2">Everything you need for writing, planning & organising</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
            {allCategories.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 0.04}>
                <Link
                  to={cat.href}
                  className="group block text-center"
                >
                  <div className={`${cat.bgColor} rounded-2xl p-3 lg:p-4 aspect-square flex items-center justify-center overflow-hidden relative group-hover:shadow-lg transition-all duration-300`}>
                    {cat.video ? (
                      <video
                        src={cat.video}
                        autoPlay loop muted playsInline
                        poster={cat.image}
                        className="w-[85%] h-[85%] object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-[85%] h-[85%] object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground mt-3 group-hover:text-primary transition-colors leading-tight">{cat.label}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Column Promotional Banners — animated */}
      <section className="py-6 sm:py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            {/* Best Sellers Banner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/shop?filter=bestseller" className="group relative block rounded-2xl overflow-hidden aspect-[4/5]">
                <video src={bestSellersBanner} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <motion.h3
                    className="font-display text-2xl sm:text-3xl font-black text-background leading-none"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    Best<br />Sellers
                  </motion.h3>
                  <span className="inline-flex items-center gap-1 text-background/80 text-xs font-semibold mt-2 group-hover:text-primary-foreground transition-colors">
                    Shop Now <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* New Arrivals Banner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/shop?filter=new" className="group relative block rounded-2xl overflow-hidden aspect-[4/5]">
                <video src={newArrivalsBanner} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <motion.h3
                    className="font-display text-2xl sm:text-3xl font-black text-background leading-none"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    New<br />Arrivals
                  </motion.h3>
                  <span className="inline-flex items-center gap-1 text-background/80 text-xs font-semibold mt-2 group-hover:text-primary-foreground transition-colors">
                    Just Launched <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Gift Hampers Banner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/category/bundles" className="group relative block rounded-2xl overflow-hidden aspect-[4/5]">
                <video src={giftHampersBanner} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <motion.h3
                    className="font-display text-2xl sm:text-3xl font-black text-background leading-none"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Gift<br />Hampers
                  </motion.h3>
                  <span className="inline-flex items-center gap-1 text-background/80 text-xs font-semibold mt-2 group-hover:text-primary-foreground transition-colors">
                    Explore Gifts <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Category — Large visual cards */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Shop by Category</h2>
                <p className="text-muted-foreground mt-2">Find the perfect stationery for every need</p>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={i * 0.1}>
                <Link to={cat.href} className="group relative rounded-2xl overflow-hidden block hover-lift">
                  <div className="aspect-[4/5] relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-background font-display text-lg font-bold">{cat.name}</h3>
                    <p className="text-background/60 text-xs mt-0.5">{cat.desc}</p>
                    <span className="inline-flex items-center gap-1 text-background/80 text-xs font-medium mt-2 group-hover:text-primary transition-colors">
                      {cat.count} <ChevronRight size={12} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Budget */}
      <section className="py-12 bg-secondary/40">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Great Picks</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">Shop by Budget</h2>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetPicks.map((bp, i) => (
              <ScrollReveal key={bp.label} delay={i * 0.08}>
                <Link
                  to={`/shop?maxPrice=${bp.max}`}
                  className={`group relative rounded-2xl overflow-hidden block border ${bp.border} bg-gradient-to-br ${bp.bg} p-6 lg:p-8 hover-lift text-center`}
                >
                  <p className="font-display text-3xl lg:text-4xl font-bold text-foreground">{bp.label}</p>
                  <p className="text-sm text-muted-foreground mt-2">{getProductsByBudget(bp.max).length}+ products</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 group-hover:underline">
                    Shop Now <ChevronRight size={12} />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Gift Hampers CTA Banner */}
      <section className="py-6 sm:py-10">
        <div className="container-custom">
          <ScrollReveal>
            <Link to="/category/bundles" className="group relative block rounded-2xl overflow-hidden">
              <div className="relative h-48 sm:h-64 lg:h-72">
                <video src={giftHampersBanner} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
                  <motion.h2
                    className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-background"
                    whileInView={{ opacity: [0, 1], x: [-30, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    Explore Our Gift Hampers
                  </motion.h2>
                  <motion.p
                    className="text-background/70 text-sm sm:text-base mt-2 max-w-md"
                    whileInView={{ opacity: [0, 1], x: [-20, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                  >
                    Moments made memorable, thoughtfully packaged & ready to inspire.
                  </motion.p>
                  <motion.span
                    className="inline-flex items-center gap-2 text-background font-semibold text-sm mt-4 group-hover:text-primary transition-colors"
                    whileInView={{ opacity: [0, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Shop Gift Sets <ArrowRight size={16} />
                  </motion.span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section-padding bg-peach">
          <div className="container-custom">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Just Launched</span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">New Arrivals</h2>
                  <p className="text-muted-foreground mt-2">Discover our latest planners and notebooks</p>
                </div>
                <Link to="/shop?filter=new" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.slice(0, 4).map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1"><Flame size={14} /> Most Popular</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">Best Sellers</h2>
                <p className="text-muted-foreground mt-2">Most loved by our customers</p>
              </div>
              <Link to="/shop?filter=bestseller" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {bestSellers.slice(0, 4).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Use Case */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Find Your Perfect Planner</h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">Explore stationery curated for your lifestyle</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {useCases.map((uc, i) => (
              <ScrollReveal key={uc.title} delay={i * 0.08}>
                <Link to={uc.href} className="group text-center p-5 rounded-2xl bg-card border border-border/50 hover-lift block">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <uc.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{uc.title}</h3>
                  <p className="text-xs text-muted-foreground leading-snug">{uc.desc}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      {bundles.length > 0 && (
        <section className="section-padding bg-blush">
          <div className="container-custom">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1"><Package size={14} /> Save More</span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">Bundles & Gift Sets</h2>
                  <p className="text-muted-foreground mt-2">Perfect combos for productivity lovers</p>
                </div>
                <Link to="/category/bundles" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.slice(0, 3).map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Product */}
      <section className="section-padding bg-sage">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <ScrollReveal>
              <img src={featured.images[0]} alt={featured.name} className="w-full rounded-2xl shadow-lg" />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Planner of the Month</span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2">{featured.name}</h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">{featured.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="font-display text-2xl font-bold text-foreground">₹{featured.price}</span>
                {featured.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{featured.originalPrice}</span>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <Link
                  to={`/product/${featured.slug}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  View Product <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Crafted for Better Writing */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Crafted for a Better Writing Experience</h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Every ChetakPlus product is designed to make writing a joyful experience</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityCards.map((q, i) => (
              <ScrollReveal key={q.title} delay={i * 0.1}>
                <div className="bg-card p-6 rounded-2xl border border-border/50 text-center hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <q.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{q.title}</h3>
                  <p className="text-sm text-muted-foreground">{q.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Trending Now</h2>
                <p className="text-muted-foreground mt-2">Fresh arrivals & popular picks</p>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {trending.slice(0, 4).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Loved by 50,000+ Customers</h2>
              <p className="text-muted-foreground mt-3">#ChetakPlus</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <div className="bg-card p-5 rounded-2xl border border-border/50 hover-lift">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} className={j < t.rating ? "fill-primary text-primary" : "text-border"} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">"{t.text}"</p>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="bg-primary rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
                Get 10% Off Your First Order
              </h2>
              <p className="text-primary-foreground/70 text-sm max-w-md mx-auto mb-8">
                Subscribe for productivity tips, new product launches, and exclusive offers.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl text-sm bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="submit" className="px-7 py-3.5 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;