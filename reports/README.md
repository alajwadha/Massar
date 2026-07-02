# Gate reports

Every validation-gate review writes one structured report here, so each delivered plan
carries its own audit trail (see PIPELINE.md, section 1).

- Path: `reports/<slug>/<YYYY-MM-DD>-cycle<N>-agent<K>.json`
  (cycle = which full gate run, agent = 1, 2, or 3).
- Shape: `reports/schema.json`. Verdict is `PASS` or `FAIL`; a FAIL carries one entry
  per finding with the criterion, severity, the exact item, evidence, and the fix.
- Evidence NEVER quotes the customer's CV (the CV is never committed). Point to the
  plan field (`aliPlan.paths[2].certs[1].link`) or the code line instead.
- Reports are append-only history. Do not edit or delete an old report after a re-run;
  write the next cycle's report beside it.
