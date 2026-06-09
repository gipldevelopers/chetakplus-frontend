import { getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/api";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import InfiniteScroll from "react-infinite-scroll-component";

const AdminHeroList = () => {
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMoreData = async (reset = false) => {
    if (loading && !reset) return;

    setLoading(true);
    const targetPage = reset ? 1 : page;

    try {
      const data = await api.adminGetHeroes({ page: targetPage, limit: 10 });
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
      setError(fetchError?.message || "Unable to load hero slides.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this hero slide?");
    if (!shouldDelete) return;

    try {
      await api.adminDeleteHero(id);
      setItems((prev) => prev.filter((hero) => hero.id !== id));
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete hero slide.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero Section"
        description="Manage homepage hero banners, messaging, CTA destinations, and visibility status."
        actions={
          <Button onClick={() => navigate("/admin/hero/new")} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Hero Section
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <InfiniteScroll
        dataLength={items.length}
        next={() => fetchMoreData(false)}
        hasMore={hasMore}
        loader={<div className="p-6 text-center text-sm text-slate-500">Loading...</div>}
        endMessage={
          items.length > 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              <b>No more hero slides</b>
            </div>
          ) : null
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((hero) => (
            <Panel key={hero.id} className="overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {hero.mediaType === "video" ? (
                  <video src={hero.imageUrl} poster={hero.posterUrl || undefined} muted autoPlay loop playsInline className="h-full w-full object-cover" />
                ) : (
                  <img src={getImageUrl(hero.imageUrl)} alt={hero.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                )}
                <div className="absolute left-3 top-3">
                  <StatusBadge value={hero.status} />
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h2 className="line-clamp-1 text-base font-semibold text-slate-900">{hero.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{hero.subtitle || hero.description}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                  <p className="font-semibold uppercase tracking-[0.12em] text-slate-400">CTA</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{hero.ctaText || "-"}</p>
                  <p className="truncate text-slate-500">{hero.ctaLink || "-"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div>
                    <p className="uppercase tracking-[0.12em]">Alignment</p>
                    <p className="mt-1 font-medium text-slate-700">{hero.alignment}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.12em]">Overlay</p>
                    <p className="mt-1 font-medium text-slate-700">{hero.overlay ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link to={`/admin/hero/${hero.id}/edit`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(hero.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </InfiniteScroll>

      {!loading && items.length === 0 ? (
        <Panel className="p-6 text-sm text-slate-500">No hero sections found yet.</Panel>
      ) : null}
    </div>
  );
};

export default AdminHeroList;
