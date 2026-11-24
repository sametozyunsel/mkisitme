# MK İşitme Cihazları Web Sitesi

## Ürün ve tasarım
MK İşitme Cihazları için kırmızı-beyaz ağırlıklı, güven veren sağlık hizmeti estetiğine sahip, mobil öncelikli kurumsal web sitesi. Tasarım dili: sakin klinik güveni + net yönlendirme. Tipografi: okunabilir sans-serif; başlıklarda güçlü ağırlık, metinde rahat satır aralığı. İmza öğeleri: kırmızı güven şeridi, ses dalgası motifi, sabit WhatsApp erişimi.

## Sayfalar
- `/` ana sayfa: kurum tanıtımı, hizmet yaklaşımı, marka içerikleri, CTA.
- `/hakkimizda`: MK İşitme'nin yaklaşımı ve hasta deneyimi.
- `/markalar/sonic`: Sonic markası ve doğrulanabilir genel teknoloji başlıkları.
- `/markalar/audibel`: Audibel işitme cihazı stilleri ve teknoloji başlıkları.
- `/blog`, `/blog/:slug`: içerik listeleme ve detay.
- `/Wordaf`: korumalı blog yönetimi.
- `/iletisim`: adres, telefon, e-posta, saatler, sosyal bağlantılar, harita ve yapılandırılabilir Web3Forms.

## Uygulama yaklaşımı
React/Vite ön yüzü, Express API ve Drizzle/MySQL blog deposu. Yönetim oturumu httpOnly, SameSite=None, Secure çerezle çalışır. Blog içerikleri veritabanına yazılır; veritabanı erişilemezse kamusal başlangıç içerikleri görünür kalır. SEO route manifesti, metadata, sitemap ve robots dosyaları eklenir.

## Kaynaklar
Sonic içerikleri genel ve temkinli tutulacak; doğrulanamayan model/özellik iddiaları yapılmayacak. Audibel ürün stilleri ve teknoloji başlıkları resmi Audibel sayfalarındaki over-the-ear, in-the-ear, kişiselleştirilmiş işitme teknolojisi, gürültü azaltma, konuşma netliği ve şarj edilebilirlik çerçevesine dayanacak.
