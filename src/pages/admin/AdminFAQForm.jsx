import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel } from "@/components/admin/AdminUi";
import { useToast } from "@/hooks/use-toast";
import api from "@/api";

const createInitialState = (faq) => ({
  question: faq?.question || "",
  answer: faq?.answer || "",
  category: faq?.category || "General",
  status: faq ? ((faq?.status || "Active") === "Active") : true,
  sortOrder: faq?.sortOrder ?? 0,
});

const AdminFAQForm = () => {
  const navigate = useNavigate();
  const { faqId } = useParams();
  const isEditMode = Boolean(faqId);

  const { toast } = useToast();
  const [formData, setFormData] = useState(() => createInitialState());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isEditMode) {
          const data = await api.adminGetFaqById(faqId);
          if (isMounted && data) {
            setFormData(createInitialState(data));
          }
        }
        setError("");
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError?.message || "Unable to load FAQ data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [faqId, isEditMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        status: formData.status ? "Active" : "Inactive",
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (isEditMode) {
        await api.adminUpdateFaq(faqId, payload);
        toast({
          title: "FAQ Updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        await api.adminCreateFaq(payload);
        toast({
          title: "FAQ Created",
          description: "New FAQ has been added to the help center.",
        });
      }

      navigate("/admin/faqs");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save FAQ.");
      toast({
        title: "Error",
        description: saveError?.message || "Something went wrong while saving.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit FAQ" : "Add FAQ"}
        description="Provide clear and concise answers to customer questions."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin/faqs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to FAQs
          </Button>
        }
      />

      {error ? (
        <Panel className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </Panel>
      ) : null}

      {loading ? (
        <Panel className="p-6 text-sm text-slate-500">Loading FAQ form...</Panel>
      ) : (
        <form className="grid gap-6 xl:grid-cols-[1fr_350px]" onSubmit={handleSubmit}>
          <Panel className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                value={formData.question}
                onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                placeholder="How do I track my order?"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                rows={8}
                value={formData.answer}
                onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
                placeholder="You can track your order by..."
                className="rounded-xl"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => navigate("/admin/faqs")}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" disabled={saving}>
                {saving ? "Saving..." : "Save FAQ"}
              </Button>
            </div>
          </Panel>

          <Panel className="space-y-5 p-5 sm:p-6 h-fit text-left">
            <div className="space-y-2">
              <Label htmlFor="faq-category">Category</Label>
              <Input
                id="faq-category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="Shipping, Orders, etc."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faq-sort-order">Sort Order</Label>
              <Input
                id="faq-sort-order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">Status</p>
                <p className="text-xs text-slate-500">Visibility</p>
              </div>
              <Switch
                checked={formData.status}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, status: checked }))}
              />
            </div>
          </Panel>
        </form>
      )}
    </div>
  );
};

export default AdminFAQForm;
