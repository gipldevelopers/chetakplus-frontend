import heroBanner from "@/assets/hero-banner.jpg";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";
import notebooksCategory from "@/assets/category-notebooks.jpg";
import journalsCategory from "@/assets/category-journals.jpg";
import officeCategory from "@/assets/category-office.jpg";
import plannersCategory from "@/assets/category-planners.jpg";
import notebookImage from "@/assets/products/spiral-notebook-1.jpg";
import journalImage from "@/assets/products/leather-journal-1.jpg";
import stickyNotesImage from "@/assets/products/sticky-notes-1.jpg";
import diaryImage from "@/assets/products/wiro-diary-1.jpg";
import plannerImage from "@/assets/products/monthly-planner-1.jpg";

export const adminNotifications = [
  {
    id: "n1",
    title: "Five new orders waiting for review",
    time: "5 min ago",
  },
  {
    id: "n2",
    title: "Inventory alert on Wiro Diary",
    time: "18 min ago",
  },
  {
    id: "n3",
    title: "Marketing campaign approved",
    time: "1 hr ago",
  },
];

export const heroSectionsData = [
  {
    id: "hero-1",
    image: heroBanner,
    title: "Build Better Workdays",
    subtitle: "Premium stationery for teams and creators",
    description: "Launch spring bundles with category-focused promotions.",
    buttonText: "Shop Collection",
    buttonLink: "/shop",
    alignment: "left",
    overlay: true,
    status: "Active",
    updatedAt: "2026-04-02",
  },
  {
    id: "hero-2",
    image: heroSlide2,
    title: "Corporate Gift Kits",
    subtitle: "Curated bundles for employee onboarding",
    description: "Showcase gift sets for HR teams and partner gifting.",
    buttonText: "Explore Gifts",
    buttonLink: "/corporate",
    alignment: "center",
    overlay: true,
    status: "Inactive",
    updatedAt: "2026-03-28",
  },
  {
    id: "hero-3",
    image: heroSlide3,
    title: "Planners for High Performers",
    subtitle: "Goal planning templates and weekly layouts",
    description: "Promote planner launches with limited-time offers.",
    buttonText: "View Planners",
    buttonLink: "/category/planners",
    alignment: "right",
    overlay: false,
    status: "Active",
    updatedAt: "2026-03-19",
  },
];

export const categoryTypes = ["Default", "Banner", "Button", "Featured", "Collection"];

export const categoriesData = [
  {
    id: "cat-1",
    image: notebooksCategory,
    name: "Notebooks",
    slug: "notebooks",
    type: "Default",
    parentCategory: "",
    description: "Daily writing notebooks with durable covers and smooth pages.",
    status: "Active",
    metaTitle: "Premium Notebooks | Chetak Plus",
    metaDescription: "Explore premium notebooks for school, office, and personal journaling.",
    productCount: 24,
  },
  {
    id: "cat-2",
    image: journalsCategory,
    name: "Journals",
    slug: "journals",
    type: "Featured",
    parentCategory: "",
    description: "Guided and blank journals for reflection and habit tracking.",
    status: "Active",
    metaTitle: "Journals and Diaries | Chetak Plus",
    metaDescription: "Find elegant journals and diaries designed for everyday planning.",
    productCount: 16,
  },
  {
    id: "cat-3",
    image: plannersCategory,
    name: "Planners",
    slug: "planners",
    type: "Collection",
    parentCategory: "Notebooks",
    description: "Monthly and weekly planners for better focus and execution.",
    status: "Active",
    metaTitle: "Goal Planners and Organizers",
    metaDescription: "Smart planners for productivity and team workflows.",
    productCount: 18,
  },
  {
    id: "cat-4",
    image: officeCategory,
    name: "Office Essentials",
    slug: "office-essentials",
    type: "Banner",
    parentCategory: "",
    description: "Core office products for teams, procurement, and gifting.",
    status: "Inactive",
    metaTitle: "Office Stationery Essentials",
    metaDescription: "Shop office essentials including files, notes, and organizers.",
    productCount: 12,
  },
];

