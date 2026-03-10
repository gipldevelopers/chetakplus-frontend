import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Target, Calendar, Star, ChevronRight, Truck, Shield, Sparkles, GraduationCap, Briefcase, ListChecks, PenTool, Layers, Gem, BookHeart, Package, Notebook, FileText, StickyNote, Gift, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import { getBestSellers, getTrending, getNewArrivals, getBundles, getFeaturedProduct, products } from "@/data/products";
import heroBanner from "@/assets/hero-banner.jpg";
import categoryPlanners from "@/assets/category-planners.jpg";
import categoryNotebooks from "@/assets/category-notebooks.jpg";
import categoryJournals from "@/assets/category-journals.jpg";
import categoryOffice from "@/assets/category-office.jpg";
import catWeeklyPlanners from "@/assets/categories/weekly-planners.jpg";
import catDailyPlanners from "@/assets/categories/daily-planners.jpg";
import catSpiralNotebooks from "@/assets/categories/spiral-notebooks.jpg";
import catJournals from "@/assets/categories/journals.jpg";
import catArchFiles from "@/assets/categories/arch-files.jpg";
import catStickyNotes from "@/assets/categories/sticky-notes.jpg";
import catLongBooks from "@/assets/categories/long-books.jpg";
import catGiftBundles from "@/assets/categories/gift-bundles.jpg";
import catPremiumDiaries from "@/assets/categories/premium-diaries.jpg";
import catGratitudeJournals from "@/assets/categories/gratitude-journals.jpg";
import catOfficeEssentials from "@/assets/categories/office-essentials.jpg";
import catStudyKits from "@/assets/categories/study-kits.jpg";
import bestSellersBanner from "@/assets/banners/best-sellers-banner.jpg";
import newArrivalsBanner from "@/assets/banners/new-arrivals-banner.jpg";
import giftHampersBanner from "@/assets/banners/gift-hampers-banner.jpg";

// Quick browse icon strip
const quickBrowse = [
{ icon: Calendar, label: "Planners", href: "/category/planners", bg: "bg-[hsl(16_60%_52%/0.12)]", iconColor: "text-primary" },
{ icon: Notebook, label: "Notebooks", href: "/category/notebooks", bg: "bg-[hsl(160_30%_45%/0.12)]", iconColor: "text-accent" },
{ icon: BookOpen, label: "Journals", href: "/category/journals", bg: "bg-[hsl(40_60%_50%/0.12)]", iconColor: "text-[hsl(40_60%_50%)]" },
{ icon: FileText, label: "Files", href: "/shop?category=office-stationery&type=files", bg: "bg-[hsl(160_30%_45%/0.12)]", iconColor: "text-accent" },
{ icon: StickyNote, label: "Sticky Notes", href: "/shop?category=office-stationery&type=sticky", bg: "bg-primary/10", iconColor: "text-primary" },
{ icon: Gift, label: "Gift Sets", href: "/category/bundles", bg: "bg-[hsl(350_30%_55%/0.12)]", iconColor: "text-[hsl(350_30%_55%)]" },
{ icon: Clock, label: "New In", href: "/shop?filter=new", bg: "bg-[hsl(16_60%_52%/0.12)]", iconColor: "text-primary" },
{ icon: Flame, label: "Best Sellers", href: "/shop?filter=bestseller", bg: "bg-[hsl(160_30%_45%/0.12)]", iconColor: "text-accent" }];


