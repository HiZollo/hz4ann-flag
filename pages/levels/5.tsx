import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import $ from 'classnames'
import styles from '@/styles/Fake404.module.css'

import Flags from '@/data/flags.json';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { PopupWrapper } from '@/components/popup';

interface ScamInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
}

interface Message {
  name: string;
  want: string;
}

const START_TIME = 1687708800000;

export default function Page() {
  const [nth, setNth] = useState(0);
  const [name, setName] = useState('');
  const [want, setWant] = useState('');
  const [open, setOpen] = useState(false);
  const [noName, setNoName] = useState(false);
  const [noWant, setNoWant] = useState(false);

  useEffect(() => {
    const n = (Date.now() - START_TIME) / 1000 / 60;
    setNth(Math.round(n + Math.sin(n)));
  }, []);

  function handleClick() {
    if (!name.length) {
      setNoName(true);
    }
    else if (!want.length) {
      setNoWant(true);
    }
    else {
      sendMessage({ name, want });
      setOpen(true);
    }
  }

  return <>
    <h1>恭喜!您第{nth} 位造訪這個網頁的幸運兒!</h1>

    <p>恭喜HiZollo 用戶,您被我們選中贏得一個HiZollo 禮物.</p>
    <p>您收到了HiZollo 的感恩回饋,您只需要回答以下三個問題,即可獲得中獎機會!</p>
    <p>請注意:您是隨機挑選的用戶獲得了邀請,但獎品數量有限.</p>
    <p>您只有6 分2 秒來回答下列問題,時間過後,下一位幸運用戶也會獲得幸運禮品!祝你好運!</p>

    <ScamInput value={name} setValue={setName} placeholder="您的Discord 名稱或 帳號id" />
    <ScamInput value={want} setValue={setWant} placeholder="您想要的禮品" />
    <Button text='提交' onClick={handleClick} />

    <PopupWrapper open={noName} handleClose={() => setNoName(false)}>
      拜託您 輸入您的Discord 名稱或 帳號id
    </PopupWrapper>
    <PopupWrapper open={noWant} handleClose={() => setNoWant(false)}>
      拜託您 輸入您想要的禮品
    </PopupWrapper>
    <PopupWrapper open={open} handleClose={() => setOpen(false)}>
      謝謝您的提交,這是HiZollo 的一點心意,請收下 {Flags.LEVEL5_FAKE404}
    </PopupWrapper>
  </>
}


// TODO
function sendMessage({ name, want }: Message) {
  console.log(name, want);
}

function ScamInput({ value, setValue, placeholder }: ScamInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  return <Input
    className={styles['fake404-input']}
    value={value}
    onChange={handleChange}
    placeholder={placeholder}
  />;
}