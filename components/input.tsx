import $ from 'classnames'
import styles from '@/styles/Input.module.css'

interface InputProps {
  value: string
  disabled: boolean
  [key: string]: any
}

function Input({ value, disabled, ...props }: InputProps) {
  return <input 
    type="text" 
    className={$(styles.input, {
      [styles.disabled]: disabled
    })}
    value={value}
    disabled={disabled} 
    {...props}
  />
}

export { Input }
