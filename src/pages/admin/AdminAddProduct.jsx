import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, ImagePlus, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoriesData, formatCurrency } from "@/data/adminMockData";
import { PageHeader, Panel } from "@/components/admin/AdminUi";
import { cn } from "@/lib/utils";

const steps = [
  { key: "basic", title: "Basic Info" },
  { key: "media", title: "Media" },
  { key: "description", title: "Description" },
  { key: "inventory", title: "Inventory" },
  { key: "review", title: "Review & Publish" },
];

const initialFormData = {
  name: "",
  category: "",
  price: "",
  discount: "",
  images: [],
  description: "",
  stock: "",
  sku: "",
  status: "Active",
};

const EditorToolbarButton = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
  >
    {label}
  </button>
);

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const percent = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const previousStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const onUploadImages = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const previewImages = files.map((file) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file), name: file.name }));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...previewImages] }));
  };

  const removeImage = (id) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((image) => image.id !== id) }));
  };

  const appendDescriptionToken = (token) => {
    setFormData((prev) => ({ ...prev, description: `${prev.description}${prev.description ? "\n" : ""}${token}` }));
  };

  const publishProduct = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      navigate("/admin/products");
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Product"
        description="Build product details in a guided 5-step publishing workflow."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        }
      />

      <Panel className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  index <= stepIndex ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500",
                )}
              >
                {index < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </span>
              <span className={cn("text-xs font-medium", index <= stepIndex ? "text-slate-800" : "text-slate-400")}>{step.title}</span>
            </div>
          ))}
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-slate-900 transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      </Panel>

      <Panel className="p-5 sm:p-6">
        {stepIndex === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Product name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">Category</Label>
              <select
                id="product-category"
                value={formData.category}
                onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Select category</option>
                {categoriesData.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-price">Price</Label>
              <Input
                id="product-price"
                type="number"
                value={formData.price}
                onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="0"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-discount">Discount (%)</Label>
              <Input
                id="product-discount"
                type="number"
                value={formData.discount}
                onChange={(event) => setFormData((prev) => ({ ...prev, discount: event.target.value }))}
                placeholder="0"
                className="rounded-xl"
              />
            </div>
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="space-y-4">
            <label
              htmlFor="product-images"
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center"
            >
              <UploadCloud className="mb-2 h-6 w-6 text-slate-500" />
              <p className="text-sm font-medium text-slate-700">Upload multiple product images</p>
              <p className="text-xs text-slate-500">PNG, JPG, WEBP supported</p>
            </label>
            <Input id="product-images" type="file" accept="image/*" multiple className="hidden" onChange={onUploadImages} />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {formData.images.map((image) => (
                <div key={image.id} className="relative overflow-hidden rounded-xl border border-slate-200">
                  <img src={image.url} alt={image.name} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {!formData.images.length ? (
                <div className="flex h-28 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  No images yet
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <EditorToolbarButton label="H2" onClick={() => appendDescriptionToken("## Heading")} />
              <EditorToolbarButton label="Bold" onClick={() => appendDescriptionToken("**Bold text**")} />
              <EditorToolbarButton label="Bullet" onClick={() => appendDescriptionToken("- Bullet point")} />
              <EditorToolbarButton label="Link" onClick={() => appendDescriptionToken("[Link title](https://)")} />
            </div>
            <Textarea
              rows={12}
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Write detailed product description..."
              className="rounded-xl font-mono text-sm"
            />
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                value={formData.stock}
                onChange={(event) => setFormData((prev) => ({ ...prev, stock: event.target.value }))}
                placeholder="0"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                value={formData.sku}
                onChange={(event) => setFormData((prev) => ({ ...prev, sku: event.target.value }))}
                placeholder="SKU-001"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-status">Status</Label>
              <select
                id="product-status"
                value={formData.status}
                onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        ) : null}

        {stepIndex === 4 ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Name</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{formData.name || "-"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Category</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{formData.category || "-"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Price</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formData.price ? formatCurrency(Number(formData.price)) : "-"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Stock / SKU</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{formData.stock || "0"} / {formData.sku || "-"}</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Description preview</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{formData.description || "No description provided"}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <Button variant="outline" className="rounded-xl" onClick={previousStep} disabled={stepIndex === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          {stepIndex < steps.length - 1 ? (
            <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" onClick={nextStep}>
              Next Step
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" onClick={publishProduct} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish Product"}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default AdminAddProduct;
