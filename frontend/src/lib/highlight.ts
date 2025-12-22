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

const copyToClipboard = async (text: string) => {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      return ok;
    } catch {
      return false;
    }
  }
};

const attachCopyButton = (pre: HTMLElement) => {
  if (pre.dataset.copyReady === "true") return;
  pre.dataset.copyReady = "true";
  pre.classList.add("code-block");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy-button";
  button.setAttribute("aria-label", "Copy code");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1z"/>
      <path d="M19 5H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"/>
    </svg>
  `;

  button.addEventListener("click", async () => {
    const codeEl = pre.querySelector("code");
    const text = codeEl?.textContent ?? "";
    const ok = await copyToClipboard(text);
    if (!ok) return;

    button.classList.add("is-copied");
    button.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/>
      </svg>
    `;
    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1z"/>
          <path d="M19 5H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"/>
        </svg>
      `;
    }, 1400);
  });

  pre.appendChild(button);
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

  const pres = root.querySelectorAll("pre");
  pres.forEach((pre) => attachCopyButton(pre as HTMLElement));
};
