#!/usr/bin/env bash
set -euo pipefail
REPO="/Users/joshua/.openclaw/workspace/projects/memorability-game/repo"
SID="19__35IVHmBkPm2zFMKrNoIY3QfmN0pSyEIYtCdOph6A"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TAG="step3_sheet_smoke_${RANDOM}"

gog sheets append "$SID" "工作表1!A:AO" --values-json "[[\"smoke_test\", \"$TS\", \"system\", \"system\", \"$TAG\", \"vis-mem-v2\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"ok\", \"\", \"\", \"\", \"1\", \"1\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"\", \"{\\\"tag\\\":\\\"$TAG\\\"}\"]]" >/tmp/sheet_append_out.txt

RAW=$(gog sheets get "$SID" "工作表1!A1:AO6" --json)
echo "$RAW" > "$REPO/reports/step3_data_integrity.json"
echo "sheet_write_ok tag=$TAG"
