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
`Hail Zollo,
I pen this missive with the utmost care, bearing secrets that are meant only for thine ears. Verily, this letter is guarded by my own hand, and its contents shrouded in a veil of secrecy, which only thy astuteness can decrypt.
In disclosure, I bestowed upon thee the key to the password that unlocks a banner of great esteem. When thou hast secured this key, I implore thee to visit the portal with great haste and unlock the gateway that guards the knowledge of highest import. Let it be known that it is for thine eyes only; therefore, I beseech thee, to guard it with the utmost care and discretion.
Though I may not disclose the password in this correspondence, let it be known that it exists in plain sight, waiting to be deciphered with all thy astuteness. May thy diligence and vigilance be heightened, my friend, for the answer lies before thy vision.
In closing, stay assured that I trust thee with this knowledge and hold no reservations about thy ability to decipher the secrets within the confines of this epistle. May fortune smile upon thee in thy quest for this password, and may it bring thee good tidings.
Ever your devoted servant,
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
      setWrongTime(WRONG_LIMIT)
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
        <Input value={value} placeholder="請輸入密碼" onKeyDown={handleKeyDown} onChange={handleChange} disabled={wrongTime >= WRONG_LIMIT} />
        <Button text="確認" onClick={submit} disabled={wrongTime >= WRONG_LIMIT}/>
      </div>
      <PopupWrapper open={correct} handleClose={() => setCorrect(false)}>
        {Flags.LEVEL1_CAESAR}
      </PopupWrapper>
      <PopupWrapper open={wrong} handleClose={() => setWrong(false)}>
        密碼錯誤 ({wrongTime}/{WRONG_LIMIT})
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
