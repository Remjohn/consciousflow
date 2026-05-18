from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent
INDEX_PATH = ROOT / "course_index.json"
SW_PATH = ROOT / "sw.js"

APP_ASSETS = [
    "index.html",
    "styles.css",
    "app.js",
    "manifest.webmanifest",
    "icon.svg",
    "course_index.json",
    "sw.js",
]

DOC_SUFFIXES = {".html", ".md", ".txt"}
LESSON_PREFIX = "Lesson_"
CACHE_NAME = "linear-algebra-offline-v1"


def rel_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def cache_url(path: str) -> str:
    return quote(path, safe="/-_.()")


def humanize(stem: str) -> str:
    stem = stem.replace("_", " ").strip()
    label_map = {
        "1 Exposure": "1. Exposure",
        "2 Mechanistic": "2. Mechanistic",
        "2 Mechanistic Notes": "2. Mechanistic Notes",
        "3 Analogy": "3. Analogy",
        "4 Master": "4. Master",
        "Chapter Syllabus": "Chapter Syllabus",
        "Course Syllabus": "Course Syllabus",
    }
    return label_map.get(stem, stem)


def build_lessons() -> list[dict]:
    lessons: list[dict] = []
    lesson_dirs = [p for p in ROOT.iterdir() if p.is_dir() and p.name.startswith(LESSON_PREFIX)]
    for lesson_dir in sorted(lesson_dirs, key=lambda p: p.name):
        files: list[dict] = []
        default_doc = None
        for file_path in sorted(lesson_dir.iterdir(), key=lambda p: p.name):
            if not file_path.is_file() or file_path.suffix.lower() not in DOC_SUFFIXES:
                continue
            relative = rel_path(file_path)
            stem = file_path.stem
            entry = {
                "label": humanize(stem),
                "path": relative,
                "kind": file_path.suffix.lower().lstrip("."),
                "nativePreferred": file_path.suffix.lower() == ".html",
                "hasHtmlPeer": file_path.with_suffix(".html").exists(),
            }
            if default_doc is None and file_path.name == "1_Exposure.html":
                default_doc = relative
            files.append(entry)
        lessons.append(
            {
                "id": lesson_dir.name,
                "title": lesson_dir.name.replace("_", " "),
                "path": rel_path(lesson_dir),
                "defaultDoc": default_doc or (files[0]["path"] if files else None),
                "files": files,
            }
        )
    return lessons


def build_section(folder_name: str) -> list[dict]:
    folder = ROOT / folder_name
    if not folder.exists():
        return []
    entries: list[dict] = []
    for file_path in sorted(folder.rglob("*")):
        if not file_path.is_file() or file_path.suffix.lower() not in DOC_SUFFIXES:
            continue
        entries.append(
            {
                "label": file_path.stem.replace("_", " "),
                "path": rel_path(file_path),
                "kind": file_path.suffix.lower().lstrip("."),
                "nativePreferred": file_path.suffix.lower() == ".html",
                "group": rel_path(file_path.parent),
            }
        )
    return entries


def build_root_docs() -> list[dict]:
    docs: list[dict] = []
    skip_names = set(APP_ASSETS + ["build_offline_pwa.py", "OFFLINE_PWA_README.md"])
    for file_path in sorted(ROOT.iterdir()):
        if not file_path.is_file() or file_path.suffix.lower() not in DOC_SUFFIXES:
            continue
        if file_path.name in skip_names:
            continue
        docs.append(
            {
                "label": file_path.stem.replace("_", " "),
                "path": rel_path(file_path),
                "kind": file_path.suffix.lower().lstrip("."),
                "nativePreferred": file_path.suffix.lower() == ".html",
            }
        )
    return docs


def build_all_docs() -> list[str]:
    files: list[str] = []
    skip_names = {"course_index.json", "sw.js"}
    for file_path in ROOT.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in DOC_SUFFIXES:
            continue
        if file_path.name in skip_names:
            continue
        files.append(rel_path(file_path))
    return sorted(set(files))


def write_index_json(payload: dict) -> None:
    INDEX_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def write_service_worker(cache_files: list[str]) -> None:
    precache_paths = sorted(set(APP_ASSETS + [cache_url(path) for path in cache_files]))
    precache_json = json.dumps(precache_paths, indent=2)
    contents = f"""const CACHE_NAME = "{CACHE_NAME}";
const PRECACHE_URLS = {precache_json};

self.addEventListener("install", (event) => {{
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
}});

self.addEventListener("activate", (event) => {{
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
}});

self.addEventListener("fetch", (event) => {{
  if (event.request.method !== "GET") {{
    return;
  }}

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {{
    return;
  }}

  event.respondWith(
    caches.match(event.request).then((cached) => {{
      if (cached) {{
        return cached;
      }}

      return fetch(event.request)
        .then((response) => {{
          if (!response || response.status !== 200 || response.type === "opaque") {{
            return response;
          }}

          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        }})
        .catch(() => caches.match("index.html"));
    }})
  );
}});
"""
    SW_PATH.write_text(contents, encoding="utf-8")


def main() -> None:
    lessons = build_lessons()
    root_docs = build_root_docs()
    academic_papers = build_section("Academic Papers")
    all_docs = build_all_docs()

    payload = {
        "courseTitle": "Linear Algebra for Transformers",
        "generatedBy": "build_offline_pwa.py",
        "defaultDoc": "Course_Syllabus.md",
        "lessons": lessons,
        "rootDocs": root_docs,
        "academicPapers": academic_papers,
        "allDocs": all_docs,
    }
    write_index_json(payload)
    write_service_worker(all_docs)
    print(f"Generated {INDEX_PATH.name} and {SW_PATH.name} for {len(all_docs)} course files.")


if __name__ == "__main__":
    main()