// Expanded category grid with vibrant colored backgrounds
const allCategories = [
{ label: "Weekly Planners", href: "/category/planners", image: catWeeklyPlanners, bgColor: "bg-[hsl(16_60%_92%)]" },
{ label: "Daily Planners", href: "/category/planners", image: catDailyPlanners, bgColor: "bg-[hsl(45_80%_90%)]" },
{ label: "Spiral Notebooks", href: "/category/notebooks", image: catSpiralNotebooks, bgColor: "bg-[hsl(160_40%_90%)]" },
{ label: "Journals", href: "/category/journals", image: catJournals, bgColor: "bg-[hsl(200_50%_90%)]" },
{ label: "Arch Files", href: "/category/office-stationery", image: catArchFiles, bgColor: "bg-[hsl(280_40%_92%)]" },
{ label: "Sticky Notes", href: "/category/office-stationery", image: catStickyNotes, bgColor: "bg-[hsl(50_80%_88%)]" },
{ label: "Long Books", href: "/category/notebooks", image: catLongBooks, bgColor: "bg-[hsl(120_30%_90%)]" },
{ label: "Gift Bundles", href: "/category/bundles", image: catGiftBundles, bgColor: "bg-[hsl(350_50%_92%)]" },
{ label: "Premium Diaries", href: "/category/journals", image: catPremiumDiaries, bgColor: "bg-[hsl(30_60%_90%)]" },
{ label: "Gratitude Journals", href: "/category/journals", image: catGratitudeJournals, bgColor: "bg-[hsl(170_40%_90%)]" },
{ label: "Office Essentials", href: "/category/office-stationery", image: catOfficeEssentials, bgColor: "bg-[hsl(220_40%_92%)]" },
{ label: "Study Kits", href: "/category/bundles", image: catStudyKits, bgColor: "bg-[hsl(0_50%_93%)]" }];


// Shop by budget
const budgetPicks = [
{ label: "Under ₹99", max: 99, bg: "from-primary/20 to-primary/5", border: "border-primary/20" },
{ label: "Under ₹199", max: 199, bg: "from-accent/20 to-accent/5", border: "border-accent/20" },
{ label: "Under ₹299", max: 299, bg: "from-[hsl(40_60%_50%/0.2)] to-[hsl(40_60%_50%/0.05)]", border: "border-[hsl(40_60%_50%/0.2)]" },
{ label: "Under ₹499", max: 499, bg: "from-[hsl(350_30%_55%/0.2)] to-[hsl(350_30%_55%/0.05)]", border: "border-[hsl(350_30%_55%/0.2)]" }];


const categories = [
{ name: "Planners", image: categoryPlanners, href: "/category/planners", count: "12+ Products", desc: "Organise your life" },
{ name: "Notebooks", image: categoryNotebooks, href: "/category/notebooks", count: "15+ Products", desc: "Write your ideas" },
{ name: "Journals", image: categoryJournals, href: "/category/journals", count: "8+ Products", desc: "Reflect & grow" },
{ name: "Office Stationery", image: categoryOffice, href: "/category/office-stationery", count: "20+ Products", desc: "Desk essentials" }];


const useCases = [
{ icon: GraduationCap, title: "For Students", desc: "Study planners & notebooks for academic success", href: "/category/planners" },
{ icon: Briefcase, title: "For Professionals", desc: "Daily planners & office essentials for your career", href: "/category/office-stationery" },
{ icon: ListChecks, title: "For Daily Planning", desc: "Weekly & daily layouts to organize every day", href: "/shop?filter=planners" },
{ icon: Target, title: "For Goal Tracking", desc: "Habit trackers & goal-setting frameworks", href: "/shop" },
{ icon: PenTool, title: "For Journaling", desc: "Gratitude journals & creative writing diaries", href: "/category/journals" }];


const qualityCards = [
{ icon: Layers, title: "Premium Paper", desc: "70-90 GSM paper for smooth, bleed-free writing" },
{ icon: BookHeart, title: "Smooth Writing", desc: "Natural shade & cream pages for a delightful feel" },
{ icon: Gem, title: "Durable Binding", desc: "Wiro, thread-sewn & hard-bound options built to last" },
{ icon: Sparkles, title: "Elegant Designs", desc: "Thoughtfully designed covers with motivational art" }];


