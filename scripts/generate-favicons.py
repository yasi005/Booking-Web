"""Regenerate transparent ZEUS favicons from public/zeus-logo.webp.

No black background — white mark on transparent pixels so the browser tab
chrome shows through. Small sizes use the bust crop; large sizes use full figure.

Do NOT write src/app/favicon.ico (Next.js Turbopack ICO decode issues).
"""
from __future__ import annotations

import struct
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
APP = ROOT / "src" / "app"


def content_bbox(img: Image.Image, threshold: float = 12.0, pad: int = 16) -> tuple[int, int, int, int]:
    bright = np.array(img.convert("RGB")).mean(axis=2)
    ys, xs = np.where(bright > threshold)
    return (
        max(0, int(xs.min()) - pad),
        max(0, int(ys.min()) - pad),
        min(img.width, int(xs.max()) + pad),
        min(img.height, int(ys.max()) + pad),
    )


def white_on_transparent(src: Image.Image, size: int, padding_ratio: float = 0.08) -> Image.Image:
    rgba = src.convert("RGBA")
    pix = np.array(rgba)
    brightness = pix[:, :, :3].mean(axis=2)
    mask = brightness > 18
    out = np.zeros((pix.shape[0], pix.shape[1], 4), dtype=np.uint8)
    out[mask, 0] = 255
    out[mask, 1] = 255
    out[mask, 2] = 255
    out[mask, 3] = 255
    src_t = Image.fromarray(out, "RGBA")

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pad = max(1, int(size * padding_ratio))
    box = size - pad * 2
    ratio = min(box / src_t.width, box / src_t.height)
    nw = max(1, int(src_t.width * ratio))
    nh = max(1, int(src_t.height * ratio))
    resized = src_t.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return canvas


def ico_bytes(images: list[Image.Image]) -> bytes:
    pngs: list[bytes] = []
    for image in images:
        if image.mode != "RGBA":
            image = image.convert("RGBA")
        buf = BytesIO()
        image.save(buf, format="PNG")
        pngs.append(buf.getvalue())

    count = len(pngs)
    header = struct.pack("<HHH", 0, 1, count)
    entries = b""
    offset = 6 + 16 * count
    blobs = b""
    for image, data in zip(images, pngs):
        side = image.width
        width = 0 if side >= 256 else side
        entries += struct.pack("<BBBBHHII", width, width, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
        blobs += data
    return header + entries + blobs


def main() -> None:
    logo = Image.open(PUBLIC / "zeus-logo.webp").convert("RGBA")
    figure = logo.crop((0, 0, logo.width, 800))
    full = figure.crop(content_bbox(figure))
    bust = full.crop((0, 0, int(full.width * 0.68), full.height))
    bust = bust.crop(content_bbox(bust, pad=12))

    white_on_transparent(full, 512, 0.08).save(APP / "icon.png", "PNG", optimize=True)
    white_on_transparent(full, 180, 0.08).save(APP / "apple-icon.png", "PNG", optimize=True)
    white_on_transparent(full, 192, 0.08).save(PUBLIC / "icon-192.png", "PNG", optimize=True)
    white_on_transparent(full, 512, 0.08).save(PUBLIC / "icon-512.png", "PNG", optimize=True)

    for size, name in ((16, "favicon-16.png"), (32, "favicon-32.png"), (48, "favicon-48.png")):
        white_on_transparent(bust, size, 0.06).save(PUBLIC / name, "PNG", optimize=True)

    (PUBLIC / "favicon.ico").write_bytes(
        ico_bytes([white_on_transparent(bust, size, 0.06) for size in (16, 32, 48)])
    )

    app_ico = APP / "favicon.ico"
    if app_ico.exists():
        app_ico.unlink()

    full.save(PUBLIC / "zeus-mark.png")
    bust.save(PUBLIC / "zeus-mark-bust.png")
    print("Regenerated transparent ZEUS favicons (no black background)")


if __name__ == "__main__":
    main()
