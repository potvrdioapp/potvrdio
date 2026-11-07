# Potvrdio Outreach CRM & Local SQLite DB

Sırbistan WooCommerce kapalı beta (closed beta) outreach sürecindeki hedef mağazaları, saha kancalarını ve tarihli iletişim geçmişini yönetmek için geliştirilmiş **tamamen bağımsız, sıfır bağımlılıklı (zero-dependency) yerel CRM ve SQLite veritabanı**.

---

## 🚀 Özellikler

1. **Bağımsız & Sıfır Boyut Etkisi (Zero-Bloat):**
   - Web sitesi (`landing-web`), panel (`merchant-dashboard`) veya backend paketlerine hiçbir ek yük getirmez.
   - Node.js 24'ün yerleşik `node:sqlite` ve `node:http` modülleri ile çalışır; `node_modules` klasörüne bile ihtiyaç duymaz!

2. **SQLite Veritabanı (`data/potvrdio_outreach.db`):**
   - `stores`: 29 mağaza (17 adet doğrulanmış P1 WooCommerce mağazası + 12 adet ikincil/diskalifiye havuz mağazası).
   - `communications`: 13 ve 14 Ekim tarihlerinde Animal Market, Fashion Store, Šifonjer ve Fermini'ye gönderilmiş gerçek e-postalar ve takip tarihleri önceden işlenmiştir.
   - `templates`: Sırpça kapalı beta e-posta ve takip şablonları (Şablon A, Şablon B1/B2/B3, Takip).

3. **Modern Yerel Web Dashboard (`http://localhost:3333`):**
   - **Canlı Metrikler:** Toplam mağaza, P1 doğrulanmış, gönderilenler ve 3–5 kapalı beta hedefi takibi.
   - **Arama & Filtre:** Mağaza adı, domain, şehir, sektör veya durumuna göre anlık filtreleme.
   - **Detay & Saha Kancası (Pitch Angle):** Her mağazanın kargo riski, çift yönlü kargo maliyeti, desi ağırlığı veya tekil ürün (1-of-1) gibi özel notları.
   - **İletişim Geçmişi (Timeline):** Gönderilen e-postalar, telefon görüşmeleri, Viber mesajları ve notların tarihli akışı.
   - **Tek Tıkla Şablon & Gönderim:** Mağaza adını otomatik yerleştiren Sırpça şablonlar, tek tıkla kopyalama, varsayılan e-posta uygulamasını açma ve doğrudan "Gönderildi" olarak DB'ye loglama.
   - **Yeni Mağaza & İletişim Ekleme:** Arayüz üzerinden yeni aday mağaza ve iletişim kaydı oluşturabilme.

---

## 🛠️ Nasıl Çalıştırılır?

Ana dizinden veya `outreach-crm` klasöründen çalıştırmak için:

```bash
cd outreach-crm
npm start
# veya doğrudan:
node server.js
```

Ardından tarayıcınızda açın:
👉 **[http://localhost:3333](http://localhost:3333)**

---

## 🗄️ Veritabanına Doğrudan Erişim (CLI / TablePlus / DBeaver)

Veritabanı standart bir SQLite dosyasıdır (`outreach-crm/data/potvrdio_outreach.db`).

Terminalden bağlanmak için:
```bash
sqlite3 outreach-crm/data/potvrdio_outreach.db
```

Verileri yeniden ilk haline sıfırlamak isterseniz:
```bash
node outreach-crm/seed.js
```
