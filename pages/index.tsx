import Head from 'next/head'
import { useState } from 'react'
import styles from '@/styles/Home.module.css'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import { HomeButtons } from '@/components/homeButtons'
import { TypingTextArea } from '@/components/typingTextArea'

import Flags from '@/utils/flagUtils';

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>HiZollo 四週年搶旗活動</h1>
      <TypingTextArea
        text={mpContent}
      />
      <Button text="開始遊戲" style={{ margin: '20px' }} onClick={() => setOpen(true)} /> 
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {Flags.START_UP}
      </PopupWrapper>
      <HomeButtons />
    </>
  )
}

const mpContent = [
  '歡迎來到 HiZollo 四周年 CTF 活動。', 
  'CTF（Capture The Flag）是一種尋找旗子（flag）的遊戲，你會需要在這個網頁中找到旗子，並把旗子帶給 HiZollo。', 
  '旗子會是一串格式如 hz4ann_flag_{<content>} 的字串，其中的 <content> 可以是任意字串。但旗子的內容並不一定會連續出現，某些旗子會是以片段的形式存在，你必須把它們拼湊成完整的旗子。', 
  '我們在這個網頁的各個你想得到的地方都藏了旗子，當你找到旗子後記得用 z!capture 交給 HiZollo。', 
  '我話就說到這，祝好運。'
]
