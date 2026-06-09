import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel } from "@/components/admin/AdminUi";
import { cn, getImageUrl } from "@/lib/utils";
import api from "@/api";

const steps = [
  { key: "basic", title: "Basic Info" },
  { key: "media", title: "Media" },
  { key: "description", title: "Description" },
  { key: "variants", title: "Variants" },
  { key: "inventory", title: "Inventory" },
  { key: "review", title: "Review & Publish" },
];

const initialFormData = {
  name: "",
  categoryId: "",
  price: "",
  discount: "",
  images: [],
  description: "",
  variants: [],
  stock: "",
  sku: "",
  status: "Active",
  brand: "ChetakPlus",
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const calculateDiscount = (price, originalPrice) => {
  const p = Number(price || 0);
  const op = Number(originalPrice || 0);
  if (p <= 0 || op <= p) return 0;
  return Math.round(((op - p) / op) * 100);
};

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { id: routeProductId } = useParams();
  const [searchParams] = useSearchParams();
  const sourceProductId = searchParams.get("source");
  const productId = routeProductId || sourceProductId || null;
  const isEditMode = Boolean(productId);

  const [stepIndex, setStepIndex] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [categoryData, productData] = await Promise.all([
          api.adminGetCategories(),
          isEditMode ? api.adminGetProductById(productId) : Promise.resolve(null),
        ]);

        if (!isMounted) return;

        const normalizedCategories = Array.isArray(categoryData) ? categoryData : [];
        setCategories(normalizedCategories);

        if (productData) {
          const derivedCategoryId =
            productData.categoryId ||
            normalizedCategories.find((category) => category.slug === productData.categorySlug)?.id ||
            "";

          setFormData({
            name: productData.name || "",
            categoryId: String(derivedCategoryId || ""),
            price: productData.price ?? "",
            discount: calculateDiscount(productData.price, productData.originalPrice),
            images: Array.isArray(productData.images) ? productData.images : [],
            description: productData.description || "",
            variants: Array.isArray(productData.variants) ? productData.variants : [],
            stock: productData.stock ?? "",
            sku: productData.sku || "",
            status: productData.status || "Active",
            brand: productData.brand || "ChetakPlus",
          });
        }

        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load product data.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [isEditMode, productId]);

  const percent = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);
  const parsedImages = useMemo(() => (Array.isArray(formData.images) ? formData.images.filter(Boolean) : []), [formData.images]);

  const selectedCategoryName =
    categories.find((category) => String(category.id) === String(formData.categoryId))?.name || "";

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const previousStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const handleImagesUpload = async (files) => {
    if (!files?.length) return;
    setUploadingImages(true);
    setError("");

    try {
      const uploadResults = await Promise.all(
        Array.from(files).map((file) => api.adminUploadMedia(file, { folder: "products", kind: "image" })),
      );
      const urls = uploadResults.map((result) => result?.url).filter(Boolean);
      if (!urls.length) {
        throw new Error("No image uploaded");
      }

      setFormData((prev) => ({
        ...prev,
        images: Array.from(new Set([...(Array.isArray(prev.images) ? prev.images : []), ...urls])),
      }));
    } catch (uploadError) {
      setError(uploadError?.message || "Unable to upload product image.");
    } finally {
      setUploadingImages(false);
    }
  };

  const publishProduct = async () => {
    setIsPublishing(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        brand: formData.brand || "ChetakPlus",
        categoryId: formData.categoryId || null,
        price: Number(formData.price),
        discount: Number(formData.discount || 0),
        images: parsedImages,
        description: formData.description,
        shortDescription: formData.description ? formData.description.slice(0, 220) : "",
        variants: formData.variants,
        stock: Number(formData.stock || 0),
        sku: formData.sku,
        status: formData.status,
      };

      if (isEditMode) {
        await api.adminUpdateProduct(productId, payload);
      } else {
        await api.adminCreateProduct(payload);
      }

      navigate("/admin/products");
    } catch (submitError) {
      setError(submitError?.message || "Unable to save product.");
      setStepIndex(0);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Loading product form...</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Product" : "Add Product"}
        description="Build product details in a guided 5-step publishing workflow."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

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
              <Label htmlFor="product-brand">Brand</Label>
              <Input
                id="product-brand"
                value={formData.brand}
                onChange={(event) => setFormData((prev) => ({ ...prev, brand: event.target.value }))}
                placeholder="ChetakPlus"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">Category</Label>
              <select
                id="product-category"
                value={formData.categoryId}
                onChange={(event) => setFormData((prev) => ({ ...prev, categoryId: event.target.value }))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
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
                min="0"
                max="100"
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
            <Label>Product Images</Label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="product-images-upload"
                className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-medium ${
                  uploadingImages
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ImagePlus className="h-4 w-4" />
                {uploadingImages ? "Uploading images..." : "Upload images"}
              </label>
              <input
                id="product-images-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploadingImages}
                onChange={(event) => {
                  void handleImagesUpload(event.target.files);
                  event.target.value = "";
                }}
              />
              <span className="text-xs text-slate-500">Upload real product photos. No URL paste needed.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {parsedImages.map((image, index) => (
                <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-200">
                  <img src={getImageUrl(image)} alt="Product preview" className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        images: (Array.isArray(prev.images) ? prev.images : []).filter((item) => item !== image),
                      }))
                    }
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {!parsedImages.length ? (
                <div className="col-span-2 sm:col-span-4 flex h-28 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Upload at least one real product image
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="space-y-4">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              rows={12}
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Write detailed product description..."
              className="rounded-xl text-sm"
            />
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Product Variants</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    variants: [
                      ...prev.variants,
                      {
                        id: Date.now().toString(),
                        title: "",
                        size: "",
                        pages: "",
                        pack: "",
                        mrp: "",
                        price: "",
                        sku: "",
                        stock: "10",
                      },
                    ],
                  }));
                }}
              >
                + Add Variant
              </Button>
            </div>
            
            {formData.variants.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No variants added. The main product details will be used.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={variant.id} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-rose-500"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          variants: prev.variants.filter((v) => v.id !== variant.id),
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="mb-3 font-medium text-slate-700">Variant {index + 1}</div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Title (e.g. 72 Pages)</Label>
                        <Input
                          value={variant.title}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].title = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Pages</Label>
                        <Input
                          value={variant.pages}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].pages = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Size</Label>
                        <Input
                          value={variant.size}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].size = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Pack</Label>
                        <Input
                          value={variant.pack}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].pack = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">MRP (₹)</Label>
                        <Input
                          type="number"
                          value={variant.mrp}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].mrp = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Selling Price (₹)</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].price = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">SKU</Label>
                        <Input
                          value={variant.sku}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].sku = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Stock</Label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].stock = e.target.value;
                            setFormData((prev) => ({ ...prev, variants: newVariants }));
                          }}
                          className="h-8 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {stepIndex === 4 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-stock">Base Stock</Label>
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
              <Label htmlFor="product-sku">Base SKU</Label>
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

        {stepIndex === 5 ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Name</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{formData.name || "-"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Category</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedCategoryName || "-"}</p>
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
              {isPublishing ? "Saving..." : isEditMode ? "Update Product" : "Publish Product"}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default AdminAddProduct;
