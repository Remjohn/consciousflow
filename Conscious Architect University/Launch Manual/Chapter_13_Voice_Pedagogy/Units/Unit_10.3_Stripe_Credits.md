# Unit 10.3: Stripe Credits — Pay-Per-Use Economics

## 🧠 THE SCIENCE (154 words)

**UNLEARN:** Monthly subscriptions are the standard for elective software. In the era of high-compute agentic architectures, subscriptions are a "leakage trap" that decouples financial time from physical energy. 

Consider the thermodynamics of compute: every inference cycle (LLM turn), every video frame rendered via ComfyUI, and every voice-to-text transcription represents a measurable expenditure of Joules on a GPU. If you charge a flat $29/month, you are vulnerable to "adverse selection"—users who consume $200 of compute while paying $29, effectively taxing your system toward insolvency.

Think of it like the biological metabolic cost of ATP (Adenosine Triphosphate). Your body doesn't "subscribe" to energy; it manages a precise credit balance of glucose. Every muscular contraction (agent turn) consumes ATP. When the balance is low, the system triggers a "pessimistic halt" (fatigue), protecting the core from total failure. In the CCP, credits ARE the metabolic glucose that sustains the agentic soul.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The sovereign CCP architecture uses Stripe not as an "always-on" subscription engine, but as a decoupled distributed ledger. In 2026, this is achieved through two primary primitives: **Stripe Meters** and **Stripe Credit Grants**.

**Stripe Meters** act as high-throughput event ingestors. When an agent completes a task, the CCP emits a usage event (e.g., `tokens_used: 1540`, `gpu_seconds: 45`). Stripe aggregates these events in real-time, removing the need for a local, high-write database to track every micro-transaction.

**Stripe Credit Grants** (`stripe.billing.CreditGrant`) manage the "pre-paid block" model. When a client purchases a "Power Pack," the CCP issues a Credit Grant. Stripe’s billing engine automatically handles the "burn-down" logic, applying the credit grant against the metered usage until the balance is zero.

Security is enforced via **HMAC-SHA256 Webhook Signatures**. Every credit top-up must be verified using the `stripe.Webhook.construct_event` method, ensuring the payload hasn't been intercepted or forged. To prevent "double-spending" or duplicate credit allocations, we implement **Idempotency Keys** using the Stripe `event.id`. If a webhook is retried due to network lag, the CCP checks the `ReceiptChain` for the existing `event.id` before mutating the client's balance. This "Receipt Chain" protocol (FR21) ensures that every financial movement is cryptographically anchored to its originating event, providing a tamper-proof audit trail for both coach and client.

## 📂 OUR CODE (182 words)

- `src/ccp/services/client_onboarding.py` line 29:
  ```python
  # WHY: Initializing the ReceiptChain at onboarding ensures that the very first
  # credit allocation (the 'Welcome Gift') is anchored to a cryptographic hash.
  self.receipt_chain = ReceiptChain(coach_acronym=self.coach_acronym)
  ```
- `src/ccp/services/failure_prevention_gates.py` line 75:
  ```python
  # WHY: The Gatekeeper must track more than just structural failures; 
  # it must serve as the 'Metabolic Guard' (Gate 0) that halts pipeline 
  # execution BEFORE spinning up expensive GPU instances if credits < threshold.
  def __init__(self, coach_acronym: str, receipt_chain: Optional[ReceiptChain] = None):
  ```
- `src/ccp/services/receipt_chain_guard.py` line 153:
  ```python
  # WHY: Handoff verification is where we intercept Stripe event.id mismatches.
  # If the receipt hash from the webhook intake doesn't match the downstream 
  # expectations, the circuit breaker (line 228) trips, preventing fraud.
  def verify_handoff(self, payload: dict[str, Any], ...):
  ```

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code / Pi:**
> I need to extend `src/ccp/services/failure_prevention_gates.py` to include a "Gate 0: Financial Guard." 
> Create a new service at `src/ccp/services/stripe_credit_service.py` that uses `stripe.billing.CreditGrant.list` to retrieve a client's available balance. 
> Then, modify the `FailurePreventionGates.ingest` method in `failure_prevention_gates.py` to call this service. If the `available_balance` is less than 100 ($1.00), the gate must raise a `ValueError("Insufficient Credits: Batch Halted")` to prevent GPU waste.
> Use the existing `receipt_chain.log` to record the 'financial_gate_check' action. 
> Ensure you use `stripe.api_key` from the environment variable `STRIPE_SECRET_KEY`.

## ⌨️ TERMINAL (64 words)

```bash
# Install the Stripe SDK
pip install stripe

# Login to the Stripe CLI
stripe login

# Listen for webhook events locally and forward to our FastAPI backend
stripe listen --forward-to localhost:8000/api/v1/webhooks/stripe

# Expected: > Ready! Your webhook signing secret is whsec_...

# Trigger a test credit-purchase success event
stripe trigger checkout.session.completed
```

## ✅ IMPLEMENTATION STEPS (165 words)

1.  **Stripe Setup:** Log in to the [Stripe Dashboard](https://dashboard.stripe.com) and create a **Meter** named "Agent Credits" with the unique ID `agent_credits_meter`.
2.  **Product Creation:** Create a "Credit Pack" Product. Link it to a Price (e.g., $10.00 for 1000 credits).
3.  **Service Creation:** Paste the prompt from Section 4 into your Claude Code session to generate `stripe_credit_service.py`.
4.  **Wiring the Gate:** Open `src/ccp/services/failure_prevention_gates.py`. In the `ingest` method (line 91), add the call to your new `StripeCreditService` before processing axis results.
5.  **Webhook Integration:** Open `src/ccp/api/webhooks.py` (build required if missing) and implement the `handle_stripe_webhook` function using `stripe.Webhook.construct_event`. 
6.  **Idempotency Check:** Inside the webhook handler, call `receipt_chain_guard.check_ghost_variables` to ensure the `event.id` hasn't been processed previously.
7.  **Environment Sync:** Add your `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to your local `.env` file.

## ✅ VERIFY (42 words)

Run `stripe trigger checkout.session.completed` while your dev server is active. Check `receipt_chain.json`. Can you see a `receipt_generated` entry for the Stripe event ID with a `total_balance` increase? → **Yes/No**. Binary Check: Successful Stripe Webhook = Balance Increment.

## 🔗 BRIDGE (36 words)

Unit 10.4 builds on this financial foundation by implementing the **Full Onboarding Flow**, where the initial credit grant we just defined is automatically provisioned for every new client who completes their first voice note.

<!-- FACT-CHECK: "Stripe Credit Grants API 2026" → Confirmed available as part of Stripe Billing. Method: stripe.billing.CreditGrant.create. -->
<!-- FACT-CHECK: "Stripe Meters 2026" → Active, supports high-throughput usage events for metered billing. -->
