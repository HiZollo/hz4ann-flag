import { useState, useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import $ from 'classnames'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'

import Flags from '@/utils/flagUtils';

import styles from '@/styles/Blackcardredcard.module.css'

enum CardType { RED, BLACK }

function Translate(v: CardType) {
  if (v === CardType.RED) return "紅"
  if (v == CardType.BLACK) return "黑"
}

function sequenceToText(sequence: Array<CardType>) {
  return sequence.map(Translate).join('')
}

function appendArrayState<T>(setState: Dispatch<SetStateAction<Array<T>>>) {
  return (newValue: T) => {
    setState(prev => [...prev, newValue])
  }
}

function arrayEqual<T>(a: Array<T>, b: Array<T>) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }

  return true
}

export default function Page() {
  const [playerSequence, setPlayerSequence] = useState<Array<CardType>>([])
  const [computerSequence, setComputerSequence] = useState<Array<CardType>>([])
  const [finishChoose, setFinishChoose] = useState(false)

  const appendPlayerSequence = appendArrayState(setPlayerSequence)
  
  useEffect(() => {
    if (playerSequence.length < 2)
      setComputerSequence([CardType.RED, CardType.RED, CardType.RED])
    else
      setComputerSequence([
        playerSequence[1] === CardType.RED ?
          CardType.BLACK : CardType.RED,
        playerSequence[0],
        playerSequence[1]
      ])
    

  }, [playerSequence])

  const amIDisabledChooseField = () => {
    return playerSequence.length >= 3 || finishChoose
  }

  const inputSequenceButtonClick = (v: CardType) => {
    return () => {
      if (amIDisabledChooseField()) return
      appendPlayerSequence(v)
    }
  }

  const submitSequence = () => {
    if (finishChoose) return
    setFinishChoose(true)
  }

  return <>
    <h1>翻牌小遊戲</h1>
    <p>為了取得 flag，你要在一場公平的賭局獲勝。</p>
    <p>你會和莊家先後分別選擇一個由「紅、黑」組成的三個字的序列。</p>
    <p>接下來，你們會開始翻一副只有紅牌和黑牌的牌。</p>
    <p>誰選擇的序列先出現，誰就獲勝。</p>
    <div id={styles.playerChooseField}>
      請選擇你的序列：
      <Input readOnly value={sequenceToText(playerSequence)} />
      <div id={styles.playerChooseButtons}>
        <Button text="紅" onClick={inputSequenceButtonClick(CardType.RED)} disabled={amIDisabledChooseField()} />
        <Button text="黑" onClick={inputSequenceButtonClick(CardType.BLACK)} disabled={amIDisabledChooseField()} />
        <Button text="<" onClick={
          () => {
          if (!playerSequence.length || finishChoose) return
          setPlayerSequence(
            prev => prev.slice(0, -1)
          )}} disabled={finishChoose || !playerSequence.length} />
  
        <Button text="確認" onClick={submitSequence} disabled={!amIDisabledChooseField() || finishChoose}/>
      </div>
    </div>
    {finishChoose && <Game 
      playerSequence={playerSequence} 
      computerSequence={computerSequence}
    />}
  </>
}

interface GameProps {
  playerSequence: Array<CardType>,
  computerSequence: Array<CardType>
}

function Game({ playerSequence, computerSequence }: GameProps) {
  const [gameSequence, setGameSequence] = useState<Array<CardType>>([])
  const [lastGenerateCardType, setLastGenerateCardType] = useState<CardType | null>(null)
  const [lastGenerateSequence, setLastGenerateSequence] = useState<Array<CardType> | null>(null)

  const [playerWin, setPlayerWin] = useState(false)
  const [computerWin, setComputerWin] = useState(false)

  const [winPopupOpen, setWinPopupOpen] = useState(false)
  const [losePopupOpen, setLosePopupOpen] = useState(false)

  useEffect(() => {
    if (gameSequence.length < 3) {
      setLastGenerateSequence(null)
    } 
    else {
      setLastGenerateSequence(gameSequence.slice(-3))
    }
  }, [gameSequence])

  useEffect(() => {
    do {
      if (lastGenerateSequence === null) break

      const computerWin = arrayEqual(computerSequence, lastGenerateSequence)
      if (computerWin) {
        lose()
        break
      }

      const playerWon = arrayEqual(playerSequence, lastGenerateSequence)
      if (playerWon) {
        win()
      }
    } while (false) 
  }, [lastGenerateSequence])
  
  const appendGameSequence = appendArrayState(setGameSequence)

  const handleNextCard = () => {
    if (playerWin || computerWin) return
    const nextCardType = Math.random() < 0.5 ? CardType.RED : CardType.BLACK
    appendGameSequence(nextCardType)
    setLastGenerateCardType(nextCardType)
  }

  function win() {
    setPlayerWin(true)
    setWinPopupOpen(true)
  }

  function lose() {
    setComputerWin(true)
    setLosePopupOpen(true)
  }

  return <>
    <table id={styles.choiceDisplay}>
      <tbody>
        <tr>
          <td>你的選擇：</td><td>{sequenceToText(playerSequence)}</td>
        </tr>
        <tr>
          <td>電腦的選擇：</td><td>{sequenceToText(computerSequence)}</td>
        </tr>
      </tbody>
    </table>
    <Button 
      id={styles.nextCard} 
      text="翻牌" 
      onClick={handleNextCard}
      disabled={playerWin || computerWin}
    />
    <table id={styles.statusDisplay}>
      <tbody>
        <tr>
          <td>翻出來的卡：</td><td>{lastGenerateCardType !== null ? Translate(lastGenerateCardType) : "—"}</td>
        </tr>
        <tr>
          <td>目前的序列：</td><td>{lastGenerateSequence !== null ? sequenceToText(lastGenerateSequence) : "—"}</td>
        </tr>
      </tbody>
    </table>
    <div id={styles.cardSequenceRow}>
    {
      gameSequence.map((type, i) => {
        return <Card type={type} key={`${i}-${Translate(type)}`} />
      })
    }
    </div>
    <PopupWrapper open={winPopupOpen} handleClose={() => setWinPopupOpen(false)}>
      <p>你的序列{sequenceToText(playerSequence)}先出現了，所以遊戲由你獲勝。</p>
      <p>你的 flag：{Flags.LEVEL10_BLACKRED}</p>
    </PopupWrapper>
    <PopupWrapper open={losePopupOpen} handleClose={() => setLosePopupOpen(false)}>
      <p>電腦的序列{sequenceToText(computerSequence)}先出現了，所以遊戲由電腦獲勝。</p>
      <p>請再接再勵</p>
    </PopupWrapper>

  </>
}

interface CardProps {
  type: CardType
}

function Card({ type }: CardProps) {
  return <div className={$(styles.card, {
    [styles.red]: type === CardType.RED,
    [styles.black]: type === CardType.BLACK
  })} />
}
