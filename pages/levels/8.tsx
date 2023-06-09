import { useState, useEffect } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import styles from '@/styles/Typing.module.css'
import $ from 'classnames'

import Flags from '@/data/flags.json'

const text = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna ut enim veniam quis exercitation nisi ut aliquip ex ea comodo consequat eu fugiat nulla excepteur sunt in culpa deserunt id est laborum."

export default function () {
  const [words, setWords] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [failed, setFailed] = useState(false)
  const [win, setWin] = useState(false)
  const [end, setEnd] = useState(false)
  const [open, setOpen] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  useEffect(() => {
    setWords(text.split(" "))
    setStartTime(Date.now())
  }, [])

  const handleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value)
  }

  const handleKeyDown = ({ keyCode, key }: React.KeyboardEvent<HTMLInputElement>) => {
    // Space and Enter
    if (keyCode === 32 || keyCode === 13) {
      if (checkMatch()) {
        setInput("")
        if (currWordIndex < words.length - 1) {
          setCurrWordIndex(now => now + 1)
          return
        }
        setCurrWordIndex(now => now + 1)
        winning()
        return
      }

      fail()
    }
  }

  const checkMatch = () => {
    const wordToCompare = words[currWordIndex]
    return wordToCompare === input.trim()
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
      Flag 將在一分鐘後失效。
      <div id={styles.wordList}>
      {
        words.map((w, i) => <span key={i} className={
          $({ 
            [styles.finished]: i < currWordIndex,
            [styles.now]: !failed && currWordIndex === i,
            [styles.unfinished]: i > currWordIndex || (failed && currWordIndex === i)
          })
        }>
          <span>{w}</span>
          <span> </span>
        </span>)
      }
      </div>
      <Input id={styles.typingArea} value={input} onChange={handleChange} onKeyDown={handleKeyDown} disabled={disabled || end} />
      <Button text={ win ? "獲取 Flag" : "完成打字測驗以獲得 Flag" } disabled={!win || end} onClick={handleWinButtonClick} />
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {endTime - startTime > 60e3 ?
          "Flag 已失效" : Flags.LEVEL8_TYPING}
      </PopupWrapper>
    </>
  )
}

