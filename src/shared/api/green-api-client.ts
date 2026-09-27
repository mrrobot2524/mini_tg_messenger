import type { AuthCredentials } from '@/entities/auth'

const BASE_URL = '/green-api'

type GreenApiError = {
  name: string
  code: number
  message: string
}

export type SendMessageResponse = {
  idMessage: string
}

export type GetStateInstanceResponse = {
  stateInstance: string
}

export type LastIncomingMessage = {
  idMessage: string
  timestamp: number
  chatId: string
  senderName: string
  textMessage: string
}

export type LastIncomingMessagesResponse = LastIncomingMessage[]

function buildUrl(credentials: AuthCredentials, method: string): string {
  return `${BASE_URL}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`
    try {
      const errorBody: GreenApiError = await response.json()
      errorMessage = errorBody.message || errorMessage
    } catch {
      // Если тело не JSON — используем статус-код
    }
    throw new Error(errorMessage)
  }
  return response.json() as Promise<T>
}

export async function getStateInstance(
  credentials: AuthCredentials
): Promise<GetStateInstanceResponse> {
  const url = buildUrl(credentials, 'getStateInstance')
  const response = await fetch(url, { method: 'GET' })

  if (!response.ok) {
    const text = await response.text()
    if (text.includes('Instance is deleted')) {
      throw new Error('Инстанс удалён. Создайте новый в кабинете GREEN-API.')
    }
    if (response.status === 401) {
      throw new Error('Неверный idInstance или apiTokenInstance.')
    }
    throw new Error(`Ошибка GREEN-API: ${text || response.status}`)
  }

  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Некорректный ответ от сервера GREEN-API')
  }
}

export async function sendMessage(
  credentials: AuthCredentials,
  params: { chatId: string; message: string }
): Promise<SendMessageResponse> {
  const url = buildUrl(credentials, 'sendMessage')
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return handleResponse<SendMessageResponse>(response)
}

export async function receiveNotification(
  credentials: AuthCredentials
): Promise<unknown | null> {
  const url = buildUrl(credentials, 'receiveNotification')
  const response = await fetch(url, { method: 'GET' })

  if (!response.ok) {
    const text = await response.text()
    if (text.includes('Instance is deleted')) {
      throw new Error('Инстанс удалён. Создайте новый в кабинете GREEN-API.')
    }
    if (response.status === 401) {
      throw new Error('Неверные креды. Войдите заново.')
    }
    throw new Error(`GREEN-API error ${response.status}: ${text}`)
  }

  const text = await response.text()
  if (!text || text === 'null') return null

  try {
    return JSON.parse(text)
  } catch {
    console.warn('Получен не-JSON ответ от GREEN-API:', text)
    return null
  }
}

export async function deleteNotification(
  credentials: AuthCredentials,
  receiptId: number
): Promise<void> {
  const url = buildUrl(credentials, `deleteNotification/${receiptId}`)
  const response = await fetch(url, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error(`Failed to delete notification ${receiptId}`)
  }
}

export async function getLastIncomingMessages(
  credentials: AuthCredentials
): Promise<LastIncomingMessagesResponse> {
  const url = buildUrl(credentials, 'lastIncomingMessages')
  const response = await fetch(url, { method: 'GET' })

  if (!response.ok) {
    const text = await response.text()
    if (text.includes('Instance is deleted')) {
      throw new Error('Инстанс удалён. Создайте новый в кабинете GREEN-API.')
    }
    throw new Error(`Ошибка GREEN-API: ${text || response.status}`)
  }

  const text = await response.text()
  if (!text || text === 'null') return []

  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}


// --- Тип ответа lastOutgoingMessages ---
export type LastOutgoingMessage = {
  idMessage: string
  timestamp: number
  chatId: string
  senderName: string
  textMessage: string
}

export type LastOutgoingMessagesResponse = LastOutgoingMessage[]


export async function getLastOutgoingMessages(
  credentials: AuthCredentials
): Promise<LastOutgoingMessagesResponse> {
  const url = buildUrl(credentials, 'lastOutgoingMessages')
  const response = await fetch(url, { method: 'GET' })

  if (!response.ok) {
    const text = await response.text()
    if (text.includes('Instance is deleted')) {
      throw new Error('Инстанс удалён. Создайте новый в кабинете GREEN-API.')
    }
    throw new Error(`Ошибка GREEN-API: ${text || response.status}`)
  }

  const text = await response.text()
  if (!text || text === 'null') return []

  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}
