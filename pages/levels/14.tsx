import { Dispatch, useState, useReducer } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { PopupWrapper } from '@/components/popup'
import Flags from '@/utils/flagUtils';
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

const _answers = [
  [BigInt(1193609890), BigInt(2045473354)], 
  [BigInt(3386779088), BigInt(1425478490)], 
  ['c585f1decb986f7ff19b8d03deba346ab8a0494cc1e4d69ad9b8acb0dfbeab6f', '740b19c56c99ffe20a3ef649b0d0a8262b8f34fa89301d8f8fd7bc996a9fa3ce', '19c9cbe3b6c304346a171fe0846cfcf92cd4750934fc4f9180bc01de723d00fe', '0b1001a02c971a01ebc585b5cb04897b35e4cb4b8cb6f91bddd2b5c622064441'], 
  ['5c8f52ca28966103ff0aad98160bc8e978c9ca0285a2043a521481d11ed17506', 'b08b0a5c8892079ef20854589792e05957f60ac9bea6e58b0320550d752a0bb3', 'c733bdf600026d8c7942bb046ce25c49e2a86271fd391286b5bc5dafba174eb7'], 
  ['295099c764e6439694e99d2c5be4b5f9fbd84b7826dcfcc7704f16585fbf42bf', '2ee7f7fb61c0d9bef4b62a1dcc244f8f55806ac0a5cb1273687871a863510e4c', 'af02be73f1a847f8621367d9035be5f87e1145886e942001607e08978ed135b3'], 
  ['282276ddea50435169cc73e02fab90514ee83f9329a7eb9a22979d0b9f570297', '8e9c83744feccc36764e6c25a55b876b65e21f903c0295c5c234a91c48988e7a', '312c0b09d2ccc9f816393aa9a7e4e9162b5003031d14b4ecaf68aa96f0563fe4', 'f1e3c16bbd633ea456f11c7c4d83292497a24e8b2163bf6a47bc285b01f1f84d']
];

const answers = decrypt(_answers) as [bigint[], bigint[], string[], string[], string[], string[]];

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

  async function handleClick() {
    if (disabled) return

    if (await validate(data)) {
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
        {Flags.LEVEL14_GEO}
      </PopupWrapper>
      <PopupWrapper open={wrong} handleClose={() => setWrong(false)}>
        至少一個國家是錯的
      </PopupWrapper>
    </>
  )
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

function power(x: bigint, y: bigint, p: bigint) {
  const bits: bigint[] = [];
  while (y > BigInt(1)) {
    bits.unshift(y & BigInt(1));
    y >>= BigInt(1);
  }

  let t = x % p;
  bits.forEach(b => {
    t = (t * t) % p;
    if (b === BigInt(1)) t = (t * x) % p;
  });
  return t;
}

function decrypt(a: typeof _answers) {
  const result: (string[] | number[])[] = [];
  a.forEach(ans => {
    if (typeof ans[0] === 'bigint' && typeof ans[1] === 'bigint') {
      result.push([
        Number(power(ans[0], BigInt(49757), BigInt(61627) * BigInt(63197))) / 1000000, 
        Number(power(ans[1], BigInt(49757), BigInt(61627) * BigInt(63197))) / 1000000
      ]);
    }
    else {
      result.push(ans.map(a => `${a}`));
    }
  });
  return result;
}

async function validate(data: strings): Promise<boolean> {
  if (!(answers[0][0] <= +data[0] && +data[0] <= answers[0][1])) return false;
  if (!(answers[1][0] <= +data[1] && +data[1] <= answers[1][1])) return false;

  const ans: string[] = []
  for (const i of [2, 3, 4, 5]) {
    ans[i] = await digestMessage(data[i]);
  }

  if (!answers[2].some((v) => v === ans[2])) return false;
  if (!answers[3].some((v) => v === ans[3])) return false;
  if (!answers[4].some((v) => v === ans[4])) return false;
  if (!answers[5].some((v) => v === ans[5])) return false;
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
