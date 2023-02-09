import { useState, useReducer } from "react";
import $ from "classnames";
import styles from '@/styles/FlipTrip.module.css'
import { FlipTrip } from "@/utils/FlipTrip";
import { PopupWrapper } from '@/components/popup'

const COLORS = 3;
const SIZE = 4;

interface ButtonProps {
  position: number
  color: number
  disabled: boolean
  flip(position: number): void
}

interface PopupOpenType {
  win: boolean,
  lose: boolean
}

export default function() {
  const [game] = useState(new FlipTrip(COLORS, SIZE));
  const [ended, setEnded] = useState(false);
  const [, refresh] = useState(false);
  const [open, updateOpen] = useReducer(
    (prev: PopupOpenType, update: Partial<PopupOpenType>) => ({ ...prev, ...update }), 
    { win: false, lose: false }
  )

  function flip(position: number) {
    game.flip(position);

    if (game.endStatus) {
      setEnded(true);

      if (game.endStatus === 'Win') {
        updateOpen({ win: true }) 
      }

      if (game.endStatus === 'Lose') {
        updateOpen({ lose: true })
      }


      return;
    }

    refresh(v => !v);
  }

  return (
    <>
      <div className={styles.fliptrip}>{
        Array.from({ length: SIZE }, (_, i) => {
          return <Button key={i} position={i} color={game.state[i]} disabled={ended} flip={flip} />
        })
      }</div>
      <PopupWrapper open={open.win} handleClose={() => updateOpen({ win: false })}>
        你贏了！
      </PopupWrapper>
      <PopupWrapper open={open.lose} handleClose={() => updateOpen({ lose: false })}>
        你輸了！
      </PopupWrapper>
    </>
  );
}

function Button({ position, color, disabled, flip }: ButtonProps) {
  return (
    <div
      className={$(styles.fliptripPiece, {
        [styles.disabled]: disabled
      })}
      onClick={() => flip(position)}
    >{color}</div>
  );
}
