import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contactsData } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge, Pagination } from "@/components/admin/AdminUi";

const AdminContacts = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(contactsData.length / itemsPerPage);
  const paginatedContacts = contactsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Contacts" description="Manage inbound inquiries and customer support messages." />

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
              {paginatedContacts.map((contact) => (
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
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={contactsData.length}
          itemsPerPage={itemsPerPage}
        />
      </Panel>
    </div>
  );
};

export default AdminContacts;
