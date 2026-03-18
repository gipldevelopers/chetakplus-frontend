import { ArrowLeft, ArrowRight, Calendar, Clock3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ScrollReveal from "@/components/ui/ScrollReveal";
import NotFound from "@/pages/NotFound";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);
  const relatedPosts = post ? getRelatedBlogPosts(post.slug, post.category) : [];

  if (!post) return <NotFound />;

  return (
    <div className="bg-background">
      <div className="relative overflow-hidden bg-cream section-padding">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-peach/20 blur-3xl" />
        </div>
        <div className="container-custom">
          <ScrollReveal>
            <Link
              to="/blog"
              className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            <div className="relative z-10 mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_420px]">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock3 size={12} /> {post.readTime}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {post.title}
                </h1>
                <p className="text-muted-foreground mt-4 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {post.highlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/50 bg-background/80 px-4 py-4 text-sm text-foreground shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm lg:hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <article className="mt-6 rounded-3xl border border-border/50 bg-card p-6 sm:p-8 lg:mt-0 lg:p-10 shadow-sm">
                <div className="space-y-6 text-muted-foreground leading-8">
                  {post.content?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[15px] sm:text-base lg:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </div>

            <aside className="lg:pt-4">
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="rounded-3xl border border-border/50 bg-cream/70 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                    Quick Take
                  </p>
                  <h2 className="mt-3 font-display text-2xl text-foreground">
                    What this article covers
                  </h2>
                  <div className="mt-5 space-y-3">
                    {post.highlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-background px-4 py-3 text-sm text-foreground border border-border/50"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border/50 bg-card p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                    Keep Reading
                  </p>
                  <div className="mt-5 space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        to={`/blog/${relatedPost.slug}`}
                        className="group block rounded-2xl border border-border/50 p-4 transition-colors hover:border-primary/30 hover:bg-cream/40"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                          {relatedPost.category}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          Read Article <ArrowRight size={12} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="pb-16">
        <div className="container-custom">
          <div className="rounded-3xl border border-border/50 bg-gradient-to-r from-cream via-background to-peach/20 px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  More from the blog
                </p>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl text-foreground">
                  Explore more planning ideas, routines, and stationery guides
                </h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse All Blogs <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
