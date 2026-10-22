import { z } from 'zod';
import { middlewarePullRequestSchema } from '../schemas/middlewarePullRequestSchema';
type MiddlewarePayload = z.infer<typeof middlewarePullRequestSchema>;

export function checkCount(data: any): string[] {
  const actual = data.pullRequests.length;
  const expected = data.totalOpenPrs;
  if (actual !== expected) {
    return [`Count mismatch: totalOpenPrs is ${expected} but there are ${actual} pull requests`];
  }
  return [];
}

export function checkHighPriorityNotDraft(data: MiddlewarePayload): string[] {
  const problems: string[] = [];
  for (const pr of data.pullRequests) {
    if (pr.labels.includes('high-priority') && pr.meta.isDraft === true) {
      problems.push(`PR #${pr.id} "${pr.title}" is high-priority but is a draft`);
    }
  }
  return problems;
}