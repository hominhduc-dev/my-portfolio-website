import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import markdown from "highlight.js/lib/languages/markdown";

let isRegistered = false;

const ensureRegistered = () => {
  if (isRegistered) return;
  hljs.registerLanguage("js", javascript);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("ts", typescript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("shell", bash);
  hljs.registerLanguage("html", xml);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("md", markdown);
  hljs.registerLanguage("markdown", markdown);
  isRegistered = true;
};

export const highlightCodeBlocks = (root: ParentNode | null) => {
  if (!root) return;
  ensureRegistered();
  const blocks = root.querySelectorAll("pre code");
  blocks.forEach((block) => {
    const el = block as HTMLElement;
    if (el.classList.contains("hljs")) return;
    if (el.querySelector("span")) return;
    const languageClass = Array.from(el.classList).find((cls) => cls.startsWith("language-"));
    if (languageClass && /language-(plaintext|text|none)/i.test(languageClass)) {
      el.classList.remove(languageClass);
    }
    hljs.highlightElement(el);
  });
};
