# Masaar — CV Competitiveness Score (rubric v0)

The score answers: **how competitive is this CV for *this specific role*** — and
**what raises it**. It is deliberately conservative. Better to under‑promise.

## Principles
1. **Role‑specific.** The same person scores differently for "Investment
   Analyst" vs "Senior Portfolio Manager." Always score against a target role.
2. **Experience > certifications > degree alone.** Anchor example (finance):
   `5y experience + finance degree` > `fresh grad + finance degree + CFA1` >
   `fresh grad + finance degree`.
3. **Where you worked matters.** Employer prestige weights heavily — 2y at PIF
   can beat 5y somewhere unknown (see `employers.prestige_tier/weight`).
4. **How you describe your work matters.** Strong, quantified bullets ("led a
   30‑person team, cut downtime 18%, saved 2M SAR/yr") score far above vague
   ones ("worked at Aramco doing tasks"). This gives *instant* value: rewrite
   and the score moves today, no waiting for a certification.
5. **Conservative.** When uncertain, score lower. An inflated score destroys
   trust with anyone who knows the market.

## Components (weights are a starting point, tune with real data)
| Component | Weight | What it measures |
|---|---|---|
| Experience (relevance + years) | 0.35 | Years × relevance to the target role |
| Employer prestige | 0.20 | Weighted by `employers` tier |
| Writing quality | 0.15 | Quantification, ownership verbs, specificity |
| Certifications | 0.15 | Role‑relevant, completed > in‑progress |
| Education | 0.15 | Degree fit + university tier |

`overall = round(100 * Σ(weight_i * component_i))`, each component in [0,1].

## Improvements (the actionable part)
For each plausible next step, estimate the delta and effort:
```json
[
  {"action": "Complete CFA Level 1", "delta": 15, "effort": "3–6 months", "category": "certifications"},
  {"action": "Rewrite top 3 bullets with metrics", "delta": 8, "effort": "30 minutes", "category": "writing_quality"},
  {"action": "Add 2 years relevant experience", "delta": 10, "effort": "2 years", "category": "experience"}
]
```
The UI renders these as "60 → 75" steps, sorted by effort‑to‑impact so the
cheapest win (usually rewriting) is surfaced first.

## Workflow (MVP: human‑in‑the‑loop)
1. Extract CV text (`unpdf`) → structured `parsed` JSON.
2. Claude scores against the target role using this rubric, returns sub‑scores +
   improvements + reasoning.
3. **You review/edit in the admin queue**, then publish.
4. Track `rubric_version` so old scores are comparable as the rubric evolves.

## Workflow (later: automated)
Same prompt, auto‑published above a confidence threshold; below it, falls back
to the admin queue. The human stays in the loop for edge cases.
