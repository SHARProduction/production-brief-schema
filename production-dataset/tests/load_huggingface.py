"""Actual local Hugging Face JSON loader and schema check. No Hub login/push."""
import json
import tempfile
from pathlib import Path
import datasets
from datasets import load_dataset
from datetime import date, datetime
from jsonschema import Draft202012Validator, FormatChecker
root = Path(__file__).resolve().parents[1]
report = {"datasets_version": datasets.__version__, "source": "local JSONL; no Hub upload", "results": {}}
with tempfile.TemporaryDirectory(prefix="shar-hf-load-") as cache:
    for name, count in [("taxonomy", 18), ("briefs", 8)]:
        source = root / "data" / (name + ".jsonl")
        schema = json.loads((root / (name + ".schema.json")).read_text(encoding="utf-8-sig"))
        validator = Draft202012Validator(schema, format_checker=FormatChecker())
        original = [json.loads(line) for line in source.read_text(encoding="utf-8").splitlines()]
        for row in original:
            validator.validate(row)
        broken = dict(original[0], origin="measured")
        assert list(validator.iter_errors(broken)), "Wrong provenance must fail schema"
        missing = dict(original[0]); missing.pop("id")
        assert list(validator.iter_errors(missing)), "Missing ID must fail schema"
        loaded = load_dataset("json", data_files=str(source), split="train", cache_dir=cache)
        assert len(loaded) == count
        def normalize(value):
            if isinstance(value, (date, datetime)): return value.strftime("%Y-%m-%d")
            if isinstance(value, dict): return {k: normalize(v) for k, v in value.items()}
            if isinstance(value, list): return [normalize(v) for v in value]
            return value
        assert normalize(loaded.to_list()) == original
        report["results"][name] = {"rows": count, "roundtrip_equal_after_iso_date_normalization": True, "schema_valid": True, "negative_schema_cases": 2}
print(json.dumps(report, indent=2))
