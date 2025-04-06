import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline'
}

export default function Button({ className, variant = 'primary', ...rest }: ButtonProps) {
  const baseClasses = 'h-fit whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 lg:px-6 lg:py-3 lg:text-base'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 focus:ring-purple-300',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200'
  }

  return (
    <button
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...rest}
    />
  )
}