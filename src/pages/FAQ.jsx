import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
{ q: "What is ChetakPlus?", a: "ChetakPlus is a premium stationery brand manufacturing high-quality paper products since 1984, based in Ahmedabad, Gujarat." },
{ q: "What products do you offer?", a: "We offer a wide range of products including notebooks, diaries, planners (weekly, daily, study), arch clip files, long books, wiro diaries, and corporate gift sets." },
{ q: "What is the minimum order quantity?", a: "MOQ varies by product — typically 100-1000 pieces. Please check individual product pages for specific MOQ details." },
{ q: "Do you offer customization?", a: "Yes! We offer customization for corporate orders and bulk purchases. Contact us for details." },
{ q: "What paper quality do you use?", a: "We use premium Meplitho paper ranging from 58 GSM to 80 GSM, depending on the product. Natural shade options are also available." },
{ q: "What is your shipping policy?", a: "We offer free shipping on orders above ₹999. Standard delivery takes 5-7 business days across India." },
{ q: "What is your return policy?", a: "We accept returns within 7 days of delivery for unused and undamaged products. Please check our refund policy page for details." },
{ q: "Do you sell to schools and institutions?", a: "Yes, we offer special pricing for bulk orders from schools, colleges, and institutions. Contact us for institutional pricing." }];


const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      <div className="bg-secondary py-16 lg:py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-4">Everything you need to know about ChetakPlus</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, i) =>
            <div key={i} className="border border-border rounded-xl overflow-hidden bg-card">
                <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                  size={18}
                  className={`text-muted-foreground shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                
                </button>
                <AnimatePresence>
                  {openIndex === i &&
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden">
                  
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

};

export default FAQ;