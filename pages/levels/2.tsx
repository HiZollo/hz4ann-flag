import styles from '@/styles/FlipTrip.module.css'
import { FlipTrip } from "@/utils/FlipTrip";
import { useState } from "react";
import $ from "classnames";

const COLORS = 3;
const SIZE = 4;

interface ButtonProps {
  position: number
  color: number
  disabled: boolean
  flip(position: number): void
}

export default function() {
  const [game] = useState(new FlipTrip(COLORS, SIZE));
  const [ended, setEnded] = useState(false);
  const [, refresh] = useState(false);

  function flip(position: number) {
    game.flip(position);

    if (game.endStatus) {
      setEnded(true);
      return;
    }

    refresh(v => !v);
  }

  return (
    <div className={styles.fliptrip}>{
      Array.from({ length: SIZE }, (_, i) => {
        return <Button key={i} position={i} color={game.state[i]} disabled={ended} flip={flip} />
      })
    }</div>
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