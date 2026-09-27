import { z } from 'zod'

export const loginSchema = z.object({
  idInstance: z
    .string()
    .trim()
    .min(1, { message: 'Введите idInstance' })
    .regex(/^\d+$/, { message: 'idInstance должен содержать только цифры' }),

  apiTokenInstance: z
    .string()
    .trim()
    .min(1, { message: 'Введите apiTokenInstance' }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
