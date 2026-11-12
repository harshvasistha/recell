# Recell current state

## PayU migration — 2026-10-09
Implemented on `codex/payu-hosted-checkout`; awaiting owner-side Firebase deployment and production frontend release.
Firebase project is `recell-new`, region `asia-south1`; live merchant key and salt secrets were saved by the owner.
See [PAYU_DEPLOYMENT.md](PAYU_DEPLOYMENT.md) for the deployment sequence, webhook URL and acceptance checks.

Keep existing React/Vite, AWS Amplify, Firebase Auth/Firestore/Cloud Functions architecture.

## Manual UPI options — 2026-10-09
Added the supplied Canara Bank QR (`120039128600@cnrb`) and separate `atul.rathore@payu.in` option alongside PayU and COD. Customer provides a 12-digit UPI reference; manual UPI orders remain unpaid/Awaiting Payment until merchant review. Admin orders display destination and reference. Supplied QR image is copied unchanged.
Deploy updated Firestore rules before releasing the frontend: `firebase deploy --only firestore:rules --project recell-new`.
Manual payment confirmation requires matching bank receipt; a customer reference is not proof. Use Firebase console admin operations to confirm payment after reconciliation; no automated verification exists for these manual addresses.

## Removed manual PayU-address UPI option — 2026-10-13
Removed `atul.rathore@payu.in` from checkout. Canara QR, PayU Hosted Checkout and COD remain available. Legacy order type retained for historical records. Deploy rules to reject new submissions using the removed manual address: `firebase deploy --only firestore:rules --project recell-new`.

## Payment failure and automatic sold inventory — 2026-10-25
Prepared on `codex/payment-inventory-fix`; NOT deployed yet. Fixed PayU v1 transaction IDs (32 → 24 characters), SPA return-reference loss, auth-restoration timing and customer field limits. Added atomic/idempotent stock allocation on captured payment, confirmed COD and trusted manual payment confirmation, live catalog subscriptions, sold-out filtering, and stale-admin-edit protection. Preserves sold device/order history. Node runtime updated to 22.
See [PAYMENT_INVENTORY_FIX.md](PAYMENT_INVENTORY_FIX.md) for backend-first deployment, validation, live acceptance steps and historical-stock review limitations. Successful live payment still requires customer authorization and merchant-side confirmation; endpoint availability alone is not a completed payment test.
