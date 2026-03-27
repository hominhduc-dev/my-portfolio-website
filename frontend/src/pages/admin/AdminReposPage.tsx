import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AdminRepo, createRepo, deleteRepo, fetchRepos, syncGithubRepos, updateRepo } from "@/data/adminRepos";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const emptyRepo: AdminRepo = {
  id: "",
  name: "",
  description: "",
  language: "",
  stars: 0,
  forks: 0,
  url: "",
  visible: true,
};

export default function AdminReposPage() {
  const { toast } = useToast();
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [repos, setRepos] = useState<AdminRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminRepo>(emptyRepo);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadRepos = async () => {
    const data = await fetchRepos();
    setRepos(data);
    return data;
  };

  const handleSync = async (silent = false) => {
    setSyncing(true);
    try {
      const data = await syncGithubRepos();
      setRepos(data);
      if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id);
      }
      if (!silent) {
        toast({ title: "Synced", description: `Imported ${data.length} repositories from GitHub.` });
      }
      return data;
    } catch (err: any) {
      if (!silent) {
        toast({ title: "Error", description: err?.message || "Failed to sync GitHub repos", variant: "destructive" });
      }
      return [];
    } finally {
      setSyncing(false);
    }
  };

  const selectedRepo = useMemo(
    () => repos.find((r) => r.id === selectedId) || null,
    [repos, selectedId]
  );

  useEffect(() => {
    loadRepos()
      .then(async (data) => {
        if (data.length === 0) {
          await handleSync(true);
        }
      })
      .catch(() => toast({ title: "Error", description: "Failed to load repos", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    if (selectedRepo) {
      setForm(selectedRepo);
    } else {
      setForm(emptyRepo);
    }
  }, [selectedRepo]);

  const handleChange = (field: keyof AdminRepo, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const scrollToFormOnMobile = () => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    window.setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleSelectRepo = (repoId: string | null) => {
    setSelectedId(repoId);
    scrollToFormOnMobile();
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.url.trim()) {
      toast({ title: "Missing fields", description: "Name and URL are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (selectedRepo) {
        const updated = await updateRepo({ ...selectedRepo, ...form });
        setRepos((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        toast({ title: "Saved", description: "Repository updated." });
      } else {
        const created = await createRepo(form);
        setRepos((prev) => [created, ...prev]);
        setSelectedId(created.id);
        toast({ title: "Created", description: "Repository added." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save repo", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRepo) return;
    try {
      await deleteRepo(selectedRepo.id);
      setRepos((prev) => prev.filter((r) => r.id !== selectedRepo.id));
      setSelectedId(null);
      toast({ title: "Deleted", description: "Repository removed." });
    } catch {
      toast({ title: "Error", description: "Failed to delete repo", variant: "destructive" });
    }
  };

  const handleToggleVisible = async (repo: AdminRepo) => {
    setTogglingId(repo.id);
    try {
      const updated = await updateRepo({ ...repo, visible: !repo.visible });
      setRepos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast({
        title: updated.visible ? "Repo shown" : "Repo hidden",
        description: `${updated.name} is now ${updated.visible ? "visible" : "hidden"} on the public site.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update visibility",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Open Source Repos</CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => void handleSync()} disabled={syncing}>
              {syncing ? "Syncing..." : "Sync GitHub"}
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => handleSelectRepo(null)}>
              New Repo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading repositories...</p>
          ) : repos.length === 0 ? (
            <div className="space-y-3">
              <p className="text-muted-foreground">No repositories yet.</p>
              <Button variant="outline" onClick={() => void handleSync()} disabled={syncing}>
                {syncing ? "Syncing..." : "Sync from GitHub"}
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      selectedId === repo.id ? "border-accent/50 bg-accent/5" : "border-border/70 bg-card"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectRepo(repo.id)}
                      className="block w-full text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{repo.name}</h3>
                        <Badge variant={repo.visible ? "accent" : "secondary"}>
                          {repo.visible ? "Shown" : "Hidden"}
                        </Badge>
                        {selectedId === repo.id && (
                          <Badge variant="outline" className="border-accent/40 text-accent">
                            Editing
                          </Badge>
                        )}
                      </div>
                      {repo.description && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{repo.description}</p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2.5 py-1">
                          {repo.language || "No language"}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-1">{repo.stars} stars</span>
                        <span className="rounded-full bg-muted px-2.5 py-1">{repo.forks} forks</span>
                      </div>
                      <p className="mt-3 truncate text-xs text-muted-foreground">{repo.url}</p>
                    </button>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleSelectRepo(repo.id)}
                      >
                        {selectedId === repo.id ? "Editing" : "Edit"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={repo.visible ? "accent" : "outline"}
                        disabled={togglingId === repo.id}
                        onClick={() => void handleToggleVisible(repo)}
                        className="w-full sm:w-auto"
                      >
                        {togglingId === repo.id ? "Saving..." : repo.visible ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Visible</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Stars</TableHead>
                      <TableHead>Forks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repos.map((repo) => (
                      <TableRow
                        key={repo.id}
                        className={selectedId === repo.id ? "bg-muted/60" : "cursor-pointer"}
                        onClick={() => setSelectedId(repo.id)}
                      >
                        <TableCell className="font-medium">{repo.name}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            variant={repo.visible ? "accent" : "outline"}
                            disabled={togglingId === repo.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleToggleVisible(repo);
                            }}
                            className="min-w-20"
                          >
                            {togglingId === repo.id ? "Saving..." : repo.visible ? "Hide" : "Show"}
                          </Button>
                        </TableCell>
                        <TableCell>{repo.language}</TableCell>
                        <TableCell>{repo.stars}</TableCell>
                        <TableCell>{repo.forks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card ref={formCardRef} className="scroll-mt-24">
        <CardHeader>
          <CardTitle>{selectedRepo ? "Edit Repo" : "Create Repo"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="my-library" />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input value={form.url} onChange={(e) => handleChange("url", e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Short description" />
          </div>
          <label className="flex items-start gap-3 rounded-lg border p-3">
            <input
              type="checkbox"
              checked={Boolean(form.visible)}
              onChange={(e) => handleChange("visible", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input"
            />
            <div className="space-y-1">
              <span className="text-sm font-medium leading-none">Show this repo on public site</span>
              <p className="text-sm text-muted-foreground">
                When unchecked, this repository stays in admin but is hidden from the homepage and projects page.
              </p>
            </div>
          </label>
          <div className="space-y-2">
            <Label>Language</Label>
            <Input value={form.language} onChange={(e) => handleChange("language", e.target.value)} placeholder="TypeScript" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Stars</Label>
              <Input
                type="number"
                value={form.stars}
                onChange={(e) => handleChange("stars", Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label>Forks</Label>
              <Input
                type="number"
                value={form.forks}
                onChange={(e) => handleChange("forks", Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {selectedRepo && (
              <Button className="w-full sm:w-auto" variant="destructive" type="button" onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            )}
            <Button className="w-full sm:w-auto" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Repository"
        description="Are you sure you want to delete this repo?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
