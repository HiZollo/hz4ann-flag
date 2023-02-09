import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import Flags from '@/data/flags.json'

export default function() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const { current: disableCount } = useRef(~~(Math.random() * 25) + 1)

  useEffect(() => {
    if (count === disableCount) setOpen(true)
  }, [count])

  return (
    <>
      <h1>按按鈕</h1>
      請按下方的按鈕 100 次以獲得一個 {count >= 100 ? Flags.CLICK_BUTTON : 'Flag' }
      <div  style={{ display: 'flex', flexDirection: 'row', gap: '60px', margin: '30px' }}>
        <Button disabled={count >= disableCount} text="按鈕" onClick={() => setCount(v => v + 1)} />
        <Button text="重來" onClick={() => setCount(0)} />
      </div>
      目前次數：{Math.min(disableCount, count)}
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        按鈕被你按壞了。
      </PopupWrapper>
    </>
  )
}
