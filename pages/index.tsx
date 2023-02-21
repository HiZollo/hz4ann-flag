import type { Dispatch, SetStateAction } from 'react'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import styles from '@/styles/Home.module.css'
import { Button } from '@/components/button'
import { PopupWrapper } from '@/components/popup'
import { HomeButtons } from '@/components/homeButtons'
import { useAutosizeTextArea } from '@/utils/useAutosizeTextArea'
import { wait } from '@/utils/wait'

import Flags from '@/data/flags.json'

export default function Home() {
  const [content, setContent] = useState('_')
  const [open, setOpen] = useState(false)
  const textareaRef = useRef(null)

  useAutosizeTextArea(textareaRef.current, content)

  useEffect(() => {
    type(setContent)

    return () => setContent('_')
  }, [])

  return (
    <>
      <h1>HiZollo 四週年搶旗活動</h1>
      <textarea 
        ref={textareaRef}
        value={content} 
        className={styles.intro} 
        tabIndex={-1} 
        rows={1}
        readOnly
      /> 
      <Button text="開始遊戲" style={{ margin: '20px' }} onClick={() => setOpen(true)} /> 
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {Flags.START_UP}
      </PopupWrapper>
      <HomeButtons />
    </>
  )
}

const content = [
  '歡迎來到 HiZollo 四周年 CTF 活動。', 
  'CTF（Capture The Flag）是一種尋找旗子（flag）的遊戲，你會需要在這個網頁中找到旗子，並把旗子帶給 HiZollo。', 
  '旗子會是一串格式如 hz4ann_flag_{<content>} 的字串，其中的 <content> 可以是任意字串。但旗子的內容並不一定會連續出現，某些旗子會是以片段的形式存在，你必須把它們拼湊成完整的旗子。', 
  '我們在這個網頁的各個你想得到的地方都藏了旗子，當你找到旗子後記得用 z!capture 交給 HiZollo。', 
  '我話就說到這，祝好運。'
]

async function type(appendContent: Dispatch<SetStateAction<string>>) {
  let acc = ''
  for (const sentence of content) {
    for (const ch of sentence) {
      acc += ch
      appendContent(acc + '_') 
      await wait(20)
    }

    await wait(100)
    acc += '\n'
    appendContent(acc + '_')
    await wait(10)
    acc += '\n'
    appendContent(acc + '_')
    await wait(1500)
  }
  acc = ''
}
