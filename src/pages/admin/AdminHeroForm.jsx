import { getImageUrl } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import api from "@/api";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";

const STATIC_ROUTE_OPTIONS = [
  { value: "/", label: "Home" },
  { value: "/shop", label: "Shop" },
  { value: "/about", label: "About" },
  { value: "/contact", label: "Contact" },
  { value: "/corporate", label: "Corporate Orders" },
  { value: "/blog", label: "Blog" },
  { value: "/wishlist", label: "Wishlist" },
  { value: "/checkout", label: "Checkout" },
  { value: "/shop?filter=new", label: "New Arrivals" },
  { value: "/shop?filter=bestseller", label: "Best Sellers" },
];

const normalizeStats = (stats) => {
  const normalized = Array.isArray(stats) ? stats.slice(0, 3) : [];
  while (normalized.length < 3) {
    normalized.push({ val: "", label: "" });
  }

  return normalized.map((item) => ({
    val: String(item?.val || item?.value || "").trim(),
    label: String(item?.label || "").trim(),
  }));
};

const createInitialState = (hero) => ({
  badge: hero?.badge || "",
  title: hero?.title || "",
  highlightText: hero?.highlightText || "",
  subtitle: hero?.subtitle || "",
  description: hero?.description || "",
  mediaType: hero?.mediaType || "image",
  imageUrl: hero?.imageUrl || "",
  posterUrl: hero?.posterUrl || "",
  buttonText: hero?.ctaText || "",
  buttonLink: hero?.ctaLink || "",
  secondaryButtonText: hero?.secondaryCtaText || "",
  secondaryButtonLink: hero?.secondaryCtaLink || "",
  stats: normalizeStats(hero?.stats),
  alignment: hero?.alignment || "left",
  overlay: hero?.overlay ?? true,
  status: hero?.status || "Active",
  sortOrder: hero?.sortOrder ?? 0,
});

