import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  appendArticle,
  appendBook,
  getSiteState,
  replaceConsultationSettings,
  replaceContactLinks,
  replacePaymentSettings,
} from "~/data/site-data.server";

export async function loader(_args: LoaderFunctionArgs) {
  return json({ state: getSiteState() });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "replace_contacts") {
    replaceContactLinks({
      whatsappUrl: String(formData.get("whatsappUrl") || ""),
      instagramUrl: String(formData.get("instagramUrl") || ""),
      tiktokUrl: String(formData.get("tiktokUrl") || ""),
    });
    return json({ ok: true, message: "تم استبدال روابط الاتصال بنجاح." });
  }

  if (intent === "replace_payments") {
    replacePaymentSettings({
      paypalUrl: String(formData.get("paypalUrl") || ""),
      bankAccount: String(formData.get("bankAccount") || ""),
      paymentNote: String(formData.get("paymentNote") || ""),
    });
    return json({ ok: true, message: "تم تحديث بيانات الدفع (بايبال / البنك) بنجاح." });
  }

  if (intent === "replace_consultation") {
    replaceConsultationSettings({
      title: String(formData.get("consultationTitle") || ""),
      message: String(formData.get("consultationMessage") || ""),
      ctaLabel: String(formData.get("consultationCtaLabel") || ""),
      ctaUrl: String(formData.get("consultationCtaUrl") || ""),
    });
    return json({ ok: true, message: "تم تحديث قسم الاستشارات القانونية بنجاح." });
  }

  if (intent === "add_article") {
    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const mediaType = String(formData.get("mediaType") || "none") as
      | "none"
      | "link"
      | "image"
      | "video";
    const mediaUrl = String(formData.get("mediaUrl") || "").trim();

    if (!title || !body) {
      return json({ ok: false, message: "يرجى إدخال عنوان المقال ونصه." }, { status: 400 });
    }

    appendArticle({ title, body, mediaType, mediaUrl });
    return json({ ok: true, message: "تمت إضافة المقال/المنشور اليومي وعرضه مباشرة." });
  }

  if (intent === "add_book") {
    const title = String(formData.get("bookTitle") || "").trim();
    const summary = String(formData.get("bookSummary") || "").trim();
    const price = String(formData.get("bookPrice") || "").trim();
    const coverUrl = String(formData.get("bookCoverUrl") || "").trim();
    const checkoutUrl = String(formData.get("bookCheckoutUrl") || "").trim();

    if (!title || !price) {
      return json({ ok: false, message: "يرجى إدخال اسم الكتاب وسعره." }, { status: 400 });
    }

    appendBook({ title, summary, price, coverUrl, checkoutUrl });
    return json({ ok: true, message: "تمت إضافة الكتاب إلى قسم الكتب بنجاح." });
  }

  return json({ ok: false, message: "إجراء غير معروف." }, { status: 400 });
}

