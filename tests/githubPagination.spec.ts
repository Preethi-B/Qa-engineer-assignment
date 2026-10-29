import { test, expect } from '@playwright/test';
import { getOpenPullRequests } from '../clients/githubClient';
import { validateAndFilterPullRequests } from '../services/pullRequestService';
import {
  makePr,
  makeResponse,
  makeMockRequest
} from '../fixtures/mockGithubRequest';

const BASE = 'https://api.github.com/repos/appwrite/appwrite/pulls';
const PAGE_1_URL = `${BASE}?state=open&per_page=100`;
const PAGE_2_URL = `${BASE}?state=open&per_page=100&page=2`;

test.describe('GitHub client pagination (mocked)', () => {
  test('follows the next link and combines items from two pages', async () => {
    const { mockRequest, requestedUrls } = makeMockRequest([
      makeResponse([makePr(1), makePr(2)], `<${PAGE_2_URL}>; rel="next"`),
      makeResponse([makePr(3)])
    ]);

    const result = await getOpenPullRequests(mockRequest as any);

    expect(result).toHaveLength(3);
    expect(requestedUrls).toEqual([PAGE_1_URL, PAGE_2_URL]);
  });

  test('excludes a draft PR found on the second page from the final count', async () => {
    const { mockRequest } = makeMockRequest([
      makeResponse(
        [makePr(1), makePr(2, { draft: true })],
        `<${PAGE_2_URL}>; rel="next"`
      ),
      makeResponse([makePr(3), makePr(4, { draft: true }), makePr(5)])
    ]);

    const allPullRequests = await getOpenPullRequests(mockRequest as any);
    const eligible = validateAndFilterPullRequests(allPullRequests);

    expect(allPullRequests).toHaveLength(5);
    expect(eligible.map((pr) => pr.number)).toEqual([1, 3, 5]);
  });
});