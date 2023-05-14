import $ from 'classnames'
import styles from '@/styles/Input.module.css'

interface InputProps {
  value: string
  disabled?: boolean
  className?: string
  [key: string]: any
}

function Input({ value, disabled, className, ...props }: InputProps) {
  return <input 
    type="text" 
    className={$(styles.input, className, {
      [styles.disabled]: disabled
    })}
    value={value}
    disabled={disabled ?? false} 
    {...props}
  />
}

export { Input }
