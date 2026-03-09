import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      <div className="bg-secondary py-16 lg:py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">Contact Us</h1>
          <p className="text-muted-foreground mt-4">We'd love to hear from you</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
                <div className="space-y-6 mb-8">
                  {[
                  { icon: Phone, label: "Phone", value: "079-22131764 / 22132622" },
                  { icon: Mail, label: "Email", value: "chetakplus84@gmail.com" },
                  { icon: MapPin, label: "Address", value: "Ahmedabad, Gujarat, India" }].
                  map((item) =>
                  <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Map placeholder */}
                <div className="rounded-2xl overflow-hidden border border-border h-64 bg-secondary flex items-center justify-center">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235014.29918129!2d72.41493!3d23.02053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="ChetakPlus Location" />
                  
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-border/50 space-y-5">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Send us a message</h3>
                {[
                { name: "name", label: "Your Name", type: "text" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "subject", label: "Subject", type: "text" }].
                map((field) =>
                <div key={field.name}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                    <input
                    type={field.type}
                    value={form[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                  
                  <Send size={16} /> Send Message
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>);

};

export default Contact;