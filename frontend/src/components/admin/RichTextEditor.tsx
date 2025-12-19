import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Film,
  Code2,
  Minus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "@/lib/uploads";
import { cn } from "@/lib/utils";
import { ARTICLE_PROSE_CLASSES, getEditorExtensions, parseJsonDoc } from "@/lib/editor";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const YOUTUBE_REGEX = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11}))/i;
const IMAGE_REGEX = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?[^\s]*)?)/i;

function normalizeYoutubeUrl(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  const id = match?.[2];
  if (!id) return null;
  return `https://www.youtube.com/watch?v=${id}`;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content...",
  onImageUpload,
}: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [color, setColor] = useState("#1f2937");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const youtubeInputRef = useRef<HTMLInputElement | null>(null);
  const lastValueRef = useRef<string>("");

  const parsedValue = useMemo(() => {
    const parsed = parseJsonDoc(value);
    if (parsed) return parsed;
    return value || "";
  }, [value]);

  const editor = useEditor({
    extensions: getEditorExtensions(placeholder),
    content: parsedValue,
    onUpdate: ({ editor }) => {
      const nextValue = JSON.stringify(editor.getJSON());
      lastValueRef.current = nextValue;
      onChange(nextValue);
    },
    editorProps: {
      handlePaste: (_, event) => {
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (!text) return false;
        const normalized = normalizeYoutubeUrl(text);
        const imageMatch = text.match(IMAGE_REGEX)?.[1];
        if (normalized) {
          event.preventDefault();
          setTimeout(() => {
            editor.commands.setYoutubeVideo({ src: normalized, width: 640, height: 360 });
          }, 0);
          return true;
        }
        if (imageMatch) {
          event.preventDefault();
          setTimeout(() => {
            editor.commands.setImage({ src: imageMatch });
          }, 0);
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (!value) {
      if (lastValueRef.current === "") return;
      editor.commands.clearContent(true);
      lastValueRef.current = "";
      return;
    }
    if (value === lastValueRef.current) return;
    const parsed = parseJsonDoc(value);
    if (parsed) {
      editor.commands.setContent(parsed, { emitUpdate: false });
      lastValueRef.current = value;
    } else if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
      lastValueRef.current = value;
    }
  }, [editor, value]);

  if (!editor) return null;

  const focusChain = () => editor.chain().focus(undefined, { scrollIntoView: false });

  const applyLink = (url: string) => {
    if (!url) return;
    focusChain().extendMarkRange("link").setLink({ href: url }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const clearLink = () => focusChain().unsetLink().run();

  const applyImageUrl = (url: string) => {
    if (!url) return;
    focusChain().setImage({ src: url }).run();
    setImageUrl("");
    setShowImageInput(false);
  };

  const embedYoutube = (url: string) => {
    if (!url) return;
    const normalized = normalizeYoutubeUrl(url) || url;
    focusChain().setYoutubeVideo({
      src: normalized,
      width: 640,
      height: 360,
    }).run();
    setYoutubeUrl("");
    setShowYoutubeInput(false);
  };

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = onImageUpload ? await onImageUpload(file) : await uploadMedia(file);
      focusChain().setImage({ src: url }).run();
    } finally {
      setIsUploading(false);
    }
  };

  const ToggleButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      className={cn(
        "h-9 w-9 flex items-center justify-center rounded-lg text-sm font-semibold text-[#444] transition",
        active ? "bg-black text-white" : "hover:bg-[#f3f4f6]"
      )}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );

  const bubbleContent = (
    <div className="flex items-center gap-2 px-2 py-2 bg-white/95 dark:bg-card border border-border rounded-xl shadow-sm">
      <ToggleButton
        onClick={() => focusChain().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToggleButton>
      <ToggleButton
        onClick={() => focusChain().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToggleButton>
      <ToggleButton
        onClick={() => focusChain().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToggleButton>
      <ToggleButton
        onClick={() => focusChain().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToggleButton>
      <ToggleButton
        onClick={() => focusChain().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </ToggleButton>
      <ToggleButton onClick={() => setShowLinkInput(true)} active={editor.isActive("link")} title="Link">
        <LinkIcon className="h-4 w-4" />
      </ToggleButton>
    </div>
  );

  return (
    <div className="relative space-y-3">
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => {
          const { empty } = editor.state.selection;
          return editor.isFocused && !empty;
        }}
      >
        {bubbleContent}
      </BubbleMenu>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-white/95 dark:bg-card px-3 py-2 shadow-sm">
        <ToggleButton
        onClick={() => focusChain().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <Minus className="h-4 w-4 rotate-90" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline code"
        >
          <Code className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code2 className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
        onClick={() => focusChain().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => setShowLinkInput((prev) => !prev)}
          active={editor.isActive("link")}
          title="Insert link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton onClick={clearLink} title="Clear link">
          <LinkIcon className="h-4 w-4 opacity-60" />
        </ToggleButton>
        <ToggleButton onClick={() => setShowImageInput((prev) => !prev)} title="Image URL">
          <ImageIcon className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => {
            setShowYoutubeInput((prev) => !prev);
            setTimeout(() => youtubeInputRef.current?.focus(), 10);
          }}
          title="YouTube embed"
        >
          <Film className="h-4 w-4" />
        </ToggleButton>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            focusChain().setColor(e.target.value).run();
          }}
          className="h-8 w-8 rounded-md border border-border bg-transparent cursor-pointer"
          title="Text color"
        />
        <Input
          type="file"
          accept="image/*"
          className="h-9 w-44"
          title="Upload image"
          onChange={(e) => handleUpload(e.target.files?.[0] || null)}
          disabled={isUploading}
        />
        {showLinkInput && (
          <Input
            ref={linkInputRef}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink(linkUrl.trim());
              if (e.key === "Escape") setShowLinkInput(false);
            }}
            onBlur={() => setShowLinkInput(false)}
            placeholder="Paste link"
            className="h-9 w-56"
          />
        )}
        {showImageInput && (
          <Input
            ref={imageInputRef}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyImageUrl(imageUrl.trim());
              if (e.key === "Escape") setShowImageInput(false);
            }}
            onBlur={() => setShowImageInput(false)}
            placeholder="Paste image URL"
            className="h-9 w-56"
          />
        )}
        {showYoutubeInput && (
          <Input
            ref={youtubeInputRef}
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") embedYoutube(youtubeUrl.trim());
              if (e.key === "Escape") setShowYoutubeInput(false);
            }}
            onBlur={() => setShowYoutubeInput(false)}
            placeholder="Paste YouTube URL"
            className="h-9 w-64"
          />
        )}
      </div>
      <div className="rounded-xl border border-border bg-background px-4 py-3">
        <div
          className={cn(
            "rounded-lg bg-muted/30 px-3 py-2 transition focus-within:ring-2 focus-within:ring-primary/30",
            isUploading ? "opacity-70" : ""
          )}
        >
          <div className={cn("tiptap-editor min-h-[320px]", ARTICLE_PROSE_CLASSES)}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
