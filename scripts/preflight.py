"""Offline source, fixture and asset integrity checks; stdlib only."""
import calendar, hashlib, json, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
for path in ["BUILD-PROMPT.txt","CLAUDE.md","package-lock.json","docs/handoff/03_CALCULATION_MODEL.md","docs/jira/BFC-56620.md","docs/jira/BFC-56885.md","sources/zodiac-sign-pages-wireframe(1).html","sources/zodiac-strength-copy-review(2).html"]:
    assert (ROOT/path).is_file(),"Missing "+path
messages=json.loads((ROOT/"data/approved-sign-messages.json").read_text())
assert len(messages)==12 and sum(len(v) for v in messages.values())==48
jira=(ROOT/"docs/jira/BFC-56885.md").read_text()
assert all(t in jira for v in messages.values() for t in v.values())
palettes=json.loads((ROOT/"data/calendar-palettes.json").read_text())
assert all(v is None for v in palettes["Cancer"].values()),"Do not invent Cancer calendar colours"
for year in (2026,2027,2028):
    data=json.loads((ROOT/f"data/sign-levels-{year}.json").read_text());n=366 if calendar.isleap(year) else 365
    assert len(data["signs"])==12
    for sign,entry in data["signs"].items():
        assert len(entry["dates"])==n and sum(entry["counts"].values())==n
        assert len({r["date"] for r in entry["dates"]})==n
        assert all(set(r)=={"date","level"} for r in entry["dates"]),"No component totals in frontend fixtures"
        assert {k:sum(r["level"]==k for r in entry["dates"]) for k in entry["counts"]}==entry["counts"]
assets=json.loads((ROOT/"references/figma/asset-manifest.json").read_text())
assert not [r for r in assets["assets"] if "error" in r],"Failed asset downloads"
for a in assets["assets"]:
    p=ROOT/a["path"];assert p.is_file()
    assert hashlib.sha256(p.read_bytes()).hexdigest()==a["sha256"],a["path"]
print("PASS: source files, 48 approved messages, TBD preservation, 2026–2028 fixtures and asset hashes.")
print("This does not certify the future HTML mockup or access in another environment.")
