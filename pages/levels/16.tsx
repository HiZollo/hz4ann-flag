import { PopupWrapper } from "@/components/popup";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import Flags from '@/data/flags.json'

interface Coords {
  x: number;
  y: number;
}

const WIDTH = 600;
const RADIUS = 30;
const INTERVAL = 10e3;

export default function() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [adjustSpeed, setAdjustSpeed] = useState<({ f: (p: Coords) => void })>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return
    const context = canvas.getContext('2d');
    if (!context) return;

    setAdjustSpeed({ f: draw(context, setOpen) });
  }, []);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const p = getPosition(canvas, e);
    
    if (adjustSpeed?.f) {
      adjustSpeed.f(p);
    }
  }

  return (
    <>
      <h1>騰空</h1>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={WIDTH}
        onClick={handleClick}
        style={{ border: "1px solid green" }}
      ></canvas>
      <PopupWrapper open={open} handleClose={() => setOpen(false)}>
        {Flags.LEVEL16_BOUNCE}
      </PopupWrapper>
    </>
  )
}

function draw(context: CanvasRenderingContext2D, setOpen: Dispatch<SetStateAction<boolean>>) {
  const position: Coords = { x: WIDTH/2, y: WIDTH/2 };
  const speed: Coords = { x: 0, y: 0 };
  const accel: Coords = { x: 0, y: -0.5 };
  let startTime: number = Date.now();

  function adjustSpeed(p: Coords) {
    if (!p) return;

    let { x, y } = p;
    x = position.x - x;
    y = position.y - y;
    let mag = Math.sqrt(x * x + y * y);

    speed.x += x * 30 / mag;
    speed.y += y * 30 / mag;
  }

  function _draw() {
    const now = Date.now();
    if (now - startTime >= INTERVAL) {
      setOpen(true);
      return;
    }

    speed.x = (speed.x + accel.x) * 0.99;
    speed.y = (speed.y + accel.y) * 0.99;

    position.x += speed.x;
    position.y += speed.y;
    if (position.x <= RADIUS || WIDTH - RADIUS <= position.x) {
      position.x = Math.max(Math.min(position.x, WIDTH - RADIUS), RADIUS);
      speed.x = -speed.x;
      startTime = now;
    }
    if (position.y <= RADIUS || WIDTH - RADIUS <= position.y) {
      position.y = Math.max(Math.min(position.y, WIDTH - RADIUS), RADIUS);
      speed.y = -speed.y;
      startTime = now;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, WIDTH, WIDTH);

    context.fillStyle = "green";
    context.beginPath();
    context.arc(position.x, WIDTH - position.y, RADIUS, 0, 2 * Math.PI);
    context.fill();

    requestAnimationFrame(_draw);
  }
  requestAnimationFrame(_draw);

  return adjustSpeed;
}

function getPosition(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>): Coords {
  const p = canvas.getBoundingClientRect();
  return {
    x: Math.trunc(event.clientX - p.left), 
    y: Math.trunc(p.bottom - event.clientY)
  };
}
