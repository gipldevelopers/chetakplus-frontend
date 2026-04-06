import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getContactById } from "@/data/adminMockData";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";

const AdminContactDetail = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const contact = useMemo(() => getContactById(contactId), [contactId]);

  const [replySubject, setReplySubject] = useState(contact ? `Re: ${contact.subject}` : "");
  const [replyBody, setReplyBody] = useState("");

  if (!contact) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Contact submission not found.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Inquiry"
        description="Review complete message context and prepare a frontend-only reply response."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/contacts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">From</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{contact.name}</p>
              <p className="text-sm text-slate-600">{contact.email}</p>
            </div>
            <StatusBadge value={contact.status} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Subject</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{contact.subject}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{contact.message}</p>
          </div>
        </Panel>

        <Panel className="space-y-4 p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">Reply UI</h2>
          <div className="space-y-2">
            <label htmlFor="reply-subject" className="text-xs font-medium text-slate-600">
              Subject
            </label>
            <Input
              id="reply-subject"
              value={replySubject}
              onChange={(event) => setReplySubject(event.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="reply-body" className="text-xs font-medium text-slate-600">
              Message
            </label>
            <Textarea
              id="reply-body"
              rows={10}
              value={replyBody}
              onChange={(event) => setReplyBody(event.target.value)}
              placeholder="Write your response here..."
              className="rounded-xl"
            />
          </div>
          <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <Send className="mr-2 h-4 w-4" />
            Send Reply (UI only)
          </Button>
        </Panel>
      </div>
    </div>
  );
};

export default AdminContactDetail;
