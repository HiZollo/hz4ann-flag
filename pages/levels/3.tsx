import $ from 'classnames';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from '@/styles/RubiksCube.module.css';
import { PopupWrapper } from '@/components/popup';

import Flags from '@/data/flags.json';

const BOARD_SIZE = 4;
const SHUFFLE_COUNT = 10 * BOARD_SIZE;

interface BoardProps {
  board: string[][];
  setBoard: Dispatch<SetStateAction<string[][]>>;
  disabled: boolean;
}

interface ControlGridProps {
  disabled: boolean;
  text: string;
  onClick: () => any;
}

export default function() {
  const [board, setBoard] = useState([[Flags.LEVEL3_HIDDEN_SQUARE]]);
  const [win, setWin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setBoard(newBoard(BOARD_SIZE, SHUFFLE_COUNT));
  }, []);

  if (!win && winBoard(board)) {
    setWin(true);
    setOpen(true);
  }

  return (
    <>
      <p>聽過二維魔方嗎？</p>

      <Board board={board} setBoard={setBoard} disabled={win} />
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {Flags.LEVEL3_SQUARE}
      </PopupWrapper>
    </>
  );
}

function newBoard(size: number, shuffle: number): string[][] {
  let board = Array.from({ length: size }, (_, i) => (
    Array.from({ length: size }, (_, j) => `${i * size + j + 1}`)
  ));

  while (shuffle--) {
    const r = Math.floor(Math.random() * 4);
    const n = Math.floor(Math.random() * size);
    board = [boardUp, boardDown, boardLeft, boardRight][r](board, n);
  }

  return board;
}

function boardUp(board: string[][], c: number): string[][] {
  const newBoard = JSON.parse(JSON.stringify(board)) as string[][];
  const size = board.length;

  let t = newBoard[0][c];
  for (let i = 1; i < size; i++) {
    newBoard[i-1][c] = newBoard[i][c];
  }
  newBoard[size-1][c] = t;

  return newBoard;
}

function boardDown(board: string[][], c: number): string[][] {
  const newBoard = JSON.parse(JSON.stringify(board)) as string[][];
  const size = board.length;

  let t = newBoard[size-1][c];
  for (let i = size-1; i > 0; i--) {
    newBoard[i][c] = newBoard[i-1][c];
  }
  newBoard[0][c] = t;
  
  return newBoard;
}

function boardLeft(board: string[][], r: number): string[][] {
  const newBoard = JSON.parse(JSON.stringify(board)) as string[][];
  const size = board[0].length;

  let t = newBoard[r][0];
  for (let i = 1; i < size; i++) {
    newBoard[r][i-1] = newBoard[r][i];
  }
  newBoard[r][size-1] = t;

  return newBoard;
}

function boardRight(board: string[][], r: number): string[][] {
  const newBoard = JSON.parse(JSON.stringify(board)) as string[][];
  const size = board[0].length;

  let t = newBoard[r][size-1];
  for (let i = size-1; i > 0; i--) {
    newBoard[r][i] = newBoard[r][i-1];
  }
  newBoard[r][0] = t;
  
  return newBoard;
}

function winBoard(board: string[][]): boolean {
  const size = board.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (`${i * size + j + 1}` !== board[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function Board({ board, setBoard, disabled }: BoardProps): JSX.Element {
  return (
    <div className={styles.board}>
      <div key={0} className={styles.row}>
        <div key={0} className={$(styles['grid'], styles['grid-corner'])}></div>{
          board.map((_, i) => 
            <ControlGrid key={i+1} disabled={disabled} text="⬆️" onClick={() => setBoard(boardUp(board, i))} />
          )
        }<div key={board[0].length} className={$(styles['grid'], styles['grid-corner'])}></div>
      </div>
      {
        board.map((row, i) => 
          <div key={i+1} className={styles.row}>
            <ControlGrid key={0} disabled={disabled} text="⬅️" onClick={() => setBoard(boardLeft(board, i))} />
            {
              row.map((v, j) => 
                <div key={j+1} className={styles.grid}>{v}</div>
              )
            }
            <ControlGrid key={board[0].length} disabled={disabled} text="➡️" onClick={() => setBoard(boardRight(board, i))} />
          </div>
        )
      }
      <div key={board.length} className={styles.row}>
        <div key={0} className={$(styles['grid'], styles['grid-corner'])}></div>{
          board.map((_, i) => 
            <ControlGrid key={i+1} disabled={disabled} text="⬇️" onClick={() => setBoard(boardDown(board, i))} />
          )
        }<div key={board[0].length} className={$(styles['grid'], styles['grid-corner'])}></div>
      </div>
    </div>
  );
}

function ControlGrid({ disabled, text, onClick }: ControlGridProps): JSX.Element {
  return (
    <div
      className={$(styles['grid'], styles[disabled ? 'grid-control-disabled' : 'grid-control'])}
      onClick={() => disabled ? 'A' : onClick()}
    >
      {text}
    </div>
  )
}