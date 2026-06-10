"""Generate professional placeholder screenshots for README and LinkedIn."""
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow not installed. Run: pip install Pillow")
    raise

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "screenshots"

PALETTE = {
    "bg": (250, 250, 247),
    "surface": (255, 255, 255),
    "gold": (201, 168, 76),
    "text": (26, 23, 16),
    "muted": (140, 132, 112),
    "border": (232, 228, 217),
    "info": (45, 95, 166),
    "danger": (217, 64, 64),
    "success": (45, 125, 82),
}

SCREENSHOTS = [
    ("banner.png", 1200, 320, "DRIVEN", "Fraud Detection Platform", "Enterprise Anti-Fraud Intelligence"),
    ("overview.png", 1200, 675, "Executive Overview", "Dashboard · KPIs · Risk Analytics", None),
    ("analytics.png", 1200, 675, "Fraud Analytics", "Alerts by Type · Time Series · Distribution", None),
    ("risk-monitoring.png", 1200, 675, "Risk Monitoring", "Transaction Surveillance · Score Engine", None),
    ("alerts.png", 1200, 675, "Alerts Center", "Real-Time Triage · Severity Scoring", None),
    ("ml-monitoring.png", 1200, 675, "ML Monitoring", "Model Drift · Inference Latency · KPIs", None),
    ("architecture.png", 1200, 675, "System Architecture", "Frontend · API · Data · ML Pipeline", None),
]


def draw_card(draw, x, y, w, h, title, color):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=12, fill=PALETTE["surface"], outline=PALETTE["border"])
    draw.rectangle([x, y, x + w, y + 44], fill=color)
    draw.text((x + 16, y + 12), title, fill=(255, 255, 255))


def generate(name, width, height, title, subtitle, tagline=None):
    img = Image.new("RGB", (width, height), PALETTE["bg"])
    draw = ImageDraw.Draw(img)

    try:
        font_lg = ImageFont.truetype("arial.ttf", 36)
        font_md = ImageFont.truetype("arial.ttf", 22)
        font_sm = ImageFont.truetype("arial.ttf", 16)
        font_xs = ImageFont.truetype("arial.ttf", 13)
    except OSError:
        font_lg = font_md = font_sm = font_xs = ImageFont.load_default()

    if name == "banner.png":
        draw.rectangle([0, 0, width, height], fill=(26, 23, 16))
        draw.rectangle([0, height - 6, width, height], fill=PALETTE["gold"])
        draw.text((60, 80), title, fill=PALETTE["gold"], font=font_lg)
        draw.text((60, 130), subtitle, fill=(255, 255, 255), font=font_md)
        if tagline:
            draw.text((60, 200), tagline, fill=PALETTE["muted"], font=font_sm)
        draw.text((60, height - 50), "Enterprise · Real-Time · ML-Ready", fill=PALETTE["muted"], font=font_xs)
        return img

    draw.text((40, 30), title, fill=PALETTE["text"], font=font_lg)
    draw.text((40, 75), subtitle, fill=PALETTE["muted"], font=font_sm)

    cards = [
        ("Total Alerts", "1,247", PALETTE["info"]),
        ("Critical", "89", PALETTE["danger"]),
        ("Avg Risk Score", "72.4", PALETTE["gold"]),
        ("Suspicious TX", "342", PALETTE["success"]),
    ]
    cw, ch, gap = 260, 120, 20
    start_x = 40
    for i, (label, value, color) in enumerate(cards):
        x = start_x + i * (cw + gap)
        draw_card(draw, x, 130, cw, ch, label, color)
        draw.text((x + 16, 170), value, fill=PALETTE["text"], font=font_md)

    draw.rounded_rectangle([40, 290, width - 40, height - 40], radius=12,
                           fill=PALETTE["surface"], outline=PALETTE["border"])
    draw.text((60, 320), "Replace with actual platform screenshot", fill=PALETTE["muted"], font=font_sm)
    draw.text((60, 350), f"Capture from http://localhost:5173 → save as screenshots/{name}", fill=PALETTE["muted"], font=font_xs)

    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for spec in SCREENSHOTS:
        name, w, h, title, subtitle, tagline = spec
        img = generate(name, w, h, title, subtitle, tagline)
        path = OUT / name
        img.save(path, "PNG", optimize=True)
        print(f"Created {path}")
    print(f"\nDone — {len(SCREENSHOTS)} screenshots in {OUT}")


if __name__ == "__main__":
    main()
