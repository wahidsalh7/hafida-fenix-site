export type ContactLinks = {
  whatsappUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
};

export type PaymentSettings = {
  paypalUrl: string;
  bankAccount: string;
  paymentNote: string;
};

export type ArticleItem = {
  id: string;
  title: string;
  body: string;
  mediaType?: "none" | "link" | "image" | "video";
  mediaUrl?: string;
  createdAt: string;
};

export type BookItem = {
  id: string;
  title: string;
  summary: string;
  price: string;
  coverUrl: string;
  checkoutUrl: string;
};

export type ConsultationSettings = {
  title: string;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
};

export type SiteState = {
  contacts: ContactLinks;
  payments: PaymentSettings;
  articles: ArticleItem[];
  books: BookItem[];
  consultation: ConsultationSettings;
};

let siteState: SiteState = {
  contacts: {
    whatsappUrl: "https://wa.me/34661073853",
    instagramUrl: "https://instagram.com",
    tiktokUrl: "https://tiktok.com",
  },
  payments: {
    paypalUrl: "https://paypal.me/your-link",
    bankAccount: "ES00 0000 0000 0000 0000 0000",
    paymentNote:
      "في حال عدم توفر حساب بايبال أو تحويل بنكي لديك، يمكنك التواصل مباشرة عبر زر الواتساب الموجود في الصفحة الرئيسية.",
  },
  articles: [
    {
      id: "art-1",
      title: "مرحباً بكم في موقع حفيدة فينيكس (Hafida Fénix)",
      body: "هنا تجدون المقالات والنشر اليومي المباشر، والكتب، والمعلومات القانونية الخاصة بإسبانيا والهجرة.",
      mediaType: "none",
      mediaUrl: "",
      createdAt: new Date().toISOString(),
    },
  ],
  books: [
    {
      id: "book-1",
      title: "دليل الإقامة والهجرة في إسبانيا",
      summary:
        "شرح عملي ومنظم لأهم الإجراءات والملفات القانونية والإدارية في إسبانيا بأسلوب واضح.",
      price: "25 €",
      coverUrl: "https://via.placeholder.com/300x400?text=Book+Cover",
      checkoutUrl: "https://paypal.me/your-link",
    },
  ],
  consultation: {
    title: "الاستشارات القانونية — إسبانيا والهجرة",
    message:
      "تجدون الكثير من المعلومات القيّمة والمفيدة هنا على الصفحة، وفي صفحاتنا على السوشل ميديا، وفي فيديوهاتنا على يوتيوب. وإذا رغبت في استفادة ومساعدة أدق لحالتك، يمكنك حجز استشارة مدفوعة وسنقدم لك أفضل الخدمات مع تخفيضات خاصة لكل زوار الموقع.",
    ctaLabel: "احجز استشارة مدفوعة عبر الواتساب",
    ctaUrl: "https://wa.me/34661073853",
  },
};

export function getSiteState(): SiteState {
  return siteState;
}

export function replaceContactLinks(input: Partial<ContactLinks>): ContactLinks {
  siteState = {
    ...siteState,
    contacts: {
      whatsappUrl:
        input.whatsappUrl !== undefined
          ? input.whatsappUrl.trim()
          : siteState.contacts.whatsappUrl,
      instagramUrl:
        input.instagramUrl !== undefined
          ? input.instagramUrl.trim()
          : siteState.contacts.instagramUrl,
      tiktokUrl:
        input.tiktokUrl !== undefined
          ? input.tiktokUrl.trim()
          : siteState.contacts.tiktokUrl,
    },
  };
  return siteState.contacts;
}

export function replacePaymentSettings(
  input: Partial<PaymentSettings>
): PaymentSettings {
  siteState = {
    ...siteState,
    payments: {
      paypalUrl:
        input.paypalUrl !== undefined
          ? input.paypalUrl.trim()
          : siteState.payments.paypalUrl,
      bankAccount:
        input.bankAccount !== undefined
          ? input.bankAccount.trim()
          : siteState.payments.bankAccount,
      paymentNote:
        input.paymentNote !== undefined
          ? input.paymentNote.trim()
          : siteState.payments.paymentNote,
    },
  };
  return siteState.payments;
}

export function replaceConsultationSettings(
  input: Partial<ConsultationSettings>
): ConsultationSettings {
  siteState = {
    ...siteState,
    consultation: {
      title:
        input.title !== undefined ? input.title.trim() : siteState.consultation.title,
      message:
        input.message !== undefined
          ? input.message.trim()
          : siteState.consultation.message,
      ctaLabel:
        input.ctaLabel !== undefined
          ? input.ctaLabel.trim()
          : siteState.consultation.ctaLabel,
      ctaUrl:
        input.ctaUrl !== undefined
          ? input.ctaUrl.trim()
          : siteState.consultation.ctaUrl,
    },
  };
  return siteState.consultation;
}

export function appendArticle(item: Omit<ArticleItem, "id" | "createdAt">): ArticleItem {
  const newArticle: ArticleItem = {
    id: `art-${Date.now()}`,
    title: item.title.trim(),
    body: item.body.trim(),
    mediaType: item.mediaType || "none",
    mediaUrl: (item.mediaUrl || "").trim(),
    createdAt: new Date().toISOString(),
  };

  siteState = {
    ...siteState,
    articles: [newArticle, ...siteState.articles],
  };

  return newArticle;
}

export function appendBook(item: Omit<BookItem, "id">): BookItem {
  const newBook: BookItem = {
    id: `book-${Date.now()}`,
    title: item.title.trim(),
    summary: item.summary.trim(),
    price: item.price.trim(),
    coverUrl: item.coverUrl.trim(),
    checkoutUrl: (item.checkoutUrl || siteState.payments.paypalUrl).trim(),
  };

  siteState = {
    ...siteState,
    books: [...siteState.books, newBook],
  };

  return newBook;
}
