"""Text / SMS Agent.

Rule-based scam classifier. Scans for the classic scam signals (urgency,
threats, fake rewards, money/credential requests, brand impersonation) and
returns a 0-100 risk contribution plus human-readable reasons.

`scan_text()` is the reusable core — the Email and Job agents build on it.

NOTE: a fine-tuned classifier (e.g. DistilBERT) could drop in right here by
replacing `scan_text()` with a model call and mapping its label/probability to
a score; the rest of the pipeline is unchanged.
"""
import re

# category -> (points, list of trigger phrases)
SCAM_CATEGORIES: dict[str, tuple[int, list[str]]] = {
    "urgency": (18, [
        "urgent", "immediately", "act now", "as soon as possible", "asap",
        "within 24 hours", "within 48 hours", "expire", "expires", "suspended",
        "suspend", "limited time", "final notice", "last warning", "right away",
        "before it's too late", "account will be closed", "action required",
    ]),
    "threat": (22, [
        "legal action", "lawsuit", "arrest", "arrested", "police", "warrant",
        "court", "fine", "penalty", "blocked", "terminated", "deactivat",
        "criminal", "prosecut", "seized", "suspend your account",
    ]),
    "reward": (20, [
        "you have won", "you won", "congratulations", "prize", "lottery",
        "gift card", "free gift", "claim your", "reward", "voucher",
        "cash prize", "you have been selected", "winner", "redeem",
    ]),
    "money": (24, [
        "wire transfer", "send money", "bitcoin", "crypto", "western union",
        "moneygram", "processing fee", "transfer fee", "deposit", "bank transfer",
        "zelle", "venmo", "cashapp", "pay a fee", "advance payment", "gift card",
    ]),
    "credentials": (28, [
        "otp", "one-time", "one time code", "one-time code", "password", "pin",
        "verify your account", "confirm your identity", "ssn", "social security",
        "verify your identity", "banking details", "card number", "cvv",
        "login details", "update your payment", "confirm your account",
    ]),
    "impersonation": (16, [
        "bank", "irs", "hmrc", "tax refund", "customs", "support team",
        "security team", "microsoft", "apple", "amazon", "paypal", "netflix",
        "government", "social security administration", "your bank",
    ]),
}


def scan_text(text: str) -> dict:
    """Score `text` against the scam rulebook.

    Returns {"score": int, "reasons": [str], "categories": [str]}.
    """
    lowered = (text or "").lower()
    score = 0
    reasons: list[str] = []
    categories: list[str] = []

    for category, (points, phrases) in SCAM_CATEGORIES.items():
        hits = [p for p in phrases if p in lowered]
        if hits:
            categories.append(category)
            # first hit full points, extra hits worth a little more (capped)
            score += points + min(len(hits) - 1, 2) * 3
            sample = ", ".join(f"“{h}”" for h in hits[:2])
            reasons.append(f"{_LABELS[category]} detected ({sample})")

    # ALL-CAPS shouting is a weak extra signal
    letters = re.sub(r"[^A-Za-z]", "", text or "")
    if len(letters) > 15 and sum(c.isupper() for c in letters) / len(letters) > 0.6:
        score += 6
        reasons.append("Excessive use of capital letters (pressure tactic)")

    return {"score": min(score, 100), "reasons": reasons, "categories": categories}


_LABELS = {
    "urgency": "Urgency / pressure tactics",
    "threat": "Threats or intimidation",
    "reward": "Fake reward or prize bait",
    "money": "Request to send money / fees",
    "credentials": "Request for passwords, OTPs or personal data",
    "impersonation": "Impersonation of a trusted organisation",
}


def analyze(content: str, indicators: list[dict], demo_mode: bool = False) -> dict:
    result = scan_text(content)
    reasons = list(result["reasons"])
    score = result["score"]

    # An unsolicited message that contains a link is more suspicious.
    has_url = any(i["type"] == "url" for i in indicators)
    if has_url and result["categories"]:
        score = min(score + 10, 100)
        reasons.append("Message contains a link alongside pressure language")

    if not reasons:
        reasons.append("No known scam patterns detected in the message text")

    return {
        "agent": "Text/SMS Agent",
        "risk_score": score,
        "reasons": reasons,
        "categories": result["categories"],
    }
