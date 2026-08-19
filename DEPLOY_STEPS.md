# Recell — steps to finish deployment

Everything code-side is done and committed (auth security fix, locked-down
Firestore rules, real server-verified Razorpay payments). Once the commit is
on GitHub, AWS Amplify will auto-build and deploy the frontend on its own —
no action needed there. The steps below are the parts that need your own
account access (Firebase billing, Razorpay live keys) that nobody else can
do on your behalf.

Total time: about 10 minutes.

## 1. Upgrade Firebase to the Blaze plan (~2 min)

Cloud Functions need to call an external API (Razorpay), which requires the
pay-as-you-go Blaze plan. The free tier does not allow outbound network
calls from Functions.

1. Open https://console.firebase.google.com/project/gen-lang-client-0545966363/usage/details
2. Click **Modify plan** → **Blaze (Pay as you go)**.
3. Add a billing account / card if you don't already have one attached.

You won't be charged anything meaningful at this scale — Cloud Functions has
a generous free quota even on Blaze; you only pay for usage above it.

## 2. Deploy the locked-down Firestore rules and the payment backend (~5 min)

From a terminal on your own machine (not this sandbox — it can't reach
Firebase's API):

```bash
git clone https://github.com/harshvasistha/recell.git
cd recell
npm install -g firebase-tools   # if you don't already have it
firebase login                  # opens a browser to your Google account
```

Set the real Razorpay live keys as Cloud Functions secrets (never in a
committed file):

```bash
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
```

(Paste your live `rzp_live_...` key id and secret when prompted — get them
from https://dashboard.razorpay.com/app/keys if you don't have them handy.)

Then deploy:

```bash
firebase deploy --only firestore:rules,functions
```

This publishes the new Firestore rules (closing the open-database and
self-admin holes) and deploys `createRazorpayOrder` /
`verifyRazorpayPayment`.

## 3. Rotate two credentials that were exposed (~1 min)

- **Razorpay**: a *test*-mode secret key was previously committed to this
  public repo's git history (`.env.example`). It's now removed from the
  file, but git history still has it. Go to
  https://dashboard.razorpay.com/app/keys and regenerate your test key pair
  (your live keys are unaffected — they were never in the repo).
- **GitHub PAT**: the personal access token used to push these changes was
  pasted into a chat session. Regenerate it from GitHub → Settings →
  Developer settings → Personal access tokens, then delete the old one.

## 4. Verify end-to-end on the live site

1. Confirm Amplify shows a successful build for the latest commit
   (AWS Amplify Console → your app → shows build status automatically on
   every push).
2. On recell.co.in: sign up as a normal customer (phone or email) and
   confirm you get a `customer` role, not admin.
3. Sign in with your real admin phone (9310552055) or
   `admin@recell.in` and confirm you still land in the admin dashboard.
4. Place a real test order with a small amount using a live payment method,
   confirm the order shows `Paid` only after Razorpay actually completes
   the charge (check your Razorpay dashboard for the matching payment).
5. Try (from a private/incognito browser) directly hitting the Firestore
   REST API without logging in — it should now be rejected instead of
   returning your data. (Optional sanity check, not required.)

## Known trade-off, not fixed today (flagging, not blocking)

`orders` and `sell_requests` are readable by anyone without login, by
design — the storefront's "Track My Order" search relies on this (enter
your phone number, no account needed). That means someone who already knows
or guesses another customer's phone number could see their order/shipping
details. Fixing this properly means adding a real "search by phone" backend
endpoint instead of a client-side bulk fetch. Worth doing as a fast-follow,
not urgent enough to hold up today's launch.
