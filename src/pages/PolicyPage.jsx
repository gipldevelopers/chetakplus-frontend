import { useLocation, Link } from "react-router-dom";

const policies = {
  "privacy-policy": {
    title: "Privacy Policy",
    content: [
    "At ChetakPlus, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.",
    "Information We Collect: We collect information you provide when placing an order, creating an account, or contacting us. This includes your name, email, phone number, and shipping address.",
    "How We Use Your Information: We use your information to process orders, communicate with you about your purchases, and improve our products and services.",
    "Data Security: We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.",
    "Cookies: Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.",
    "Third-Party Sharing: We do not sell your personal information. We may share data with trusted partners who assist us in operating our website and conducting our business.",
    "Contact: If you have questions about this privacy policy, please contact us at chetakplus84@gmail.com."]

  },
  "shipping-policy": {
    title: "Shipping Policy",
    content: [
    "Free Shipping: We offer free shipping on all orders above ₹999 across India.",
    "Standard Delivery: Orders are typically delivered within 5-7 business days after dispatch.",
    "Order Processing: Orders are processed within 1-2 business days (excluding weekends and holidays).",
    "Tracking: You will receive a tracking number via email once your order has been shipped.",
    "Bulk Orders: For bulk orders (100+ pieces), delivery timelines may vary. Please contact us for specific delivery estimates.",
    "Remote Areas: Delivery to remote areas may take an additional 2-3 business days.",
    "Damage During Transit: If your order arrives damaged, please contact us within 48 hours with photos of the damaged product."]

  },
  "refund-policy": {
    title: "Refund Policy",
    content: [
    "Return Window: We accept returns within 7 days of delivery for unused and undamaged products in their original packaging.",
    "Non-Returnable Items: Customized products and bulk orders are non-returnable unless defective.",
    "Refund Process: Once we receive your return, we will inspect the product and process your refund within 5-7 business days.",
    "Refund Method: Refunds will be credited to your original payment method.",
    "Defective Products: If you receive a defective product, please contact us immediately. We will arrange a replacement or full refund.",
    "Cancellation: Orders can be cancelled before dispatch. Once shipped, the standard return policy applies.",
    "Contact: For returns and refunds, email us at chetakplus84@gmail.com with your order details."]

  },
  terms: {
    title: "Terms & Conditions",
    content: [
    "By using the ChetakPlus website and purchasing our products, you agree to the following terms and conditions.",
    "Products: All products are subject to availability. We reserve the right to discontinue any product without prior notice.",
    "Pricing: Prices are listed in Indian Rupees (₹) and are subject to change without notice. Prices at the time of order placement will be honoured.",
    "Intellectual Property: All content on this website, including images, text, and logos, is the property of ChetakPlus and is protected by copyright laws.",
    "Limitation of Liability: ChetakPlus is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website.",
    "Governing Law: These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in Ahmedabad, Gujarat.",
    "Modifications: We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of the updated terms."]

  }
};

const PolicyPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const policy = policies[slug || ""];

  if (!policy) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Page Not Found</h2>
          <Link to="/" className="text-primary hover:underline text-sm">Go Home</Link>
        </div>
      </div>);

  }

  return (
    <div>
      <div className="bg-secondary py-16 lg:py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">{policy.title}</h1>
        </div>
      </div>
      <section className="section-padding">
        <div className="container-custom max-w-3xl space-y-6">
          {policy.content.map((paragraph, i) =>
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">{paragraph}</p>
          )}
        </div>
      </section>
    </div>);

};

export default PolicyPage;