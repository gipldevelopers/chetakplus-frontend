import { getImageUrl } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import api from "@/api";

const categoryTypes = ["Default", "Banner", "Button", "Featured", "Collection"];

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const createInitialState = (category) => ({
  imageUrl: category?.imageUrl || "",
  name: category?.name || "",
  slug: category?.slug || "",
  description: category?.description || "",
  type: category?.type || "Default",
  parentCategoryId: category?.parentCategoryId || "",
  status: (category?.status || "Active") === "Active",
  metaTitle: category?.metaTitle || "",
  metaDescription: category?.metaDescription || "",
  sortOrder: category?.sortOrder ?? 0,
});

const AdminCategoryForm = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEditMode = Boolean(categoryId);

  const [formData, setFormData] = useState(() => createInitialState());
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [allCategories, currentCategory] = await Promise.all([
          api.adminGetCategories(),
          isEditMode ? api.adminGetCategoryById(categoryId) : Promise.resolve(null),
        ]);

        if (!isMounted) return;

        const categoryList = Array.isArray(allCategories) ? allCategories : [];
        setCategories(categoryList);

        if (currentCategory) {
          setFormData(createInitialState(currentCategory));
        }

        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load category data.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [categoryId, isEditMode]);

  const parentOptions = useMemo(
    () => categories.filter((category) => String(category.id) !== String(categoryId)),
    [categories, categoryId],
  );

  const selectedParentName = useMemo(
    () => parentOptions.find((item) => String(item.id) === String(formData.parentCategoryId))?.name || "",
    [parentOptions, formData.parentCategoryId],
  );

  const handleNameChange = (event) => {
    const name = event.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : toSlug(name),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        imageUrl: formData.imageUrl,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        type: formData.type,
        parentCategoryId: formData.parentCategoryId || null,
        status: formData.status ? "Active" : "Inactive",
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (isEditMode) {
        await api.adminUpdateCategory(categoryId, payload);
      } else {
        await api.adminCreateCategory(payload);
      }

      navigate("/admin/categories");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    setError("");

    try {
      const uploaded = await api.adminUploadMedia(file, { folder: "categories", kind: "image" });
      const uploadedUrl = uploaded?.url;
      if (!uploadedUrl) {
        throw new Error("Image upload failed");
      }

      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
    } catch (uploadError) {
      setError(uploadError?.message || "Unable to upload category image.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Category" : "Add Category"}
        description="Create or refine category structure with SEO metadata and storefront display settings."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/categories")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      {loading ? (
        <Panel className="p-6 text-sm text-slate-500">Loading category form...</Panel>
      ) : (
        <form className="grid gap-6 xl:grid-cols-[1.2fr_1fr]" onSubmit={handleSubmit}>
          <Panel className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <Label>Category Image</Label>
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="category-image-upload"
                  className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-medium ${
                    uploadingImage
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? "Uploading image..." : "Upload image"}
                </label>
                <input
                  id="category-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    void handleImageUpload(file);
                    event.target.value = "";
                  }}
                />
                {formData.imageUrl ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl text-rose-600 hover:text-rose-700"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Remove image
                  </Button>
                ) : null}
              </div>
              <Input value={formData.imageUrl} readOnly placeholder="Uploaded image path will appear here" className="rounded-xl bg-slate-50" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Category name"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-slug">Slug</Label>
                <Input
                  id="category-slug"
                  value={formData.slug}
                  onChange={(event) => {
                    setSlugManuallyEdited(true);
                    setFormData((prev) => ({ ...prev, slug: toSlug(event.target.value) }));
                  }}
                  placeholder="category-slug"
                  className="rounded-xl font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                rows={4}
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Brief description for storefront and admin use"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category-type">Category Type</Label>
                <select
                  id="category-type"
                  value={formData.type}
                  onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value }))}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  {categoryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-parent">Parent Category</Label>
                <select
                  id="category-parent"
                  value={formData.parentCategoryId}
                  onChange={(event) => setFormData((prev) => ({ ...prev, parentCategoryId: event.target.value }))}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="">No parent</option>
                  {parentOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-sort-order">Sort Order</Label>
                <Input
                  id="category-sort-order"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">Category Status</p>
                <p className="text-xs text-slate-500">Inactive categories are hidden from storefront lists.</p>
              </div>
              <Switch
                checked={formData.status}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, status: checked }))}
              />
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">SEO Fields</h3>
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={formData.metaTitle}
                  onChange={(event) => setFormData((prev) => ({ ...prev, metaTitle: event.target.value }))}
                  placeholder="Meta title for search engines"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(event) => setFormData((prev) => ({ ...prev, metaDescription: event.target.value }))}
                  placeholder="Meta description"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => navigate("/admin/categories")}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" disabled={saving}>
                {saving ? "Saving..." : "Save Category"}
              </Button>
            </div>
          </Panel>

          <Panel className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Preview</h2>
              <StatusBadge value={formData.status ? "Active" : "Inactive"} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {formData.imageUrl ? <img src={getImageUrl(formData.imageUrl)} alt="Category preview" className="h-52 w-full object-cover" /> : <div className="h-52 bg-slate-100" />}
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-slate-900">{formData.name || "Category Name"}</h3>
                <p className="text-sm text-slate-500">/{formData.slug || "category-slug"}</p>
                <p className="text-sm text-slate-600">{formData.description || "Description preview"}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <p>
                    <span className="font-semibold">Type:</span> {formData.type}
                  </p>
                  <p>
                    <span className="font-semibold">Parent:</span> {selectedParentName || "None"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">SEO Snippet</p>
              <p className="mt-1 text-sm text-blue-700">{formData.metaTitle || formData.name || "Meta title"}</p>
              <p className="mt-1 line-clamp-3">{formData.metaDescription || "Meta description preview"}</p>
            </div>
          </Panel>
        </form>
      )}
    </div>
  );
};

export default AdminCategoryForm;
