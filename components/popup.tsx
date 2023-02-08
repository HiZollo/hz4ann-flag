import React from 'react'
import styles from '@/styles/Popup.module.css'

interface PopupWindowProps {
  children: React.ReactNode
  close: () => void
}

function PopupWindow({ children, close }: PopupWindowProps) {
  return (
    <div className={styles.popupWindow}>
      <div className={styles.popupTitle}>
        <CloseButton close={close} />
        <div>System Message</div>
      </div>
      <div className={styles.popupContent}>
        {children}
      </div>
    </div>
  )
}

interface CloseButtonProps {
  close: () => void
}

function CloseButton({ close }: CloseButtonProps) {
  return (
    <div className={styles.popupCloseButton} onClick={close}>
      &times;
    </div>
  )
}

export { PopupWindow }