const AdminHeroForm = () => {
  const navigate = useNavigate();
  const { heroId } = useParams();
  const isEditMode = Boolean(heroId);

  const [formData, setFormData] = useState(() => createInitialState());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [error, setError] = useState("");
  const [useCustomPrimaryLink, setUseCustomPrimaryLink] = useState(false);
  const [useCustomSecondaryLink, setUseCustomSecondaryLink] = useState(false);

  const routeOptions = useMemo(() => {
    const dynamicCategoryRoutes = categories
      .filter((category) => category?.slug)
      .map((category) => ({
        value: `/category/${category.slug}`,
        label: `Category: ${category.name}`,
      }));

    const merged = [...STATIC_ROUTE_OPTIONS, ...dynamicCategoryRoutes];
    const uniqueMap = new Map();
    merged.forEach((item) => {
      if (!uniqueMap.has(item.value)) {
        uniqueMap.set(item.value, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, [categories]);

  useEffect(() => {
    let isMounted = true;

    const fetchFormDependencies = async () => {
      try {
        const [hero, categoriesData] = await Promise.all([
          isEditMode ? api.adminGetHeroById(heroId) : Promise.resolve(null),
          api.adminGetCategories(),
        ]);

        if (!isMounted) return;

        const categoryList = Array.isArray(categoriesData) ? categoriesData : [];
        setCategories(categoryList);

        const categoryRouteSet = new Set(
          categoryList
            .filter((category) => category?.slug)
            .map((category) => `/category/${category.slug}`),
        );
        const staticRouteSet = new Set(STATIC_ROUTE_OPTIONS.map((route) => route.value));
        const isRouteKnownInData = (value) => staticRouteSet.has(value) || categoryRouteSet.has(value);

        if (hero) {
          const nextState = createInitialState(hero);
          setFormData(nextState);
          setUseCustomPrimaryLink(nextState.buttonLink ? !isRouteKnownInData(nextState.buttonLink) : false);
          setUseCustomSecondaryLink(nextState.secondaryButtonLink ? !isRouteKnownInData(nextState.secondaryButtonLink) : false);
        }

        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load hero section.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFormDependencies();
    return () => {
      isMounted = false;
    };
  }, [heroId, isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const previewAlignmentClass = useMemo(() => {
    if (formData.alignment === "center") return "items-center justify-center text-center";
    if (formData.alignment === "right") return "items-center justify-end text-right";
    return "items-center justify-start text-left";
  }, [formData.alignment]);

  const primarySelectValue = useCustomPrimaryLink ? "__custom__" : (formData.buttonLink || "");
  const secondarySelectValue = useCustomSecondaryLink ? "__custom__" : (formData.secondaryButtonLink || "");

  const handleUpload = async (file, type) => {
    if (!file) return;

    setError("");
    if (type === "media") setUploadingMedia(true);
    if (type === "poster") setUploadingPoster(true);

    try {
      const uploaded = await api.adminUploadMedia(file, { folder: "hero", kind: type });
      const uploadedUrl = uploaded?.url;
      if (!uploadedUrl) {
        throw new Error("Upload response is missing file URL.");
      }

      setFormData((prev) => ({
        ...prev,
        ...(type === "media" ? { imageUrl: uploadedUrl, mediaType: uploaded?.mediaType || prev.mediaType } : { posterUrl: uploadedUrl }),
      }));
    } catch (uploadError) {
      setError(uploadError?.message || "Unable to upload file.");
    } finally {
      if (type === "media") setUploadingMedia(false);
      if (type === "poster") setUploadingPoster(false);
    }
  };

  const updateStat = (index, key, value) => {
    setFormData((prev) => {
      const nextStats = [...prev.stats];
      nextStats[index] = {
        ...nextStats[index],
        [key]: value,
      };
      return { ...prev, stats: nextStats };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const statsPayload = formData.stats
        .map((stat) => ({ val: stat.val.trim(), label: stat.label.trim() }))
        .filter((stat) => stat.val !== "" && stat.label !== "");

      const payload = {
        badge: formData.badge,
        title: formData.title,
        highlightText: formData.highlightText,
        subtitle: formData.subtitle,
        description: formData.description,
        mediaType: formData.mediaType,
        imageUrl: formData.imageUrl,
        posterUrl: formData.posterUrl,
        ctaText: formData.buttonText,
        ctaLink: formData.buttonLink,
        secondaryCtaText: formData.secondaryButtonText,
        secondaryCtaLink: formData.secondaryButtonLink,
        stats: statsPayload,
        alignment: formData.alignment,
        overlay: formData.overlay,
        status: formData.status,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (isEditMode) {
        await api.adminUpdateHero(heroId, payload);
      } else {
        await api.adminCreateHero(payload);
      }

      navigate("/admin/hero");
    } catch (submitError) {
      setError(submitError?.message || "Unable to save hero section.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Panel className="p-6 text-sm text-slate-500">
        Loading hero section...
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Hero Section" : "Add Hero Section"}
        description="Real hero CMS: upload media files, set automatic button routes, and control content."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/hero")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hero List
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <form className="grid gap-6 xl:grid-cols-[1.2fr_1fr]" onSubmit={handleSubmit}>
        <Panel className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-media-type">Media Type</Label>
              <select
                id="hero-media-type"
                value={formData.mediaType}
                onChange={(event) => setFormData((prev) => ({ ...prev, mediaType: event.target.value }))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-sort-order">Sort Order</Label>
              <Input
                id="hero-sort-order"
                type="number"
                value={formData.sortOrder}
                onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hero Media Upload ({formData.mediaType === "video" ? "Video" : "Image"})</Label>
            <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-400">
              <UploadCloud className="mb-2 h-5 w-5 text-slate-500" />
              <p className="text-sm font-medium text-slate-700">
                {uploadingMedia ? "Uploading media..." : `Upload ${formData.mediaType}`}
              </p>
              <p className="text-xs text-slate-500">Supported: JPG, PNG, WEBP, MP4, WEBM, MOV</p>
              <input
                type="file"
                accept={formData.mediaType === "video" ? "video/*" : "image/*"}
                className="hidden"
                disabled={uploadingMedia}
                onChange={(event) => handleUpload(event.target.files?.[0], "media")}
              />
            </label>
            <Input value={formData.imageUrl} readOnly className="rounded-xl bg-slate-50" placeholder="Uploaded media URL will appear here" />
          </div>

          {formData.mediaType === "video" ? (
            <div className="space-y-2">
              <Label>Video Poster Upload (Optional)</Label>
              <label className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-400">
                <UploadCloud className="mb-2 h-5 w-5 text-slate-500" />
                <p className="text-sm font-medium text-slate-700">
                  {uploadingPoster ? "Uploading poster..." : "Upload poster image"}
                </p>
                <p className="text-xs text-slate-500">Supported: JPG, PNG, WEBP</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingPoster}
                  onChange={(event) => handleUpload(event.target.files?.[0], "poster")}
                />
              </label>
              <Input value={formData.posterUrl} readOnly className="rounded-xl bg-slate-50" placeholder="Uploaded poster URL will appear here" />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="hero-badge">Badge</Label>
            <Input
              id="hero-badge"
              value={formData.badge}
              onChange={(event) => setFormData((prev) => ({ ...prev, badge: event.target.value }))}
              placeholder="Premium Stationery | Since 1984"
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Write Your"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-highlight">Highlight Text</Label>
              <Input
                id="hero-highlight"
                value={formData.highlightText}
                onChange={(event) => setFormData((prev) => ({ ...prev, highlightText: event.target.value }))}
                placeholder="Success Story"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={formData.subtitle}
              onChange={(event) => setFormData((prev) => ({ ...prev, subtitle: event.target.value }))}
              placeholder="Premium planners and notebooks for every workflow."
              className="rounded-xl"
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

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Hero Stats (3 items)</p>
            {formData.stats.map((stat, index) => (
              <div key={`stat-${index}`} className="grid gap-3 sm:grid-cols-2">
                <Input
                  value={stat.val}
                  onChange={(event) => updateStat(index, "val", event.target.value)}
                  placeholder={`Value ${index + 1} (e.g. 50K+)`}
                  className="rounded-xl bg-white"
                />
                <Input
                  value={stat.label}
                  onChange={(event) => updateStat(index, "label", event.target.value)}
                  placeholder={`Label ${index + 1} (e.g. Happy Customers)`}
                  className="rounded-xl bg-white"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-button-text">Primary Button Text</Label>
              <Input
                id="hero-button-text"
                value={formData.buttonText}
                onChange={(event) => setFormData((prev) => ({ ...prev, buttonText: event.target.value }))}
                placeholder="Shop now"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Button Route (Auto)</Label>
              <select
                value={primarySelectValue}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "__custom__") {
                    setUseCustomPrimaryLink(true);
                    return;
                  }
                  setUseCustomPrimaryLink(false);
                  setFormData((prev) => ({ ...prev, buttonLink: value }));
                }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Select route</option>
                {routeOptions.map((route) => (
                  <option key={route.value} value={route.value}>
                    {route.label} ({route.value})
                  </option>
                ))}
                <option value="__custom__">Custom route</option>
              </select>
              {useCustomPrimaryLink ? (
                <Input
                  value={formData.buttonLink}
                  onChange={(event) => setFormData((prev) => ({ ...prev, buttonLink: event.target.value }))}
                  placeholder="/custom-route"
                  className="rounded-xl"
                />
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-secondary-button-text">Secondary Button Text</Label>
              <Input
                id="hero-secondary-button-text"
                value={formData.secondaryButtonText}
                onChange={(event) => setFormData((prev) => ({ ...prev, secondaryButtonText: event.target.value }))}
                placeholder="Explore Planners"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary Button Route (Auto)</Label>
              <select
                value={secondarySelectValue}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "__custom__") {
                    setUseCustomSecondaryLink(true);
                    return;
                  }
                  setUseCustomSecondaryLink(false);
                  setFormData((prev) => ({ ...prev, secondaryButtonLink: value }));
                }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Select route</option>
                {routeOptions.map((route) => (
                  <option key={route.value} value={route.value}>
                    {route.label} ({route.value})
                  </option>
                ))}
                <option value="__custom__">Custom route</option>
              </select>
              {useCustomSecondaryLink ? (
                <Input
                  value={formData.secondaryButtonLink}
                  onChange={(event) => setFormData((prev) => ({ ...prev, secondaryButtonLink: event.target.value }))}
                  placeholder="/custom-route"
                  className="rounded-xl"
                />
              ) : null}
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
              <p className="text-xs text-slate-500">Adds contrast layer over media for readability</p>
            </div>
            <Switch checked={formData.overlay} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, overlay: checked }))} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => navigate("/admin/hero")}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" disabled={submitting || uploadingMedia || uploadingPoster}>
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : "Save Hero Section"}
            </Button>
          </div>
        </Panel>

        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Live Preview</h2>
            <StatusBadge value={formData.status} />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {formData.mediaType === "video" && formData.imageUrl ? (
              <video
                src={formData.imageUrl}
                poster={formData.posterUrl || undefined}
                className="h-64 w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : formData.imageUrl ? (
              <img src={getImageUrl(formData.imageUrl)} alt="Hero preview" className="h-64 w-full object-cover" />
            ) : (
              <div className="h-64 bg-slate-100" />
            )}

            {formData.overlay ? <div className="absolute inset-0 bg-slate-900/45" /> : null}
            <div className={`absolute inset-0 flex p-6 text-white ${previewAlignmentClass}`}>
              <div className="max-w-xs space-y-2">
                {formData.badge ? <p className="text-xs uppercase tracking-[0.2em] text-white/80">{formData.badge}</p> : null}
                <p className="text-lg font-semibold">
                  {formData.title || "Hero title"} {formData.highlightText ? <span className="text-white/90">{formData.highlightText}</span> : null}
                </p>
                <p className="text-sm text-white/85">{formData.subtitle || "Hero subtitle"}</p>
                <p className="text-xs text-white/75">{formData.description || "Description preview"}</p>
                {formData.buttonText ? (
                  <button type="button" className="mt-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900">
                    {formData.buttonText}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </Panel>
      </form>
    </div>
  );
};

export default AdminHeroForm;
