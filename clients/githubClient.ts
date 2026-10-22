import { APIRequestContext } from '@playwright/test';

const GITHUB_API_URL =
  'https://api.github.com/repos/appwrite/appwrite/pulls';

export async function getOpenPullRequests(
  request: APIRequestContext
): Promise<unknown[]> {
  const allPullRequests: unknown[] = [];
  let url: string | null =
    `${GITHUB_API_URL}?state=open&per_page=100`;

  while (url) {
    const response = await request.get(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'qa-backend-challenge'
      }
    });

    if (!response.ok()) {
      throw new Error(
        `GitHub API request failed: ${response.status()} ${response.statusText()}`
      );
    }

    const pageData = await response.json();

    if (!Array.isArray(pageData)) {
      throw new Error('GitHub API response is not an array');
    }

    allPullRequests.push(...pageData);

    const linkHeader = response.headers()['link'];
    const nextLink = getNextLink(linkHeader);

    url = nextLink;
  }

  return allPullRequests;
}

function getNextLink(linkHeader?: string): string | null {
  if (!linkHeader) {
    return null;
  }

  const nextPart = linkHeader
    .split(',')
    .find((part) => part.includes('rel="next"'));

  if (!nextPart) {
    return null;
  }

  return nextPart.match(/<([^>]+)>/)?.[1] ?? null;
}