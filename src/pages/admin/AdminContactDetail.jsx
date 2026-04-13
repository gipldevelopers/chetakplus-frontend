import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import api from "@/api";

const AdminContactDetail = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();

  const [contact, setContact] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [status, setStatus] = useState("New");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadContact = async () => {
      try {
        const data = await api.adminGetContactById(contactId);
        if (!isMounted) return;
        setContact(data || null);
        const nextSubject = data?.replySubject || (data?.subject ? `Re: ${data.subject}` : "");
        setReplySubject(nextSubject);
        setReplyBody(data?.replyMessage || "");
        setStatus(data?.status || "New");
        setError("");
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || "Unable to load contact submission.");
        setContact(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContact();
    return () => {
      isMounted = false;
    };
  }, [contactId]);

  const saveContactUpdate = async () => {
    if (!contact) return;

    setSaving(true);
    setError("");

    try {
      const updated = await api.adminUpdateContact(contact.id, {
        status,
        replySubject,
        replyMessage: replyBody,
      });
      setContact(updated);
      setReplySubject(updated?.replySubject || "");
      setReplyBody(updated?.replyMessage || "");
      setStatus(updated?.status || status);
    } catch (saveError) {
      setError(saveError?.message || "Unable to save contact update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">Loading contact details...</p>
      </Panel>
    );
  }

  if (!contact) {
    return (
      <Panel className="p-6">
        <p className="text-sm text-slate-500">{error || "Contact submission not found."}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Inquiry"
        description="Review complete message context and save a real reply/status update in backend."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/contacts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">From</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{contact.name}</p>
              <p className="text-sm text-slate-600">{contact.email}</p>
              {contact.phone ? <p className="text-sm text-slate-600">{contact.phone}</p> : null}
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
          <h2 className="text-sm font-semibold text-slate-900">Reply & Status</h2>

          <div className="space-y-2">
            <label htmlFor="contact-status" className="text-xs font-medium text-slate-600">
              Status
            </label>
            <select
              id="contact-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
              disabled={saving}
            >
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Spam">Spam</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="reply-subject" className="text-xs font-medium text-slate-600">
              Subject
            </label>
            <Input
              id="reply-subject"
              value={replySubject}
              onChange={(event) => setReplySubject(event.target.value)}
              className="rounded-xl"
              disabled={saving}
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
              disabled={saving}
            />
          </div>
          <Button onClick={saveContactUpdate} disabled={saving} className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800">
            <Send className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Update"}
          </Button>
        </Panel>
      </div>
    </div>
  );
};

export default AdminContactDetail;
