# Masaar — Sector & Company-Tier Taxonomy (HR database)

The shared HR/recruiter database (`hr_contacts`) is organized on **two
dimensions**:

1. **Sector** — *what* the company does (16 sectors below).
2. **Company tier** — *how big* it is. This matters a lot, because the prestige
   giants (PIF, Aramco) reply rarely, while **mid-market and small companies are
   far more numerous and reply far more often.** A database of only giants is a
   database of non-responders.

> Design principle: giants are the *aspiration* (covered by "Good Targets" /
> decision-makers and the prestige score). The **HR formal route must be broad
> and skew mid-market + SME + agencies** — that's where replies actually happen.
> Target ~60–70% of every sector's HR contacts from non-giant tiers.

## Company tiers (`hr_contacts.company_tier`)

| Tier | الوصف | Reply likelihood | Role in Masaar |
|---|---|---|---|
| `giant` | عمالقة وحكومة (PIF, Aramco, NEOM, الوزارات) | Low | Prestige aspiration; high value, hard to reach |
| `large` | شركات كبيرة راسخة (بنوك، مقاولون كبار) | Low–Med | Structured TA teams |
| `mid_market` | شركات متوسطة | **High** | The responsive core |
| `sme` | شركات صغيرة وناشئة | **Very high** | Most numerous, fastest replies |
| `agency` | مكاتب توظيف واستقدام | **Very high** | Place across all sectors |

## The 16 sectors

| # | Slug | العربية | English | Priority | Target HR | Anchor employers |
|---|---|---|---|---|---|---|
| 1 | `investment_finance` | الاستثمار والتمويل | Investment & Finance | 1 | 250 | PIF, SNB, Al Rajhi, + boutique advisory/fintech SMEs |
| 2 | `consulting` | الاستشارات والخدمات المهنية | Consulting & Professional Services | 1 | 200 | MBB, Big 4, + local/boutique consultancies |
| 3 | `energy_petrochem` | الطاقة والبتروكيماويات | Energy & Petrochemicals | 1 | 200 | Aramco, SABIC, + contractors & service SMEs |
| 4 | `gigaprojects_realestate` | المشاريع الكبرى والعقار والإنشاء | Giga-projects, Real Estate & Construction | 1 | 250 | NEOM, Roshn, + the long tail of contractors |
| 5 | `government` | الحكومة والقطاع العام | Government & Public Sector | 1 | 180 | Ministries, authorities, + semi-gov entities |
| 6 | `recruitment_agencies` | مكاتب التوظيف والاستقدام | Recruitment & Staffing Agencies | 1 | 220 | Maharah, SMASCO, Hays, ManpowerGroup, Michael Page |
| 7 | `telecom_it` | الاتصالات وتقنية المعلومات | Telecom & IT | 2 | 130 | stc, Mobily, Zain, + IT services SMEs |
| 8 | `tech_startups` | التقنية والشركات الناشئة | Tech & Startups | 2 | 180 | Tamara, Jahez, Salla, + the whole startup long tail |
| 9 | `healthcare_pharma` | الصحة والأدوية | Healthcare & Pharma | 2 | 160 | MOH, KFSHRC, + private hospitals & clinics |
| 10 | `manufacturing_mining` | الصناعة والتعدين | Manufacturing & Mining | 2 | 140 | Ma'aden, + industrial-city factories (SMEs) |
| 11 | `transport_logistics` | النقل واللوجستيات | Transport & Logistics | 2 | 140 | Saudia, Bahri, + freight/logistics SMEs |
| 12 | `retail_fmcg` | التجزئة والسلع الاستهلاكية | Retail & FMCG | 3 | 120 | Cenomi, Almarai, + retailers & distributors |
| 13 | `education_training` | التعليم والتدريب | Education & Training | 3 | 120 | KAUST, + private schools & training centers |
| 14 | `tourism_entertainment` | السياحة والترفيه والضيافة | Tourism, Entertainment & Hospitality | 3 | 110 | SEVEN, GEA, + hotels & F&B operators |
| 15 | `insurance` | التأمين | Insurance | 3 | 80 | Bupa, Tawuniya, + brokers |
| 16 | `aerospace_defense` | الطيران والدفاع | Aerospace & Defense | 3 | 70 | SAMI, GAMI, + suppliers |

**Mature target: ~2,550 individual HR people** (P1 ≈ 1,300 · P2 ≈ 750 · P3 ≈ 500).
Start with priority-1 (sectors 1–6 ≈ 1,300), and within each sector fill
mid-market + SME + agency first.

## Tier mix to aim for (per sector)
For a priority-1 sector targeting ~250 people:
- `giant` / `large` (anchors): ~60 (24%)
- `mid_market`: ~100 (40%)
- `sme`: ~90 (36%)

The exact split flexes by sector, but the rule holds: **the majority comes from
mid-market and smaller firms**, because those are the people who reply.

## Research workflow (per sector × tier)
1. LinkedIn search anchor employers AND mid/small companies in the sector, with
   titles: "Talent Acquisition", "Recruiter", "HR Business Partner",
   "People & Culture", "اكتساب المواهب", "موارد بشرية".
2. Capture: name, title, company, LinkedIn URL, sector slug, **company_tier**,
   `source`.
3. Business contact data only (PDPL): no personal emails/phones. Set
   `verified_at` once confirmed current in role.
4. Track via the `sector_progress` and `hr_by_tier` views.