export const productsData = [
  {
    id: "PRD-1001",
    name: "Spiral Notebook Pro",
    category: "Notebooks",
    price: 499,
    discount: 15,
    stock: 125,
    sku: "NBK-SPI-001",
    status: "Active",
    description:
      "Premium spiral notebook with thick pages, smooth paper finish, and hard-wearing cover for everyday use.",
    richDescription:
      "<h3>Built for high-use desks</h3><p>This notebook is designed for daily planning, class notes, and meeting records. The paper quality supports pens and markers with minimal bleed-through.</p><ul><li>Hard cover finish</li><li>Perforated pages</li><li>Compact A5 profile</li></ul>",
    images: [notebookImage, plannerImage, stickyNotesImage],
    updatedAt: "2026-04-04",
  },
  {
    id: "PRD-1002",
    name: "Leather Journal Signature",
    category: "Journals",
    price: 799,
    discount: 10,
    stock: 44,
    sku: "JRN-LTH-002",
    status: "Active",
    description: "Soft leather-finish journal with stitched binding and archival quality pages.",
    richDescription:
      "<h3>Thoughtful daily journaling</h3><p>Includes minimal prompts and section markers for gratitude, goals, and free writing.</p>",
    images: [journalImage, diaryImage, notebookImage],
    updatedAt: "2026-04-03",
  },
  {
    id: "PRD-1003",
    name: "Sticky Notes Studio Pack",
    category: "Office Essentials",
    price: 249,
    discount: 0,
    stock: 0,
    sku: "OFF-STK-003",
    status: "Inactive",
    description: "Color-block sticky notes bundle for reminders and project boards.",
    richDescription:
      "<h3>Organize ideas quickly</h3><p>Pack includes assorted sizes with repositionable adhesive for repeated use.</p>",
    images: [stickyNotesImage, notebookImage, plannerImage],
    updatedAt: "2026-03-29",
  },
  {
    id: "PRD-1004",
    name: "Wiro Diary Executive",
    category: "Planners",
    price: 699,
    discount: 12,
    stock: 21,
    sku: "PLN-WIR-004",
    status: "Active",
    description: "Executive-grade diary with timeline blocks and weekly review pages.",
    richDescription:
      "<h3>Structured planning format</h3><p>Designed for founders and managers who need clear weekly planning blocks.</p>",
    images: [diaryImage, plannerImage, journalImage],
    updatedAt: "2026-04-01",
  },
];

export const ordersData = [
  {
    id: "ORD-9021",
    customerName: "Aarav Sharma",
    customerId: "CUS-201",
    total: 1698,
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    date: "2026-04-05",
    shippingAddress: "21 Green Park, New Delhi, DL 110016",
    items: [
      { name: "Spiral Notebook Pro", quantity: 2, price: 499 },
      { name: "Sticky Notes Studio Pack", quantity: 2, price: 249 },
      { name: "Shipping", quantity: 1, price: 202 },
    ],
    timeline: [
      { label: "Placed", date: "2026-04-05 09:12", state: "done" },
      { label: "Packed", date: "2026-04-05 12:40", state: "done" },
      { label: "Shipped", date: "Pending", state: "current" },
      { label: "Delivered", date: "Pending", state: "pending" },
    ],
  },
  {
    id: "ORD-9020",
    customerName: "Neha Kapoor",
    customerId: "CUS-202",
    total: 799,
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Card",
    date: "2026-04-04",
    shippingAddress: "57 River View, Ahmedabad, GJ 380009",
    items: [{ name: "Leather Journal Signature", quantity: 1, price: 799 }],
    timeline: [
      { label: "Placed", date: "2026-04-04 10:20", state: "done" },
      { label: "Packed", date: "2026-04-04 12:01", state: "done" },
      { label: "Shipped", date: "2026-04-04 16:45", state: "done" },
      { label: "Delivered", date: "2026-04-05 13:15", state: "done" },
    ],
  },
  {
    id: "ORD-9019",
    customerName: "Ishita Rao",
    customerId: "CUS-203",
    total: 699,
    status: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "Cash on Delivery",
    date: "2026-04-04",
    shippingAddress: "8 Residency Road, Jaipur, RJ 302001",
    items: [{ name: "Wiro Diary Executive", quantity: 1, price: 699 }],
    timeline: [
      { label: "Placed", date: "2026-04-04 21:09", state: "done" },
      { label: "Packed", date: "Pending", state: "current" },
      { label: "Shipped", date: "Pending", state: "pending" },
      { label: "Delivered", date: "Pending", state: "pending" },
    ],
  },
];

export const customersData = [
  {
    id: "CUS-201",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98980 11223",
    totalOrders: 14,
    status: "Active",
    totalSpending: 16450,
    joinedAt: "2025-10-16",
    notes: "Prefers weekday afternoon delivery slots.",
    address: "21 Green Park, New Delhi, DL 110016",
    orderIds: ["ORD-9021", "ORD-8990", "ORD-8931"],
  },
  {
    id: "CUS-202",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91 99240 55671",
    totalOrders: 8,
    status: "Active",
    totalSpending: 9850,
    joinedAt: "2025-12-01",
    notes: "Interested in corporate gifting bundles.",
    address: "57 River View, Ahmedabad, GJ 380009",
    orderIds: ["ORD-9020", "ORD-8942"],
  },
  {
    id: "CUS-203",
    name: "Ishita Rao",
    email: "ishita.rao@example.com",
    phone: "+91 98765 44219",
    totalOrders: 3,
    status: "Inactive",
    totalSpending: 2360,
    joinedAt: "2026-01-24",
    notes: "Requested GST invoice on every order.",
    address: "8 Residency Road, Jaipur, RJ 302001",
    orderIds: ["ORD-9019"],
  },
];

