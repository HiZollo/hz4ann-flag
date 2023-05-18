import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import Flags from '@/data/flags.json'

const translate = ['完全一度', '小二度', '大二度', '小三度', '大三度', '完全四度', '增四度', '完全五度', '小六度', '大六度', '小七度', '大七度', '完全八度']

const answers = [
  [6, 8, 11, 4, 5, 8, 12, 2, 8, 1]
]

export default function() {
  const [played, setPlayed] = useState(false)
  const [nowIndex, setNowIndex] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [open, setOpen] = useState(false)
  const question = useRef(~~(Math.random() * 1) + 1)
  const answer = useRef(answers[question.current - 1])
  const audioRef = useRef<HTMLAudioElement>(null)

  const attempt = (ans: number) => {
    if (wrong) return
    const correct = answer.current[nowIndex]
    if (ans === correct) {
      if (nowIndex === 9) return win()
      setNowIndex((v) => v + 1)
      return
    }
    setWrong(true)
  }

  const win = () => {
    setWrong(true)
    setPlayed(true)
    setOpen(true)

  }

  const playAudio = () => {
    if (played) return
    if (wrong) return
    if (!audioRef.current) return
    setPlayed(true)
    audioRef.current.play()
  }

  return (
    <>
      <h1>音程聽力測驗</h1>
      <p>請聆聽以下音檔，並依照和聲出現的順序點擊對應的音程按鈕。</p>
      <p>你必須完全正確的答對以獲得一個 Flag</p>

      <Button text="開始播放" disabled={played || wrong} onClick={playAudio} style={{ margin: '30px' }} />
      <audio ref={audioRef}>
        <source src={`/resources/3/${question.current}.mp3`} />
      </audio>

      <div style={{ display:'flex', flexFlow: 'row wrap', gap: '10px', margin: '12px', justifyContent: 'center' }}>
        {translate.map((v, i) => {
          return <Button key={v} text={v} disabled={wrong} onClick={() => attempt(i)} />
        })}
      </div>
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {Flags.LEVEL4_INTERVAL}
      </PopupWrapper>
    </>
  )
}
