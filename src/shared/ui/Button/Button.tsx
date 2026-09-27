type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[#5288C1] hover:bg-[#3F6FA0] text-white',
  secondary: 'bg-[#5288C1] hover:bg-[#3F6FA0] text-white',
  ghost: 'bg-transparent border border-[#5288C1] text-[#5288C1] hover:bg-[#5288C1]/10',
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  const baseClasses = 'rounded-lg font-medium transition-colors duration-150 ' + 'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={buttonClasses} {...rest}>{children}</button>
  )
}
