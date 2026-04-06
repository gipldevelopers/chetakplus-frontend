import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { heroSectionsData } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";

const createInitialState = (hero) => ({
  image: hero?.image || "",
  title: hero?.title || "",
  subtitle: hero?.subtitle || "",
  description: hero?.description || "",
  buttonText: hero?.buttonText || "",
  buttonLink: hero?.buttonLink || "",
  alignment: hero?.alignment || "left",
  overlay: hero?.overlay ?? true,
  status: hero?.status || "Active",
});

const AdminHeroForm = () => {
  const navigate = useNavigate();
  const { heroId } = useParams();

  const editingHero = useMemo(() => heroSectionsData.find((hero) => hero.id === heroId), [heroId]);
  const isEditMode = Boolean(editingHero);

  const [formData, setFormData] = useState(() => createInitialState(editingHero));
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      navigate("/admin/hero");
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Hero Section" : "Add Hero Section"}
        description="Configure homepage banners, messaging hierarchy, button behavior, and live preview."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/hero")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hero List
          </Button>
        }
      />

      <form className="grid gap-6 xl:grid-cols-[1.2fr_1fr]" onSubmit={handleSubmit}>
        <Panel className="space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="hero-image">Banner Image</Label>
            <label
              htmlFor="hero-image"
              className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-400"
            >
              <Upload className="mb-2 h-5 w-5 text-slate-500" />
              <p className="text-sm font-medium text-slate-700">Upload hero banner</p>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP up to 4MB</p>
            </label>
            <Input id="hero-image" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Enter headline"
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={formData.subtitle}
              onChange={(event) => setFormData((prev) => ({ ...prev, subtitle: event.target.value }))}
              placeholder="Enter subtitle"
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-description">Description</Label>
            <Textarea
              id="hero-description"
              rows={4}
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Describe campaign intent and messaging"
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-button-text">Button Text</Label>
              <Input
                id="hero-button-text"
                value={formData.buttonText}
                onChange={(event) => setFormData((prev) => ({ ...prev, buttonText: event.target.value }))}
                placeholder="Shop now"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-button-link">Button Link</Label>
              <Input
                id="hero-button-link"
                value={formData.buttonLink}
                onChange={(event) => setFormData((prev) => ({ ...prev, buttonLink: event.target.value }))}
                placeholder="/shop"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-alignment">Alignment</Label>
              <select
                id="hero-alignment"
                value={formData.alignment}
                onChange={(event) => setFormData((prev) => ({ ...prev, alignment: event.target.value }))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-status">Status</Label>
              <select
                id="hero-status"
                value={formData.status}
                onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Enable Overlay</p>
              <p className="text-xs text-slate-500">Adds contrast layer over image for readability</p>
            </div>
            <Switch checked={formData.overlay} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, overlay: checked }))} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => navigate("/admin/hero")}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" disabled={submitting}>
              {submitting ? "Saving..." : "Save Hero Section"}
            </Button>
          </div>
        </Panel>

        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Live Preview</h2>
            <StatusBadge value={formData.status} />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200">
            {formData.image ? <img src={formData.image} alt="Hero preview" className="h-64 w-full object-cover" /> : <div className="h-64 bg-slate-100" />}
            {formData.overlay ? <div className="absolute inset-0 bg-slate-900/45" /> : null}
            <div
              className={`absolute inset-0 flex p-6 text-white ${
                formData.alignment === "center"
                  ? "items-center justify-center text-center"
                  : formData.alignment === "right"
                    ? "items-center justify-end text-right"
                    : "items-center justify-start text-left"
              }`}
            >
              <div className="max-w-xs space-y-2">
                <p className="text-lg font-semibold">{formData.title || "Hero title"}</p>
                <p className="text-sm text-white/85">{formData.subtitle || "Hero subtitle"}</p>
                <p className="text-xs text-white/75">{formData.description || "Description preview"}</p>
                <button type="button" className="mt-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900">
                  {formData.buttonText || "Button"}
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </form>
    </div>
  );
};

export default AdminHeroForm;
