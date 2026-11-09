"""Restore bundled Figma assets after checkout; Python standard library only."""
import hashlib,json,pathlib,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
manifest=ROOT/"asset-packs/manifest.json"
if not manifest.exists():
    raise SystemExit("Missing asset-packs/manifest.json. Restore the prepared asset packs.")
data=json.loads(manifest.read_text())
restored=0
for archive in data["archives"]:
    path=ROOT/archive["path"]
    if not path.is_file():
        raise SystemExit("Missing asset pack: "+archive["path"])
    if hashlib.sha256(path.read_bytes()).hexdigest()!=archive["sha256"]:
        raise SystemExit("Asset pack checksum mismatch: "+archive["path"])
    with zipfile.ZipFile(path) as z:
        for info in z.infolist():
            relative=pathlib.PurePosixPath(info.filename)
            if relative.is_absolute() or ".." in relative.parts or relative.parts[:2]!=("assets","figma"):
                raise SystemExit("Unexpected archive path")
            target=ROOT.joinpath(*relative.parts)
            payload=z.read(info)
            if hashlib.sha256(payload).hexdigest()!=target.stem:
                raise SystemExit("Asset checksum mismatch: "+info.filename)
            target.parent.mkdir(parents=True,exist_ok=True)
            if not target.exists() or hashlib.sha256(target.read_bytes()).hexdigest()!=target.stem:
                target.write_bytes(payload)
            restored+=1
if restored!=data["file_count"]:
    raise SystemExit("Asset count mismatch")
print(f"Verified/restored {restored} original Figma files from the asset packs.")
