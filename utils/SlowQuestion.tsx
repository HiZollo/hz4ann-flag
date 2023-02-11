import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { useAutosizeTextArea } from '@/utils/useAutosizeTextArea'
import styles from '@/styles/SlowQuestion.module.css'

const wait = (ms: number) => new Promise(res => setTimeout(res, ms))


type QuestionType =
  | { text: string, mode: "CHOOSE", choice: string[], answer: number }
  | { text: string, mode: "INPUT", answer: string }


interface AnswerComponentProps {
  handleCorrect: () => void
  handleWrong: () => void
}

class SlowQuestion {
  private afterType: () => unknown = () => {}
  constructor(public readonly questions: Array<QuestionType>) {

  }

  public getQuestionComponent(index: number): React.FC {
    const thisQuestion = this.questions[index]

    const self = this

    return function() {
      const [content, setContent] = useState('_')
      const textareaRef = useRef(null)

      useAutosizeTextArea(textareaRef.current, content)

      useEffect(() => {
        switch (thisQuestion.mode) {
          case "CHOOSE":
            const choices = thisQuestion.choice.map((text, index) => `(${index + 1}) ${text}`)
             self.type([`${index + 1}. ${thisQuestion.text}`, ...choices], setContent)
          break;
          case "INPUT":
            self.type([`${index + 1}. ${thisQuestion.text}`], setContent)
        }            
        return () => setContent('_')
      }, [])

      return (
        <textarea 
          ref={textareaRef}
          value={content}
          className={styles.questionContext} 
          tabIndex={-1}
          rows={1}
          readOnly
        />
      )
    }

  }

  public getAnswerComponent(index: number): React.FC<AnswerComponentProps> {
    const thisQuestion = this.questions[index]

    const self = this

    if (thisQuestion.mode === "CHOOSE") return function({
      handleCorrect, handleWrong
    }: AnswerComponentProps) {
      const [disabled, setDisabled] = useState(false)
      const [show, setShow] = useState(false)
      const [wrong, setWrong] = useState(false)
      const [correct, setCorrect] = useState(false)

      useEffect(() => {
        self.afterType = () => setShow(true)
        return () => {
          self.afterType = () => {}
        }
      }, [])

      useEffect(() => {
        if (wrong) {
          handleWrong()
          setDisabled(true)
        }
      }, [wrong])

      useEffect(() => {
        if (correct) {
          handleCorrect()
        }
      }, [correct])

      const selectButtons = thisQuestion.choice
        .map((value, index) => {
          return disabled ?
            <Button 
              disabled={true} 
              text={`${index + 1}`}
              key={value}
            />:
            <Button 
              onClick={index === thisQuestion.answer ?
                () => setCorrect(true) : () => setWrong(true)}
              disabled={disabled}
              text={`${index + 1}`} 
              key={value} 
            />
        })

      return (
        <>
          { show && <div className={styles.chooseButtonRow}>
            {selectButtons}
          </div> }
        </>
      )
    }

    if (thisQuestion.mode === "INPUT") return function({
      handleCorrect, handleWrong
    }: AnswerComponentProps) {
      const [disabled, setDisabled] = useState(false)
      const [value, setValue] = useState("")
      const [show, setShow] = useState(false)
      useEffect(() => {
        self.afterType = () => setShow(true)
        return () => {
          self.afterType = () => {}
        }
      }, [])

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
      }

      const submit = () => {
        if (value === thisQuestion.answer) {
          handleCorrect()
          return
        }

        handleWrong()
        setDisabled(true)
      }

      const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') submit()
      }

      return (
        <>
          { show && <div className={styles.inputAnswerArea}>
            <Input 
              disabled={disabled}
              value={value} 
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            />
            <div className={styles.buttons}>
              <Button
                onClick={submit}
                disabled={disabled}
                text="確認"
              />
              <Button
                onClick={() => setValue("")}
                disabled={disabled}
                text="清除"
              />
            </div>
          </div> }
        </>
      )
    }

    throw new Error('INVALID_MODE')
  }

  private async type(content: string[], appendContent: Dispatch<SetStateAction<string>>) {
    let acc = ''
    for (const sentence of content) {
      for (const ch of sentence) {
        acc += ch
        appendContent(acc + '_') 
        await wait(20)
      }

      await wait(100)
      acc += '\n'
      appendContent(acc + '_')
      await wait(10)
      acc += '\n'
      appendContent(acc + '_')
      await wait(1500)
    }
    acc = ''
    await wait(2000)
    this.typeFinish()
  }

  private typeFinish() {
    this.afterType()
  }
}

interface SlowQuestionComponentProps {
  questions: Array<QuestionType>
  handleCorrect?: () => void
  handleWrong?: () => void
  handleWin?: () => void
  Win: React.FC 
}

function SlowQuestionComponent({
  questions, 
  handleCorrect, handleWrong, Win, handleWin
}: SlowQuestionComponentProps) {
  const [index, setIndex] = useState(0)
  const [win, setWin] = useState(false)

  const QuestionManager = new SlowQuestion(questions)

  if (index === QuestionManager.questions.length) {
    handleWin?.()
    return <Win />
  }

  const Q = QuestionManager.getQuestionComponent(index)
  const A = QuestionManager.getAnswerComponent(index)

  const getCorrect = () => {
    handleCorrect?.()
    setIndex(v => v + 1)
  }

  const getWrong = () => {
    handleWrong?.()
  }

  return (
    <>
      <Q />
      <A 
        handleCorrect={getCorrect}
        handleWrong={getWrong}
      />
    </>
  )
}

export { SlowQuestion, SlowQuestionComponent }
export type { QuestionType }
