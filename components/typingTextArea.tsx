import type { Dispatch, SetStateAction } from 'react'
import { useState, useEffect, useRef } from 'react'
import { useAutosizeTextArea } from '@/utils/useAutosizeTextArea'
import { wait } from '@/utils/wait'
import styles from './typingTextArea.module.css'

interface TypingTextAreaProps {
  text: string[]
  speedRatio?: number
}

function TypingTextArea({ text, speedRatio = 1 }: TypingTextAreaProps) {
  const [content, setContent] = useState('_')
  const textareaRef = useRef(null)
  const speeds = [20, 100, 10, 1500].map(v => v * speedRatio)

  async function type(appendContent: Dispatch<SetStateAction<string>>) {
  let acc = ''
  for (const sentence of text) {
    for (const ch of sentence) {
      acc += ch
      appendContent(acc + '_') 
      await wait(speeds[0])
    }

    await wait(speeds[1])
    acc += '\n'
    appendContent(acc + '_')
    await wait(speeds[2])
    acc += '\n'
    appendContent(acc + '_')
    await wait(speeds[3])
  }
  acc = ''
}

  useAutosizeTextArea(textareaRef.current, content)

  useEffect(() => {
    type(setContent)

    return () => setContent('_')
  }, [])

  return <textarea 
    ref={textareaRef}
    className={styles['typing-textarea']}
    value={content}
    tabIndex={-1}
    rows={1}
    readOnly
  />
}

export { TypingTextArea }
