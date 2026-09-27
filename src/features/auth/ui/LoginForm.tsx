import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Input, Button } from '@/shared'
import { useAuthStore } from '@/entities/auth'
import { loginSchema, type LoginFormValues } from '../model/login-schema'
import { useCheckAuth } from '../model/use-check-auth'

export function LoginForm() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const checkAuthMutation = useCheckAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      idInstance: '',
      apiTokenInstance: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await checkAuthMutation.mutateAsync(data)
      login(data)
      navigate('/chat')
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Не удалось войти. Попробуйте ещё раз.'

      setError('root', {
        type: 'manual',
        message: errorMessage,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {errors.root && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {errors.root.message}
        </div>
      )}

      <Input
        label="idInstance"
        placeholder="например, 410022745795"
        error={errors.idInstance?.message}
        {...register('idInstance')}
        disabled={isSubmitting}
      />

      <Input
        label="apiTokenInstance"
        placeholder="например, a1b2c3d4e5f6..."
        type="password"
        error={errors.apiTokenInstance?.message}
        {...register('apiTokenInstance')}
        disabled={isSubmitting}
      />

      <Button type="submit" disabled={!isValid || isSubmitting} className='px-4 py-3'>
        {isSubmitting ? 'Проверка...' : 'Войти'}
      </Button>
    </form>
  )
}
