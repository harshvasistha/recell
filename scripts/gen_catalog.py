import json, re, sys

# ---- OPPO price table: (model, slug, [(storage, MOP, DP), ...]) ----
oppo = [
    ("OPPO A6X 4G", "oppo-a6x-4g", [("4GB+64GB", 12999, 12380)]),
    ("OPPO A6C 4G", "oppo-a6c-4g", [("4GB+64GB", 16999, 16189)]),
    ("OPPO A6X", "oppo-a6x", [
        ("4GB+64GB", 17999, 17142),
        ("4GB+128GB", 19999, 19046),
        ("6GB+128GB", 22999, 21904),
    ]),
    ("OPPO K14X", "oppo-k14x", [
        ("4GB+64GB", 17999, 17308),
        ("4GB+128GB", 19999, 19231),
        ("6GB+128GB", 22999, 22115),
    ]),
    ("OPPO A6s", "oppo-a6s", [
        ("4GB+128GB", 21999, 20951),
        ("6GB+128GB", 24999, 23809),
    ]),
    ("OPPO A6", "oppo-a6", [
        ("4GB+128GB", 26999, 25713),
        ("6GB+128GB", 28999, 27617),
        ("6GB+256GB", 31999, 30331),
    ]),
    ("OPPO A6 PRO", "oppo-a6-pro", [
        ("8GB+128GB", 32999, 31279),
        ("8GB+256GB", 35999, 34123),
    ]),
    ("OPPO FIND X9", "oppo-find-x9", [
        ("12GB+256GB", 74999, 70754),
        ("16GB+512GB", 84999, 80188),
    ]),
    ("OPPO RENO15 C", "oppo-reno15-c", [
        ("8GB+256GB", 41999, 39622),
        ("12GB+256GB", 44999, 42452),
    ]),
    ("OPPO RENO15", "oppo-reno15", [
        ("12GB+512GB", 55999, 52830),
    ]),
    ("OPPO RENO15 PRO MINI", "oppo-reno15-pro-mini", [
        ("12GB+256GB", 59999, 56603),
        ("12GB+512GB", 64999, 61320),
    ]),
    ("OPPO F33 PRO", "oppo-f33-pro", [
        ("8GB+128GB", 39999, 37735),
        ("8GB+256GB", 43999, 41508),
    ]),
    ("OPPO F33", "oppo-f33", [
        ("6GB+128GB", 34999, 33174),
        ("8GB+128GB", 36999, 35070),
        ("8GB+256GB", 39999, 37735),
    ]),
    ("OPPO FIND X9s", "oppo-find-x9s", [
        ("12GB+256GB", 79999, 74073),
        ("12GB+512GB", 89999, 83332),
    ]),
    ("OPPO FIND X9 ULTRA", "oppo-find-x9-ultra", [
        ("12GB+512GB", 169999, 157406),
    ]),
    ("OPPO RENO16 C", "oppo-reno16-c", [
        ("8GB+128GB", 46999, 44549),
        ("8GB+256GB", 49999, 46728),
        ("12GB+256GB", 55999, 52036),
    ]),
    ("OPPO RENO16", "oppo-reno16", [
        ("8GB+256GB", 61999, 57406),
        ("12GB+256GB", 67999, 62962),
    ]),
    ("OPPO PAD 5", "oppo-pad-5", [
        ("8GB+128GB", 29999, 27777),
        ("8GB+256GB", 34999, 32406),
    ]),
    ("OPPO K14", "oppo-k14", [
        ("6GB+128GB", 23999, 23076),
    ]),
]

# ---- Xiaomi / Redmi price table: (model, slug, no_discount, [(storage, SRP, NEP or None), ...]) ----
xiaomi = [
    ("Redmi A5", "redmi-a5", True, [("3GB+64GB", 8999, None), ("4GB+128GB", 9999, None)]),
    ("Redmi A7 4G", "redmi-a7-4g", True, [("3GB+64GB", 11499, None)]),
    ("Redmi A7 Pro 4G", "redmi-a7-pro-4g", True, [("4GB+64GB", 12499, None)]),
    ("Redmi 14C 5G", "redmi-14c-5g", True, [
        ("4GB+64GB", 9499, None), ("4GB+128GB", 10499, None), ("6GB+128GB", 11999, None),
    ]),
    ("Redmi 15C 5G", "redmi-15c-5g", True, [
        ("4GB+128GB", 16999, None), ("6GB+128GB", 18999, None), ("8GB+128GB", 20999, None),
    ]),
    ("Redmi 15A 5G", "redmi-15a-5g", True, [
        ("4GB+64GB", 14999, None), ("4GB+128GB", 15999, None), ("6GB+128GB", 17999, None),
    ]),
    ("Redmi 15 5G", "redmi-15-5g", True, [
        ("6GB+128GB", 20499, None), ("8GB+128GB", 22499, None), ("8GB+256GB", 24499, None),
    ]),
    ("Redmi Note 14 5G", "redmi-note-14-5g", False, [
        ("6GB+128GB", 16499, 15499), ("8GB+128GB", 16999, 15999), ("8GB+256GB", 18499, 17499),
    ]),
    ("Redmi Note 15 5G", "redmi-note-15-5g", False, [
        ("8GB+128GB", 26999, 24999), ("8GB+256GB", 29999, 27999),
    ]),
    ("Redmi Note 14 Pro 5G", "redmi-note-14-pro-5g", False, [
        ("8GB+128GB", 23999, 21999), ("8GB+256GB", 25999, 23999),
    ]),
    ("Redmi Note 15 Pro 5G", "redmi-note-15-pro-5g", False, [
        ("8GB+128GB", 31999, 28999), ("8GB+256GB", 34999, 31999),
    ]),
    ("Redmi Note 14 Pro+ 5G", "redmi-note-14-pro-plus-5g", False, [
        ("8GB+128GB", 28999, 26999), ("8GB+256GB", 30999, 28999), ("12GB+512GB", 33999, 31999),
    ]),
    ("Redmi Note 15 Pro+ 5G", "redmi-note-15-pro-plus-5g", False, [
        ("8GB+256GB", 39999, 36999), ("12GB+256GB", 41999, 38999), ("12GB+512GB", 44999, 41999),
    ]),
    ("Xiaomi 17T", "xiaomi-17t", False, [
        ("12GB+256GB", 59999, 54999), ("12GB+512GB", 64999, 59999),
    ]),
    ("Xiaomi 17", "xiaomi-17", False, [
        ("12GB+512GB", 89999, 82999),
    ]),
    ("Xiaomi 17 Ultra", "xiaomi-17-ultra", False, [
        ("16GB+512GB", 139999, 129999),
    ]),
]

