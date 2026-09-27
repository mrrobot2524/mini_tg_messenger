export type AuthCredentials = {
  idInstance: string
  apiTokenInstance: string
}

export type AuthState = {
  credentials: AuthCredentials | null
  isAuthenticated: boolean
}
