import styles from '@/styles/Button.module.css'

interface ButtonProps {
  text: string
  [key: string]: any
}
function Button({ text, ...props }: ButtonProps) {
  return (
    <div className={styles.button} {...props}>
      {text}
    </div>
  )
}

export { Button }
