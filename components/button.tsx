import $ from 'classnames'
import styles from '@/styles/Button.module.css'

interface ButtonProps {
  text: string
  disabled?: boolean
  [key: string]: any
}
function Button({ text, disabled = false, ...props }: ButtonProps) {
  return (
    <div className={`${$(styles.button, {
      [styles.disabled]: disabled
    })}`} {...props}>
      {text}
    </div>
  )
}

export { Button }
