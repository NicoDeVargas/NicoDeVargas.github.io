#!/usr/bin/env python3
"""Baixa as gravuras do Doré (Wikimedia Commons, domínio público), recorta e
recolore em violeta. Saída: assets-src/colored/<nome>.png (mestres em alta).

Depois rode `node scripts/build-images.mjs` para gerar AVIF/WebP responsivos.

Uso: python3 scripts/process-images.py [nome ...]
"""
from pathlib import Path
import sys
import urllib.request

from PIL import Image, ImageFilter, ImageOps

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
ORIG = ROOT / "assets-src" / "originals"
OUT = ROOT / "assets-src" / "colored"
UA = "portfolio-build/1.0 (contato.nicodevargas@gmail.com)"

INK, MID, PAPER = "#3b2bb8", "#8f84e0", "#fbf8ec"

# nome -> (arquivo local, url, recorte em frações (x0, y0, x1, y1), ampliação)
PLATES = {
    "hippogriff": (
        "hippogriff.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/"
        "Orlando_Furioso_hippogriff_battle.png/3840px-Orlando_Furioso_hippogriff_battle.png",
        (0.012, 0.0, 0.988, 0.95),
        1.0,
    ),
    "paradise": (
        "paradise.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/9/9d/Paradise_Lost_12.jpg",
        (0.02, 0.005, 0.98, 0.94),
        1.0,
    ),
    # Só existe em 930 px no Commons: amplia 2x com Lanczos + nitidez leve.
    "idylls": (
        "idylls.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/c/c9/Idylls_of_the_King_14.jpg",
        (0.018, 0.012, 0.982, 0.935),
        2.0,
    ),
    "orlando9": (
        "orlando9.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/e/e2/Orlando_Furioso_9.jpg",
        (0.025, 0.02, 0.975, 0.945),
        1.0,
    ),
    # Rodapé: "Lavanderas; bords du Tage, environs de Tolède" (L'Espagne, 1874).
    "tage": (
        "tage.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/5/5b/"
        "%22Lavanderas_%28laveuses%29%3B_bords_du_tage%2C_environs_de_Tol%C3%A8de%22_%2819314442854%29.jpg",
        (0.055, 0.035, 0.952, 0.872),
        1.0,
    ),
}


def fetch(name: str, url: str) -> Path:
    path = ORIG / name
    if not path.exists():
        ORIG.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req) as r:
            path.write_bytes(r.read())
    return path


# Pontos de branco por prancha: o papel amarelado vira o creme exato do site
# (importante no rodapé, onde a gravura "nasce" do papel).
WHITEPOINT = {"tage": 226}


def colorize(gray: Image.Image, whitepoint: int = 255) -> Image.Image:
    return ImageOps.colorize(
        gray, black=INK, mid=MID, white=PAPER, whitepoint=whitepoint, midpoint=min(127, whitepoint // 2)
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    for name, (fname, url, box, up) in PLATES.items():
        if only and name not in only:
            continue
        src = fetch(fname, url)
        im = Image.open(src).convert("L")
        w, h = im.size
        x0, y0, x1, y1 = box
        im = im.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
        if up != 1.0:
            im = im.resize((round(im.width * up), round(im.height * up)), Image.LANCZOS)
            im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
        colorize(im, WHITEPOINT.get(name, 255)).save(OUT / f"{name}.png", optimize=False)
        print(f"{name}: {im.width}x{im.height}")

    # Foto do "Sobre": duotone com a mesma paleta.
    if only and "avatar" not in only:
        return
    avatar = Path("/home/nico/Documentos/Dev/NicoDeVargas/assets/avatar.jpg")
    if avatar.exists():
        a = ImageOps.exif_transpose(Image.open(avatar)).convert("L")
        a = ImageOps.autocontrast(a, cutoff=1)
        colorize(a).save(OUT / "avatar.png")
        print(f"avatar: {a.width}x{a.height}")


if __name__ == "__main__":
    main()
