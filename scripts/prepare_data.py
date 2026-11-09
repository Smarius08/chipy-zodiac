"""BUILD TIME ONLY. Extract source data and generate BFC-56621 sign fixtures.
Python standard library only. Never embed this file in the delivered browser page.
"""
import calendar, collections, datetime as dt, json, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
LEVELS=["Quiet","Mixed","Strong","Strongest"]
WEEKDAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
EXPECTED=[[126,110,120,9],[0,30,293,42],[127,100,125,13],[13,65,252,35],[139,108,107,11],[137,104,112,12],[123,110,123,9],[70,100,169,26],[91,111,147,16],[119,94,139,13],[79,106,165,15],[81,101,167,16]]
def write(name,data):
    (ROOT/"data"/name).write_text(json.dumps(data,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
def extract(name,marker):
    text=(ROOT/"sources"/name).read_text(encoding="utf-8")
    return json.JSONDecoder().raw_decode(text.split(marker,1)[1].lstrip())[0]
def red(n): return 1+(n-1)%9
def level(sign,date):
    total=sum(map(int,str(date.day)+str(date.month)+str(date.year)))
    number=red(total)
    distance=min(min(abs(date.weekday()-WEEKDAYS.index(w)),7-abs(date.weekday()-WEEKDAYS.index(w))) for w in sign["lucky_days"])
    reduced={red(n) for n in sign["lucky_numbers"]}
    exact=total in sign["lucky_numbers"] or number in reduced
    score=3-distance+(2 if exact else (1 if min(abs(number-n) for n in reduced)==1 else 0))
    return "Quiet" if score<=1 else "Mixed" if score==2 else "Strong" if score<=4 else "Strongest"
def main():
    wire=extract("zodiac-sign-pages-wireframe(1).html","const DATA = ")
    copy=extract("zodiac-strength-copy-review(2).html","const DATA=")
    approved=(ROOT/"docs/jira/BFC-56885.md").read_text(encoding="utf-8")
    assert len(copy)==12 and all(len(s["texts"])==4 for s in copy)
    assert all(t in approved for s in copy for t in s["texts"]),"Messages differ from approved Jira"
    signs=[{k:s[k] for k in ("name","start","end","lucky_days","lucky_numbers","glyph")} for s in wire["signs"]]
    write("reference-data.json",signs)
    write("approved-sign-messages.json",{s["name"]:dict(zip(LEVELS,s["texts"])) for s in copy})
    personal=(ROOT/"docs/jira/BFC-52417.md").read_text(encoding="utf-8")
    table=personal.split("| Low Luck | Some Luck | Good Luck | Jackpot Luck |",1)[1].split("\n\n",1)[0]
    rows=[[c.strip() for c in line.strip().strip("|").split("|")] for line in table.splitlines() if line.startswith("|") and "---" not in line]
    assert len(rows)==10 and all(len(r)==4 for r in rows)
    write("approved-personal-messages.json",{name:[r[i] for r in rows] for i,name in enumerate(["Low Luck","Some Luck","Good Luck","Jackpot Luck"])})
    palettes={}
    for line in (ROOT/"docs/jira/BFC-56633.md").read_text().splitlines():
        cells=[c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells)==5 and cells[0] in [s["name"] for s in signs] and all(c.startswith("#") or "TBD" in c for c in cells[1:]):
            palettes[cells[0]]={k:(v if v.startswith("#") else None) for k,v in zip(LEVELS,cells[1:])}
    assert len(palettes)==12
    write("calendar-palettes.json",palettes)
    for year in (2026,2027,2028):
        start=dt.date(year,1,1); n=366 if calendar.isleap(year) else 365
        data={"year":year,"source":"BFC-56621 adopted formula v1.0","signs":{}}
        for i,sign in enumerate(signs):
            dates=[{"date":(start+dt.timedelta(days=k)).isoformat(),"level":level(sign,start+dt.timedelta(days=k))} for k in range(n)]
            counts=collections.Counter(r["level"] for r in dates)
            counts={k:counts[k] for k in LEVELS}
            assert len(dates)==n and sum(counts.values())==n
            if year==2026: assert list(counts.values())==EXPECTED[i],(sign["name"],counts)
            data["signs"][sign["name"]]={"dates":dates,"counts":counts}
        if year==2026:
            aries=data["signs"]["Aries"]["dates"]; lookup={r["date"]:r["level"] for r in aries}
            assert lookup["2026-11-03"]=="Strong" and lookup["2026-11-17"]=="Strong" and lookup["2026-01-06"]=="Strongest"
            upcoming=lambda date:[r["date"] for r in aries if r["date"]>date and r["level"]=="Strongest"][:5]
            assert upcoming("2026-11-05")==["2026-12-15","2026-12-22"]
            assert upcoming("2026-12-30")==[]
            assert upcoming("2026-01-01")==["2026-01-06","2026-03-24","2026-03-31","2026-04-14","2026-04-21"]
        write(f"sign-levels-{year}.json",data)
        print(f"Verified {year}: 12 signs × {n} dates; counts and applicable Jira examples passed.")
    print("48 sign messages, 40 personal messages, Reference Data and palettes extracted. Cancer palette remains TBD.")
if __name__=="__main__":main()
