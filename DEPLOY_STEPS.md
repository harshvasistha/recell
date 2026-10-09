# Recell deployment

The payment gateway migration now uses PayU Hosted Checkout with live credentials in Firebase secrets.

Follow [docs/PAYU_DEPLOYMENT.md](docs/PAYU_DEPLOYMENT.md) for the current backend-first deployment sequence, webhook configuration and live verification checks.

Firebase project: `recell-new`. Region: `asia-south1`.
Do not deploy the frontend until the PayU backend functions and Firestore rules have deployed successfully.
Historical Razorpay records remain readable; the legacy callable endpoints reject new payments.
