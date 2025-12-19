import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { AdminMessage, deleteMessage, fetchMessages, markMessageRead } from "@/data/adminMessages";

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [selected, setSelected] = useState<AdminMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const updated = await markMessageRead(id);
      if (updated) {
        setMessages((prev) => prev.map((msg) => (msg.id === updated.id ? updated : msg)));
        setSelected(updated);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to mark as read",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMessage(deleteId);
      toast({ title: "Deleted", description: "Message removed." });
      setMessages((prev) => prev.filter((msg) => msg.id !== deleteId));
      if (selected?.id === deleteId) {
        setSelected(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<AdminMessage>[] = [
    {
      key: "name",
      header: "Sender",
      render: (item) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (item) => (
        <p className="line-clamp-1">{item.subject}</p>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <Badge variant="outline" className="capitalize">
          {item.category}
        </Badge>
      ),
    },
    {
      key: "isRead",
      header: "Status",
      render: (item) => (
        <Badge variant={item.isRead ? "secondary" : "default"}>
          {item.isRead ? "Read" : "New"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Received",
      render: (item) => new Date(item.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-medium">Messages</h1>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading messages...</p>
      ) : (
        <DataTable
          data={messages}
          columns={columns}
          searchKey="subject"
          searchPlaceholder="Search messages..."
          onEdit={(item) => setSelected(item)}
          onDelete={(item) => setDeleteId(item.id)}
          editLabel="View"
        />
      )}

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span>{selected.subject}</span>
              <div className="flex flex-wrap gap-2">
                {!selected.isRead && (
                  <Button variant="outline" onClick={() => handleMarkRead(selected.id)}>
                    Mark as read
                  </Button>
                )}
                <Button variant="destructive" onClick={() => setDeleteId(selected.id)}>
                  Delete
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{selected.name}</p>
                <p className="text-sm">{selected.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Details</p>
                <p className="text-sm">Category: {selected.category}</p>
                <p className="text-sm">Company: {selected.company || "-"}</p>
                <p className="text-sm">Phone: {selected.phone || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Message</p>
              <div className="mt-2 rounded-lg border border-border bg-muted/30 p-4 whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
