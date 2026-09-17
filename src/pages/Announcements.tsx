
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Megaphone, Plus, Edit, Trash, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatDate } from "@/lib/formatters";

type Announcement = {
  id: number;
  title: string;
  description: string;
  cta_label: string | null;
  cta_url: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string | null;
};

type FormState = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
};

type View = "list" | "create" | "edit";

const emptyForm: FormState = {
  title: "",
  description: "",
  ctaLabel: "",
  ctaUrl: "",
};

export default function Announcements() {
  const token = localStorage.getItem("userToken");
  const mode = useSelector((state: RootState) => state.modal.mode);

  const baseURL =
    mode === "dev"
      ? import.meta.env.VITE_BACKEND_DEV_URL
      : import.meta.env.VITE_BACKEND_PROD_URL;

  const [view, setView] = useState<View>("list");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const authHeaders = { Authorization: `Bearer ${token}` };
  const announcementsApi = `${baseURL}api/v2/admin/announcements`;

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof AxiosError) {
      return err.response?.data?.message ?? fallback;
    }
    return fallback;
  };

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(announcementsApi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load announcements"));
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  }, [announcementsApi, token]);

  useEffect(() => {
    if (view === "list") {
      fetchAnnouncements();
    }
  }, [view, fetchAnnouncements]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setView("create");
  };

  const openEdit = (announcement: Announcement) => {
    setForm({
      title: announcement?.title,
      description: announcement?.description,
      ctaLabel: announcement?.cta_label ?? "",
      ctaUrl: announcement?.cta_url ?? "",
    });
    setEditingId(announcement?.id);
    setView("edit");
  };

  const backToList = () => {
    setForm(emptyForm);
    setEditingId(null);
    setView("list");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim() || null,
    cta_title: form.ctaLabel.trim() || null,
    cta_url: form.ctaUrl.trim() || null,
  });

  const handleCreate = async () => {
    if (!validateForm()) return;

    const loadId = toast.loading("Creating announcement");
    setIsSubmitting(true);

    try {
      const response = await axios.post(announcementsApi, buildPayload(), {
        headers: authHeaders,
      });
      toast.success(response.data?.message ?? "Announcement created successfully");
      backToList();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create announcement"));
      console.error("Error creating announcement:", err);
    } finally {
      toast.dismiss(loadId);
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm() || editingId === null) return;

    const loadId = toast.loading("Updating announcement");
    setIsSubmitting(true);

    try {
      const response = await axios.put(`${announcementsApi}/${editingId}`, buildPayload(), {
        headers: authHeaders,
      });
      toast.success(response.data?.message ?? "Announcement updated successfully");
      backToList();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update announcement"));
      console.error("Error updating announcement:", err);
    } finally {
      toast.dismiss(loadId);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const loadId = toast.loading("Deleting announcement");
    try {
      const response = await axios.delete(`${announcementsApi}/${deleteTarget.id}`, {
        headers: authHeaders,
      });
      toast.success(response.data?.message ?? "Announcement deleted successfully");
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete announcement"));
    } finally {
      toast.dismiss(loadId);
    }
  };

  const handleToggleStatus = async (announcement: Announcement) => {
    const loadId = toast.loading("Updating status");
    try {
      const response = await axios.put(
        `${announcementsApi}/${announcement?.id}/status`,
        { is_active: !announcement?.is_active },
        { headers: authHeaders }
      );
      toast.success(response.data?.message ?? "Status updated successfully");
      fetchAnnouncements();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status"));
    } finally {
      toast.dismiss(loadId);
    }
  };

  if (view === "create" || view === "edit") {
    return (
      <DashboardLayout
        title={view === "create" ? "Create Announcement" : "Edit Announcement"}
        subtitle="Fill in the details below"
      >
        <Card className="max-w-2xl animate-fade-in">
          <CardHeader>
            <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-2" onClick={backToList}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Announcements
            </Button>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-bharatgo-primary" />
              <CardTitle>{view === "create" ? "New Announcement" : "Edit Announcement"}</CardTitle>
            </div>
            <CardDescription>
              {view === "create"
                ? "Create a new announcement for sellers."
                : "Update the announcement details."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                value={form?.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter announcement description"
                value={form?.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLabel">CTA Title</Label>
              <Input
                id="ctaLabel"
                placeholder="e.g. Learn More (optional)"
                value={form?.ctaLabel}
                onChange={(e) => handleChange("ctaLabel", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaUrl">CTA URL</Label>
              <Input
                id="ctaUrl"
                type="url"
                placeholder="https://example.com (optional)"
                value={form?.ctaUrl}
                onChange={(e) => handleChange("ctaUrl", e.target.value)}
              />
            </div>

            <Button
              onClick={view === "create" ? handleCreate : handleUpdate}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {view === "create" ? "Create" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Announcements"
      subtitle="Manage announcements shown to sellers"
    >
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Announcements</CardTitle>
            <CardDescription>View, edit, or delete existing announcements</CardDescription>
          </div>
          <Button className="gap-2" onClick={openCreate}>
            <Plus size={16} />
            Create
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>CTA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No announcements found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    announcements?.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium max-w-[180px]">
                          {announcement?.title}
                        </TableCell>
                        <TableCell className="max-w-[280px] truncate text-gray-600">
                          {announcement?.description}
                        </TableCell>
                        <TableCell className="max-w-[160px]">
                          {announcement?.cta_label ? (
                            <a
                              href={announcement?.cta_url ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-bharatgo-primary hover:underline text-sm truncate block"
                            >
                              {announcement?.cta_label}
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={announcement?.is_active}
                              onCheckedChange={() => handleToggleStatus(announcement)}
                            />
                            <Badge variant={announcement?.is_active ? "default" : "secondary"}>
                              {announcement?.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(announcement?.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(announcement)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteTarget(announcement)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete announcement?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTarget?.title ?? ""}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
