"""Regenerate favicons from public/zeus-logo.webp (header logo).

Small icons (16/32/48) use the Zeus bust (head + lightning) for clarity.
Large icons (180/192/512) use the full figure mark.

Note: do NOT put favicon.ico in src/app/ — Next.js Turbopack fails on many
ICO encodings. Use app/icon.png + public/favicon.ico instead.
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
BG = (17, 17, 17, 255)


def content_bbox(img: Image.Image, threshold: float = 12.0, pad: int = 16) -> tuple[int, int, int, int]:
    bright = np.array(img.convert("RGB")).mean(axis=2)
    ys, xs = np.where(bright > threshold)
    return (
        max(0, int(xs.min()) - pad),
        max(0, int(ys.min()) - pad),
        min(img.width, int(xs.max()) + pad),
        min(img.height, int(ys.max()) + pad),
    )


def fit_square_rgba(src: Image.Image, size: int, padding_ratio: float) -> Image.Image:
    rgba = src.convert("RGBA")
    pix = np.array(rgba)
    brightness = pix[:, :, :3].mean(axis=2)
    pix[:, :, 3] = np.where(brightness > 8, 255, 0).astype(np.uint8)
    src_t = Image.fromarray(pix)

    canvas = Image.new("RGBA", (size, size), BG)
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

    fit_square_rgba(full, 512, 0.08).convert("RGB").save(APP / "icon.png", "PNG", optimize=True)
    fit_square_rgba(full, 180, 0.08).convert("RGB").save(APP / "apple-icon.png", "PNG", optimize=True)
    fit_square_rgba(full, 192, 0.08).convert("RGB").save(PUBLIC / "icon-192.png", "PNG", optimize=True)
    fit_square_rgba(full, 512, 0.08).convert("RGB").save(PUBLIC / "icon-512.png", "PNG", optimize=True)

    for size, name in ((16, "favicon-16.png"), (32, "favicon-32.png"), (48, "favicon-48.png")):
        fit_square_rgba(bust, size, 0.06).convert("RGB").save(PUBLIC / name, "PNG", optimize=True)

    data = ico_bytes([fit_square_rgba(bust, size, 0.06) for size in (16, 32, 48)])
    (PUBLIC / "favicon.ico").write_bytes(data)

    # Next.js Turbopack cannot decode many ICO files in src/app/favicon.ico
    app_ico = APP / "favicon.ico"
    if app_ico.exists():
        app_ico.unlink()

    full.save(PUBLIC / "zeus-mark.png")
    bust.save(PUBLIC / "zeus-mark-bust.png")
    print(f"Regenerated favicons from {PUBLIC / 'zeus-logo.webp'}")


if __name__ == "__main__":
    main()
