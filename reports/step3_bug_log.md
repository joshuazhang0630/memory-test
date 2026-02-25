# STEP 3 Bug Log (Live + Automated)

## BL-001 (Critical) — Level assignment overfilled target pool per level
- **Observed:** Runtime level generation initially assigned hundreds of targets per level while `levelTrialCount=120`.
- **Impact:** Sequence builder could not place required repeat pairs; produced invalid fallback behavior and violated lag constraints.
- **Fix:** Updated participant-level assignment budget in `data.js` to fixed per-level quotas compatible with strict constraints:
  - target pairs: 18
  - vigilance pairs: 6
  - filler singles: 72

## BL-002 (Critical) — Sequence builder allowed out-of-window fallback placements
- **Observed:** `buildLevelSequence` could place pairs outside lag constraints via fallback (`findLargestGapPair`) and could silently continue after failed pair placement.
- **Impact:** Violates experimental design assumptions and corrupts memorability signal quality.
- **Fix:** Rewrote `buildLevelSequence` as strict builder:
  - hard target lag placement (91–109)
  - hard vigilance spacing (1–7)
  - no out-of-range fallback
  - retries and hard error on failure

## BL-003 (Major) — Constraint validator script initially used inaccessible constants
- **Observed:** automated check script read constants from VM context where `const` values were not exported.
- **Impact:** false negatives (missed lag violations).
- **Fix:** use explicit numeric constants in script and produce proper lag stats.

## Post-fix status
- `step3_constraints.json`: 0 overlap violations, 0 target lag violations, 0 vigilance lag violations, 0 null slots, 0 sequence build errors over 50 synthetic participants.
- `step3_data_integrity.json`: Google Sheets schema read/write smoke checks passed.
