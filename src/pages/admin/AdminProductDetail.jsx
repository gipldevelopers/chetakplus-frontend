import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById, formatCurrency } from "@/data/adminMockData";
import { PageHeader, Panel, StatLabel, StatusBadge } from "@/components/admin/AdminUi";

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const product = useMemo(() => getProductById(id), [id]);
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || "");

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
            <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" onClick={() => navigate(`/admin/products/new?source=${product.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img src={activeImage} alt={product.name} className="h-[340px] w-full object-cover" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image) => (
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
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.description}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-base font-semibold text-slate-900">Rich Content Preview</h2>
            <div
              className="prose prose-sm mt-2 max-w-none text-slate-600"
              dangerouslySetInnerHTML={{ __html: product.richDescription }}
            />
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
              <StatLabel label="Discount" value={`${product.discount}%`} />
              <StatLabel label="Category" value={product.category} />
              <StatLabel label="Stock" value={String(product.stock)} />
              <StatLabel label="SKU" value={product.sku} />
              <StatLabel label="Updated" value={product.updatedAt} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
