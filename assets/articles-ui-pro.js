(function () {
  function ensureToolbar() {
    const artSection =
      document.getElementById("articles") ||
      document.querySelector('[data-section="articles"]') ||
      Array.from(document.querySelectorAll("section, div")).find(
        (el) => el.textContent && el.textContent.includes("المقالات") && el.querySelector("#hf-art-form, .hf-article-card, article")
      );

    if (!artSection || document.getElementById("hf-pro-toolbar")) return;

    const bar = document.createElement("div");
    bar.id = "hf-pro-toolbar";
    bar.style.cssText =
      "display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 14px;padding:10px;border-radius:12px;background:rgba(0,0,0,0.03);";

    const filters = [
      { label: "الكل", val: "ALL" },
      { label: "يوتيوب", val: "يوتيوب" },
      { label: "إنستغرام", val: "إنستغرام" },
      { label: "مقال", val: "مقال" }
    ];

    filters.forEach((f) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = f.label;
      btn.dataset.filter = f.val;
      btn.style.cssText =
        "padding:6px 12px;border-radius:999px;border:1px solid #ccc;background:#fff;cursor:pointer;font-size:13px;";
      btn.addEventListener("click", () => applyFilter(f.val, bar));
      bar.appendChild(btn);
    });

    const cloudBtn = document.createElement("button");
    cloudBtn.type = "button";
    cloudBtn.textContent = "رفع للسحابة الآن";
    cloudBtn.style.cssText =
      "padding:6px 12px;border-radius:999px;border:none;background:#111;color:#fff;cursor:pointer;font-size:13px;margin-inline-start:auto;";
    cloudBtn.addEventListener("click", () => {
      if (typeof window.hfSyncArticlesCloud === "function") {
        window.hfSyncArticlesCloud();
      }
    });

    const exportBtn = document.createElement("button");
    exportBtn.type = "button";
    exportBtn.textContent = "نسخة احتياطية JSON";
    exportBtn.style.cssText =
      "padding:6px 12px;border-radius:999px;border:1px solid #bbb;background:#fff;cursor:pointer;font-size:13px;";
    exportBtn.addEventListener("click", exportJsonBackup);

    const importInput = document.createElement("input");
    importInput.type = "file";
    importInput.accept = "application/json";
    importInput.style.display = "none";
    importInput.addEventListener("change", importJsonBackup);

    const importBtn = document.createElement("button");
    importBtn.type = "button";
    importBtn.textContent = "استيراد JSON";
    importBtn.style.cssText =
      "padding:6px 12px;border-radius:999px;border:1px solid #bbb;background:#fff;cursor:pointer;font-size:13px;";
    importBtn.addEventListener("click", () => importInput.click());

    bar.appendChild(exportBtn);
    bar.appendChild(importBtn);
    bar.appendChild(importInput);
    bar.appendChild(cloudBtn);

    const heading = artSection.querySelector("h2, h3, .section-title") || artSection.firstElementChild;
    if (heading && heading.parentNode) {
      heading.insertAdjacentElement("afterend", bar);
    } else {
      artSection.prepend(bar);
    }
  }

  function applyFilter(val, bar) {
    bar.querySelectorAll("button[data-filter]").forEach((b) => {
      const active = b.dataset.filter === val;
      b.style.background = active ? "#222" : "#fff";
      b.style.color = active ? "#fff" : "#111";
    });

    const cards = document.querySelectorAll(".hf-article-card, [data-article-cat], article");
    cards.forEach((card) => {
      if (val === "ALL") {
        card.style.display = "";
        return;
      }
      const catAttr = card.getAttribute("data-article-cat") || "";
      const txt = card.textContent || "";
      const match = catAttr.includes(val) || txt.includes(val);
      card.style.display = match ? "" : "none";
    });
  }

  function exportJsonBackup() {
    let data = [];
    try {
      data = JSON.parse(localStorage.getItem("hf_articles_full_v1") || "[]");
    } catch (_) {}
    if (!Array.isArray(data) || !data.length) {
      data = Array.isArray(window.HF_PERMANENT_ARTICLES) ? window.HF_PERMANENT_ARTICLES : [];
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hafida-fenix-articles-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJsonBackup(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = JSON.parse(String(reader.result || "[]"));
        if (!Array.isArray(parsed)) throw new Error("صيغة غير صالحة");
        localStorage.setItem("hf_articles_full_v1", JSON.stringify(parsed));
        if (typeof window.hfSyncArticlesCloud === "function") {
          window.hfSyncArticlesCloud();
        }
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        alert("تعذر استيراد الملف: " + err.message);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureToolbar();
    setTimeout(ensureToolbar, 600);
  });
})();