# Specs gathered so far via WebFetch (brand official spec pages). Placeholder generic specs used until real ones fetched.
KNOWN_SPECS = {
    "oppo-a6x": {"screen": "6.72\" HD+ 120Hz LCD", "processor": "Snapdragon 685", "camera": "13MP Rear / 5MP Front", "battery": "6500mAh"},
    "oppo-a6c-4g": {"screen": "6.75\" HD+ 120Hz LCD", "processor": "UNISOC T7250", "camera": "13MP Rear / 5MP Front", "battery": "7000mAh, 15W"},
    "oppo-a6s": {"screen": "6.75\" HD+ 120Hz LCD", "processor": "MediaTek Dimensity 6300", "camera": "50MP+2MP Rear / 5MP Front", "battery": "6500mAh, 45W SUPERVOOC"},
    "oppo-a6": {"screen": "6.75\" HD+ 120Hz LCD", "processor": "MediaTek Dimensity 6300", "camera": "50MP+2MP Rear / 8MP Front", "battery": "7000mAh, 45W SUPERVOOC"},
    "oppo-a6-pro": {"screen": "6.75\" HD+ 120Hz LCD", "processor": "MediaTek Dimensity 6300", "camera": "50MP+2MP Rear / 16MP Front", "battery": "7000mAh, 80W SUPERVOOC"},
}

GENERIC_SPECS = {
    "Oppo": {"screen": "HD+/FHD+ 120Hz LCD/AMOLED Display", "processor": "Octa-Core Processor", "camera": "AI Multi-Camera System", "battery": "5000mAh+ with Fast Charging"},
    "Xiaomi": {"screen": "HD+/FHD+ 120Hz Display", "processor": "Snapdragon / Dimensity Octa-Core", "camera": "AI Multi-Camera System", "battery": "5000mAh+ with Fast Charging"},
}

def make_products(brand, entries, price_rule):
    out = []
    for entry in entries:
        if price_rule == "oppo":
            model, slug, variants = entry
            no_discount = False
            variants = [(s, mop, dp) for (s, mop, dp) in variants]
        else:
            model, slug, no_discount, variants = entry
            variants = [(s, srp, (srp if no_discount else nep)) for (s, srp, nep) in variants]

        specs = KNOWN_SPECS.get(slug, GENERIC_SPECS[brand])
        for storage, original_price, refurb_price in variants:
            ram = storage.split("+")[0]
            out.append({
                "id": f"{slug}-{storage.lower().replace('+','-').replace('gb','gb')}",
                "title": f"{model} ({storage})",
                "brand": brand,
                "model": model,
                "storage": storage,
                "color": "Assorted",
                "originalPrice": original_price,
                "refurbPrice": refurb_price,
                "conditionGrade": "Open Box",
                "warrantyMonths": 12,
                "brandWarrantyMonths": 12,
                "batteryHealthPercent": 100,
                "images": [],  # to be filled once real photos are uploaded -> /products/<slug>/N.jpg
                "imageFolder": f"/products/{slug}/",
                "inStock": True,
                "stockCount": 3,
                "serialImei": "",
                "inspectionPassed": True,
                "description": f"Open Box {model}. Sealed / like-new condition with full accessories and 12-Month Recell warranty.",
                "boxChargerIncluded": True,
                "isOpenBox": True,
                "specs": {
                    "screen": specs["screen"],
                    "processor": specs["processor"],
                    "ram": ram,
                    "camera": specs["camera"],
                },
            })
    return out

catalog = []
catalog += make_products("Oppo", oppo, "oppo")
catalog += make_products("Xiaomi", xiaomi, "xiaomi")

with open("/tmp/recell/src/data/catalog_rebuild.json", "w") as f:
    json.dump(catalog, f, indent=2)

print(f"Total variants: {len(catalog)}")
print(f"Distinct models: {len(oppo) + len(xiaomi)}")
