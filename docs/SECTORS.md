# Masaar — Sector Taxonomy (for the HR database)

The shared HR/recruiter database (`hr_contacts`) is organized by **sector**. We
use a fixed list of **15 sectors** — granular enough to match a recruiter to a
customer's goal, broad enough that each sector holds a useful number of
contacts. This roughly mirrors LinkedIn's industry grouping plus the Vision 2030
giga-project map.

## How to use this
- Every `hr_contacts.sector` and `employers.sector` value must be one of the
  **slugs** below (lowercase, stable). Names are localized in the app.
- **Don't spread the research evenly.** Fill high-priority sectors first — that's
  where the early customers (finance / consulting / investment) are aiming.
- **Target HR count** is the launch goal per sector (verified contacts with a
  LinkedIn profile). Grow over time; quality and `verified_at` freshness beat raw
  volume.

## The 15 sectors

| Slug | العربية | English | Priority | Target HR | Anchor employers |
|---|---|---|---|---|---|
| `investment_finance` | الاستثمار والتمويل | Investment & Finance | 1 | 45 | PIF, SNB, Al Rajhi, Tadawul, SAB, Riyad Bank |
| `consulting` | الاستشارات والخدمات المهنية | Consulting & Professional Services | 1 | 45 | McKinsey, BCG, Bain, Deloitte, PwC, EY, KPMG, Strategy& |
| `energy_petrochem` | الطاقة والبتروكيماويات | Energy & Petrochemicals | 1 | 45 | Aramco, SABIC, ACWA Power, Luberef |
| `gigaprojects_realestate` | المشاريع الكبرى والعقار والإنشاء | Giga-projects, Real Estate & Construction | 1 | 45 | NEOM, Roshn, Red Sea Global, Qiddiya, Diriyah, Bechtel |
| `government` | الحكومة والقطاع العام | Government & Public Sector | 1 | 40 | Ministries, RCU, GEA, SDAIA, MISA, Monsha'at |
| `telecom_it` | الاتصالات وتقنية المعلومات | Telecom & IT | 2 | 30 | stc, Mobily, Zain, Tonomus, AWS, Microsoft, Google |
| `tech_startups` | التقنية والشركات الناشئة | Tech & Startups | 2 | 30 | Tamara, Jahez, Salla, STV portfolio, Tabby |
| `healthcare_pharma` | الصحة والأدوية | Healthcare & Pharma | 2 | 30 | MOH, KFSHRC, Seha Virtual, Nupco, Lifera |
| `manufacturing_mining` | الصناعة والتعدين | Manufacturing & Mining | 2 | 30 | Ma'aden, Alfanar, Tasnee, industrial cities |
| `transport_logistics` | النقل واللوجستيات | Transport & Logistics | 2 | 30 | Saudia, Riyadh Air, Bahri, SAR, Aramex, ports |
| `tourism_entertainment` | السياحة والترفيه والضيافة | Tourism, Entertainment & Hospitality | 3 | 20 | SEVEN, GEA, Red Sea hotels, Boutique Group |
| `retail_fmcg` | التجزئة والسلع الاستهلاكية | Retail & FMCG | 3 | 20 | Cenomi, Almarai, Savola, Panda, Nestlé |
| `aerospace_defense` | الطيران والدفاع | Aerospace & Defense | 3 | 20 | SAMI, GAMI, Lockheed (local), Boeing (local) |
| `education_training` | التعليم والتدريب | Education & Training | 3 | 20 | KAUST, KFUPM, TVTC, Misk, Elm |
| `insurance` | التأمين | Insurance | 3 | 15 | Bupa Arabia, Tawuniya, Walaa, CHI |

**Launch total target: ~465 verified HR contacts.** Start with the five
priority-1 sectors (~220) before touching the rest.

## Research workflow (per sector)
1. On LinkedIn, search the anchor employers + titles: "Talent Acquisition",
   "Recruiter", "HR Business Partner", "People & Culture", "اكتساب المواهب".
2. Capture: name, title, company, LinkedIn URL, sector slug, `source`.
3. Only **business** contact data (PDPL): no personal emails/phones. Set
   `verified_at` when you confirm the person is current in the role.
4. Track progress against the target per sector (the `sectors` table stores the
   target; a grouped count of `hr_contacts` gives the actual — see the
   `sector_progress` view).
