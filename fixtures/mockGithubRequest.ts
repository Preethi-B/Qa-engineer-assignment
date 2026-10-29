// Helpers that build fake GitHub data and a fake Playwright `request`.
// They let tests control exactly what the "API" returns, including
// multiple pages and Link headers, without calling the real GitHub.

// Builds a pull request object that satisfies githubPullRequestSchema.
export function makePr(
  number: number,
  overrides: { draft?: boolean | null; state?: 'open' | 'closed' } = {}
) {
  return {
    number,
    title: `PR ${number}`,
    state: overrides.state ?? 'open',
    draft: overrides.draft ?? false,
    user: { login: 'tester' }
  };
}

// Builds a fake Playwright response. `link` is the raw Link header, if any.
export function makeResponse(items: unknown, link?: string) {
  return {
    ok: () => true,
    status: () => 200,
    statusText: () => 'OK',
    json: async () => items,
    headers: () => (link ? { link } : {})
  };
}

// Builds a fake `request` that returns the given responses in order
// and records every URL that was requested.
export function makeMockRequest(responses: ReturnType<typeof makeResponse>[]) {
  const requestedUrls: string[] = [];
  let callIndex = 0;

  const mockRequest = {
    get: async (url: string) => {
      requestedUrls.push(url);
      const response = responses[callIndex];
      callIndex += 1;
      if (!response) {
        throw new Error(`Unexpected extra request to ${url}`);
      }
      return response;
    }
  };

  return { mockRequest, requestedUrls };
}