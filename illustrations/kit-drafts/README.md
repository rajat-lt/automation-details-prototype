# Setup state spots: kit drafts

Four spot illustrations for the setup state (spec §12.11), built with design-context's illustration kit (`illustration-style-kit/skill/lambdatest-illustration`, at `6cfb737`) from parts lifted out of LambdaTest's own drawings. They are drafts: the kit says only Rajat approves them, and nothing was committed to design-context.

| File | Step | Parts | Checker |
|---|---|---|---|
| `setup-device.mjs` | Setting up iPhone 16 | `phone-r134` (no home button; right edge drawn closed), `gears-r13` at 0.5 | PASS, accent 0.06 |
| `setup-applepay.mjs` | Setting up Apple Pay | `credit-card-r69` at 0.84 | PASS, accent 0.133 |
| `setup-run.mjs` | Running your test | `flask-r97` at 0.84 | WARN, line evenness 0.205 (the lifted flask alone: 0.234), accent 0.016 |
| `setup-results.mjs` | Loading your results | `bar-chart-r107` at 0.46 | WARN, subject height 0.142 and line evenness 0.198, accent 0.121 |

Each `.png` is the kit's 2x preview of its 600 × 500 artboard.

## Rebuild

From a design-context checkout, in `illustration-style-kit/skill/lambdatest-illustration/`:

1. Copy `_setup-lib.mjs` to `gallery/pending/_setup-lib.mjs`.
2. Copy each `setup-<step>.mjs` to `gallery/pending/setup-<step>/scene.mjs`.
3. Run `node scripts/build.mjs gallery/pending/setup-<step>/scene.mjs` for the SVG, the 2x PNG and the check report.

The page uses each SVG cut to `viewBox="228 182 144 136"` (centred on the artboard's (300, 250)), with its group IDs prefixed `su-<step>-` so CSS can move them (`src/illustrations/`).
