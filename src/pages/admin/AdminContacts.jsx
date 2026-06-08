import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@/api";

const AdminContacts = () => {
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
      const data = await api.adminGetContacts({ page: targetPage, limit: 10 });
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
      setError(fetchError?.message || "Unable to load contact inquiries.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Contacts" description="Manage inbound inquiries and customer support messages." />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <Panel className="overflow-hidden">
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
                  <b>No more contact inquiries</b>
                </div>
              ) : null
            }
          >
            <Table className="admin-table min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((contact) => (
                  <TableRow key={contact.id} onClick={() => navigate(`/admin/contacts/${contact.id}`)} className="cursor-pointer">
                    <TableCell className="font-semibold text-slate-800">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      <p className="max-w-[380px] truncate text-sm text-slate-600">{contact.message}</p>
                    </TableCell>
                    <TableCell>{contact.date}</TableCell>
                    <TableCell>
                      <StatusBadge value={contact.status} />
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                      No contact inquiries found.
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

export default AdminContacts;
