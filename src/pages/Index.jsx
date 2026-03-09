import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Target, Calendar, Award, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import { getBestSellers, getTrending } from "@/data/products";
import heroBanner from "@/assets/hero-banner.jpg";
import categoryPlanners from "@/assets/category-planners.jpg";
import categoryNotebooks from "@/assets/category-notebooks.jpg";
import categoryJournals from "@/assets/category-journals.jpg";
import categoryOffice from "@/assets/category-office.jpg";

const categories = [
{ name: "Planners", image: categoryPlanners, href: "/category/planners" },
{ name: "Notebooks", image: categoryNotebooks, href: "/category/notebooks" },
{ name: "Journals", image: categoryJournals, href: "/category/journals" },
{ name: "Office Stationery", image: categoryOffice, href: "/category/office-stationery" }];


const benefits = [
{ icon: Calendar, title: "Plan Better", description: "Structure your week with thoughtfully designed layouts" },
{ icon: Target, title: "Stay Productive", description: "Track goals and habits to build consistency" },
{ icon: BookOpen, title: "Write Beautifully", description: "Premium paper quality for a smooth writing experience" },
{ icon: Award, title: "Achieve More", description: "Transform ideas into action with our planners" }];


const testimonials = [
{ name: "Priya Sharma", role: "College Student", text: "The study planner has completely transformed how I prepare for exams. Love the quality!", rating: 5 },
{ name: "Rahul Patel", role: "Business Professional", text: "ChetakPlus notebooks are my go-to for meetings. The paper quality is excellent.", rating: 5 },
{ name: "Anita Desai", role: "Content Creator", text: "Beautiful designs and premium feel. These journals make me want to write every day.", rating: 4 }];


const Index = () => {
  const bestSellers = getBestSellers();
  const trending = getTrending();

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
                Premium Stationery
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative">
              
              <img
                src={heroBanner}
                alt="ChetakPlus premium stationery collection"
                className="w-full rounded-3xl shadow-2xl" />
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Shop by Category</h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">Find the perfect stationery for every need</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat, i) =>
            <ScrollReveal key={cat.name} delay={i * 0.1}>
                <Link to={cat.href} className="group relative aspect-[3/4] rounded-2xl overflow-hidden block hover-lift">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-background font-display text-lg font-semibold">{cat.name}</h3>
                    <span className="text-background/70 text-sm flex items-center gap-1 mt-1 group-hover:text-primary transition-colors">
                      Explore <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Best Sellers</h2>
                <p className="text-muted-foreground mt-2">Most loved by our customers</p>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
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

      {/* Why ChetakPlus */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Why ChetakPlus?</h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                Trusted by students and professionals since 1984
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) =>
            <ScrollReveal key={b.title} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <b.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.description}</p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section-padding bg-peach">
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

      {/* How Planners Help */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">How Our Planners Help You</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            { step: "01", title: "Plan Your Week", desc: "Use weekly layouts to map out tasks and priorities" },
            { step: "02", title: "Track Progress", desc: "Monitor habits and goals with built-in trackers" },
            { step: "03", title: "Stay Organized", desc: "Keep everything in one place with structured sections" },
            { step: "04", title: "Achieve Goals", desc: "Review, reflect, and celebrate your accomplishments" }].
            map((item, i) =>
            <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="relative">
                  <span className="font-display text-6xl font-bold text-primary/10">{item.step}</span>
                  <h3 className="font-semibold text-foreground text-lg -mt-4">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-sage">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">What Our Customers Say</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) =>
            <ScrollReveal key={t.name} delay={i * 0.1}>
                <div className="bg-card p-6 rounded-2xl border border-border/50">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) =>
                  <Star key={j} size={14} className={j < t.rating ? "fill-primary text-primary" : "text-border"} />
                  )}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
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
                Stay Productive, Stay Inspired
              </h2>
              <p className="text-primary-foreground/70 text-sm max-w-md mx-auto mb-8">
                Subscribe for productivity tips, new product launches, and exclusive offers.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl text-sm bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                  
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