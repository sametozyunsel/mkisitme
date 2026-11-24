import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { blogPosts, type BlogPost, type InsertBlogPost } from "../drizzle/schema";

export const seedPosts: Omit<BlogPost, "id" | "createdAt" | "updatedAt">[] = [
  {
    slug: "isitme-cihazi-secerken-5-onemli-nokta",
    title: "İşitme cihazı seçerken dikkat edilmesi gereken 5 nokta",
    excerpt: "İşitme cihazı seçimi; işitme kaybı, günlük yaşam ve kullanım alışkanlıkları birlikte değerlendirilerek yapılır.",
    category: "İşitme Rehberi",
    content: "İşitme cihazı seçimi kişiye özeldir. İşitme değerlendirmesi, cihazın fiziksel yapısı, günlük kullanım alanları ve telefonla bağlantı ihtiyacı birlikte ele alınmalıdır.\n\nKulak arkası ve kulak içi modeller farklı kullanım deneyimleri sunar. En doğru seçim, işitme uzmanının değerlendirmesi ve kişisel deneme süreciyle netleşir.\n\nMK İşitme Cihazları olarak cihaz seçiminden ayar sürecine kadar anlaşılır ve kişiye özel bir yol haritası sunuyoruz.",
    imageUrl: "/images/blog-consultation.jpg",
    published: 1,
  },
  {
    slug: "bluetooth-isitme-cihazi-telefon-eslestirme",
    title: "Bluetooth işitme cihazını telefona bağlama rehberi",
    excerpt: "Bağlantı sorunu yaşadığınızda cihazı hemen servise göndermeden önce deneyebileceğiniz temel adımlar.",
    category: "Teknoloji",
    content: "Önce işitme cihazının şarjını ve telefonun Bluetooth ayarını kontrol edin. Eski eşleştirme kayıtlarını kaldırmak, telefonu ve cihazı yeniden başlatmak çoğu bağlantı sorununda iyi bir başlangıçtır.\n\nUygulama izinlerini, özellikle Android cihazlarda konum iznini ve pil optimizasyonunu da kontrol edin. Menü adları telefon üreticisine göre değişebilir.\n\nSorun devam ederse MK İşitme Cihazları ekibinden destek alabilirsiniz.",
    imageUrl: "/images/blog-phone.jpg",
    published: 1,
  },
  {
    slug: "isitme-cihazi-bakimi-ve-temizligi",
    title: "İşitme cihazı bakımı ve temizliği nasıl yapılır?",
    excerpt: "Günlük bakım alışkanlıkları cihaz performansını korumaya ve kullanım konforunu artırmaya yardımcı olur.",
    category: "Bakım",
    content: "Cihazınızı kullanmadığınız zamanlarda kuru ve güvenli bir yerde saklayın. Kulak kiri filtresini, mikrofon girişlerini ve şarj kontaklarını düzenli olarak kontrol edin.\n\nCihazı suya, yoğun neme ve doğrudan ısıya maruz bırakmayın. Temizlik için üreticinin önerdiği araçları kullanın; sivri veya ıslak malzemelerden kaçının.\n\nBakım aralığı cihaz modeline ve kullanım alışkanlıklarına göre değişebilir. Düzenli kontrol için merkezimizle iletişime geçebilirsiniz.",
    imageUrl: "/images/blog-care.jpg",
    published: 1,
  },
];

export async function listBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return seedPosts.map((post, index) => ({ ...post, id: index + 1, createdAt: new Date(), updatedAt: new Date() }));
  const rows = await db.select().from(blogPosts).where(includeUnpublished ? undefined : eq(blogPosts.published, 1)).orderBy(desc(blogPosts.createdAt));
  return rows.length ? rows : seedPosts.map((post, index) => ({ ...post, id: index + 1, createdAt: new Date(), updatedAt: new Date() }));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return seedPosts.find(post => post.slug === slug) ? { ...seedPosts.find(post => post.slug === slug)!, id: 1, createdAt: new Date(), updatedAt: new Date() } : undefined;
  const rows = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, 1))).limit(1);
  return rows[0] ?? seedPosts.find(post => post.slug === slug);
}

export async function createBlogPost(input: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(blogPosts).values(input);
  return result;
}

export async function updateBlogPost(id: number, input: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.update(blogPosts).set({ ...input, updatedAt: new Date() }).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.delete(blogPosts).where(eq(blogPosts.id, id));
}
