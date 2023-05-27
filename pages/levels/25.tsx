import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { PopupWrapper } from '@/components/popup';
import { useReducer, useState } from 'react';
import { MathJax, MathJaxProvider } from '@cutting/use-mathjax'

import Flags from '@/data/flags.json';
import styles from '@/styles/Formula.module.css';

interface DataType {
  input: string;
  output: number;
}

type Event = React.ChangeEvent<HTMLInputElement>;

const FUNCTION_COUNT = 3;

const functions = [f1, f2, f3];

export default function() {
  const [data, setData] = useReducer((prev: DataType[], { index, input }: { index: number, input: string }): DataType[] => {
    if (index < 0 || FUNCTION_COUNT <= index) {
      return prev;
    }

    const newData = prev.slice() as DataType[];
    newData[index].input = input;
    newData[index].output = functions[index](input.length ? +input : NaN);
    return newData;
  }, Array.from({ length: FUNCTION_COUNT }, () => ({ input: "", output: NaN })));

  function handleChange(e: Event, index: number) {
    setData({ index, input: e.target.value });
  }

  return (
    <MathJaxProvider>
      <h1>盲盒</h1>

      <MathJax>{"$ x = $"}</MathJax>
      <Input className={styles['formula-input']} value={data[0].input} onChange={(e: Event) => handleChange(e, 0)} />
      <MathJax>{"$ f_1(x) = ax^2 + bx + c = $"}</MathJax>
      <Input className={styles['formula-input']} value={formatOutput(data[0].output)} disabled />

      <MathJax>{"$ x = $"}</MathJax>
      <Input className={styles['formula-input']} value={data[1].input} onChange={(e: Event) => handleChange(e, 1)} />
      <MathJax>{"$ f_2(x) = ae^{bx^k} = $"}</MathJax>
      <Input className={styles['formula-input']} value={formatOutput(data[1].output)} disabled />

      <MathJax>{"$ x = $"}</MathJax>
      <Input className={styles['formula-input']} value={data[2].input} onChange={(e: Event) => handleChange(e, 2)} />
      <MathJax>{"$ f_3(x) = af_3(x-1) + bf_3(x-2),\\ f_3(0) = 1, \\ f_3(1) = 1 $"}</MathJax>
      <Input className={styles['formula-input']} value={formatOutput(data[2].output)} disabled />
    </MathJaxProvider>
  )
}

function f1(x: number) {
  return 3 * x * x;
}

function f2(x: number) {
  return Math.exp(-x * x);
}

function f3(x: number) {
  if (!Number.isInteger(x)) return NaN;
  if (x < 0) return NaN;
  if (x === 0 || x === 1) return 1;
  if (x >= 1476) return Infinity;

  let a = 1, b = 1;
  for (let i = 1; i < x; i++) {
    let t = a + b;
    a = b;
    b = t;
  }
  return b;
}

function formatOutput(output: number) {
  if (isNaN(output)) return "N/A";
  if (output === Infinity) return "∞";
  if (output === -Infinity) return "-∞";
  return output.toString();
}
