import $ from 'classnames'
import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/button'
import styles from '@/styles/Ra.module.css'

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [play, setPlay] = useState(false)

  const start = () => {
    if (play) return
    setPlay(true)
  }

  useEffect(() => {
    console.log(play)
    do {
      if (!play) break
      if (!videoRef.current) break

      videoRef.current.requestFullscreen()
      videoRef.current.play()

    } while(false)
  }, [play])

  return <>
    <h1>一顆按鈕</h1>
    <Button text="獲得 Flag" onClick={start} disabled={play} />
    <video src="/resources/ra/flag.mp4" ref={videoRef} className={$(styles.video, {
      [styles.hidden]: !play
    })}/>
  </>
}
