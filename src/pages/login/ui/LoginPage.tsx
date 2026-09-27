import { LoginForm } from '@/features/auth'
import { Send } from 'lucide-react'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0E1621] flex items-center justify-center p-4">
      <div className="w-full max-w-100 bg-[#17212B] rounded-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#5288C1] flex items-center justify-center text-white font-bold text-2xl">
            <Send/>
          </div>
          <h1 className="text-xl font-semibold text-white text-center">
            Sign in to Telegram
          </h1>
          <p className="text-sm text-gray-400 text-center">
            Enter your GREEN-API credentials
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
