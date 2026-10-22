import { test, expect } from '@playwright/test';
import { getOpenPullRequests } from '../clients/githubClient';
import { validateAndFilterPullRequests } from '../services/pullRequestService';

test('counts all open non-draft GitHub pull requests', async ({
  request
}) => {
  const allPullRequests = await getOpenPullRequests(request);

  const eligiblePullRequests =
    validateAndFilterPullRequests(allPullRequests);
    expect(Array.isArray(allPullRequests)).toBe(true);
  console.log(`Total pull requests fetched: ${allPullRequests.length}`);
  console.log(
    `Open non-draft pull requests counted: ${eligiblePullRequests.length}`
  );

  for (const pullRequest of eligiblePullRequests) {
    expect(pullRequest.state).toBe('open');
    expect(pullRequest.draft).not.toBe(true);
  }
});



test('throws an error when GitHub API returns 403', async () => {
  const mockRequest = {
    get: async () => ({
      ok: () => false,
      status: () => 403,
      statusText: () => 'Forbidden',
    }),
  };

  await expect(
    getOpenPullRequests(mockRequest as any)
  ).rejects.toThrow(
    'GitHub API request failed: 403 Forbidden'
  );
});

test('throws an error when GitHub API response is not an array', async () => {
  const mockRequest = {
    get: async () => ({
      ok: () => true,
      status: () => 200,
      statusText: () => 'OK',
      json: async () => ({ message: 'Unexpected response' }),
    }),
  };

  await expect(
    getOpenPullRequests(mockRequest as any)
  ).rejects.toThrow('GitHub API response is not an array');
});