# Değişiklik Geçmişi

## 2026-05-20 — 2026 Yılı Analiz Takvimi Verilerinin Eklenmesi

`src/data.ts` dosyasındaki `calendarData.analizler` objesine 2026 yılının 18 yeni girişi eklendi. 2025 yılı verileri olduğu gibi korundu (tarihsel referans).

### İlgili commitler

- `167ff9e` — 2026 yılı analiz takvimi verilerinin eklenmesi
- `0243eb9` — 2026 girişlerinde Enstitü Performans dönemini (2022-2024) → (2023-2025) güncelle
- `0721ec2` — 2026 açıklamalarına yıl belirteçlerinin eklenmesi

### Eklenen 2026 girişleri

| Tarih | Açıklama |
|---|---|
| 2026-01-01 | Öğretim Üyesi Yayın ve Yazarlık Analizi için Verilerin Çekilmesi (AVESİS) |
| 2026-01-19 | Öğretim Üyesi Yayın ve Yazarlık Analizi Raporunun Yayınlanması (2025 Yılı Değerlendirmesi) |
| 2026-02-01 | Alan Bazlı Göstergelerin Karşılaştırmalı Analizi İçin Veri Çekilmesi (WoS) |
| 2026-02-19 | Alan Bazlı Göstergelerin Karşılaştırmalı Analizi Raporunun Yayınlanması |
| 2026-04-01 | Öğretim Üyesi Yayın ve Yazarlık Analizi için Verilerin Çekilmesi (AVESİS) |
| 2026-04-19 | Öğretim Üyesi Yayın ve Yazarlık Analizi Raporunun Yayınlanması (2025 Yılı Değerlendirmesi) |
| 2026-05-20 | Fakülte Performans Analizi için İlgili Birimlerden Veri Talep Edilmesi (KPS-KLT-ISB) |
| 2026-06-01 | Enstitü Performans Analizi için Enstitülerden Veri Talep Edilmesi (2023-2025) |
| 2026-06-08 | Fakülte Performans Analizi Verilerinin Araştırma Dekanlığı'na İletilmesi için SON GÜN |
| 2026-06-15 | Fakülte Performans Analizi Raporunun Yayınlanması (KPS-KLT-ISB — 2025 Yılı Raporu) |
| 2026-07-01 | Öğretim Üyesi Yayın ve Yazarlık Analizi için Verilerin Çekilmesi (AVESİS) ~~ MYO / Fakülte / Enstitü / AR-UY Merkezlerinden Aksiyon Raporu-2026 Verilerinin Talep Edilmesi |
| 2026-07-16 | Enstitü Performans Analizi Verilerinin Araştırma Dekanlığı'na İletilmesi için SON GÜN |
| 2026-07-19 | Öğretim Üyesi Yayın ve Yazarlık Analizi Raporunun Yayınlanması (2025 Yılı Değerlendirmesi) |
| 2026-08-01 | YKS Analizi Çalışması 2026 (ÖSYM Takvimine Göre) ~~ Enstitü Performans Analizi Raporunun Yayınlanması (2023-2025) |
| 2026-09-01 | Araştırma Üniversiteleri Performans Sıralaması Simülasyon Çalışmasının Başlaması |
| 2026-09-24 | Alt Yapı Projeleri Öncelikli Alanlar Etüt Çalışması-2 Raporunun Yayınlanması |
| 2026-10-01 | Öğretim Üyesi Yayın ve Yazarlık Analizi için Verilerin Çekilmesi (AVESİS) |
| 2026-10-19 | Öğretim Üyesi Yayın ve Yazarlık Analizi Raporunun Yayınlanması (2025 Yılı Değerlendirmesi) |

### Karar notları

- **Öğretim Üyesi Yayın ve Yazarlık Analizi** üç ayda bir tekrar ediyor: **Ocak, Nisan, Temmuz, Ekim**. Her ayın 1'inde veri çekilmesi, 19'unda rapor yayını.
- **Aynı tarihte birden fazla etkinlik** (`2026-07-01` ve `2026-08-01`) `~~` ayracı ile tek `description` içinde birleştirildi. UI tarafında bu ayraç parse edilerek ayrı satırlar olarak gösterilebilir (2025 verilerinde de aynı kalıp kullanıldı, örn: `2025-11-24`, `2025-12-31`).
- **Yıl belirteçleri** Word dökümanından gelen başlıkların 1 yıl ileri kaydırılmış hali:
  - `(2022-2024)` → `(2023-2025)` (Enstitü Performans Raporu dönemi)
  - `(2024 Yılı Raporu)` (2025 girişlerinde) → `(2025 Yılı Değerlendirmesi)` / `(2025 Yılı Raporu)` (2026 girişlerinde)
  - `Aksiyon Raporu-2025` → `Aksiyon Raporu-2026`
  - `YKS Analizi 2025` → `YKS Analizi 2026`

### Veri yapısı hatırlatması

`src/data.ts` içinde her giriş şu şekilde:

```ts
"YYYY-MM-DD": {
  "date": "YYYY-MM-DD",
  "description": "Açıklama metni",
  "is_new": true,
  "link": "https://..."   // opsiyonel
}
```

- `analizler` — ana takvim girişleri (kullanılıyor)
- `etkinlikler`, `haberler` — şu an UI'da gösterilmiyor ama veri yapısı korunuyor

### Test edilen ama geri alınan denemeler

Bu güncelleme sırasında UI/UX iyileştirmeleri (bugün vurgusu, ~~ bullet parser, mobil header, dashboard layout, year heatmap, arama + filtre chip'leri, dark mode redesign) bir `redesign-v1` branch'inde denendi ancak kullanıcı beğenmediği için tamamen geri alındı. Sadece veri güncellemeleri `main`'de kaldı.

### Sıradaki yıl güncellemesi için

2027 verilerini eklerken:

1. `git pull` ile reposu güncel tut.
2. `src/data.ts` içine `calendarData.analizler` altına aynı formatta yeni girişler ekle.
3. Aynı tarihteki birden çok etkinliği `~~` ile birleştir.
4. Yıl referanslarını 1 yıl ileri kaydır (`(2024 Yılı Değerlendirmesi)` → `(2026 Yılı Değerlendirmesi)`, vb).
5. `npx tsc --noEmit -p tsconfig.app.json` ile typecheck et.
6. Commit + push → Netlify otomatik deploy eder.
