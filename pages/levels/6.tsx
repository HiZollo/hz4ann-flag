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

    setStory('')
    setEnd(true)
  }
  
  return (
    <>
      <h1>寫故事</h1>
      <p>好無聊…我在這裡只有孤單一個人</p>
      <p>你可以跟我說個有趣的故事嗎？</p>
      <p>最好是超過 300 個字，謝謝你</p>

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
