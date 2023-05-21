import { useEffect, useRef, useState } from "react"

interface Coords {
  x: number;
  y: number
}

const WIDTH = 600;
const RADIUS = 30;

let ff: (p: Coords) => void;

export default function() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [adjustSpeed, setAdjustSpeed] = useState<((p: Coords) => void)>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return
    const context = canvas.getContext('2d');
    if (!context) return;

    const f = draw(context);
    ff = f;
    setAdjustSpeed(f);
  }, []);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const p = getPosition(canvas, e);
    
    if (adjustSpeed) {
      adjustSpeed(p);
    }
    if (ff) {
      ff(p);
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
    </>
  )
}

function draw(context: CanvasRenderingContext2D) {
  const position: Coords = { x: WIDTH/2, y: WIDTH/2 };
  const speed: Coords = { x: 0, y: 0 };
  const accel: Coords = { x: 0, y: -0.5 };

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
    speed.x = (speed.x + accel.x) * 0.99;
    speed.y = (speed.y + accel.y) * 0.99;

    position.x += speed.x;
    position.y += speed.y;
    if (position.x <= RADIUS || WIDTH - RADIUS <= position.x) {
      position.x = Math.max(Math.min(position.x, WIDTH - RADIUS), RADIUS);
      speed.x = -speed.x;
    }
    if (position.y <= RADIUS || WIDTH - RADIUS <= position.y) {
      position.y = Math.max(Math.min(position.y, WIDTH - RADIUS), RADIUS);
      speed.y = -speed.y;
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
