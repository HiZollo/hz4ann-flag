import { Dispatch, useState, useEffect, useRef, useReducer } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { PopupWrapper } from '@/components/popup'
import Flags from '@/data/flags.json'
import Image, { StaticImageData } from 'next/image'
import p23_1 from '@/data/assets/23/23_1.png'
import p23_2 from '@/data/assets/23/23_2.png'
import p23_3 from '@/data/assets/23/23_3.png'
import p23_4 from '@/data/assets/23/23_4.png'
import p23_5 from '@/data/assets/23/23_5.png'
import styles from '@/styles/GeoGuessr.module.css'

interface GeoImageProps {
  src: StaticImageData;
  alt: string;
}

type strings = [string, string, string, string, string, string];

interface GeoInputProps {
  value: string;
  update: Dispatch<{ index: number; value: string; }>;
  index: number;
  placeholder: string;
  disabled?: boolean;
}

const answers = [
  [25.030800, 25.031000], 
  [121.554300, 121.554600], 
  ['australia', '澳洲', '澳大利亞', '澳大利亚'], 
  ['brazil', 'brasil', '巴西'], 
  ['sweden', 'sverige', '瑞典'], 
  ['phillipines', 'pilipinas', '菲律賓', '菲律宾']
] as const;

export default function() {
  const [correct, setCorrect] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [data, updateData] = useReducer((prev: strings, { index, value }: { index: number, value: string }): strings => {
    if ((index === 0 || index === 1)) {
      if (!/[\d\.]*/.test(value)) {
        return prev
      }
      if (value.startsWith('.')) {
        value = '0' + value
      }
      if (isNaN(+value)) {
        return prev
      }
    }

    const newData: strings = prev.slice() as strings
    newData[index] = value
    return newData
  }, ['', '', '', '', '', ''])

  function handleClick() {
    if (disabled) return

    if (validate(data)) {
      setCorrect(true)
    }
    else {
      setWrong(true)
    }
    setDisabled(true)
  }

  return (
    <>
      <h1>我在哪</h1>
      <p>在茫茫網路世界中，你迷失了方向。</p>
      <p>在茫茫網路世界中，你亟欲尋找你的所在。</p>
      <p>在茫茫網路世界中，你捫心自問：「我在哪裡？」</p>
      

      <GeoImage src={p23_1} alt='p23_1' />
      北緯
      <GeoInput value={data[0]} update={updateData} disabled={disabled} index={0} placeholder='你的緯度' />
      東經
      <GeoInput value={data[1]} update={updateData} disabled={disabled} index={1} placeholder='你的經度' />

      <GeoImage src={p23_2} alt='p23_2' />
      <GeoInput value={data[2]} update={updateData} disabled={disabled} index={2} placeholder='你在哪個國家' />

      <GeoImage src={p23_3} alt='p23_3' />
      <GeoInput value={data[3]} update={updateData} disabled={disabled} index={3} placeholder='你在哪個國家' />

      <GeoImage src={p23_4} alt='p23_4' />
      <GeoInput value={data[4]} update={updateData} disabled={disabled} index={4} placeholder='你在哪個國家' />

      <GeoImage src={p23_5} alt='p23_5' />
      <GeoInput value={data[5]} update={updateData} disabled={disabled} index={5} placeholder='你在哪個國家' />

      <Button text='提交' className={styles['geo-button']} disabled={disabled} onClick={handleClick} />

      <PopupWrapper open={correct} handleClose={() => setCorrect(false)}>
        {Flags.LEVEL23_GEO}
      </PopupWrapper>
      <PopupWrapper open={wrong} handleClose={() => setWrong(false)}>
        至少一個國家是錯的
      </PopupWrapper>
    </>
  )
}

function validate(data: strings): boolean {
  if (!(answers[0][0] <= +data[0] && +data[0] <= answers[0][1])) return false;
  if (!(answers[1][0] <= +data[1] && +data[1] <= answers[1][1])) return false;

  if (!answers[2].some((v) => v === data[2])) return false;
  if (!answers[3].some((v) => v === data[3])) return false;
  if (!answers[4].some((v) => v === data[4])) return false;
  if (!answers[5].some((v) => v === data[5])) return false;
  return true;
}

function GeoImage({ src, alt }: GeoImageProps) {
  return <Image 
    className={styles['geo-image']}

    src={src}
    alt={alt}
    width={700}
    draggable={false}
    onContextMenu={e => e.preventDefault()}
  />
}

function GeoInput({ value, disabled, update, index, placeholder }: GeoInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update({ index, value: e.target.value })
  }

  return <Input
    className={styles['geo-input']}

    disabled={disabled}
    value={value}
    onChange={handleChange}
    placeholder={placeholder}
  />
}
