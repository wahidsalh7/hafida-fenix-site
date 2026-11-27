(function () {
  const REPO = "wahidsalh7/hafida-fenix-site";
  const BRANCH = "main";
  const LOCAL_KEY = "hf_articles_full_v1";
  const TOKEN_KEY = "hf_gh_auto_token";

  function setStatus(msg) {
    const el = document.getElementById("hf-art-status");
    if (el) el.textContent = msg;
  }

  function getArticles() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return (typeof HF_PERMANENT_ARTICLES !== "undefined" && Array.isArray(HF_PERMANENT_ARTICLES))
      ? HF_PERMANENT_ARTICLES
      : [];
  }

  function toBase64Utf8(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function fromBase64Utf8(b64) {
    const bin = atob((b64 || "").replace(/\n/g, ""));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }

  async function syncToGitHubCloud() {
    let token = (localStorage.getItem(TOKEN_KEY) || "").trim();
    if (!token) {
      token = (prompt("أدخل GitHub Token (يُحفظ في هاتفك لمرة واحدة للرفع التلقائي):") || "").trim();
      if (!token) {
        setStatus("تم الحفظ محلياً فقط (لم يُدخل رمز GitHub).");
        return;
      }
      localStorage.setItem(TOKEN_KEY, token);
    }

    const items = getArticles();
    setStatus("جاري رفع التحديثات إلى السحابة...");

    try {
      const apiUrl = `https://api.github.com/repos/${REPO}/contents/index.html`;
      const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github+json"
        }
      });
      if (!getRes.ok) throw new Error(`تعذر قراءة الملف (${getRes.status})`);
      const fileData = await getRes.json();

      let currentHtml = fromBase64Utf8(fileData.content);
      const serialized = `const HF_PERMANENT_ARTICLES = ${JSON.stringify(items, null, 2)};`;
      const pattern = /const HF_PERMANENT_ARTICLES = \[[\s\S]*?\];/;

      if (pattern.test(currentHtml)) {
        currentHtml = currentHtml.replace(pattern, () => serialized);
      } else {
        setStatus("تحذير: لم يتم العثور على HF_PERMANENT_ARTICLES في index.html");
        return;
      }

      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Sync articles from admin panel",
          content: toBase64Utf8(currentHtml),
          sha: fileData.sha,
          branch: BRANCH
        })
      });

      if (!putRes.ok) throw new Error(`فشل الرفع (${putRes.status})`);
      setStatus("تم الحفظ والرفع للسحابة بنجاح.");
    } catch (err) {
      setStatus(`حُفظ محلياً، وتعذر الرفع للسحابة: ${err.message}`);
    }
  }

  window.hfSyncArticlesCloud = syncToGitHubCloud;

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("hf-art-form");
    if (form) {
      form.addEventListener("submit", function () {
        setTimeout(() => syncToGitHubCloud(), 150);
      }, true);
    }

    const prevDelete = window.hfDeleteArticle;
    if (typeof prevDelete === "function") {
      window.hfDeleteArticle = function (id) {
        prevDelete(id);
        setTimeout(() => syncToGitHubCloud(), 150);
      };
    }
  });
})();
