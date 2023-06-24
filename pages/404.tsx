import { useState, useRef } from 'react'
import { Button } from '@/components/button'

export default function Page() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [disabled, setDisabled] = useState(false)

  const play = () => {
    if (!audioRef.current) return
    if (disabled) return
    audioRef.current.play()
    setDisabled(true)
  }

  return <>
    <h1>404</h1>
    <Button onClick={play} text="播放" disabled={disabled} />
    <audio ref={audioRef}>
      <source src="resources/404/audio.wav" />
    </audio>
  </>
}

