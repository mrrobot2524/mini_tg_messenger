import { useMutation } from '@tanstack/react-query'
import { getStateInstance } from '@/shared/api'
import type { GetStateInstanceResponse } from '@/shared/api'
import type { AuthCredentials } from '@/entities/auth'


export class CheckAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CheckAuthError'
  }
}

function getRussianErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()

    if (msg.includes('failed to fetch') || msg.includes('network')) {
      return 'Не удалось подключиться к серверу. Проверьте интернет-соединение.'
    }

    if (msg.includes('401') || msg.includes('unauthorized')) {
      return 'Неверный idInstance или apiTokenInstance. Проверьте данные в кабинете GREEN-API.'
    }

    if (msg.includes('466')) {
      return 'Превышен лимит запросов на бесплатном тарифе. Попробуйте позже или подключите платный тариф.'
    }


    if (msg.includes('400') || msg.includes('bad request')) {
      return 'Неверный формат данных. Проверьте правильность ввода.'
    }


    if (msg.includes('notauthorized') || msg.includes('not authorized')) {
      return 'Инстанс не авторизован. Привяжите Telegram-аккаунт в кабинете GREEN-API.'
    }


    if (msg.includes('blocked')) {
      return 'Инстанс заблокирован. Обратитесь в поддержку GREEN-API.'
    }


    return error.message
  }

  return 'Неизвестная ошибка. Попробуйте ещё раз.'
}

export function useCheckAuth() {
  return useMutation<GetStateInstanceResponse, Error, AuthCredentials>({
    mutationFn: async (credentials) => {
      try {
        const response = await getStateInstance(credentials)

        if (response.stateInstance !== 'authorized') {
          throw new CheckAuthError(
            `Инстанс не авторизован. Текущее состояние: ${response.stateInstance}. ` +
            `Привяжите Telegram-аккаунт в кабинете GREEN-API.`
          )
        }

        return response
      } catch (error) {

        if (error instanceof CheckAuthError) {
          throw error
        }
        throw new Error(getRussianErrorMessage(error), {cause: error})
      }
    },
    retry: false,
  })
}
