# Recell current state

## PayU migration — 2026-10-09
Implemented on `codex/payu-hosted-checkout`; awaiting owner-side Firebase deployment and production frontend release.
Firebase project is `recell-new`, region `asia-south1`; live merchant key and salt secrets were saved by the owner.
See [PAYU_DEPLOYMENT.md](PAYU_DEPLOYMENT.md) for the deployment sequence, webhook URL and acceptance checks.

Keep existing React/Vite, AWS Amplify, Firebase Auth/Firestore/Cloud Functions architecture.
