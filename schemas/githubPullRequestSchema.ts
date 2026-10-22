import { z } from 'zod';

export const githubPullRequestSchema = z.object({
  number: z.number(),
  title: z.string(),
  state: z.enum(['open', 'closed']),
  draft: z.boolean().nullable(),
  user: z
    .object({
      login: z.string()
    })
    .nullable()
});