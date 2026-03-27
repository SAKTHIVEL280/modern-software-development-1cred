# Test Document

Date: 2026-03-27
Project: TODO
Scope: Front-end SPA (React + Router + static data)

## 1) Testing Goals

- Prevent regressions in primary user journeys.
- Verify route behavior and fallback handling.
- Validate filtering and rendering logic against static data.
- Improve confidence before deployment.

## 2) Current Test Baseline

- Existing test setup is configured (Vitest + jsdom + jest-dom).
- Current actual coverage: placeholder only.
- Local command status in this environment:
  - npm run test fails because Vitest command is not available yet.

## 3) Test Strategy

Unit and component tests (high priority):
- Validate pure logic and component rendering behavior.
- Use React Testing Library for user-centric assertions.

Integration tests (high priority):
- Validate route rendering and navigation outcomes.
- Validate page + data interactions (filters, detail lookup).

End-to-end smoke tests (medium priority):
- Validate top-level flows from home to inventory and detail page.

## 4) Test Scope by Area

### Routing

Must test:
- / renders home page sections.
- /shop renders inventory list.
- /shop/:id renders detail page for valid IDs.
- /shop/:id with invalid ID shows fallback message.
- Unknown route renders NotFound page.

### Shop Filters

Must test:
- Brand query param in URL initializes brand filter.
- Selecting brand/body/fuel updates visible car cards.
- Clear all resets filters and restores full list.
- No matches displays empty-state UI.

### CarCard and CarDetail

Must test:
- CarCard renders title, price, and tags (mileage/fuel/body).
- CarCard link points to expected detail route.
- CarDetail shows hero data, specs, and related section when applicable.

### Static Content Pages

Should test:
- Blog page renders featured and list cards from dataset.
- About and Contact pages render key headings and CTA elements.

### Accessibility

Should test:
- Buttons and links are keyboard reachable.
- Form fields in Contact have accessible labels or aria-labels.
- No critical role/name regressions in core pages.

## 5) Priority Test Cases

P0 (ship blocker if failing):
1. App route map renders expected pages.
2. Shop filter behavior matches selected criteria.
3. CarDetail invalid ID fallback works.
4. NotFound route catches unknown paths.

P1:
1. CarCard formatting and links are correct.
2. Blog first-item featured layout still renders safely when dataset exists.
3. Contact submit handler prevents page reload.

P2:
1. Snapshot-like stability checks for repeated layout sections.
2. Non-critical style class presence checks.

## 6) Suggested Test File Plan

- src/test/app.routes.test.tsx
- src/test/shop.filters.test.tsx
- src/test/car-detail.test.tsx
- src/test/car-card.test.tsx
- src/test/blog.test.tsx
- src/test/not-found.test.tsx

## 7) Example Test Data Approach

- Reuse src/data/cars.ts for integration-style page tests.
- For unit tests, create minimal local fixtures to keep tests fast and focused.

## 8) Entry Criteria for Test Execution

- Dependencies installed successfully.
- Test environment boots with jsdom.
- React Router test wrappers are configured.

## 9) Exit Criteria for Ready State

Minimum recommended before release:
- All P0 tests passing.
- No failing lint errors.
- At least one test for each route-level page.
- Basic accessibility assertions added for navigation and forms.

## 10) Commands

- Run all tests: npm run test
- Watch mode: npm run test:watch
- Lint: npm run lint

## 11) Immediate Next Implementation Steps

1. Replace placeholder test in src/test/example.test.ts with route smoke tests.
2. Add dedicated Shop filter test file for behavior coverage.
3. Add CarDetail valid/invalid ID tests.
4. Add NotFound route assertion.
