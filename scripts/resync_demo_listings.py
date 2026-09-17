"""Resync from Hostaway, then keep only currently curated listing IDs."""
import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "backend"
DEMO = ROOT / "book" / "public" / "demo-listings.json"

sys.path.insert(0, str(BACKEND))

from app.config import get_settings
from app.hostaway.listings_sync import sync_listings, get_cached_listings, get_last_sync_time


async def main() -> None:
    get_settings.cache_clear()

    current = json.loads(DEMO.read_text(encoding="utf-8"))
    keep_ids = {int(item["id"]) for item in current.get("listings", []) if item.get("id") is not None}
    print(f"Curated IDs to keep: {len(keep_ids)}")

    result = await sync_listings()
    print(f"Hostaway sync: {result}")

    all_listings = get_cached_listings()
    print(f"Hostaway total cached: {len(all_listings)}")

    curated = [listing for listing in all_listings if int(listing["id"]) in keep_ids]
    curated.sort(key=lambda item: (item.get("name") or "").lower())

    missing = keep_ids - {int(item["id"]) for item in curated}
    if missing:
        print(f"Warning: {len(missing)} curated IDs not returned by Hostaway: {sorted(missing)}")

    payload = {
        "count": len(curated),
        "lastSyncedAt": get_last_sync_time(),
        "listings": curated,
    }
    DEMO.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {DEMO} with {len(curated)} listings")


if __name__ == "__main__":
    asyncio.run(main())
