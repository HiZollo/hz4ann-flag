import { PopupWrapper } from "@/components/popup";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import Flags from '@/utils/flagUtils';

interface Coords {
  x: number;
  y: number;
}

const WIDTH = 400;
const RADIUS = 20;
const INTERVAL = 10e3;

export default function() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [dead, setDead] = useState(false);
  const [deadOpen, setDeadOpen] = useState(false);
  const [adjustSpeed, setAdjustSpeed] = useState<({ f: (p: Coords) => void })>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return
    const context = canvas.getContext('2d');
    if (!context) return;

    const { adjustSpeed: f, caughtCheat } = draw(context, setOpen);
    setAdjustSpeed({ f });

    function onVisibilityChange() {
      caughtCheat();
      setDead(true);
      setDeadOpen(true);
    }

    window.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange);
    }
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

      <p>這裡有一顆球，它喜歡飛翔，不喜歡撞牆</p>
      <p>如果你讓他飛十秒，它會很感謝你的</p>

      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={WIDTH}
        onClick={handleClick}
        style={{ border: "1px solid green" }}
      ></canvas>

      <PopupWrapper open={open && !dead} handleClose={() => setOpen(false)}>
        {Flags.LEVEL16_BOUNCE}
      </PopupWrapper>
      <PopupWrapper open={dead} handleClose={() => setDeadOpen(false)}>
        切掉視窗是作弊行為，因此你遭受了懲罰
      </PopupWrapper>
    </>
  )
}

function draw(context: CanvasRenderingContext2D, setOpen: Dispatch<SetStateAction<boolean>>) {
  const position: Coords = { x: WIDTH/2, y: WIDTH/2 };
  const speed: Coords = { x: 0, y: 0 };
  const accel: Coords = { x: 0, y: -0.45 };
  let startTime: number = Date.now();
  let cheat = false;

  function adjustSpeed(p: Coords) {
    if (!p) return;

    let { x, y } = p;
    x = position.x - x;
    y = position.y - y;
    let mag = Math.sqrt(x * x + y * y);

    speed.x += x * 24 / mag;
    speed.y += y * 24 / mag;
  }

  function caughtCheat() {
    cheat = true;
  }

  context.font = "20px sans-serif";

  function _draw() {
    const now = Date.now();
    if (cheat) {
      setOpen(false);
      return;
    }
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

    const remainTime = (INTERVAL - now + startTime) / 1e3;
    if (remainTime <= 6) {
      context.fillStyle = "yellow";
    }
    else if (remainTime <= 3) {
      context.fillStyle = "red";
    }
    context.fillText(remainTime.toString(), 20,  (WIDTH - 20));

    requestAnimationFrame(_draw);
  }
  requestAnimationFrame(_draw);

  return { adjustSpeed, caughtCheat };
}

function getPosition(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>): Coords {
  const p = canvas.getBoundingClientRect();
  return {
    x: Math.trunc(event.clientX - p.left), 
    y: Math.trunc(p.bottom - event.clientY)
  };
}
