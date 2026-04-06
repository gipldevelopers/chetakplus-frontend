import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { categoriesData, categoryTypes, getCategoryById } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const createInitialState = (category) => ({
  image: category?.image || "",
  name: category?.name || "",
  slug: category?.slug || "",
  description: category?.description || "",
  type: category?.type || "Default",
  parentCategory: category?.parentCategory || "",
  status: (category?.status || "Active") === "Active",
  metaTitle: category?.metaTitle || "",
  metaDescription: category?.metaDescription || "",
});

const AdminCategoryForm = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const editingCategory = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const isEditMode = Boolean(editingCategory);

  const [formData, setFormData] = useState(() => createInitialState(editingCategory));
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);

  const categoryNames = categoriesData.map((category) => category.name).filter((name) => name !== editingCategory?.name);

  const handleNameChange = (event) => {
    const name = event.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : toSlug(name),
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      navigate("/admin/categories");
    }, 700);
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

      <form className="grid gap-6 xl:grid-cols-[1.2fr_1fr]" onSubmit={handleSubmit}>
        <Panel className="space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="category-image">Category Image</Label>
            <label
              htmlFor="category-image"
              className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-400"
            >
              <Upload className="mb-2 h-5 w-5 text-slate-500" />
              <p className="text-sm font-medium text-slate-700">Upload category image</p>
              <p className="text-xs text-slate-500">Recommended ratio 4:3</p>
            </label>
            <Input id="category-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
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

          <div className="grid gap-4 sm:grid-cols-2">
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
              <Label htmlFor="category-parent">Parent Category (optional)</Label>
              <select
                id="category-parent"
                value={formData.parentCategory}
                onChange={(event) => setFormData((prev) => ({ ...prev, parentCategory: event.target.value }))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">No parent</option>
                {categoryNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
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
            {formData.image ? <img src={formData.image} alt="Category preview" className="h-52 w-full object-cover" /> : <div className="h-52 bg-slate-100" />}
            <div className="space-y-2 p-4">
              <h3 className="text-lg font-semibold text-slate-900">{formData.name || "Category Name"}</h3>
              <p className="text-sm text-slate-500">/{formData.slug || "category-slug"}</p>
              <p className="text-sm text-slate-600">{formData.description || "Description preview"}</p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <p>
                  <span className="font-semibold">Type:</span> {formData.type}
                </p>
                <p>
                  <span className="font-semibold">Parent:</span> {formData.parentCategory || "None"}
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
    </div>
  );
};

export default AdminCategoryForm;
