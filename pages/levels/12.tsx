import p12 from '@/data/assets/12/12.png';
import Image from 'next/image';

export default function() {
  

  return (
    <>
      <h1>臺北捷運</h1>

      <p>下圖是一張臺北捷運的同構圖，請問紅色的三個點各代表哪一站？</p>

      <Image src={p12} alt="p12" width={350} draggable={false} />
    </>
  )
}