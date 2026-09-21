"""LLM abstraction — Claude via the Anthropic SDK, with graceful degradation.

The whole app must run with NO API key and during API outages, so this module
never raises: `generate()` returns the model's text on success, or ``None`` on
any failure / when disabled. Callers always have a template fallback ready.
"""
from .config import settings

DEFAULT_SYSTEM = (
    "You are a senior cybersecurity threat analyst for ScamShield AI. "
    "You write concise, factual, plain-English threat explanations for a "
    "non-technical audience. Never invent indicators that were not provided. "
    "Do not use markdown headings; write 2-4 short sentences."
)

_client = None


def _get_client():
    global _client
    if _client is None:
        from anthropic import Anthropic  # imported lazily so it's optional

        _client = Anthropic(
            api_key=settings.ANTHROPIC_API_KEY,
            timeout=settings.LLM_TIMEOUT,
            max_retries=1,
        )
    return _client


def generate(
    prompt: str,
    system: str | None = None,
    max_tokens: int = 500,
    demo_mode: bool = False,
) -> str | None:
    """Return Claude's completion text, or None if unavailable/failed."""
    if demo_mode or not settings.llm_enabled:
        return None
    try:
        client = _get_client()
        msg = client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=max_tokens,
            system=system or DEFAULT_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        text = "".join(
            block.text for block in msg.content
            if getattr(block, "type", None) == "text"
        ).strip()
        return text or None
    except Exception:
        # Any error (bad key, rate limit, network, timeout) -> template fallback.
        return None
