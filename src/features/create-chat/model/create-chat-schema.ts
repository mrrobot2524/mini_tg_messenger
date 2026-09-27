import { z } from 'zod'

export const createChatSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Введите chatId получателя' })
    .regex(/^(\d+|@?\w+)$/, {
      message: 'Только цифры (например, 910290429) или @username',
    }),

  name: z
    .string()
    .trim()
    .max(50, { message: 'Максимум 50 символов' })
    .optional(),
})

export type CreateChatValues = z.infer<typeof createChatSchema>
