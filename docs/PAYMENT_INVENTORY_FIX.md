# Payment and sold inventory repair — 2026-10-25

## Findings and changes

- PayU Hosted Checkout `_payment` specifies max 25 characters for `txnid` (https://docs.payu.in/reference/addl_info-payment-apis). Existing code generated 32 hex characters. New checkouts generate 24 characters (96 random bits). Verification and return UI still accept legacy 32-character references.
- SPA route synchronization removed `payu_txn` immediately after return; subsequent renders could hide the verification banner. Route sync now preserves valid references, and the banner retains its initial reference.
- Checkout waits for Firebase Auth restoration and gives an explicit expired-session error instead of sending an unauthenticated payment request.
- PayU customer field limits are enforced; callbacks return directly to canonical www origin.
- PayU success reconciliation updates payment, order and inventory in one Firestore transaction, with a private per-order allocation ledger. Duplicate callbacks or triggers cannot decrement twice.
- `syncSoldInventory` handles confirmed COD and paid manual UPI/other orders. Pending/failed online payments and manual UPI reference submission do not consume stock. COD stock is allocated on acceptance rather than delivery so another customer cannot buy the same listed unit.
- Last unit sets `stockCount=0` and `inStock=false`. Products remain in admin history but disappear from public homepage, refurbished/open-box listings, related products and product checkout routes.
- Live catalog subscription updates open storefront/admin sessions. Server snapshots no longer trigger full-catalog writes. Explicit admin saves merge only changed fields in a transaction; stale stock edits reject instead of resurrecting sold items.
- Insufficient stock at capture time records the real payment and marks inventory `Review Required`; customer and admin see a stock-review message. Never mark an actually captured payment failed just because inventory is unavailable.
- Firebase runtime upgraded to Node 22; existing Node 20 is nearing decommission.

## Validation and limits

Frontend TypeScript and production build; Functions TypeScript build; 11 backend tests and 5 frontend utility tests. Covers transaction ID length/legacy verification, hashes/amount matching, duplicate allocations, remaining-stock behavior, no negative stock, unpaid/failed policy, stale admin edits, and PayU return routing. Transaction tests use an in-memory adapter enforcing read-before-write; real Firestore concurrent retry behavior still needs deployment acceptance testing.

Live checks: the public catalog contains four one-unit devices; the deployed createPayuCheckout endpoint responds with expected UNAUTHENTICATED error without a customer session. This proves endpoint availability, not merchant credential validity or successful payment capture. Local browser connection timed out. No real customer payment or production inventory mutation was performed during this work.

No prepayment stock reservation is introduced: a checkout already opened before another buyer pays can still complete payment and enter stock review. Refunds/cancellations do not automatically restock serialized devices; verify physical availability before manual restock. No historical order backfill is run, because previous manual stock adjustments cannot be inferred safely. Review already-sold listings once at rollout.

## Deploy backend before frontend release

In PowerShell at `C:\Users\harsh vasistha\recell`:

```powershell
git fetch origin
git switch --track origin/codex/payment-inventory-fix
npm --prefix functions ci
$env:FUNCTIONS_DISCOVERY_TIMEOUT = "60"
firebase deploy --only "functions:createPayuCheckout,functions:verifyPayuPayment,functions:payuCallback,functions:payuWebhook,functions:syncSoldInventory" --project recell-new
```

If the branch already exists locally use `git switch codex/payment-inventory-fix` and `git pull --ff-only` instead of `--track`.
No new secrets are required. Existing PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT stay in Firebase Secret Manager. No Firestore rules changes are required; the default deny already protects inventory_allocations.

After deployment succeeds, merge this PR to main and verify Amplify's build succeeds. Close old admin tabs and reopen after release so they no longer execute the old full-catalog saving code. Other untouched functions still on Node 20 should be separately upgraded before the provider's decommission date.

## Live acceptance checks

Use an owner-authorized checkout/payment. Do not change a real device price merely to test a small charge.
1. Confirm PayU checkout opens with a 24-character transaction reference and correct server-derived amount.
2. Complete a payment: verify captured PayU transaction, Paid order, one payment record, one inventory allocation, and stock reduced once.
3. Recheck/replay callback and refresh: stock must not reduce again.
4. Verify last-unit listing disappears from storefront in another tab, while admin retains a Sold / Out of Stock record.
5. Test unpaid/cancelled PayU and manual UPI reference submission: inventory remains unchanged.
6. Confirm a COD order reduces available stock once; manually verified UPI changes stock only after trusted admin sets payment Paid.
7. Confirm a title/image edit in an older admin session does not reset server-reduced stock.
8. If PayU still fails, capture the exact screen error (no PIN/OTP), order reference and function error code. Use `firebase functions:log --only createPayuCheckout,verifyPayuPayment,payuCallback,payuWebhook --project recell-new`. The client may need to confirm live key/salt and approved merchant/domain status in their PayU dashboard.
