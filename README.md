# QA Engineer Assignment

## Overview
This project tests GitHub pull requests and validates a middleware response using TypeScript, Playwright, and Zod.

## Structure
- `clients/` – Handles GitHub API requests and pagination.
- `schemas/` – Validates response structure and data types.
- `services/` – Contains pull request filtering and business rules.
- `tests/` – Contains API and middleware tests.
- fixtures/` – Contains sample middleware response data and mock request helper

## Assumptions
- Only open, non-draft pull requests are counted.
- `totalOpenPrs` must match the number of items in `pullRequests`.
- A pull request labelled `high-priority` must not be a draft.

## Pagination and Validation
The GitHub client requests up to 100 pull requests per page and follows the `Link` header to retrieve additional pages.

Zod validates the response structure and data types. Tests cover count mismatches, invalid values, and high-priority draft violations.

## Run Tests
```bash
npm install
npx playwright test
```