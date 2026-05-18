const navSections = document.getElementById("nav-sections");
const searchInput = document.getElementById("search-input");
const viewerTitle = document.getElementById("viewer-title");
const viewerSubtitle = document.getElementById("viewer-subtitle");
const overviewCard = document.getElementById("overview-card");
const htmlSurface = document.getElementById("html-surface");
const htmlFrame = document.getElementById("html-frame");
const textSurface = document.getElementById("text-surface");
const textViewer = document.getElementById("text-viewer");
const rawOpenButton = document.getElementById("raw-open-button");
const nativeOpenButton = document.getElementById("native-open-button");
const offlineStatus = document.getElementById("offline-status");
const installButton = document.getElementById("install-button");

let catalog = null;
let deferredInstallPrompt = null;
let selectedPath = null;

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const encodeDocPath = (path) => encodeURIComponent(path);
const decodeDocPath = (value) => decodeURIComponent(value || "");

function getHashDoc() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.startsWith("doc=")) return null;
  return decodeDocPath(hash.slice(4));
}

function setHashDoc(path) {
  window.location.hash = `doc=${encodeDocPath(path)}`;
}

function inlineFormat(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listMode = null;
  let codeMode = false;
  let codeLines = [];
  let tableBuffer = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inlineFormat(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listMode) {
      html.push(`</${listMode}>`);
      listMode = null;
    }
  };

  const flushTable = () => {
    if (!tableBuffer.length) return;
    const rows = tableBuffer.map((row) =>
      row
        .split("|")
        .slice(1, -1)
        .map((cell) => inlineFormat(cell.trim()))
    );
    tableBuffer = [];
    if (rows.length < 2) {
      rows.forEach((row) => html.push(`<p>${row.join(" | ")}</p>`));
      return;
    }
    const header = rows[0];
    const body = rows.slice(2);
    html.push("<table><thead><tr>");
    header.forEach((cell) => html.push(`<th>${cell}</th>`));
    html.push("</tr></thead><tbody>");
    body.forEach((row) => {
      html.push("<tr>");
      row.forEach((cell) => html.push(`<td>${cell}</td>`));
      html.push("</tr>");
    });
    html.push("</tbody></table>");
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      flushParagraph();
      flushList();
      flushTable();
      if (!codeMode) {
        codeMode = true;
        codeLines = [];
      } else {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeMode = false;
      }
      return;
    }

    if (codeMode) {
      codeLines.push(line);
      return;
    }

    if (/^\|.+\|$/.test(line.trim())) {
      flushParagraph();
      flushList();
      tableBuffer.push(line.trim());
      return;
    }

    flushTable();

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineFormat(headingMatch[2].trim())}</h${level}>`);
      return;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      html.push("<hr>");
      return;
    }

    const blockquoteMatch = line.match(/^>\s?(.*)$/);
    if (blockquoteMatch) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${inlineFormat(blockquoteMatch[1])}</blockquote>`);
      return;
    }

    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      const nextMode = /\d+\./.test(listMatch[2]) ? "ol" : "ul";
      if (listMode !== nextMode) {
        flushList();
        listMode = nextMode;
        html.push(`<${listMode}>`);
      }
      html.push(`<li>${inlineFormat(listMatch[3])}</li>`);
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushTable();

  return `${html.join("\n")}<div class="raw-note">Markdown-only file rendered locally for offline reading.</div>`;
}

function flattenCatalog(data) {
  const records = [];
  data.lessons.forEach((lesson) => {
    lesson.files.forEach((file) => {
      records.push({ section: "Lessons", lesson: lesson.title, ...file });
    });
  });
  data.rootDocs.forEach((file) => records.push({ section: "Root Docs", ...file }));
  data.academicPapers.forEach((file) => records.push({ section: "Academic Papers", ...file }));
  return records;
}

