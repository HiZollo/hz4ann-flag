import $ from 'classnames';
import { useState, useReducer } from 'react'
import { PopupWrapper } from '@/components/popup';
import { TypingTextArea } from '@/components/typingTextArea'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import Flags from '@/data/flags.json';
import styles from '@/styles/Storyteller.module.css'

function getSubsequence<T>(arr: Array<T>, count: number) {
  const result: Array<T> = []
  for (let i = 0; i < arr.length; ++i) {
    const reminder = count - result.length;
    if (count === 0) break;
    
    const size = arr.length - i;

    if (Math.random() < reminder / size) {
      result.push(arr[i])
    }
  }

  return result
}

const LatinOrdinalNumbersFeminineGenitiveSingle = [
  "primae", "secundae", "tertiae", "quartae", "quintae",
  "sextae", "septimae", "octavae", "nonae", "decimae"
]

const answer = {
  q1: 3,
  q2: ["Zollus", "Iulius", "Octavia"],
  q3: 4,
  q4: ["medicamentum", "carta nominis", "calamus", "culter"],
  q5: "Zollus",
  q6: "Octavia",
  q7: "Et tu, Octavia."
}

interface AnswerType {
  q1: number
  q2: string[]
  q3: number
  q4: string[]
  q5: string
  q6: string
  q7: string
}

type AnswerInputDispatchType = 
  | Question1InputDispatchType | Question2InputDispatchType
  | Question3InputDispatchType | Question4InputDispatchType
  | Question5InputDispatchType | Question6InputDispatchType
  | Question7InputDispatchType

interface Question1InputDispatchType {
  question: "q1"
  update: number
}

interface Question2InputDispatchType {
  question: "q2"
  update: [number, string]
}

interface Question3InputDispatchType {
  question: "q3"
  update: number
}

interface Question4InputDispatchType {
  question: "q4"
  update: [number, string]
}

interface Question5InputDispatchType {
  question: "q5"
  update: string
}

interface Question6InputDispatchType {
  question: "q6"
  update: string
}

interface Question7InputDispatchType {
  question: "q7"
  update: string
}

export default function() {
  const texts = getSubsequence(article, 3)
  const [disabled, setDisabled] = useState(false)
  const [openCorrect, setOpenCorrect] = useState(false)
  const [openWrong, setOpenWrong] = useState(false)
  const [input, dispatch] = useReducer((prev: AnswerType, dispatch: AnswerInputDispatchType) => {
    if (dispatch.question === "q1" || dispatch.question === "q3") {
      const { update } = dispatch
      if (isNaN(update)) return prev
      if (update < 0 || update > 10) return prev
      let arr: string[] = dispatch.question === "q1" ? prev.q2 : prev.q4
      if (arr.length > update) arr.length = update
      return { ...prev, [dispatch.question]: update, [dispatch.question === "q1" ? "q2" : "q4"]: arr }
    }

    if (dispatch.question === "q2" || dispatch.question === "q4") {
      const { update: [index, value] } = dispatch
      if (index < 0 || index > 9) return prev
      let afterUpdate = [...prev[dispatch.question]]
      afterUpdate[index] = value
      return { ...prev, [dispatch.question]: afterUpdate }
    }

    if (dispatch.question === "q5" || dispatch.question === "q6" || dispatch.question === "q7") {
      const { update } = dispatch
      return { ...prev, [dispatch.question]: update }
    }

    return prev
  }, { q1: 0, q2: [],  q3: 0, q4: [], q5: "", q6: "", q7: "" })

  const submit = () => {
    if (disabled) return
    if (input.q1 === answer.q1 &&
        input.q2[0] === answer.q2[0] &&
        input.q2[1] === answer.q2[1] &&
        input.q2[2] === answer.q2[2] &&
        input.q3 === answer.q3 &&
        input.q4[0] === answer.q4[0] &&
        input.q4[1] === answer.q4[1] &&
        input.q4[2] === answer.q4[2] &&
        input.q4[3] === answer.q4[3] &&
        input.q5 === answer.q5 &&
        input.q6 === answer.q6 &&
        input.q7 === answer.q7) {
      setOpenCorrect(true)
      setDisabled(true)
      return
    }
    setOpenWrong(true)
    setDisabled(true)
  }

  return (
    <>
      <h1>Fabulator</h1>
      <p>Videbis tria sententias ex fabula.</p>
      <p>Illae ordine exhibentur.</p>
      <p>Quaestionem responde postquam fabulam intellexeris.</p>
      <TypingTextArea
        text={texts}
      />
      <p>1. Quot personae fabula sunt in (0 ~ 10)?</p>
      <Input 
        disabled={disabled}
        value={input.q1.toString()} 
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) => dispatch({ question: "q1", update: ~~(+e.currentTarget.value)})}
      />
      <p>2. Enumerate personae eo ordine quo in fabula apparuere:</p>
      <section className={styles.q2Inputs}>
      {
        Array.from(Array(input.q1)).map((_, i) => {
          return <Input 
            key={i}
            disabled={disabled}
            value={input.q2[i] ?? ""}
            placeholder={`Nomen personae ${LatinOrdinalNumbersFeminineGenitiveSingle[i]} scribe`}
            onChange={(e: React.SyntheticEvent<HTMLInputElement>) => dispatch({ question: "q2", update: [i, e.currentTarget.value] })}
          />
        })
      }
      </section>
      <p>3. Quot res in corpore viri invinerunt (0 ~ 10)?</p>
      <Input 
        disabled={disabled}
        value={input.q3.toString()} 
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) => dispatch({ question: "q3", update: ~~(+e.currentTarget.value)})}
      />
      <p>4. Quid in corpore viri invenerunt? Enumerate eo ordine in fabula apparuere.</p>
      <section className={styles.q2Inputs}>
      {
        Array.from(Array(input.q3)).map((_, i) => {
          return <Input 
            key={i}
            disabled={disabled}
            value={input.q4[i] ?? ""}
            placeholder={`Nomen resi ${LatinOrdinalNumbersFeminineGenitiveSingle[i]} scribe`}
            onChange={(e: React.SyntheticEvent<HTMLInputElement>) => dispatch({ question: "q4", update: [i, e.currentTarget.value] })}
          />
        })
      }
      </section>
      <p>5. Quid est persona qui occisa est?</p>
      <Input 
        disabled={disabled}
        value={input.q5} 
        placeholder="Nomen personae scribe"
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) => dispatch({ question: "q5", update: e.currentTarget.value })}
      />
      <p>6. Quis virum occidit?</p>
      <Input 
        disabled={disabled}
        value={input.q6} 
        placeholder="Nomen personae scribe"
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) => dispatch({ question: "q6", update: e.currentTarget.value })}
      />
      <p>7. Quae ultima verba Zolli erant</p>
      <Input 
        disabled={disabled}
        value={input.q7} 
        placeholder="Sententiam scribe"
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) => dispatch({ question: "q7", update: e.currentTarget.value })}
      />
      <Button 
        disabled={disabled}
        text="Submitte" 
        className={styles.submit} 
        onClick={submit}
      />
      <PopupWrapper open={openCorrect} handleClose={() => setOpenCorrect(false)}>
        {Flags.LEVEL13_STORYTELLER}
      </PopupWrapper>
      <PopupWrapper open={openWrong} handleClose={() => setOpenWrong(false)}>
        Saltem una responsio est incorrecta
      </PopupWrapper>
    </>
  );
}

