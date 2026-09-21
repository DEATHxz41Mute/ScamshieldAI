"""Correlation Agent — the core differentiator.

Compares a freshly-analysed event against every previously stored event,
looking for shared strong indicators (phones, emails, domains, URLs, company
names) via exact + fuzzy matching. When two or more events share indicators
they are grouped into a Scam Campaign, and a human-readable explanation of the
link is produced.

The event being correlated must already be persisted (with its indicators) so
that DB queries can see it and exclude it by id.
"""
from rapidfuzz import fuzz

from ..models import Campaign, CampaignEvent, Event, Indicator

# Only strong, identifying indicators drive correlation (not generic keywords).
STRONG_TYPES = {"phone", "email", "domain", "url", "company"}
FUZZY_TYPES = {"domain", "company"}       # tolerate look-alikes / minor variants
FUZZY_THRESHOLD = 88

_TYPE_LABEL = {
    "phone": "phone number", "email": "email address", "domain": "domain",
    "url": "URL", "company": "company name",
}
# priority for naming a campaign after its most salient shared indicator
_NAME_PRIORITY = ["company", "domain", "phone", "email", "url"]


def _empty() -> dict:
    return {
        "related_count": 0, "related_event_ids": [], "shared_indicators": [],
        "campaign_id": None, "campaign_name": None, "explanation": None,
    }


def _derive_name(shared: list[dict]) -> str:
    by_type = {}
    for it in shared:
        by_type.setdefault(it["type"], it["value"])
    for t in _NAME_PRIORITY:
        if t in by_type:
            val = by_type[t]
            if t == "company":
                return f"{val} Impersonation Campaign"
            if t == "domain":
                return f"{val} Scam Network"
            if t == "phone":
                return f"Scam Ring · {val}"
            return f"Scam Campaign · {val}"
    return "Correlated Scam Campaign"


def correlate(db, event: Event, demo_mode: bool = False) -> dict:
    current = [i for i in event.indicators if i.indicator_type in STRONG_TYPES]
    if not current:
        return _empty()

    current_by_type: dict[str, list[str]] = {}
    for i in current:
        current_by_type.setdefault(i.indicator_type, []).append(i.indicator_value)

    others = (
        db.query(Indicator)
        .filter(Indicator.event_id != event.id,
                Indicator.indicator_type.in_(STRONG_TYPES))
        .all()
    )

    related_event_ids: set[int] = set()
    shared: dict[tuple[str, str], dict] = {}

    for oi in others:
        candidates = current_by_type.get(oi.indicator_type)
        if not candidates:
            continue
        ov = oi.indicator_value.lower()
        for cv in candidates:
            cvl = cv.lower()
            match = cvl == ov or (
                oi.indicator_type in FUZZY_TYPES
                and fuzz.token_sort_ratio(cvl, ov) >= FUZZY_THRESHOLD
            )
            if match:
                related_event_ids.add(oi.event_id)
                shared[(oi.indicator_type, cvl)] = {"type": oi.indicator_type, "value": cv}
                break

    if not related_event_ids:
        return _empty()

    shared_list = list(shared.values())
    all_ids = related_event_ids | {event.id}

    # ---- attach to an existing campaign or create a new one --------------
    existing = (
        db.query(CampaignEvent)
        .filter(CampaignEvent.event_id.in_(all_ids))
        .all()
    )
    campaign_ids = {link.campaign_id for link in existing}
    if campaign_ids:
        campaign = (
            db.query(Campaign)
            .filter(Campaign.id.in_(campaign_ids))
            .order_by(Campaign.id)
            .first()
        )
    else:
        campaign = Campaign(name="Correlated Scam Campaign", risk_score=0,
                            shared_indicators=[])
        db.add(campaign)
        db.flush()

    linked = {
        link.event_id for link in
        db.query(CampaignEvent).filter(CampaignEvent.campaign_id == campaign.id).all()
    }
    for eid in all_ids:
        if eid not in linked:
            db.add(CampaignEvent(campaign_id=campaign.id, event_id=eid))
    db.flush()

    # ---- recompute campaign aggregates -----------------------------------
    member_ids = [
        link.event_id for link in
        db.query(CampaignEvent).filter(CampaignEvent.campaign_id == campaign.id).all()
    ]
    members = db.query(Event).filter(Event.id.in_(member_ids)).all()
    campaign.risk_score = max((m.risk_score or 0) for m in members)

    merged: dict[tuple[str, str], dict] = {
        (si["type"], si["value"].lower()): si
        for si in (campaign.shared_indicators or [])
    }
    for it in shared_list:
        merged[(it["type"], it["value"].lower())] = it
    campaign.shared_indicators = list(merged.values())
    campaign.name = _derive_name(campaign.shared_indicators)
    campaign.explanation = _build_explanation(len(member_ids), campaign.shared_indicators)
    db.flush()

    return {
        "related_count": len(related_event_ids),
        "related_event_ids": sorted(related_event_ids),
        "shared_indicators": shared_list,
        "campaign_id": campaign.id,
        "campaign_name": campaign.name,
        "explanation": _build_explanation(len(related_event_ids) + 1, shared_list,
                                          for_event=True),
    }


def _build_explanation(event_count: int, shared: list[dict],
                       for_event: bool = False) -> str:
    parts = []
    for it in shared[:4]:
        parts.append(f"the same {_TYPE_LABEL.get(it['type'], it['type'])} "
                     f"“{it['value']}”")
    if not parts:
        shared_desc = "one or more common indicators"
    elif len(parts) == 1:
        shared_desc = parts[0]
    else:
        shared_desc = ", ".join(parts[:-1]) + f" and {parts[-1]}"

    if for_event:
        others = event_count - 1
        return (
            f"This event is linked to {others} previously detected "
            f"{'event' if others == 1 else 'events'} because they share "
            f"{shared_desc}. Together they form a coordinated cross-channel "
            f"scam campaign."
        )
    return (
        f"This campaign groups {event_count} events across multiple channels "
        f"that share {shared_desc}, indicating a single coordinated operation."
    )
