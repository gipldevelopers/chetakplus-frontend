import ScrollReveal from "@/components/ui/ScrollReveal";
import { Award, Users, BookOpen, Heart } from "lucide-react";

const About = () =>
<div>
    <div className="bg-secondary py-16 lg:py-20">
      <div className="container-custom text-center">
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">Our Story</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
          Since 1984, ChetakPlus has been crafting premium quality paper stationery products, helping students and professionals write their success stories.
        </p>
      </div>
    </div>

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">Crafting Quality Since 1984</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  ChetakPlus is a leading manufacturer of premium quality paper stationery products based in Ahmedabad, Gujarat. What started as a small manufacturing unit has grown into a trusted brand serving thousands of students, teachers, and professionals across India.
                </p>
                <p>
                  Our focus has always been on providing the highest quality paper products — from notebooks and diaries to planners and office stationery. Every product is thoughtfully designed with attention to paper quality, binding, and aesthetics.
                </p>
                <p>
                  We believe that the right stationery can transform the way you think, plan, and create. That's why we pour our expertise into every product, ensuring a writing experience that inspires productivity and creativity.
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {[
            { icon: Award, label: "40+ Years", desc: "Of manufacturing excellence" },
            { icon: Users, label: "50,000+", desc: "Happy customers" },
            { icon: BookOpen, label: "100+", desc: "Product varieties" },
            { icon: Heart, label: "Premium", desc: "Quality guaranteed" }].
            map((stat) =>
            <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border/50 text-center">
                  <stat.icon size={24} className="mx-auto text-primary mb-3" />
                  <p className="font-display text-xl font-bold text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                </div>
            )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section className="section-padding bg-cream">
      <div className="container-custom text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            To provide comprehensive, high-quality stationery products that inspire productivity and creativity for students, parents, teachers, and professionals. We bring an extensive product catalogue from all major items in the field of educational and office supplies.
          </p>
        </ScrollReveal>
      </div>
    </section>
  </div>;


export default About;