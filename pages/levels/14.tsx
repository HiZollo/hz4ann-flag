import { SlowQuestionComponent, QuestionType } from '@/utils/SlowQuestion'
import Flags from '@/data/flags.json'

const questions: Array<QuestionType> = [{
  text: "請問下列哪個拍子不屬於複拍子？",
  mode: "CHOOSE",
  choice: ["6/8 拍", "12/16 拍", "3/8 拍", "6/4 拍"],
  answer: 2
}, {
  text: "以 F 為下中音的大調音階的屬音做為導音的大音階，以他的平行調的中音為根音的小三和弦之五度音為？",
  mode: "CHOOSE",
  choice: ["D", "F#", "B", "E", "Bb"],
  answer: 0
}, {
  text: "下列哪個調為降 E 小調的近系調？",
  mode: "CHOOSE",
  choice: ["F 大調", "F 小調", "降 E 大調", "降 D 大調", "A 大調"],
  answer: 3
}, {
  text: "關係大小調的根音彼此的音程間隔為", 
  mode: "CHOOSE",
  choice: ["大六度", "完全五度", "大三度", "增二度"],
  answer: 0
}, {
  text: "以 A 音的第八泛音為主音的大調的調號有幾個升降記號？（請以阿拉伯數字回答）",
  mode: "INPUT",
  answer: "5"
}, {
  text: "一個減六度包含幾個半音音程？（請以阿拉伯數字回答）",
  mode: "INPUT",
  answer: "7"
}, {
  text: "下列哪個音樂術語和速度無關？",
  mode: "CHOOSE",
  choice: ["Allegro", "Accelerando", "Ad libitum", "Cresendo", "Vivace"],
  answer: 3
}, {
  text: "同一個減三和弦可以出現在幾個和聲小音階之中？（請以阿拉伯數字回答）",
  mode: "INPUT", 
  answer: "2"
}, {
  text: "在 Phrygian 教會調式音階之中，相鄰兩音的音程間隔依序為：", 
  mode: "CHOOSE", 
  choice: ["全全半全全全半", "半全全半全全全", "半全半全全全全", "全半全全全半全", "半全全全半全全"],
  answer: 4
}, {
  text: "一個大音階的組成音總共可以構成幾個增三和弦？（請以阿拉伯數字回答）",
  mode: "INPUT",
  answer: "0"
}]

interface StatusType { win: boolean, lose: boolean }

export default function() {
  return (
    <>
      <h1>機智問答</h1>
      <p>在這關，你必須完美的回答 HiZollo 對你提出的十個問題。</p>
      <p>祝好運。</p>
      <SlowQuestionComponent
        questions={questions}
        Win={Win}
      />
    </>
  )
}

function Win() {
  return (
    <>
      <p>恭喜你答對了所有的問題。</p>
      <p>{Flags.LEVEL14_Q}</p>
    </>
  )
}
