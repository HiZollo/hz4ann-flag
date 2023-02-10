import $ from 'classnames'
import styles from '@/styles/Button.module.css'

interface ButtonProps {
  text: string
  disabled?: boolean
  [key: string]: any
}
function Button({ text, disabled = false, ...props }: ButtonProps) {
  if (disabled) {
    return (
      <div className={$(
        styles.button, 
        styles.disabled
      )} {...props}>
        {text}
      </div>
    )
  }

  return (
    <button className={styles.button} {...props}>
      {text}
    </button>
  )
}

export { Button }
