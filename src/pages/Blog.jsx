import { getImageUrl } from "@/lib/utils";


import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { blogPosts } from "@/data/blogPosts";


const Blog = () => {
  return (
    <div>
      <div className="bg-cream section-padding">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Blog & Ideas</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Productivity tips, stationery guides, and creative inspiration.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) =>
            <ScrollReveal key={post.slug} delay={i * 0.1}>
                <article className="bg-card rounded-2xl overflow-hidden border border-border/50 hover-lift group">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} /> {post.date}
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </div>);

};

export default Blog;
