import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatLabel, StatusBadge } from "@/components/admin/AdminUi";
import api from "@/api";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const data = await api.adminGetProductById(id);
        if (!isMounted) return;
        setProduct(data);
        setActiveImage(data?.images?.[0] || "");
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load product.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const discountPercent = useMemo(() => {
    if (!product?.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }, [product]);

  if (loading) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Loading product...</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel className="border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </Panel>
    );
  }

  if (!product) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Product not found.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Details"
        description="Detailed product profile with media, pricing, category, and stock information."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="h-[340px] w-full object-cover" />
            ) : (
              <div className="flex h-[340px] items-center justify-center text-sm text-slate-400">No image</div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(product.images || []).map((image) => (
              <button
                type="button"
                key={image}
                onClick={() => setActiveImage(image)}
                className={`overflow-hidden rounded-lg border ${activeImage === image ? "border-slate-900" : "border-slate-200"}`}
              >
                <img src={image} alt={product.name} className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-base font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{product.description || "-"}</p>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="space-y-4 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Product</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-1 text-xs font-mono text-slate-500">{product.id}</p>
              </div>
              <StatusBadge value={product.status} />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <StatLabel label="Price" value={formatCurrency(product.price)} />
              <StatLabel label="Discount" value={`${discountPercent}%`} />
              <StatLabel label="Category" value={product.category || "-"} />
              <StatLabel label="Stock" value={String(product.stock ?? 0)} />
              <StatLabel label="SKU" value={product.sku || "-"} />
              <StatLabel label="Updated" value={product.updatedAt || "-"} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
