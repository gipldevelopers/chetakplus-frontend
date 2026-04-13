import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";
import api from "@/api";

const ITEMS_PER_PAGE = 5;
const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const AdminProducts = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await api.adminGetProducts();
        if (!isMounted) return;
        setProducts(Array.isArray(data) ? data : []);
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load products.");
        setProducts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const token = searchValue.toLowerCase().trim();
    if (!token) return products;

    return products.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const category = String(product.category || "").toLowerCase();
      const sku = String(product.sku || "").toLowerCase();
      const slug = String(product.slug || "").toLowerCase();
      return name.includes(token) || category.includes(token) || sku.includes(token) || slug.includes(token);
    });
  }, [products, searchValue]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)), [filteredProducts.length]);
  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredProducts, currentPage],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const removeProduct = async (id) => {
    const shouldDelete = window.confirm("Delete this product?");
    if (!shouldDelete) return;

    try {
      await api.adminDeleteProduct(id);
      setProducts((prev) => prev.filter((product) => String(product.id) !== String(id)));
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete product.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage catalog inventory, pricing, stock levels, and publishing state."
        actions={
          <Button onClick={() => navigate("/admin/products/new")} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
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

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
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
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
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

                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-sm text-slate-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredProducts.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </Panel>
    </div>
  );
};

export default AdminProducts;
