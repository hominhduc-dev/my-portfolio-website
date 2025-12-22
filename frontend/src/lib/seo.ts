type MetaTag = {
  name: string;
  attr: "name" | "property";
  content: string;
};

type PageMeta = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
};

const upsertMetaTag = ({ name, attr, content }: MetaTag) => {
  if (!content || typeof document === "undefined") return;
  let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const removeMetaTag = (name: string, attr: "name" | "property") => {
  if (typeof document === "undefined") return;
  const tag = document.querySelector(`meta[${attr}="${name}"]`);
  tag?.parentElement?.removeChild(tag);
};

const upsertLinkTag = (rel: string, href: string) => {
  if (!href || typeof document === "undefined") return;
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

export const setPageMeta = ({ title, description, canonical, ogImage }: PageMeta) => {
  if (typeof document === "undefined") return;
  const url = canonical || window.location.href;

  document.title = title;
  upsertMetaTag({ name: "description", attr: "name", content: description });
  upsertMetaTag({ name: "og:title", attr: "property", content: title });
  upsertMetaTag({ name: "og:description", attr: "property", content: description });
  upsertMetaTag({ name: "og:type", attr: "property", content: "website" });
  upsertMetaTag({ name: "og:url", attr: "property", content: url });
  upsertMetaTag({ name: "twitter:card", attr: "name", content: ogImage ? "summary_large_image" : "summary" });
  upsertMetaTag({ name: "twitter:title", attr: "name", content: title });
  upsertMetaTag({ name: "twitter:description", attr: "name", content: description });
  upsertLinkTag("canonical", url);

  if (ogImage) {
    upsertMetaTag({ name: "og:image", attr: "property", content: ogImage });
    upsertMetaTag({ name: "twitter:image", attr: "name", content: ogImage });
  } else {
    removeMetaTag("og:image", "property");
    removeMetaTag("twitter:image", "name");
  }
};
