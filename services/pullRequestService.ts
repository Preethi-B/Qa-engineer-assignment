import { z } from 'zod';
import { githubPullRequestSchema } from '../schemas/githubPullRequestSchema';

type GitHubPullRequest = z.infer<typeof githubPullRequestSchema>;

export function validateAndFilterPullRequests(
  pullRequests: unknown[]
): GitHubPullRequest[] {
  const validatedPullRequests = pullRequests.map((pullRequest, index) => {
    const result = githubPullRequestSchema.safeParse(pullRequest);

    if (!result.success) {
      throw new Error(
        `Pull request at index ${index} failed schema validation: ${result.error.message}`
      );
    }

    return result.data;
  });

  return validatedPullRequests.filter(
    (pullRequest) =>
      pullRequest.state === 'open' && pullRequest.draft !== true
  );
}