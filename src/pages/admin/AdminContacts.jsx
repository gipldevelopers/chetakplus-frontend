import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";
import api from "@/api";

const AdminContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    let isMounted = true;

    const loadContacts = async () => {
      try {
        const data = await api.adminGetContacts();
        if (!isMounted) return;
        setContacts(Array.isArray(data) ? data : []);
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load contact inquiries.");
        setContacts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(contacts.length / itemsPerPage)), [contacts.length]);
  const paginatedContacts = useMemo(
    () => contacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [contacts, currentPage]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    Loading contacts...
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContacts.map((contact) => (
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
                ))
              )}

              {!loading && paginatedContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    No contact inquiries found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={contacts.length}
          itemsPerPage={itemsPerPage}
        />
      </Panel>
    </div>
  );
};

export default AdminContacts;
