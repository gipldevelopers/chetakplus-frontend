import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";

const FAQ = () => {
  const { faqs: dynamicFaqs, loading } = useData();
  const [openIndex, setOpenIndex] = useState(0);

  // Fetch dynamic faqs
  const faqs = dynamicFaqs || [];

  return (
    <div>
      <div className="bg-secondary py-16 lg:py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground transition-all">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-4">Everything you need to know about ChetakPlus</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          {loading && faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground animate-pulse font-medium">Loading help center...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden bg-card transition-all hover:border-primary/30 group">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-[15px] font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-muted-foreground shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-primary font-bold" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-border/10 pt-4">
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              {faqs.length === 0 && !loading && (
                 <div className="text-center py-10">
                   <p className="text-muted-foreground">No questions found at the moment.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FAQ;