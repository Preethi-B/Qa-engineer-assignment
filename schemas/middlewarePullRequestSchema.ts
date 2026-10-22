import { z } from 'zod';

export const middlewarePullRequestSchema = z.object({
  productId: z.string(),
  totalOpenPrs: z.number(),
  lastUpdated: z.string().datetime(),
  pullRequests: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      author: z.object({
        username: z.string(),
        role: z.string()
      }),
      status: z.enum(['OPEN', 'CLOSED']),
      labels: z.array(z.string()),
      meta: z.object({
        isDraft: z.boolean()
      }),
      reviewComments: z.number()
    })
  )
});