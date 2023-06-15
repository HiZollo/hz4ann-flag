import { useState, useRef } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import styles from '@/styles/GuessAB.module.css'

import Flags from '@/data/flags.json'

const MAX_ATTEMPT_COUNT = 10 as const

type ABDiffCount = [number, number]

enum ButtonText {
  one = "1", two = "2", three = "3",
  four = "4", five = "5", six = "6", 
  seven = "7", eight = "8", nine = "9",
  zero = "0", clear = "C", back = "<",
}


const inputButtonLayout = [
  ButtonText.one, ButtonText.two, ButtonText.three,
  ButtonText.four, ButtonText.five, ButtonText.six,
  ButtonText.seven, ButtonText.eight, ButtonText.nine,
  ButtonText.clear, ButtonText.zero, ButtonText.back,
]

export default function () {
  const { current: answer } = useRef(generateQuestion())
  const [guessNumber, setGuessNumber] = useState("")
  const [lastGuessNumber, setLastGuessNumber] = useState("")
  const [lastGuessResult, setLastGuessResult] = useState<ABDiffCount>([0, 0])
  const [attempCount, setAttemptCount] = useState(0)

  const [win, setWin] = useState(false)
  const [lose, setLose] = useState(false)

  const [winPopupOpen, setWinPopupOpen] = useState(false)
  const [losePopupOpen, setLosePopupOpen] = useState(false)

  const end = () => win || lose

  const amIDisabled = (n: ButtonText) => {
    if (end()) return true
    if (n === ButtonText.clear || n === ButtonText.back) return false
    return guessNumber.includes(n) || guessNumber.length === 8
  }

  const handleClick = (n: ButtonText) => {
    if (amIDisabled(n)) return () => {}
    if (n === ButtonText.clear) return () => setGuessNumber("")
    if (n === ButtonText.back) return () => setGuessNumber(prev => prev.slice(0, -1))
    return () => setGuessNumber(prev => `${prev}${n}`)
  }

  const submit = () => {
    if (end()) return
    if (guessNumber.length < 8) return
    setLastGuessNumber(guessNumber)
    const result = compareAB(guessNumber, answer)
    setLastGuessResult(result)
    setGuessNumber("")
    if (result[0] === 8) winning()
    else if (attempCount === MAX_ATTEMPT_COUNT - 1) losing()
    setAttemptCount(prev => prev + 1)
  }

  const winning = () => {
    setWin(true)
    setWinPopupOpen(true)
  }

  const losing = () => {
    setLose(true)
    setLosePopupOpen(true)
  }

  return (
    <>
      <h1>猜數字</h1>
      {
        lastGuessNumber && <>
          <h2>
            {lastGuessNumber} 的結果是 <GuessResult
              result={lastGuessResult}
            />
          </h2>
          <div id={styles.attemptCountDisplay}>總猜測次數：{attempCount}</div>
        </>
      }
      <Input value={guessNumber} readOnly />
      <div id={styles.buttons}>
        {inputButtonLayout.map(t => 
          <Button 
            key={`input_button_${t}`} 
            text={t} 
            onClick={handleClick(t)}
            disabled={amIDisabled(t)}
          />
        )}
        <Button 
          id={styles.submit} 
          text="猜測"
          onClick={submit}
          disabled={guessNumber.length < 8}
        />
      </div>
      <PopupWrapper open={winPopupOpen} handleClose={() => setWinPopupOpen(false)}>
        {Flags.LEVEL11_GUESSAB}
      </PopupWrapper>
      <PopupWrapper open={losePopupOpen} handleClose={() => setLosePopupOpen(false)}>
        你猜太多次了
      </PopupWrapper>
    </>
  )
}

interface GuessResultProps {
  result: ABDiffCount
}

function GuessResult({ result }: GuessResultProps) {
  const [a, b] = result

  return <div className={styles.tooltip}>
    <span data-tooltip={`${a} 個數字對了並且在正確位置\n${b} 個數字對了但不在正確位置`}>{a} A {b} B</span>
  </div>
}

function generateQuestion() {
  return getRandomNumber(8)
}

function compareAB(a: string, b: string): ABDiffCount {
  const ab: ABDiffCount = [0, 0]
  for(let i = 0; i < a.length; ++i) {
    const digit = a[i]
    const index = b.indexOf(digit)
    if (index === -1) continue

    if (index === i) ++ab[0]
    else ++ab[1]

  }
  return ab;
}


// https://stackoverflow.com/questions/50073055/how-to-get-a-random-number-without-duplicate-digits-in-javascript-jquery
function getRandomNumber(n: number){
  const digits = Array.from({ length: 10 }, (_, i) => i);
  const result = Array.from({ length: n }, () => {
    const randIndex = Math.floor(Math.random() * digits.length);
    const digit = digits[randIndex];
    digits.splice(randIndex, 1);
    return digit;
  });
  return result.join('');
}
