import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'

import styles from '@/styles/Songs.module.css'

import Flags from '@/data/flags.json'

const HAS_TO_GUESSED = 4

const answers = [
  // left, lf, front, rf, right
  ["再出發", "傷心的人別聽慢歌", "Do You Want To Build a Snowman?", "擊敗人", "破浪"],
  ["Faded", "Do You Hear the People Sing?", "乾杯", "小酒窩", "皮囊"],
  ["櫻花瓣", "笑忘歌", "Bohemian Rhapsody", "挪威的森林", "不為誰而作的歌"],
  ["Despacito", "洗衣機", "知足", "三生三世", "漂向北方"],
  ["Alone", "童話", "子曰", "明明就", "風箏"],
  ["達拉崩吧", "Let It Go", "那些你很冒險的夢", "小幸運", "起飛"],
  ["Sing Me To Sleep", "連名帶姓", "夢想藍圖", "星晴", "聽媽媽的話"],
  ["忠孝東路走九遍", "最後的8/31", "離開地球表面", "夏至未至", "演員"],
  ["體面", "告白氣球", "Alone", "鹿港小鎮", "啟程"],
  ["Never Gonna Give You Up", "你是我的花朵", "戀愛ing", "不能說的秘密", "修煉愛情"],
  ["那些年", "千里之外", "看見夕陽了嗎", "蒲公英的約定", "因為有你"],
]

export default function Page() {
  const { current: question } = useRef(~~(Math.random() * 11) + 1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const answer = answers[question - 1]

  const [front, setFront] = useState("")
  const [rf, setRf] = useState("")
  const [lf, setLf] = useState("")
  const [right, setRight] = useState("")
  const [left, setLeft] = useState("")

  const [win, setWin] = useState(false)
  const [end, setEnd] = useState(false)
  const [open, setOpen] = useState(false)
  const [losePopupOpen, setLosePopupOpen] = useState(false)
  const [cc, setCc] = useState(0)

  const handleInput = (position: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (position === "front") return setFront(e.currentTarget.value)
      if (position === "rf") return setRf(e.currentTarget.value)
      if (position === "lf") return setLf(e.currentTarget.value)
      if (position === "right") return setRight(e.currentTarget.value)
      if (position === "left") return setLeft(e.currentTarget.value)
    }
  }

  useEffect(() => {
    do {
      if (win) {
        setOpen(true)
        break
      }
      if (end) setLosePopupOpen(true)
    } while(false)
  }, [end])

  const submit = () => {
    if (end) return
    const correctCount = checkCorrectCount()
    setCc(correctCount)
    if (correctCount >= HAS_TO_GUESSED) setWin(true)
    setEnd(true)
  }

  const checkCorrectCount = () => {
    let correct_count = 0
    if (left === answer[0]) ++correct_count
    if (lf === answer[1]) ++correct_count
    if (front === answer[2]) ++correct_count
    if (rf === answer[3]) ++correct_count
    if (right === answer[4]) ++correct_count
    return correct_count
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `/resources/17/${question}.mp3`
    }
  }, [])

  return <>
    <h1>聽歌</h1>
    <p>你來到了音樂表演現場</p>
    <p>你前方、左前、右前、左邊和右邊一共有 5 個表演</p>
    <p>請仔細聆聽他們的表演，並回答出每一首表演曲的名稱</p>
    <p>貼心小提示：</p>
    <ol>
      <li>要以原文回答出完整的歌曲名稱，包含拉丁字母的大小寫及標點符號。</li>
      <li>他們的表演曲以華語歌為主。</li>
    </ol>
    <audio src="" ref={audioRef} controls />
    <div id={styles.stage}>
      <div>
        <Input value={front} onChange={handleInput("front")} placeholder="請輸入正前方的歌曲名稱" disabled={end} />
      </div>
      <div>
        <Input value={lf} onChange={handleInput("lf")} placeholder="請輸入左前方的歌曲名稱" disabled={end} />
        <Input value={rf} onChange={handleInput("rf")} placeholder="請輸入右前方的歌曲名稱" disabled={end} />
      </div>
      <div>
        <Input value={left} onChange={handleInput("left")} placeholder="請輸入正左方的歌曲名稱" disabled={end} />
        <Input value={right} onChange={handleInput("right")} placeholder="請輸入正右方的歌曲名稱" disabled={end} />
      </div>
    </div>
    <Button text="確認" onClick={submit} disabled={end} />
    <PopupWrapper open={open} handleClose={() => setOpen(false)}>
      {cc === 5 ? "你五首歌都答對了，這是你的 Flag" : "雖然你答錯了其中一首，但我想你還是可以獲得 Flag"}<br />
      {Flags.LEVEL17_SONGS}
    </PopupWrapper>
    <PopupWrapper open={losePopupOpen} handleClose={() => setLosePopupOpen(false)}>
      其中 {5 - cc} 首歌是錯的。
    </PopupWrapper>
  </>
}
