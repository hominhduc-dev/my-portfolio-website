import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FormSection } from '@/components/admin/FormSection';
import { TagChipsInput } from '@/components/admin/TagChipsInput';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { getProjectById, saveProject, deleteProject, AdminProject } from '@/data/adminProjects';
import { Save, Trash2, ArrowLeft, Eye } from 'lucide-react';

const COMMON_TAGS = ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'AWS'];

export default function AdminProjectEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id || id === 'new';

  const [project, setProject] = useState<AdminProject>({
    id: `project-${Date.now()}`,
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    tags: [],
    thumbnailUrl: '',
    links: { github: '', demo: '' },
    status: 'draft',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const existing = getProjectById(id);
      if (existing) {
        setProject(existing);
      } else {
        navigate('/admin/projects');
      }
    }
  }, [id, isNew, navigate]);

  const handleChange = (field: string, value: any) => {
    setProject((prev) => {
      if (field.startsWith('links.')) {
        const linkField = field.replace('links.', '');
        return { ...prev, links: { ...prev.links, [linkField]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const generateSlug = () => {
    const slug = project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    handleChange('slug', slug);
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    if (!project.title.trim()) {
      toast({ title: 'Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updated = { ...project, status: status || project.status };
    saveProject(updated);
    toast({
      title: isNew ? 'Project created' : 'Project saved',
      description: status === 'published' ? 'Your project is now live.' : 'Your changes have been saved.',
    });
    setSaving(false);
    if (isNew) {
      navigate(`/admin/projects/${updated.id}/edit`);
    }
  };

  const handleDelete = () => {
    deleteProject(project.id);
    toast({ title: 'Project deleted', description: 'The project has been removed.' });
    navigate('/admin/projects');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-serif font-medium flex-1">
          {isNew ? 'New Project' : 'Edit Project'}
        </h1>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
            Save Draft
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={project.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Project Title"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <div className="flex gap-2">
                  <Input
                    value={project.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="project-slug"
                  />
                  <Button variant="outline" type="button" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea
                  value={project.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  placeholder="A brief description for cards and previews"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <MarkdownEditor
                  value={project.fullDescription}
                  onChange={(value) => handleChange('fullDescription', value)}
                  placeholder="Detailed project description in Markdown..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={project.links.github || ''}
                  onChange={(e) => handleChange('links.github', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Demo URL</Label>
                <Input
                  value={project.links.demo || ''}
                  onChange={(e) => handleChange('links.demo', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={project.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <TagChipsInput
                value={project.tags}
                onChange={(tags) => handleChange('tags', tags)}
                suggestions={COMMON_TAGS}
                placeholder="Add technology tags..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={project.thumbnailUrl}
                  onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              {project.thumbnailUrl && (
                <img
                  src={project.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full aspect-video object-cover rounded-md border"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
