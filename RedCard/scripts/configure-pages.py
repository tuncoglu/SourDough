"""Preserve downloaded Pages settings while adding RedCard's service binding."""
import json
from pathlib import Path
import tomllib

path = Path("wrangler.toml")
config = tomllib.loads(path.read_text())
config["name"] = "sourdough"
config["pages_build_output_dir"] = "SourDoughMobile/dist"
config.setdefault("compatibility_date", "2026-10-03")


def bind(target):
    services = target.setdefault("services", [])
    for service in services:
        if service["binding"] == "REDCARD":
            if service["service"] != "sourdough-redcard":
                raise RuntimeError("REDCARD is already bound to another service")
            return
    services.append({"binding": "REDCARD", "service": "sourdough-redcard"})


bind(config)
for name in ["production", "preview"]:
    bind(config.setdefault("env", {}).setdefault(name, {}))
Path("wrangler.json").write_text(json.dumps(config, indent=2) + "\n")
path.unlink()
