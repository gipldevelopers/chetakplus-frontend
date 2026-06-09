import { getImageUrl } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2, Download, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/api";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const AdminProducts = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  const fetchMoreData = async (reset = false) => {
    if (loading && !reset) return;

    setLoading(true);
    const targetPage = reset ? 1 : page;

    try {
      const data = await api.adminGetProducts({ page: targetPage, limit: 10, search: searchValue });
      setError("");

      if (!data || data.length === 0) {
        setHasMore(false);
        if (reset) setItems([]);
      } else {
        setItems((prev) => reset ? data : [...prev, ...data]);
        setPage((prev) => reset ? 2 : prev + 1);

        if (data.length < 10) setHasMore(false);
        else setHasMore(true);
      }
    } catch (fetchError) {
      setError(fetchError?.message || "Unable to load products.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const removeProduct = async (id) => {
    const shouldDelete = window.confirm("Delete this product?");
    if (!shouldDelete) return;

    try {
      await api.adminDeleteProduct(id);
      setItems((prev) => prev.filter((product) => String(product.id) !== String(id)));
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete product.");
    }
  };

  const handleDownloadTemplate = () => {
    // Directly open the backend URL to trigger the file download
    // This bypasses the apiClient which tries to parse it as JSON
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "/backend/api";
    const downloadUrl = `${baseUrl.replace(/\/+$/, "")}/admin/product-template.php`;
    window.open(downloadUrl, '_blank');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const response = await api.adminImportProducts(file);
      alert(`Import successful!\nImported: ${response.imported || 0}\nUpdated: ${response.updated || 0}`);
      if (response.errors && response.errors.length > 0) {
        console.error("Import errors:", response.errors);
        alert(`Warning: ${response.errors.length} rows had errors. Check console.`);
      }
      fetchMoreData(true);
    } catch (err) {
      setError(err.message || "Failed to import products");
    } finally {
      setImporting(false);
      // reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage catalog inventory, pricing, stock levels, and publishing state."
        actions={
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="rounded-xl border-slate-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Template
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="rounded-xl border-slate-200"
            >
              {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {importing ? "Importing..." : "Import CSV"}
            </Button>
            <Button onClick={() => navigate("/admin/products/new")} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <Panel className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by name, category, SKU, or slug"
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <InfiniteScroll
            dataLength={items.length}
            next={() => fetchMoreData(false)}
            hasMore={hasMore}
            loader={
              <div className="py-4 text-center text-sm text-slate-500">
                Loading...
              </div>
            }
            endMessage={
              items.length > 0 ? (
                <div className="py-4 text-center text-sm text-slate-500">
                  <b>No more products</b>
                </div>
              ) : null
            }
          >
            <Table className="admin-table min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        {product.images?.[0] ? (
                          <img src={getImageUrl(product.images[0])} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">No image</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-slate-800">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sku || "-"}</p>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.category || "-"}</TableCell>
                    <TableCell>{product.stock ?? 0}</TableCell>
                    <TableCell>
                      <StatusBadge value={product.status || "Inactive"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-sm text-slate-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
      </Panel>
    </div>
  );
};

export default AdminProducts;

