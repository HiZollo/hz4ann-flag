import { useState, useReducer } from "react";
import $ from "classnames";
import styles from '@/styles/FlipTrip.module.css'
import { FlipTrip } from "@/utils/FlipTrip";
import { PopupWrapper } from '@/components/popup'
import { Button } from "@/components/button";
import Flags from '@/data/flags.json';

const COLORS = 3;
const SIZE = 4;

interface FlipTripPiecesProps {
  size: number;
  states: number[];
  ended: boolean;
  flip(position: number): void
}

interface FlipTripPieceProps {
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
  const [game, setGame] = useState(new FlipTrip(COLORS, SIZE));
  const [size, _setSize] = useState(SIZE);
  const [ended, setEnded] = useState(false);
  const [, refresh] = useState(false);
  const [open, updateOpen] = useReducer(
    (prev: PopupOpenType, update: Partial<PopupOpenType>) => ({ ...prev, ...update }), 
    { win: false, lose: false }
  )

  function flip(position: number) {
    if (ended) return;

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

  function restart() {
    setGame(new FlipTrip(COLORS, size));
    setEnded(false);
  }

  return (
    <>
      <h1>色彩</h1>

      <p>在這個只有黑底綠字的世界裡</p>
      <p>只有這裡才有黃色的溫暖、青色的秀氣、紫色的性感</p>
      <p>你有 {size} 桶顏料、{COLORS} 種色彩，盡可能地造出新顏色吧</p>
      <p>小心別造出重複的顏色，綠色以外的顏色太刺眼了</p>
      
      <br />

      <div className={styles.fliptrip}>
        <FlipTripPieces size={size} ended={ended} states={game.states} flip={flip} />
        <div style={{ fontSize: '2em', margin: 30, color: ended ? 'gray' : 'white' }}>=</div>
        <div className={styles.fliptripResult} style={{ backgroundColor: getColor(game.states, ended) }}></div>
      </div>
      <PopupWrapper open={open.win} handleClose={() => updateOpen({ win: false })}>
        你完美地展示了所有可能不同的顏色，拿去吧，這面旗是屬於你的：{Flags.FLIP_TRIP}
      </PopupWrapper>
      <PopupWrapper open={open.lose} handleClose={() => updateOpen({ lose: false })}>
        這個顏色已經出現過了，仔細思考再行動吧，你對色彩的敏銳度還是不夠
      </PopupWrapper>

      <br />

      <Button text='重新來過' onClick={restart} />
    </>
  );
}

const styleTable = [styles.green, styles.blue, styles.red];
const textTable = ['G', 'B', 'R'];

function FlipTripPieces({ size, ended, states, flip }: FlipTripPiecesProps) {
  const contents = [
    <FlipTripPiece key={0} position={0} color={states[0]} disabled={ended} flip={flip} />
  ];

  for (let i = 1; i < size; i++) {
    contents.push(
      <div key={-i} style={{ fontSize: '2em', color: ended ? 'gray' : 'white' }}>+</div>, 
      <FlipTripPiece key={i} position={i} color={states[i]} disabled={ended} flip={flip} />
    );
  }

  return (
    <div className={styles.fliptripPieces}>{contents}</div>
  );
}

function FlipTripPiece({ position, color, disabled, flip }: FlipTripPieceProps) {
  return (
    <div
      className={$(styles.fliptripPiece, styleTable[color], {
        [styles.disabled]: disabled
      })}
      onClick={() => flip(position)}
    >{textTable[color]}</div>
  );
}

function getColor(states: number[], ended: boolean) {
  const temp = Array.from({ length: COLORS }, () => 0);
  states.forEach(s => temp[(s+1)%3] += 255 / states.length);

  const coef = 255 / Math.max(...temp);
  const colors = temp.map(t => t * coef).map(s => Math.trunc(ended ? (s/2) : s));

  return `rgb(${colors.join(',')})`;
}