export default function IndexRoute() {
  const { state } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Hafida Fénix</h1>
            <p className="text-xs text-slate-500">مقالات، نشر يومي، كتب واستشارات قانونية</p>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <a href="#daily-posts" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">
              المقالات والنشر اليومي
            </a>
            <a href="#books" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">
              الكتب
            </a>
            <a href="#consultations" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">
              الاستشارات القانونية
            </a>
            <a href="#admin-panel" className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 font-medium">
              لوحة التحكم
            </a>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {state.contacts.whatsappUrl && (
              <a
                href={state.contacts.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                واتساب مباشر
              </a>
            )}
            {state.contacts.instagramUrl && (
              <a
                href={state.contacts.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-100"
              >
                إنستغرام
              </a>
            )}
            {state.contacts.tiktokUrl && (
              <a
                href={state.contacts.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-100"
              >
                تيك توك
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {actionData?.message && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium ${
              actionData.ok
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            {actionData.message}
          </div>
        )}

        <section id="daily-posts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">المقالات والنشر اليومي المباشر</h2>
            <span className="text-xs text-slate-500">يظهر هنا كل جديد فوراً وبترتيب الإضافة</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {state.articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <h3 className="text-lg font-bold text-slate-900">{article.title}</h3>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">{article.body}</p>

                {article.mediaType === "link" && article.mediaUrl && (
                  <a
                    href={article.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm font-medium text-blue-600 underline"
                  >
                    فتح الرابط المرفق
                  </a>
                )}

                {article.mediaType === "image" && article.mediaUrl && (
                  <img
                    src={article.mediaUrl}
                    alt={article.title}
                    className="w-full h-52 object-cover rounded-xl border border-slate-100"
                  />
                )}

                {article.mediaType === "video" && article.mediaUrl && (
                  <video
                    src={article.mediaUrl}
                    controls
                    className="w-full h-52 rounded-xl border border-slate-100 bg-black"
                  />
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="books" className="space-y-4">
          <h2 className="text-2xl font-bold">الكتب</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {state.books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row gap-5"
              >
                <img
                  src={book.coverUrl || "https://via.placeholder.com/200x260?text=Book"}
                  alt={book.title}
                  className="w-full sm:w-36 h-48 object-cover rounded-xl border border-slate-100 shrink-0"
                />
                <div className="flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{book.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-base font-bold text-slate-900">السعر: {book.price}</span>
                    <a
                      href={book.checkoutUrl || state.payments.paypalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                    >
                      الدفع (بايبال / البنك)
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-950 space-y-2">
            <p className="font-semibold">{state.payments.paymentNote}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {state.payments.bankAccount && (
                <span>الحساب البنكي: {state.payments.bankAccount}</span>
              )}
              {state.contacts.whatsappUrl && (
                <a
                  href={state.contacts.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline text-emerald-800"
                >
                  الانتقال إلى زر الواتساب في الصفحة الرئيسية
                </a>
              )}
            </div>
          </div>
        </section>

        <section id="consultations" className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-2xl font-bold">{state.consultation.title}</h2>
          <p className="text-slate-700 leading-relaxed">{state.consultation.message}</p>
          <div>
            <a
              href={state.consultation.ctaUrl || state.contacts.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              {state.consultation.ctaLabel}
            </a>
          </div>
        </section>

        <section id="admin-panel" className="bg-slate-900 text-white rounded-3xl p-6 space-y-8">
          <div>
            <h2 className="text-2xl font-bold">لوحة التحكم</h2>
            <p className="text-xs text-slate-300 mt-1">
              روابط الاتصال والدفع والاستشارات تستبدل القديمة مباشرة؛ والمقالات والكتب تُضاف بشكل مرتب.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Form method="post" className="bg-slate-800 rounded-2xl p-5 space-y-3 border border-slate-700">
              <input type="hidden" name="intent" value="replace_contacts" />
              <h3 className="font-bold text-lg">روابط الاتصال (استبدال مباشر)</h3>
              <label className="block text-xs text-slate-300">
                رابط واتساب
                <input
                  type="text"
                  name="whatsappUrl"
                  defaultValue={state.contacts.whatsappUrl}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-300">
                رابط إنستغرام (يحل محل القديم)
                <input
                  type="text"
                  name="instagramUrl"
                  defaultValue={state.contacts.instagramUrl}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-300">
                رابط تيك توك (يحل محل القديم)
                <input
                  type="text"
                  name="tiktokUrl"
                  defaultValue={state.contacts.tiktokUrl}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400"
              >
                حفظ واستبدال الروابط
              </button>
            </Form>

            <Form method="post" className="bg-slate-800 rounded-2xl p-5 space-y-3 border border-slate-700">
              <input type="hidden" name="intent" value="replace_payments" />
              <h3 className="font-bold text-lg">بيانات الدفع — بايبال والبنك (استبدال مباشر)</h3>
              <label className="block text-xs text-slate-300">
                رابط بايبال
                <input
                  type="text"
                  name="paypalUrl"
                  defaultValue={state.payments.paypalUrl}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-300">
                حساب البنك
                <input
                  type="text"
                  name="bankAccount"
                  defaultValue={state.payments.bankAccount}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-300">
                تنبيه عدم توفر وسائل الدفع
                <input
                  type="text"
                  name="paymentNote"
                  defaultValue={state.payments.paymentNote}
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-sky-400 text-slate-950 font-bold text-sm hover:bg-sky-300"
              >
                حفظ واستبدال بيانات الدفع
              </button>
            </Form>

            <Form method="post" className="bg-slate-800 rounded-2xl p-5 space-y-3 border border-slate-700">
              <input type="hidden" name="intent" value="add_article" />
              <h3 className="font-bold text-lg">إضافة مقال / نشر يومي (إضافة مرتبة)</h3>
              <label className="block text-xs text-slate-300">
                العنوان
                <input
                  type="text"
                  name="title"
                  required
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="block text-xs text-slate-300">
                النص
                <textarea
                  name="body"
                  rows={4}
                  required
                  className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs text-slate-300">
                  إضافة اختيارية تحت النص
                  <select
                    name="mediaType"
                    defaultValue="none"
                    className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  >
                    <option value="none">بدون إضافة</option>
                    <option value="link">رابط</option>
                    <option value="image">صورة</option>
                    <option value="video">فيديو</option>
                  </select>
                </label>
                <label className="block text-xs text-slate-300">
                  رابط الملف أو الصفحة
                  <input
                    type="text"
                    name="mediaUrl"
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300"
              >
                نشر المقال / المنشور اليومي
              </button>
            </Form>

            <div className="space-y-6">
              <Form method="post" className="bg-slate-800 rounded-2xl p-5 space-y-3 border border-slate-700">
                <input type="hidden" name="intent" value="add_book" />
                <h3 className="font-bold text-lg">إضافة كتاب</h3>
                <label className="block text-xs text-slate-300">
                  اسم الكتاب
                  <input
                    type="text"
                    name="bookTitle"
                    required
                    className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="block text-xs text-slate-300">
                  نبذة عن الكتاب
                  <textarea
                    name="bookSummary"
                    rows={2}
                    className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs text-slate-300">
                    السعر
                    <input
                      type="text"
                      name="bookPrice"
                      placeholder="25 €"
                      required
                      className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="block text-xs text-slate-300">
                    رابط صورة الغلاف
                    <input
                      type="text"
                      name="bookCoverUrl"
                      placeholder="https://..."
                      className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </label>
                </div>
                <label className="block text-xs text-slate-300">
                  رابط الدفع (بايبال / البنك)
                  <input
                    type="text"
                    name="bookCheckoutUrl"
                    defaultValue={state.payments.paypalUrl}
                    className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </label>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-400 text-slate-950 font-bold text-sm hover:bg-indigo-300"
                >
                  إضافة الكتاب
                </button>
              </Form>

              <Form method="post" className="bg-slate-800 rounded-2xl p-5 space-y-3 border border-slate-700">
                <input type="hidden" name="intent" value="replace_consultation" />
                <h3 className="font-bold text-lg">الاستشارات القانونية (استبدال مباشر)</h3>
                <label className="block text-xs text-slate-300">
                  العنوان
                  <input
                    type="text"
                    name="consultationTitle"
                    defaultValue={state.consultation.title}
                    className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="block text-xs text-slate-300">
                  الرسالة التحفيزية
                  <textarea
                    name="consultationMessage"
                    rows={3}
                    defaultValue={state.consultation.message}
                    className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs text-slate-300">
                    نص زر الحجز
                    <input
                      type="text"
                      name="consultationCtaLabel"
                      defaultValue={state.consultation.ctaLabel}
                      className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="block text-xs text-slate-300">
                    رابط الحجز
                    <input
                      type="text"
                      name="consultationCtaUrl"
                      defaultValue={state.consultation.ctaUrl}
                      className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 font-bold text-sm hover:bg-teal-300"
                >
                  حفظ رسالة الاستشارات
                </button>
              </Form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
