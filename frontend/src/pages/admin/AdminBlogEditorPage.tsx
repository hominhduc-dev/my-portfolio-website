import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { getPostById, savePost, deletePost, AdminPost } from '@/data/adminPosts';
import { Save, Trash2, ArrowLeft } from 'lucide-react';

export default function AdminBlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id || id === 'new';

  const [post, setPost] = useState<AdminPost>({
    id: `post-${Date.now()}`,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'tech',
    coverImageUrl: '',
    status: 'draft',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const existing = getPostById(id);
      if (existing) {
        setPost(existing);
      } else {
        navigate('/admin/blog');
      }
    }
  }, [id, isNew, navigate]);

  const handleChange = (field: keyof AdminPost, value: any) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    handleChange('slug', slug);
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    if (!post.title.trim()) {
      toast({ title: 'Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const updated = { ...post, status: status || post.status };
    savePost(updated);
    toast({
      title: isNew ? 'Post created' : 'Post saved',
      description: status === 'published' ? 'Your post is now live.' : 'Your changes have been saved.',
    });
    setSaving(false);
    if (isNew) {
      navigate(`/admin/blog/${updated.id}/edit`);
    }
  };

  const handleDelete = () => {
    deletePost(post.id);
    toast({ title: 'Post deleted', description: 'The blog post has been removed.' });
    navigate('/admin/blog');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-serif font-medium flex-1">
          {isNew ? 'New Post' : 'Edit Post'}
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
                  value={post.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Post Title"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <div className="flex gap-2">
                  <Input
                    value={post.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="post-slug"
                  />
                  <Button variant="outline" type="button" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={post.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="A brief summary for previews"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <MarkdownEditor
                  value={post.content}
                  onChange={(value) => handleChange('content', value)}
                  placeholder="Write your blog post in Markdown..."
                  minHeight="400px"
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
                value={post.status}
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
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={post.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={post.coverImageUrl}
                  onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              {post.coverImageUrl && (
                <img
                  src={post.coverImageUrl}
                  alt="Cover preview"
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
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