export const reviewsData = [
  {
    id: "REV-5001",
    product: "Spiral Notebook Pro",
    customer: "Aarav Sharma",
    rating: 5,
    comment: "Excellent paper quality and very smooth writing experience.",
    status: "Approved",
    date: "2026-04-05",
  },
  {
    id: "REV-5002",
    product: "Leather Journal Signature",
    customer: "Neha Kapoor",
    rating: 4,
    comment: "Looks premium, would love more color options.",
    status: "Pending",
    date: "2026-04-04",
  },
  {
    id: "REV-5003",
    product: "Sticky Notes Studio Pack",
    customer: "Ishita Rao",
    rating: 2,
    comment: "Adhesive could be stronger for wall surfaces.",
    status: "Rejected",
    date: "2026-04-02",
  },
];

export const paymentsData = [
  {
    id: "PAY-7001",
    transactionId: "TXN-1K5P89",
    orderId: "ORD-9021",
    amount: 1698,
    method: "UPI",
    status: "Paid",
    date: "2026-04-05",
    breakdown: {
      subtotal: 1496,
      shipping: 202,
      tax: 0,
      gatewayFee: 12,
    },
  },
  {
    id: "PAY-7002",
    transactionId: "TXN-2M7R11",
    orderId: "ORD-9020",
    amount: 799,
    method: "Card",
    status: "Paid",
    date: "2026-04-04",
    breakdown: {
      subtotal: 749,
      shipping: 50,
      tax: 0,
      gatewayFee: 9,
    },
  },
  {
    id: "PAY-7003",
    transactionId: "TXN-3Z1F22",
    orderId: "ORD-9019",
    amount: 699,
    method: "Cash on Delivery",
    status: "Pending",
    date: "2026-04-04",
    breakdown: {
      subtotal: 699,
      shipping: 0,
      tax: 0,
      gatewayFee: 0,
    },
  },
];

export const contactsData = [
  {
    id: "CON-301",
    name: "Rahul Sinha",
    email: "rahul.sinha@example.com",
    subject: "Bulk order pricing",
    message:
      "Hi team, we are looking for 400 corporate welcome kits for June onboarding. Please share catalog and pricing slabs.",
    date: "2026-04-05",
    status: "New",
  },
  {
    id: "CON-302",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    subject: "Order follow up",
    message:
      "My order ORD-9018 has not moved from packed state for two days. Can someone help with an update?",
    date: "2026-04-04",
    status: "In Review",
  },
  {
    id: "CON-303",
    name: "Karan Mehta",
    email: "karan.mehta@example.com",
    subject: "Custom planner printing",
    message:
      "Do you support branded planner printing for startup teams with custom covers?",
    date: "2026-04-02",
    status: "Resolved",
  },
];

export const dashboardSeries = [
  { month: "Nov", sales: 82, orders: 62, revenue: 520 },
  { month: "Dec", sales: 98, orders: 75, revenue: 610 },
  { month: "Jan", sales: 120, orders: 88, revenue: 720 },
  { month: "Feb", sales: 110, orders: 84, revenue: 680 },
  { month: "Mar", sales: 136, orders: 102, revenue: 810 },
  { month: "Apr", sales: 142, orders: 108, revenue: 860 },
];

export const categoryPerformance = [
  { name: "Notebooks", value: 38 },
  { name: "Journals", value: 24 },
  { name: "Planners", value: 28 },
  { name: "Office", value: 10 },
];

export const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;

export const adminSummary = {
  totalSales: "12,480",
  totalOrders: "1,984",
  totalCustomers: "4,210",
  revenue: "Rs 8,74,200",
};

export const getProductById = (id) => productsData.find((item) => item.id === id);
export const getOrderById = (id) => ordersData.find((item) => item.id === id);
export const getCustomerById = (id) => customersData.find((item) => item.id === id);
export const getPaymentById = (id) => paymentsData.find((item) => item.id === id);
export const getContactById = (id) => contactsData.find((item) => item.id === id);
export const getHeroById = (id) => heroSectionsData.find((item) => item.id === id);
export const getCategoryById = (id) => categoriesData.find((item) => item.id === id);