const article = [
  `Iulius et Zollus in officio sedere. Eos fruuntur mane primo.` ,
  `Tum, telephonum Zolli sonuit et ille respondit.`,
  `"Salve?" interrogavit.`,
  `"Zolle, haec Octavia est," vox familiaris ex alio latere dixit.` ,
  `Octavia erat amica intima Zolli.`,
  `"Octavia, gaudeo te audire," Zollus cum solacio dixit.`,
  `"Zolle, opus tuum habeo," Octavia urgenter dixit. "Homicidium factum est, nescio quid facere."`,
  `Zollus cum Iulio facile signum sciscitavit, "Absoluter, Octavia. Omnia a nobis fieri possunt. Ubi est locus sceleris?"`,
  `Octavia eum locum dedit, deinde telefonum clausum est.` ,
  `Zollus statim ad Iulium conversus est. "Ad locum sceleris ire debemus. Aptus es, Iuli?"`,
  `"Certe," Iulius respondit et adfuit, iamdudum pallium suum apprehendens.`,
  `Cum Iulius abiret, Zollus spectabat, deinde suo pallio sibi indutus ipse exibat.`  ,
  `Is ad locum, quem Octavia ei indicavit, perrexit. Interea, Octavia exspectatione eorum anxiebat.` ,
  `Cum tandem ad locum pervenissent, Octavia eis opportune occurrit.`,

  `Steterunt Octavia et Zollus ad locum sceleris, sermone involuti, dum Iulius indicia quaerebat.` ,
  `"Oportet nobis scire quis hoc fecerit," dixit Zollus ad Octaviam. "Ne eum impune haec re elapsum patiamur."` ,
  `Octavia Iulium venire vidit.`,
  `"Vedio adiutorem meum. Is venit," dixit Zollus. Iulius advenit.`,
  `"Aliquidne repperis?", inquit Zollus ad Iulium.`,
  `"Corpus viri huius investigabam, et haec inveni," respondit Iulius.`,
  `"Videam," dixit Zollus. "Medicamentum, carta nominis, calamusque...quid hoc est?"`,
  `"Culter est, Zolle. Culter," respondit Iulius.`,
  `"Sed poterat celari ubi?", Zollus curiosus rogat.`,
  `"Possum eum celare hic!"`,

  `Iulius Zollum ferit cultro.` ,
  `Zollus impetum evitavit et manum Iulii tenuit. "Quid agis, Iuli?", rogavit Zollus.` ,
  `Interea, dolorem a tergo suo sensit.` ,
  `Octavia Zollum pugione praeparato vulneravit.`,
  `"Et tu, Octavia?" tum cecidit Zollus.`,
]
