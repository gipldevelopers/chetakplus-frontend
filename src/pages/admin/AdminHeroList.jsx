import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSectionsData } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";

const AdminHeroList = () => {
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState(heroSectionsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(heroes.length / itemsPerPage);
  const paginatedHeroes = heroes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    setHeroes((prev) => prev.filter((hero) => hero.id !== id));
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedHeroes.map((hero) => (
          <Panel key={hero.id} className="overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={hero.image} alt={hero.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              <div className="absolute left-3 top-3">
                <StatusBadge value={hero.status} />
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h2 className="line-clamp-1 text-base font-semibold text-slate-900">{hero.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{hero.subtitle}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                <p className="font-semibold uppercase tracking-[0.12em] text-slate-400">CTA</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{hero.buttonText}</p>
                <p className="truncate text-slate-500">{hero.buttonLink}</p>
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

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={heroes.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminHeroList;
