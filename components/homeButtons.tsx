import { createContext, useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import $ from 'classnames'
import styles from '@/styles/Home.module.css'
import { LightsUp } from '@/utils/LightsUp'
import { PopupWrapper } from '@/components/popup'

import Flags from '@/data/flags.json'

const Game = createContext(new LightsUp());

function HomeButtons() {
  const [game, setGame] = useState(new LightsUp())
  const [open, setOpen] = useState(false)
  const [opened, setOpened] = useState(false)
  const [, refresh] = useState(true)

  const flip = (x: number, y: number) => {
    game.flip(x, y)
    refresh(v => !v)
  }

  useEffect(() => {
    if (!opened && game.win) {
      setOpen(true)
      setOpened(true)
    }
  })

  return (
    <>
      <h2>關卡</h2>
      <Game.Provider value={game}>
        <div id={styles.buttons}>
          {
            game.board.map((rows, rowNum) => {
              return rows.map((value, colNum) => {
                return <Button 
                  key={rowNum*5+colNum} 
                  row={rowNum} 
                  col={colNum} 
                  flip={flip}
                /> 
              })
            })
          }
        </div>
      </Game.Provider>
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {Flags.LIGHTS_UP}
      </PopupWrapper>
    </>
  )  
}
interface ButtonProps {
  row: number
  col: number
  flip: (x: number, y: number) => void
}

function Button({ row, col, flip }: ButtonProps) {
  const index = row*5 + col + 1
  const game = useContext(Game)

  const state = game.board[row][col]

  return (
    <Link 
      className={styles.levelButtonLink} 
      href={`/levels/${index < 5 ? index : index + 1}`} 
      onClick={() => flip(row, col)}
      onContextMenu={() => flip(row, col)}
    >
      <button className={$(styles.levelButton, {
        [styles.light]: state,
        [styles.dark]: !state
      })}>
        {index}
      </button>
    </Link>
  );
}

export { HomeButtons }
