import $ from 'classnames'
import styles from '@/styles/Button.module.css'

interface ButtonProps {
  text: string
  disabled?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  [key: string]: any
}
function Button({ text, disabled = false, className, onClick, ...props }: ButtonProps) {
  if (disabled) {
    return (
      <div 
        className={$(
          styles.button, 
          className, 
          styles.disabled
        )}
        onClick={() => {}}
        {...props}
      >
        {text}
      </div>
    )
  }

  return (
    <button className={styles.button + ' ' + className} onClick={onClick} {...props}>
      {text}
    </button>
  )
}

export { Button }
