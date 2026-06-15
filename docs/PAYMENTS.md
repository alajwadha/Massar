# Masaar — Payments (Moyasar) & Go-Live

The marketing site sells the product end to end: pricing → checkout → real
payment → verification → unlock. The integration is **code-complete**; it just
needs your Moyasar keys to take live payments.

## Flow
1. **Pricing** (`/#pricing`) — Starter (199 SAR) / Pro (499 SAR), buttons link to
   `/<locale>/checkout?plan=starter|pro`.
2. **Checkout** (`src/app/[locale]/checkout/page.tsx`) — renders the Moyasar
   hosted payment form (`CheckoutForm`) with **mada, cards, STC Pay**. Amounts are
   in halalas (SAR × 100) from `src/lib/plans.ts`.
3. Moyasar processes the payment and redirects to the **callback**
   `/<locale>/checkout/success?id=<paymentId>`.
4. **Success page** calls **`/api/payments/verify?id=…`**, which re-fetches the
   payment from Moyasar with the **secret key** and confirms `status === "paid"`
   (never trusts the client). On success it shows "Payment successful" → Get
   started; on failure, a retry path.

## What you need to go live
1. A **Moyasar account** (moyasar.com) — requires a Saudi commercial registration
   (CR). Create it under the entity that will collect revenue.
2. From the Moyasar dashboard, copy your **publishable** and **secret** API keys.
3. Set environment variables (locally in `.env.local`, and in Vercel project
   settings):
   ```
   MOYASAR_PUBLISHABLE_KEY=pk_live_xxx        # safe to expose; used in the form
   MOYASAR_SECRET_KEY=sk_live_xxx             # server-only; used to verify
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # for the absolute callback URL
   ```
   Until these are set, checkout shows a clear "payment not configured" notice
   instead of breaking — the rest of the site works normally.
4. **Apple Pay** needs extra setup (Apple merchant ID + a domain-association file
   from Moyasar). It's intentionally left out of the default methods
   (`creditcard`, `stcpay`) so the form works immediately; enable it in
   `CheckoutForm` once the Apple merchant is configured. **mada runs through the
   card method** and works out of the box.

## Test mode
Use Moyasar **test keys** (`pk_test_…`, `sk_test_…`) and their test card numbers
to run the full flow without real charges before going live.

## Unlock after payment (next step)
The verify route has a marked `TODO`: once Supabase is wired (Phase 1), on a
`paid` result we record the payment row, set the buyer's `plan`, and route them
into onboarding. Today the success page confirms payment and links to `/app`.
