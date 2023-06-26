import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import Flags from '@/utils/flagUtils';

const translate = ['完全一度', '小二度', '大二度', '小三度', '大三度', '完全四度', '增四度', '完全五度', '小六度', '大六度', '小七度', '大七度', '完全八度']

const answers = [
  [6, 8, 11, 4, 5, 8, 12, 2, 8, 1],
  [3, 6, 4, 7, 2, 9, 11, 0, 3, 9],
  [8, 10, 4, 7, 4, 1, 9, 8, 5, 5], 
  [8, 5, 8, 6, 7, 6, 10, 8, 3, 4],
  [9, 3, 9, 11, 4, 6, 7, 9, 5, 10], 
  
  [5, 10, 7, 6, 4, 3, 8, 7, 8, 11], 
  [4, 8, 6, 7, 3, 10, 6, 8, 5, 6], 
  [7, 8, 8, 7, 4, 8, 1, 3, 10, 2],
  [5, 3, 9, 9, 7, 1, 5, 3, 8, 6],
  [9, 7, 4, 5, 12, 9, 6, 4, 5, 10],

  [6, 4, 9, 5, 2, 6, 3, 9, 6, 7],
  [8, 3, 7, 10, 11, 6, 12, 5, 9, 9],
  [7, 3, 10, 6, 5, 2, 10, 4, 8, 11],
  [3, 12, 5, 2, 9, 8, 8, 9, 6, 1],
  [9, 9, 4, 7, 8, 6, 3, 10, 9, 6],

  [4, 6, 11, 8, 2, 9, 4, 3, 5, 9],
  [8, 3, 12, 5, 10, 2, 7, 6, 4, 7],
  [9, 4, 7, 5, 6, 10, 3, 10, 8, 5],
  [4, 10, 9, 7, 9, 6, 4, 5, 2, 7],
  [6, 8, 3, 5, 7, 3, 9, 10, 1, 8]
]

export default function() {
  const { current: question } = useRef(~~(Math.random() * 20) + 1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [played, setPlayed] = useState(false)
  const [nowIndex, setNowIndex] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [open, setOpen] = useState(false)
  const answer = answers[question - 1]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `/resources/4/${question}.mp3`
    }
  }, [])

  const attempt = (ans: number) => {
    if (wrong) return
    const correct = answer[nowIndex]
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
      <p>請聆聽以下音檔，並依照和聲出現的順序點擊對應的音程按鈕</p>
      <p>你必須依序正確辨識所有音程以獲得一面旗子</p>

      <Button text="開始播放" disabled={played || wrong} onClick={playAudio} style={{ margin: '30px' }} />
      <audio ref={audioRef} src="" />

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
