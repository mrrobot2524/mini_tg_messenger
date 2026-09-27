import type { ReactNode } from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  children?: ReactNode
}

export function Input({ label, error, children, className = '', ...rest }: InputProps) {
  const baseClasses = 'w-full px-4 py-3 rounded-lg bg-[#242F3D] text-white placeholder-gray-500 ' + 'outline-none transition-colors duration-150 border border-transparent';

  const stateClasses = error ? 'border-red-500' : 'focus:border-[#5288C1]';

  const inputClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-gray-400 font-medium">{ label }</label>
      )}

      <input className={inputClasses} {...rest} />

      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
