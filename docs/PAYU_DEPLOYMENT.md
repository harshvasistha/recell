# Recell PayU Hosted Checkout

Project: `recell-new`. Region: `asia-south1`. Production storefront: https://recell.co.in.

## Implemented
- Online payment choice uses PayU's live `_payment` hosted checkout; COD remains available.
- Firebase callable creates the online order using product IDs and prices from `system/catalog`, verifies stock availability and shipping details, and stores an immutable private session with Firebase Auth ownership.
- Merchant key/salt are bound through Firebase secrets. Salt never goes to the browser.
- Callback/webhook validates SHA-512 reverse hash, transaction ID, shipping identity, product info and amount before reconciliation.
- Verify Payment API must report `success` and `captured` with matching transaction/amount before an atomic transaction confirms the order and records payment. Repeat callbacks are idempotent.
- Return banner checks server status using the signed-in customer's account; URL query parameters cannot prove payment.
- Legacy Razorpay endpoints remain deployed but reject new use, and the unused client integration/SDK is removed. Historical order/payment data is preserved.
- Firestore rules deny client-created PayU orders and all private session/payment writes.

## Deployment sequence (PowerShell in the repo)

Deploy the backend and rules before merging the frontend branch into the Amplify production branch.

```powershell
firebase login
npm --prefix functions ci
npm --prefix functions run build
node --test functions/tests/payuProtocol.test.cjs
firebase deploy --only "functions:createPayuCheckout,functions:verifyPayuPayment,functions:payuCallback,functions:payuWebhook,functions:createRazorpayOrder,functions:verifyRazorpayPayment,firestore:rules" --project recell-new
```

Required secrets (already created by the owner): `PAYU_MERCHANT_KEY`, `PAYU_MERCHANT_SALT`.
Ensure these are live credentials and Firebase project billing permits Cloud Functions deployment.
No PayU salt or secret should be added to Amplify build variables.

Configure success and failure payment webhooks in the PayU live dashboard with this URL:

https://asia-south1-recell-new.cloudfunctions.net/payuWebhook

The callback URLs are sent with each checkout request:
https://asia-south1-recell-new.cloudfunctions.net/payuCallback

Confirm deployment output exposes both HTTP functions to PayU/browser requests (public invocation). Callable checkout/verification still enforce Firebase Auth inside the handlers. PayU merchant account/domain must be approved for live transactions.

After backend deployment, merge the branch to the production-connected branch and wait for Amplify's frontend build to finish. If backend deployment fails, do not publish the frontend yet.

## Acceptance checks after deployment
1. Sign in as a customer; open checkout, enter shipping details and select PayU.
2. Confirm displayed PayU amount equals catalog total; complete an owner-authorized payment.
3. Return to Recell and confirm verified payment banner, one confirmed order and one matching payment record. Cross-check merchant dashboard.
4. Cancel/fail a checkout: no Paid order or SUCCESS record should appear.
5. Deliver/replay the webhook: no duplicate payment/history and no status downgrade.
6. Check COD still creates an unpaid order without opening PayU.
7. Confirm logged-out and different-account verification are rejected.
8. If verification is pending/unavailable, customer sees a check-again message; never assume payment failed or pay twice.

## Verification and limits
Frontend TypeScript and production build, Functions TypeScript build and four payment protocol tests are run before publishing the branch. Tests cover request/reverse hashes, tampering, additional charges and captured amount/transaction matching.
Live Firebase deployment and end-to-end merchant transactions cannot be executed from the chat's local GitHub checkout without Firebase credentials. CLI login on the owner's computer does not authenticate the chat environment.
Stock availability is checked at checkout; this change does not add inventory reservation or refunds. Existing order tracking read permissions remain unchanged. An abandoned checkout remains Awaiting Payment; do not fulfill it until verified Paid. The catalog must exist in Firestore; local seed-only products cannot be paid online.
