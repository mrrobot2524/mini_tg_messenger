import { Forward } from "lucide-react";
import { useState } from "react"

type MessageInputProps = {
  onSend: (text: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return;
    onSend(trimmed)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()  // не даём вставить перенос строки
      handleSend()
    }
  }

  const textareaClasses = 'flex-1 bg-[#242F3D] text-white placeholder-gray-500 rounded-2xl px-4 py-2.5 resize-none outline-none border border-transparent focus:border-[#5288c1] transition-colors disabled:opacity-50'

  return (
    <div className="p-4 border-t border-[#0E1621] flex items-end gap-2">
      <textarea className={textareaClasses} placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} disabled={ disabled } rows={1} />
      <button onClick={handleSend} disabled={disabled || text.trim().length === 0}
        className="w-10 h-10 shrink-0 cursor-pointer rounded-full bg-[#5288C1] hover:bg-[#3F6FA0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
        aria-label="Send message"
      >
        <Forward />
      </button>
    </div>
  )
}
