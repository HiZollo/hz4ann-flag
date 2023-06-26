import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { PopupWrapper } from '@/components/popup';
import { useState } from 'react';
import { MathJax, MathJaxProvider } from '@cutting/use-mathjax';

import Flags from '@/utils/flagUtils';
import styles from '@/styles/Formula.module.css';

const ANS = 28;

export default function() {
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [disabled, setDisabled] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAnswer(e.target.value);
  }
  
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) handleClick()
  }

  function handleClick() {
    if(disabled) return

    if (parseFloat(answer) === ANS) {
      setCorrect(true);
    }
    else {
      setWrong(true);
    }
    setDisabled(true)
  }

  return (
    <MathJaxProvider>
      <h1>請算</h1>
      <p>有個神奇的公式長這樣：</p>
      <MathJax>{"$$ p_n = \\sum_{i=1}^{2^n} \\left\\lfloor \\left( \\frac{n}{\\sum_{j=1}^{i}\\left\\lfloor \\left( \\cos \\frac{(j-1)!+1}{j}\\pi \\right)^2 \\right\\rfloor} \\right)^{1/n} \\right\\rfloor $$"}</MathJax>

      <MathJax>{"請問 $ p_{10} $ 是多少呢？"}</MathJax>
      <Input className={styles['formula-input']} disabled={disabled} value={answer} onChange={handleChange} onKeyDown={handleKeyDown}/>
      <Button disabled={!answer.length || disabled} className={styles['formula-button']} text="提交" onClick={handleClick} />

      <PopupWrapper open={correct} handleClose={() => setCorrect(false)}>
        {Flags.LEVEL15_FORMULA}
      </PopupWrapper>
      <PopupWrapper open={wrong} handleClose={() => setWrong(false)}>
        答案並不是 {answer}
      </PopupWrapper>
    </MathJaxProvider>
  )
}
