# Performance and profiling notes

## Measurements

Measurements were taken on 2026-10-06 with the same generated dataset of 10,000
assignments and local Chrome/Lighthouse configuration for both builds. The
repository history contains only the optimized implementation, so the baseline
below is a **reconstructed, temporary pre-optimization variant**, not a
historical measurement: it rendered every card, filtered synchronously without
`useMemo`/`useDebounce`, and did not use `React.memo` or virtualization. The
variant was used only for measurement and was not kept in the application.

For the render comparison, the search field was changed once to `Bài tập mẫu`,
which matches all 10,000 records. React Profiler commit callbacks were counted
for `AssignmentCard`.

| Metric | Before (reconstructed baseline) | After (optimized) |
| --- | ---: | ---: |
| `AssignmentCard` commits for the `Bài tập mẫu` search (10,000 matches) | 10,000 | 10 |
| Lighthouse Performance score | 46 / 100 | 85 / 100 |
| Lighthouse LCP | 4,200 ms | 3,200 ms |
| Lighthouse TBT | 2,940 ms | 0 ms |
| Lighthouse CLS | 0 | 0 |
| Unrelated subtree commits after toggling theme | 0 additional commits | 0 additional commits |

Lighthouse was run once per production build against the same local preview URL
and Chrome executable:

```text
npx lighthouse http://127.0.0.1:4173/?stress=1 --only-categories=performance
```

The scores are machine- and run-dependent; the figures above are the observed
single-run results, not a statistical average. `?stress=1` loads 10,000
assignments for repeatable profiling; in normal use, click **Tạo 10.000 bài tập
mẫu** to load the same data.

## React DevTools Profiler

To inspect the render boundary interactively:

1. Start the app with `npm run dev`.
2. Open `http://localhost:5173/?stress=1` and select the **Profiler** tab in React DevTools.
3. Record while changing the search field, then record while changing the theme.
4. The virtualized list should commit only the rendered rows; the theme change should not commit the unrelated form/list subtree.

`ThemeContext.test.tsx` verifies the unrelated subtree using React's Profiler
callback. In development, searching also reports the `AssignmentCard` commit
count to the browser console. Redux Logger is development-only and logs
`assignments/addAssignment`, `assignments/toggleCompleted`, and
`assignments/removeAssignment`.
