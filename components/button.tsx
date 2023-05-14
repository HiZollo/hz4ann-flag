import $ from 'classnames'
import styles from '@/styles/Button.module.css'

interface ButtonProps {
  text: string
  disabled?: boolean
  className?: string
  [key: string]: any
}
function Button({ text, disabled = false, className, ...props }: ButtonProps) {
  if (disabled) {
    return (
      <div className={$(
        styles.button, 
        className, 
        styles.disabled
      )} {...props}>
        {text}
      </div>
    )
  }

  return (
    <button className={styles.button + ' ' + className} {...props}>
      {text}
    </button>
  )
}

export { Button }
