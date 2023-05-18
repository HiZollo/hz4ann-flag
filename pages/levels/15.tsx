import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { PopupWrapper } from '@/components/popup';
import 'katex/dist/katex.min.css';
import { useState } from 'react';
import Latex from 'react-latex-next';

import Flags from '@/data/flags.json';
import styles from '@/styles/Formula.module.css';

const ANS = 29;

export default function() {
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(false)
  const [wrong, setWrong] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAnswer(e.target.value);
  }

  function handleClick() {
    if (parseFloat(answer) === ANS) {
      setCorrect(true);
    }
    else {
      setWrong(true);
    }
  }

  return (
    <>
      <h1>請算</h1>
      <p>有個神奇的公式長這樣：</p>
      <Latex>{"$$ p_n = 1 + \\sum_{i=1}^{2^n} \\left\\lfloor \\left( \\frac{n}{\\sum_{j=1}^{i}\\left\\lfloor \\left( \\cos \\frac{(j-1)!+1}{j}\\pi \\right)^2 \\right\\rfloor} \\right)^{1/n} \\right\\rfloor $$"}</Latex>

      <Latex>{"請問 $ p_{10} $ 是多少呢？"}</Latex>
      <Input className={styles['formula-input']} value={answer} onChange={handleChange} />
      <Button disabled={!answer.length} className={styles['formula-button']} text="提交" onClick={handleClick} />

      <PopupWrapper open={correct} handleClose={() => setCorrect(false)}>
        {Flags.LEVEL15_FORMULA}
      </PopupWrapper>
      <PopupWrapper open={wrong} handleClose={() => setWrong(false)}>
        答案並不是 {answer}
      </PopupWrapper>
    </>
  )
}