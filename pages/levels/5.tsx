import { useState } from 'react'
import $ from 'classnames'
import styles from '@/styles/Fake404.module.css'

import Flags from '@/data/flags.json'

export default function Page() {
  const [open, setOpen] = useState(false)

  const show = () => {
    setOpen(prev => !prev)
  }

  return <>
    <h1 onClick={show}>404</h1>
    喔，糟糕，你好像不小心掉入無人的荒野了。
    <div className={$(styles.collapsable, {
      [styles.collapsed]: !open,
      [styles.open]: open
    })}>
      {Flags.LEVEL5_FAKE404}
    </div>
  </>
}
