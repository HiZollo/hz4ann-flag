import { useState, useEffect } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import styles from '@/styles/Typing.module.css'

import Flags from '@/utils/flagUtils';

const text = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna ut enim veniam quis exercitation nisi ut aliquip ex ea comodo consequat eu fugiat nulla excepteur sunt in culpa deserunt id est laborum."

export default function () {
  const [words, setWords] = useState<string[]>([])
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [finishedWords, setFinishedWords] = useState<string[]>([])
  const [unfinishedWords, setUnfinishedWords] = useState<string[]>([])


  const [input, setInput] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [failed, setFailed] = useState(false)
  const [win, setWin] = useState(false)
  const [end, setEnd] = useState(false)
  const [open, setOpen] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  useEffect(() => {
    const w = text.split(" ")
    setWords(w)
    setUnfinishedWords(w.slice(1))
    setStartTime(Date.now())
  }, [])

  const handleChange = ({ currentTarget }: React.KeyboardEvent<HTMLInputElement>) => {
    setInput(currentTarget.value.trim())
  }

  const handleKeyDown = ({ keyCode }: React.KeyboardEvent<HTMLInputElement>) => {
    // Space and Enter
    if (keyCode === 32 || keyCode === 13) {
      if (words[currWordIndex] === input.trim()) {
        setInput("")
        if (currWordIndex < words.length - 1) {
          increment()
          return
        }
        increment()
        winning()
        return
      }

      fail()
    }
  }

  function increment() {
    setFinishedWords(now => [...now, words[currWordIndex]])
    setUnfinishedWords(unfinishedWords.splice(1))
    setCurrWordIndex(now => now + 1)
  }

  function fail() {
    setFailed(true)
    setDisabled(true)
    setEnd(true)
  }

  function winning() {
    setWin(true)
    setDisabled(true)
  }

  function handleWinButtonClick() {
    if (failed) return
    if (!win) return
    if (end) return
    setEndTime(Date.now())
    setOpen(true)
    setEnd(true)
  }

  return (
    <>
      <h1>Typing</h1>
      <p>Flag 將在一分鐘後失效。</p>

      <div id={styles.wordList}>
      {
        failed ?
          <span className={styles.unfinished}>{words.join(' ')}</span>
          :
          <>
            <span className={styles.finished}>{finishedWords.join(' ')} </span>
            <span className={styles.now}>{words[currWordIndex]} </span>
            <span className={styles.unfinished}>{unfinishedWords.join(' ')}</span>
          </>
      }
      </div>
      <Input 
        id={styles.typingArea} 
        value={input} 
        onChange={handleChange} 
        onKeyDown={handleKeyDown} 
        disabled={disabled || end}
        placeholder={words[currWordIndex]}
      />
      <Button text={ win ? "獲取 Flag" : "完成打字測驗以獲得 Flag" } disabled={!win || end} onClick={handleWinButtonClick} />
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {endTime - startTime > 60e3 ?
          "Flag 已失效" : Flags.LEVEL8_TYPING}
      </PopupWrapper>
    </>
  )
}

