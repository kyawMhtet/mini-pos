import type { TKey } from "./en";

export const my: Record<TKey, string> = {
  // Navigation
  "nav.dashboard": "မူလစာမျက်နှာ",
  "nav.newOrder": "အမှာစာ အသစ်",
  "nav.orders": "အမှာစာများ",
  "nav.products": "ကုန်ပစ္စည်းများ",
  "nav.stock": "စတော့",

  // Auth
  "auth.signInToContinue": "ဆက်လက်ရန် ဝင်ရောက်ပါ",
  "auth.email": "အီးမေးလ်",
  "auth.emailPlaceholder": "you@example.com",
  "auth.password": "စကားဝှက်",
  "auth.passwordPlaceholder": "••••••••",
  "auth.signIn": "ဝင်ရောက်",
  "auth.signingIn": "ဝင်ရောက်နေသည်…",
  "auth.invalidCredentials": "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေသည်။",
  "auth.signInErrorPrefix": "ဝင်ရောက်မှု အမှား:",
  "auth.signOut": "ထွက်ရန်",

  // Common actions
  "action.cancel": "ပယ်ဖျက်",
  "action.save": "သိမ်းဆည်း",
  "action.saveChanges": "ပြောင်းလဲမှုများ သိမ်းဆည်း",
  "action.edit": "တည်းဖြတ်",
  "action.delete": "ဖျက်",
  "action.confirm": "အတည်ပြု",
  "action.add": "ထည့်သွင်း",
  "action.retry": "ပြန်ကြိုးစား",
  "action.print": "ပုံနှိပ်",
  "action.clear": "ရှင်းလင်း",
  "action.clearAll": "အားလုံး ဖယ်ရှား",
  "action.viewAll": "အားလုံးကြည့်",
  "action.downloadPdf": "PDF ဒေါင်းလုတ်",
  "action.completeOrder": "အမှာစာ ပြီးဆုံးစေ",
  "action.backToOrders": "အမှာစာများသို့ ပြန်သွား",
  "action.restockAll": "အားလုံး ပြန်ဖြည့်",
  "action.addProduct": "ကုန်ပစ္စည်း ထည့်သွင်း",
  "action.editProduct": "ကုန်ပစ္စည်း တည်းဖြတ်",
  "action.createProduct": "ကုန်ပစ္စည်း ဖန်တီး",

  // Common states
  "state.loading": "ခဏစောင့်ပါ…",
  "state.saving": "သိမ်းဆည်းနေသည်…",
  "state.processing": "လုပ်ဆောင်နေသည်…",
  "state.generating": "ဖန်တီးနေသည်…",
  "state.optional": "ရွေးချယ်နိုင်သည်",
  "state.active": "တက်ကြွနေဆဲ",
  "state.inactive": "တက်ကြွမနေ",
  "state.all": "အားလုံး",

  // Common labels
  "label.status": "အခြေအနေ",
  "label.customerName": "ဖောက်သည်အမည်",
  "label.discount": "လျှော့ဈေး (ကျပ်)",
  "label.discountKyats": "လျှော့ဈေး (ကျပ်)",
  "label.note": "မှတ်ချက်",
  "label.subtotal": "ကြိုတင်စုစုပေါင်း",
  "label.discountLine": "လျှော့ဈေး",
  "label.total": "စုစုပေါင်း",
  "label.qty": "အရေအတွက်",
  "label.unitPrice": "ယူနစ်ဈေး",
  "label.amount": "ပမာဏ",
  "label.item": "ပစ္စည်း",
  "label.to": "မှ",

  // Errors
  "error.failedToLoad": "ဒေတာ မရနိုင်ပါ။ ပြန်လည်ကြိုးစားပါ။",

  // Order status
  "status.pending": "ဆိုင်းငံ့နေဆဲ",
  "status.completed": "ပြီးဆုံးပြီ",
  "status.cancelled": "ပယ်ဖျက်ပြီ",

  // Units (Myanmar has no grammatical plural — use same noun)
  "unit.order": "အမှာစာ",
  "unit.orders": "အမှာစာ",
  "unit.product": "ကုန်ပစ္စည်း",
  "unit.products": "ကုန်ပစ္စည်း",
  "unit.item": "ခု",
  "unit.items": "ခု",

  // Dashboard
  "dashboard.title": "မူလစာမျက်နှာ",
  "dashboard.subtitle": "သင့်ဆိုင်၏ စွမ်းဆောင်ရည် အနှစ်ချုပ်",
  "dashboard.failedToLoad": "မူလစာမျက်နှာ ဒေတာ မရနိုင်ပါ။ ပြန်ကြိုးစားပါ။",
  "dashboard.today": "ယနေ့",
  "dashboard.thisWeek": "ဤသတ္တပတ်",
  "dashboard.thisMonth": "ဤလ",
  "dashboard.recentOrders": "မကြာသေးမီ အမှာစာများ",
  "dashboard.noOrdersYet": "အမှာစာ မရှိသေးပါ။",
  "dashboard.topProducts": "ထိပ်တန်း ကုန်ပစ္စည်းများ",
  "dashboard.topProductsSubtitle": "ဤလ ရောင်းအရေအတွက်အလိုက်",
  "dashboard.noSalesThisMonth": "ဤလ ရောင်းအားမရှိပါ။",

  // Products
  "products.title": "ကုန်ပစ္စည်းများ",
  "products.failedToLoad": "ကုန်ပစ္စည်းများ မရနိုင်ပါ။",
  "products.noProductsFound": "ကုန်ပစ္စည်း မတွေ့ပါ",
  "products.noProductsHint": "စစ်ထုတ်မှု ပြောင်းကြည့်ပါ သို့မဟုတ် ကုန်ပစ္စည်း ထည့်ပါ။",
  "products.addDescription": "ကုန်ပစ္စည်း ထည့်သွင်းရန် အသေးစိတ်ဖြည့်ပါ။",
  "products.nameLabel": "အမည် *",
  "products.namePlaceholder": "ဥပမာ - Insulated Bag M",
  "products.skuLabel": "SKU *",
  "products.skuPlaceholder": "ဥပမာ - BAG-INS-M",
  "products.priceLabel": "ဈေးနှုန်း (ကျပ်) *",
  "products.stockLabel": "စတော့ *",
  "products.categoryLabel": "အမျိုးအစား",
  "products.noCategory": "— အမျိုးအစား မရှိ —",
  "products.descriptionLabel": "ဖော်ပြချက်",
  "products.descriptionPlaceholder": "ကုန်ပစ္စည်း ဖော်ပြချက် (ရွေးချယ်နိုင်)",
  "products.imageUrlLabel": "ရုပ်ပုံ လင့်",
  "products.imageUrlPlaceholder": "https://...",

  // Table headers
  "table.product": "ကုန်ပစ္စည်း",
  "table.sku": "SKU",
  "table.category": "အမျိုးအစား",
  "table.status": "အခြေအနေ",
  "table.stock": "စတော့",
  "table.priceKyats": "ဈေးနှုန်း (ကျပ်)",
  "table.actions": "လုပ်ဆောင်ချက်",
  "table.orderNumber": "အမှာစာ #",
  "table.customer": "ဖောက်သည်",
  "table.items": "ပစ္စည်းများ",
  "table.total": "စုစုပေါင်း",
  "table.date": "ရက်စွဲ",

  // Orders
  "orders.title": "အမှာစာများ",
  "orders.searchPlaceholder": "အမှာစာ # သို့မဟုတ် ဖောက်သည်နာမည် ရှာပါ…",
  "orders.failedToLoad": "အမှာစာများ မရနိုင်ပါ။",
  "orders.noOrdersFound": "အမှာစာ မတွေ့ပါ",
  "orders.noOrdersHint": "စစ်ထုတ်မှု ပြင်ကြည့်ပါ။",
  "orders.loadingOrder": "အမှာစာ ရယူနေသည်…",
  "orders.notFound": "အမှာစာ မတွေ့ပါ။",
  "orders.mustHaveItem": "အမှာစာတွင် ပစ္စည်းအနည်းဆုံး တစ်ခု ရှိရမည်။",
  "orders.addProductPlaceholder": "ကုန်ပစ္စည်း ထည့်ပါ…",
  "orders.orderDetailsSection": "အမှာစာ အသေးစိတ်",
  "orders.itemsSection": "ပစ္စည်းများ",

  // New Order
  "newOrder.title": "အမှာစာ အသစ်",
  "newOrder.subtitle": "ဈေးဝယ်တောင်းထဲ ထည့်ရန် ကုန်ပစ္စည်း ရွေးပါ",
  "newOrder.productsTab": "ကုန်ပစ္စည်းများ",
  "newOrder.cartTab": "ဈေးဝယ်တောင်း",

  // Cart
  "cart.title": "ဈေးဝယ်တောင်း",
  "cart.empty": "ဈေးဝယ်တောင်း ဗလာဖြစ်နေသည်",
  "cart.emptyHint": "ထည့်ရန် ကုန်ပစ္စည်းကို နှိပ်ပါ",

  // Product Grid
  "productGrid.searchPlaceholder": "နာမည် သို့မဟုတ် SKU ဖြင့် ရှာပါ…",
  "productGrid.noProducts": "ကုန်ပစ္စည်း မတွေ့ပါ။",
  "productGrid.outOfStock": "ပစ္စည်းကုန်ပြီ",
  "productGrid.lowStock": "နည်း: ",
  "productGrid.inStock": "ပစ္စည်းရှိသည်",

  // Invoice
  "invoice.title": "ငွေတောင်းခံလွှာ",
  "invoice.billTo": "ငွေတောင်းမည့်သူ",
  "invoice.thankYou": "ဝယ်ယူမှုအတွက် ကျေးဇူးတင်ပါသည်။",

  // Stock
  "stock.title": "စတော့",
  "stock.restockAllTitle": "ကုန်ပစ္စည်းများ အားလုံး ပြန်ဖြည့်",
  "stock.lowOnStock": "ပစ္စည်းနည်းနေသည်",
  "stock.searchPlaceholder": "နာမည် သို့မဟုတ် SKU ဖြင့် ရှာပါ…",
  "stock.failedToLoad": "စတော့ ဒေတာ မရနိုင်ပါ။",
  "stock.noProductsMatch": "ရှာဖွေမှုနှင့် ကိုက်ညီသော ကုန်ပစ္စည်း မတွေ့ပါ။",
  "stock.noProductsFound": "ကုန်ပစ္စည်း မတွေ့ပါ။",
  "stock.clickToAdjust": "စတော့ ပြင်ဆင်ရန် နှိပ်ပါ",
  "stock.current": "လက်ရှိ: ",

  // Mobile nav
  "nav.openMenu": "မီနူး ဖွင့်ပါ",
  "nav.closeMenu": "မီနူး ပိတ်ပါ",
  "nav.navigationMenu": "လမ်းညွှန် မီနူး",
};
