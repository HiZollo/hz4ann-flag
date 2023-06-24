import p12 from '@/data/assets/12/12.png';
import Image from 'next/image';

export default function() {
  

  return (
    <>
      <h1>臺北捷運</h1>

      <p>如果用一個點代表一個車站，用兩點之間直線代表這兩站有連接，就可以畫出一張捷運地圖</p>
      <p>因為上面的描述方式並沒有規定每個點一定要排整齊，所以其實下面這張圖也是一張臺北捷運地圖</p>
      <p>這張地圖只包含了紅、橘、黃、綠、藍、棕線，以及新北投、小碧潭支線</p>
      <p>請問用紅色實心點標出的三個站分別代表哪三個站？</p>

      <Image src={p12} alt="p12" width={350} draggable={false} />

      <p>請依據這三站的實際位置由南到北排序，中間以底線區隔作為本題 flag 的 content</p>
      <p>站點名稱請使用臺北捷運的官方名稱，如「新店_台北車站_淡水」</p>
    </>
  )
}