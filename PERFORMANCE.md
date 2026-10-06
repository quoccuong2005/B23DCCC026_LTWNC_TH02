# Performance and profiling notes

## Measurements

The selected `Baithuchanhso2` workspace was empty before this implementation, so there was no prior app build to profile. A valid pre-optimization baseline cannot be recovered from this workspace.

| Metric | Before optimization | After optimization |
| --- | --- | --- |
| `AssignmentCard` commits after searching `Bài tập mẫu 9999` with 10,000 items | Not available (no prior app in workspace) | 1 |
| Lighthouse Performance score (production build, 10,000 items) | Not available (no prior app in workspace) | 96 / 100 |
| Lighthouse LCP | Not available | 1,877 ms |
| Lighthouse TBT | Not available | 127 ms |
| Lighthouse CLS | Not available | 0.005 |
| Unrelated subtree commits after toggling theme | Not available | 0 (Profiler test; one initial mount only) |

For the after-search render count, the development build was opened with `?stress=1`, then the search field was filled with `Bài tập mẫu 9999`. The development-only `React.Profiler` callback recorded one `AssignmentCard` commit for the filtered result.

Lighthouse was run against the production preview with Chrome using:

```text
npx lighthouse http://127.0.0.1:4173/?stress=1 --only-categories=performance
```

The `?stress=1` query parameter enables reproducible 10,000-item profiling on page load. In the normal app, the **Tạo 10.000 bài tập mẫu** button enables the same dataset.

## React DevTools Profiler

To inspect the render boundary interactively:

1. Start the app with `npm run dev`.
2. Open `http://localhost:5173/?stress=1` and select the **Profiler** tab in React DevTools.
3. Record while typing in the search field, then record while changing the theme.
4. Search results should commit only the visible virtualized rows; the theme change should not commit the unrelated form/list subtree.

`ThemeContext.test.tsx` verifies the unrelated subtree with React's Profiler callback. In development, searching also reports the `AssignmentCard` commit count to the browser console. Redux Logger is development-only; browser console verification produced `assignments/addAssignment`, `assignments/toggleCompleted`, and `assignments/removeAssignment` entries.
