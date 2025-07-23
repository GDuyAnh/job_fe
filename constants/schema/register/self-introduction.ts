import { z } from 'zod'

export const selfIntroductionSchema = z.object({
  selfIntroduction: z.string().optional(),
})

export type SelfIntroductionType = z.infer<typeof selfIntroductionSchema>