const testimonials = [
{ name: "Priya Sharma", role: "College Student", text: "The study planner has completely transformed how I prepare for exams. Love the quality!", rating: 5 },
{ name: "Rahul Patel", role: "Business Professional", text: "ChetakPlus notebooks are my go-to for meetings. The paper quality is excellent.", rating: 5 },
{ name: "Anita Desai", role: "Content Creator", text: "Beautiful designs and premium feel. These journals make me want to write every day.", rating: 4 },
{ name: "Vikram Singh", role: "Teacher", text: "I've been using ChetakPlus for years. The consistency in quality is unmatched.", rating: 5 }];


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
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh] py-12 lg:py-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6">
              
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                Premium Stationery · Since 1984
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                Write Your <br />
                <span className="text-primary">Success Story</span>
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground max-w-md leading-relaxed">
                Premium planners, notebooks & stationery designed to fuel your productivity and creativity.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                  
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link
                  to="/category/planners"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-colors">
                  
                  Explore Planners
                </Link>
              </div>
              <div className="flex flex-wrap gap-5 pt-4">
                {[
                { icon: Truck, label: "Free Shipping 999+" },
                { icon: Shield, label: "Premium Quality" },
                { icon: Sparkles, label: "Since 1984" }].
                map((f) =>
                <div key={f.label} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <f.icon size={16} className="text-primary" />
                    </div>
                    <span className="text-xs font-medium">{f.label}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative">
              
              <img src={heroBanner} alt="ChetakPlus premium stationery collection" className="w-full h-full object-cover animate-pan-video rounded-3xl" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-6 bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-border/50 shadow-lg">
                
                <div className="grid grid-cols-3 divide-x divide-border">
                  {[
                  { val: "40+", label: "Years Legacy" },
                  { val: "50K+", label: "Happy Customers" },
                  { val: "100+", label: "Products" }].
                  map((s) =>
                  <div key={s.label} className="text-center px-2">
                      <p className="text-lg sm:text-xl font-bold text-primary">{s.val}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Browse Icon Strip */}
      <section className="py-8 border-b border-border/50 bg-card">
        <div className="container-custom">
          <div className="flex justify-center gap-6 sm:gap-8 lg:gap-10 overflow-x-auto pb-2 scrollbar-hide">
            {quickBrowse.map((item, i) =>
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}>
              
                <Link
                to={item.href}
                className="flex flex-col items-center gap-2.5 min-w-[72px] group">
                
                  <div className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    <item.icon size={22} className={item.iconColor} />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground whitespace-nowrap transition-colors">{item.label}</span>
                </Link>
              </motion.div>
            )}
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
            {allCategories.map((cat, i) =>
            <ScrollReveal key={cat.label} delay={i * 0.04}>
                <Link
                to={cat.href}
                className="group block text-center">
                
                  <div className={`${cat.bgColor} rounded-2xl p-3 lg:p-4 aspect-square flex items-center justify-center overflow-hidden relative group-hover:shadow-lg transition-all duration-300`}>
                    <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-[85%] h-[85%] object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                    loading="lazy" />
                  
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground mt-3 group-hover:text-primary transition-colors leading-tight">{cat.label}</p>
                </Link>
              </ScrollReveal>
            )}
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
              transition={{ type: "spring", stiffness: 300 }}>
              
              <Link to="/shop?filter=bestseller" className="group relative flex flex-col justify-end rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video bg-card shadow-sm hover:shadow-lg transition-shadow">
                <img src={bestSellersBanner} alt="Best Sellers" className="absolute inset-0 w-full h-full object-cover animate-pan-video" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative z-10 p-4 sm:p-5 flex items-end justify-end w-full">
                  <h3 className="sr-only">Best Sellers</h3>
                  <span className="inline-flex items-center gap-1.5 text-background text-[11px] font-bold uppercase tracking-wider bg-foreground/20 backdrop-blur-md border border-background/20 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                    Shop Now <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* New Arrivals Banner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}>
              
              <Link to="/shop?filter=new" className="group relative flex flex-col justify-end rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video bg-card shadow-sm hover:shadow-lg transition-shadow">
                <img src={newArrivalsBanner} alt="New Arrivals" className="absolute inset-0 w-full h-full object-cover animate-[pan-video_15s_reverse_infinite]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative z-10 p-4 sm:p-5 flex items-end justify-end w-full">
                  <h3 className="sr-only">New Arrivals</h3>
                  <span className="inline-flex items-center gap-1.5 text-background text-[11px] font-bold uppercase tracking-wider bg-foreground/20 backdrop-blur-md border border-background/20 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                    Discover <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Gift Hampers Banner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}>
              
              <Link to="/category/bundles" className="group relative flex flex-col justify-end rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video bg-card shadow-sm hover:shadow-lg transition-shadow">
                <img src={giftHampersBanner} alt="Gift Hampers" className="absolute inset-0 w-full h-full object-cover animate-pan-video" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative z-10 p-4 sm:p-5 flex items-end justify-end w-full">
                  <h3 className="sr-only">Gift Hampers</h3>
                  <span className="inline-flex items-center gap-1.5 text-background text-[11px] font-bold uppercase tracking-wider bg-foreground/20 backdrop-blur-md border border-background/20 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                    Explore Gifts <ChevronRight size={14} />
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
            {categories.map((cat, i) =>
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
            )}
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
            {budgetPicks.map((bp, i) =>
            <ScrollReveal key={bp.label} delay={i * 0.08}>
                <Link
                to={`/shop?maxPrice=${bp.max}`}
                className={`group relative rounded-2xl overflow-hidden block border ${bp.border} bg-gradient-to-br ${bp.bg} p-6 lg:p-8 hover-lift text-center`}>
                
                  <p className="font-display text-3xl lg:text-4xl font-bold text-foreground">{bp.label}</p>
                  <p className="text-sm text-muted-foreground mt-2">{getProductsByBudget(bp.max).length}+ products</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3 group-hover:underline">
                    Shop Now <ChevronRight size={12} />
                  </span>
                </Link>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Full-width Gift Hampers CTA Banner */}
      <section className="py-6 sm:py-10">
        <div className="container-custom">
          <ScrollReveal>
            <Link to="/category/bundles" className="group relative block rounded-2xl overflow-hidden">
              <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
                <img src={giftHampersBanner} alt="Explore Gift Hampers" className="w-full h-full object-cover animate-[pan-video_25s_infinite]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
                  <motion.h2
                    className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-background"
                    whileInView={{ opacity: [0, 1], x: [-30, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
                    
                    Explore Our Gift Hampers
                  </motion.h2>
                  <motion.p
                    className="text-background/70 text-sm sm:text-base mt-2 max-w-md"
                    whileInView={{ opacity: [0, 1], x: [-20, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}>
                    
                    Moments made memorable, thoughtfully packaged & ready to inspire.
                  </motion.p>
                  <motion.span
                    className="inline-flex items-center gap-2 text-background font-semibold text-sm mt-4 group-hover:text-primary transition-colors"
                    whileInView={{ opacity: [0, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}>
                    
                    Shop Gift Sets <ArrowRight size={16} />
                  </motion.span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 &&
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
              {newArrivals.slice(0, 4).map((product, i) =>
            <ScrollReveal key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} />
                </ScrollReveal>
            )}
            </div>
          </div>
        </section>
      }

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
            {bestSellers.slice(0, 4).map((product, i) =>
            <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            )}
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
            {useCases.map((uc, i) =>
            <ScrollReveal key={uc.title} delay={i * 0.08}>
                <Link to={uc.href} className="group text-center p-5 rounded-2xl bg-card border border-border/50 hover-lift block">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <uc.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{uc.title}</h3>
                  <p className="text-xs text-muted-foreground leading-snug">{uc.desc}</p>
                </Link>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Bundles */}
      {bundles.length > 0 &&
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
              {bundles.slice(0, 3).map((product, i) =>
            <ScrollReveal key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} />
                </ScrollReveal>
            )}
            </div>
          </div>
        </section>
      }

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
                {featured.originalPrice &&
                <span className="text-lg text-muted-foreground line-through">₹{featured.originalPrice}</span>
                }
              </div>
              <div className="flex gap-3 mt-6">
                <Link
                  to={`/product/${featured.slug}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                  
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
            {qualityCards.map((q, i) =>
            <ScrollReveal key={q.title} delay={i * 0.1}>
                <div className="bg-card p-6 rounded-2xl border border-border/50 text-center hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <q.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{q.title}</h3>
                  <p className="text-sm text-muted-foreground">{q.desc}</p>
                </div>
              </ScrollReveal>
            )}
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
            {trending.slice(0, 4).map((product, i) =>
            <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            )}
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
            {testimonials.map((t, i) =>
            <ScrollReveal key={t.name} delay={i * 0.1}>
                <div className="bg-card p-5 rounded-2xl border border-border/50 hover-lift">

                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">"{t.text}"</p>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </ScrollReveal>
            )}
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
                  className="flex-1 px-5 py-3.5 rounded-xl text-sm bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                
                <button type="submit" className="px-7 py-3.5 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>);

};

export default Index;