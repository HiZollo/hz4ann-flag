import { useState, useRef } from 'react'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import styles from '@/styles/Interesting.module.css'

import Flags from '@/data/flags.json'

export default function () {
  const [story, setStory] = useState("")

  const [not300, setNot300] = useState(false)
  const [notInteresting, setNotInteresting] = useState(false)
  const [win, setWin] = useState(false)
  const [end, setEnd] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.currentTarget.value)
  }

  const submit = () => {
    if (end) return

    if (story.trim().length < 300) {
      setNot300(true)
    }

    else if (!story.includes("趣")) {
      setNotInteresting(true)
    }

    else {
      setWin(true)
    }

    setEnd(true)
  }
  
  return (
    <>
      <h1>寫故事</h1>
      請寫一個 300 字以上且有趣的故事。
      <textarea className={styles.textarea} value={story} onChange={handleChange} disabled={end} />
      <Button text="送出" onClick={submit} disabled={end}/>
      <PopupWrapper open={not300} handleClose={() => setNot300(false)}>
        你的故事不到 300 字。
      </PopupWrapper>
      <PopupWrapper open={notInteresting} handleClose={() => setNotInteresting(false)}>
        你的故事完全是無趣的呢。
      </PopupWrapper>
      <PopupWrapper open={win} handleClose={() => setWin(false)}>
        {Flags.LEVEL6_INTERESTING}
      </PopupWrapper>
    </>
  )
}
