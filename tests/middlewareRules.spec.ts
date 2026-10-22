import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { middlewarePullRequestSchema } from '../schemas/middlewarePullRequestSchema';
import { checkCount, checkHighPriorityNotDraft } from '../services/middlewareRules';

function loadData() {
  const fileContent = readFileSync('fixtures/pullRequests.json', 'utf-8');
  const rawData: unknown = JSON.parse(fileContent);
  const result = middlewarePullRequestSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(`Middleware response schema is invalid: ${result.error.message}`);
  }
  return result.data;
}

test.describe('Middleware payload', () => {
  test('valid payload passes both business rules', () => {
    const data = loadData();
    expect(checkCount(data)).toEqual([]);
    expect(checkHighPriorityNotDraft(data)).toEqual([]);
  });

  test('count mismatch is detected when totalOpenPrs exceeds actual PR count', () => {
    const data = loadData();
    data.totalOpenPrs = 3;
    expect(checkCount(data)).toEqual([
      'Count mismatch: totalOpenPrs is 3 but there are 1 pull requests',
    ]);
  });




  test('high-priority draft is detected', () => {
    const data = loadData();
    data.pullRequests[0].meta.isDraft = true;
    expect(checkHighPriorityNotDraft(data)).toEqual([
      'PR #1024 "feat: add SQS support to testing commons" is high-priority but is a draft',
    ]);
  });

 

  test('schema accepts a boolean isDraft value', () => {
    const rawData = JSON.parse(readFileSync('fixtures/pullRequests.json', 'utf-8'));
    rawData.pullRequests[0].meta.isDraft = false; // valid boolean

    const result = middlewarePullRequestSchema.safeParse(rawData);

    expect(result.success).toBe(true);
  });

  test('schema rejects a string isDraft value', () => {
    const rawData = JSON.parse(readFileSync('fixtures/pullRequests.json', 'utf-8'));
    rawData.pullRequests[0].meta.isDraft = 'false'; // invalid string

    const result = middlewarePullRequestSchema.safeParse(rawData);

    expect(result.success).toBe(false);
  });

  test('schema rejects an invalid pull request status', () => {
  const rawData = JSON.parse(
    readFileSync('fixtures/pullRequests.json', 'utf-8')
  );

  rawData.pullRequests[0].status = 'PENDING';

  const result = middlewarePullRequestSchema.safeParse(rawData);

  expect(result.success).toBe(false);
});
});