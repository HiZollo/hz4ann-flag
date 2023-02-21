import type { Dispatch, SetStateAction } from 'react'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import { useAutosizeTextArea } from '@/utils/useAutosizeTextArea'
import { wait } from '@/utils/wait'
import styles from '@/styles/Home.module.css'

import Flags from '@/data/flags.json'

const letter = 
`To Zollo:
     This is a super secret letter, so I encrypted it with my special method. If thou art reading this, that probably meanth thou hast already decoded the content.
     Anyway, the reason why this letter is top secret is that it is going to tell thee the secret password of a flag. Once thou getest the password, go to the event website and enter it.
     This information is very sensitive, please keep it private.
     The password of the flag hath been showned, but it is unfortunately not on this letter due to security issue. Try get the password by thyself. Password is hiding, but in the place thou canst see it.

Sincerely,
AC`

export default function () {
  const [content, setContent] = useState('_')
  const [correct, setCorrect] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [value, setValue] = useState('')
  const [wrongTime, setWrongTime] = useState(0)
  const WRONG_LIMIT = 3
  const textareaRef = useRef(null)
  const { current: offset } = useRef(~~(Math.random() * 25) + 1)
  const { current: text } = useRef(Caesar(letter, offset))
  const answer = Caesar("Caesar", 26-offset)

  useAutosizeTextArea(textareaRef.current, content)

  useEffect(() => {
    type(text.split('\n'), setContent)

    return () => setContent('_')
  }, [])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }


  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') submit()
  }

  const submit = () => {
    if (wrongTime >= WRONG_LIMIT) return
    if (value === answer) {
      setCorrect(true)
      setWrongTime(3)
      return
    }
    setWrong(true)
    setWrongTime(v => v + 1)
  }

  return (
    <>
      <h1>Caesar</h1>
      <textarea 
        ref={textareaRef}
        className={styles.intro}
        value={content}
        tabIndex={-1}
        rows={1}
        readOnly
      />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        gap: '20px',
        margin: '10px'
      }}>
        <Input value={value} onKeyDown={handleKeyDown} onChange={handleChange} disabled={wrongTime >= WRONG_LIMIT} />
        <Button text="確認" onClick={submit} disabled={wrongTime >= WRONG_LIMIT}/>
      </div>
      <PopupWrapper open={correct} handleClose={() => setCorrect(false)}>
        {Flags.LEVEL1_CAESAR}
      </PopupWrapper>
      <PopupWrapper open={wrong} handleClose={() => setWrong(false)}>
        密碼錯誤
      </PopupWrapper>
    </>
  )
}

function Caesar(text: string, offset: number) {
  return text.replace(/[a-z]/g, (ch) => {
    const ch_c = ch.charCodeAt(0)
    const dest = ch_c + offset
    return String.fromCharCode(
      dest <= 122 ? dest : dest % 122 + 96
    )
  })
  .replace(/[A-Z]/g, (ch) => {
    const ch_c = ch.charCodeAt(0)
    const dest = ch_c + offset
    return String.fromCharCode(
      dest <= 90 ? dest : dest % 90 + 64
    )
  })
}

async function type(text: string[], appendContent: Dispatch<SetStateAction<string>>) {
  let acc = ''
  for (const sentence of text) {
    for (const ch of sentence) {
      acc += ch
      appendContent(acc + '_') 
      await wait(20)
    }

    await wait(100)
    acc += '\n'
    appendContent(acc + '_')
    await wait(10)
    acc += '\n'
    appendContent(acc + '_')
    await wait(1500)
  }
  acc = ''
}