function renderNavGroup(title, entries, getLabel) {
  if (!entries.length) return "";
  return `
    <section class="nav-group">
      <div class="group-title">${title}</div>
      <div class="nav-list">
        ${entries
          .map((entry) => {
            const active = selectedPath === entry.path ? "active" : "";
            const subLabel = getLabel ? `<small>${getLabel(entry)}</small>` : "";
            return `<a class="nav-link ${active}" data-path="${escapeHtml(entry.path)}" href="#doc=${encodeDocPath(
              entry.path
            )}">${escapeHtml(entry.label)}${subLabel}</a>`;
          })
          .join("")}
      </div>
    </section>
  `;
}

function buildNavigation(data, query = "") {
  const q = query.trim().toLowerCase();
  const filterEntries = (entries) =>
    !q
      ? entries
      : entries.filter((entry) =>
          `${entry.label} ${entry.path} ${entry.lesson || ""} ${entry.group || ""}`.toLowerCase().includes(q)
        );

  const lessonGroups = data.lessons
    .map((lesson) => {
      const files = filterEntries(
        lesson.files.map((file) => ({
          ...file,
          label: file.label,
          lesson: lesson.title,
        }))
      );
      return files.length
        ? renderNavGroup(lesson.title, files, (entry) => `${entry.kind.toUpperCase()} · ${entry.path.split("/").pop()}`)
        : "";
    })
    .join("");

  const rootDocs = renderNavGroup("Course Docs", filterEntries(data.rootDocs), (entry) => entry.kind.toUpperCase());
  const papers = renderNavGroup(
    "Academic Papers",
    filterEntries(data.academicPapers),
    (entry) => `${entry.kind.toUpperCase()} · ${entry.group.replace("Academic Papers/", "") || "Academic Papers"}`
  );

  navSections.innerHTML = `${rootDocs}${lessonGroups}${papers}`;
}

function showOverview() {
  overviewCard.classList.remove("hidden");
  htmlSurface.classList.add("hidden");
  textSurface.classList.add("hidden");
  rawOpenButton.classList.add("hidden");
  nativeOpenButton.classList.add("hidden");
  viewerTitle.textContent = "Course Overview";
  viewerSubtitle.textContent = "Choose a lesson or reference file from the left panel.";
}

async function loadDoc(path) {
  selectedPath = path;
  buildNavigation(catalog, searchInput.value);
  const record = flattenCatalog(catalog).find((item) => item.path === path);
  if (!record) {
    showOverview();
    return;
  }

  viewerTitle.textContent = record.label;
  viewerSubtitle.textContent = record.lesson
    ? `${record.lesson} · ${record.kind.toUpperCase()}`
    : `${record.kind.toUpperCase()} · ${record.path}`;
  rawOpenButton.classList.remove("hidden");
  rawOpenButton.onclick = () => window.open(encodeURI(path), "_blank", "noopener,noreferrer");

  if (record.kind === "html") {
    overviewCard.classList.add("hidden");
    textSurface.classList.add("hidden");
    htmlSurface.classList.remove("hidden");
    htmlFrame.src = encodeURI(path);
    nativeOpenButton.classList.add("hidden");
    return;
  }

  overviewCard.classList.add("hidden");
  htmlSurface.classList.add("hidden");
  textSurface.classList.remove("hidden");
  nativeOpenButton.classList.remove("hidden");
  nativeOpenButton.onclick = () => window.open(encodeURI(path), "_blank", "noopener,noreferrer");

  const response = await fetch(encodeURI(path));
  const text = await response.text();
  textViewer.innerHTML = renderMarkdown(text);
}

async function bootstrap() {
  const response = await fetch("course_index.json");
  catalog = await response.json();
  buildNavigation(catalog);

  const requested = getHashDoc() || catalog.defaultDoc;
  if (requested) {
    await loadDoc(requested);
  } else {
    showOverview();
  }
}

window.addEventListener("hashchange", async () => {
  const requested = getHashDoc();
  if (!requested) {
    selectedPath = null;
    buildNavigation(catalog, searchInput.value);
    showOverview();
    return;
  }
  await loadDoc(requested);
});

searchInput.addEventListener("input", () => {
  if (!catalog) return;
  buildNavigation(catalog, searchInput.value);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.classList.remove("hidden");
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.classList.add("hidden");
});

window.addEventListener("appinstalled", () => {
  installButton.classList.add("hidden");
  offlineStatus.textContent = "Installed. This course is now available from your home screen.";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("sw.js");
      offlineStatus.textContent =
        "Offline cache enabled. After first sync, this course keeps working without internet.";
    } catch (error) {
      offlineStatus.textContent = "Service worker registration failed. Serve this folder over HTTP or HTTPS.";
    }
  });
} else {
  offlineStatus.textContent = "This browser does not support offline installation.";
}

bootstrap().catch((error) => {
  viewerTitle.textContent = "Unable to load course";
  viewerSubtitle.textContent = "The offline index could not be loaded.";
  textSurface.classList.remove("hidden");
  overviewCard.classList.add("hidden");
  htmlSurface.classList.add("hidden");
  textViewer.innerHTML = `<pre>${escapeHtml(String(error))}</pre>`;
});
