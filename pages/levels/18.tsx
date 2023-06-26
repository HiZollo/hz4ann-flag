import { useEffect, useState } from "react";
import Flags from '@/utils/flagUtils';
import { MathJax, MathJaxProvider } from '@cutting/use-mathjax';

const PRIME_SIZE = 256;
const ZEROn = BigInt(0);
const ONEn = BigInt(1);
const TWOn = BigInt(2);
const THREEn = BigInt(3);
const FOURn = BigInt(4);
const En = BigInt(65537);
const BIGn = BigInt(1e5);

const [TEXT1, TEXT2] = parseFlag(Flags.LEVEL18_RSA);

export default function() {
  const [N1, setN1] = useState<bigint>();
  const [N2, setN2] = useState<bigint>();
  const [c1, setC1] = useState<bigint>();
  const [c2, setC2] = useState<bigint>();

  useEffect(() => {
    const a = getPrime(PRIME_SIZE);
    const b = getPrime(PRIME_SIZE);
    const c = getPrime(PRIME_SIZE);
    const n1 = a * b;
    const n2 = a * c;
    const c1 = power(TEXT1, En, n1);
    const c2 = power(TEXT2, En, n2);

    setN1(n1);
    setN2(n2);
    setC1(c1);
    setC2(c2);
  }, []);

  if (!N1 || !N2 || !c1 || !c2) {
    return (
      <>
        <h1>RSA</h1>
        <p>載入中...</p>
      </>
    )
  }

  return (
    <MathJaxProvider>
      <h1>RSA</h1>

      <p>RSA 很讚，但如果用來質數的生成器很爛的話就不讚了</p>
      <p>下面這兩個數字都是從一個很爛的質數生成器生的</p>
      <p>噢對了，這個質數生成器爛就爛在它很會生出重複的質數</p>
      <MathJax>{`$$ \\begin{align*} N_1 =&\\ ${format(N1)} \\\\ N_2 =&\\ ${format(N2)} \\end{align*} $$`}</MathJax>

      <p>有一個笨小孩不知道這個質數生成器很爛，硬要用它來加密</p>
      <MathJax>{"$ (N_1, e=65537) $ 被拿來加密 $ m_1 $ 得到："}</MathJax>
      <MathJax>{`$$ \\begin{align*} c_1 =&\\ ${format(c1)} \\end{align*} $$`}</MathJax>
      <MathJax>{"$ (N_2, e=65537) $ 被拿來加密 $ m_2 $ 得到："}</MathJax>
      <MathJax>{`$$ \\begin{align*} c_2 =&\\ ${format(c2)} \\end{align*} $$`}</MathJax>

      <MathJax>{"就直接告訴你吧，這題的 flag 是 hz4ann_flag_{$ m_1 $_$ m_2 $}"}</MathJax>

    </MathJaxProvider>
  )
}

function f(a: bigint, b: bigint) {
  if (a < b) [a,b] = [b, a];
  let s = ZEROn, old_s = ONEn;
  let t = ONEn, old_t = ZEROn;
  let r = b, old_r = a;
  while (r != ZEROn) {
      let q = old_r / r;
      [r, old_r] = [old_r - q*r, r];
      [s, old_s] = [old_s - q*s, s];
      [t, old_t] = [old_t - q*t, t];
  }
  return (old_t + a) % a;
}

function parseFlag(flag: string) {
  const match = flag.match(/hz4ann_flag_{(.+?)_(.+?)}/);
  if (!match) {
    throw new Error("Wrong flag format");
  }

  return [BigInt(parseInt(match[1])), BigInt(parseInt(match[2]))];
}

function format(n: bigint) {
  const s = n.toString();
  const l = Math.ceil(s.length / 4);
  let res = "";
  for (let i = 0, j = 0; i < s.length; i++, j++) {
    res += s[i];
    if (j === l - 1 || i === s.length - 1) {
      j = -1;
      res += " \\\\ &\\ ";
    }
  }
  return res;
}

function getPrime(size: number) {
  if (size <= 1) {
    throw new Error("Size too small.");
  }

  let result, t;
  do {
    result = TWOn;
    t = size - 2;
    while (--t) {
      result += Math.random() > 0.5 ? ONEn : ZEROn;
      result <<= ONEn;
    }
    result += ONEn;
  } while (!isPrime(result));

  return result;
}

// https://javascript.plainenglish.io/how-to-find-very-large-prime-numbers-in-javascript-5a563ba2f3bb
function isPrime(n: bigint, k: number = 50) {
	if (n <= ONEn || n == FOURn) return false;
	if (n <= THREEn) return true;
  if ((n - ONEn) % En === ZEROn) return false;

	let d = n - ONEn;
	while (d % TWOn == ZEROn) {
		d /= TWOn;
  }

	for (let i = 0; i < k; i++) {
    if (!primeTest(n, d)) {
      return false;
    }
  }

  return true;
}

function primeTest(n: bigint, d: bigint) {
  const r = BigInt(Math.floor(Math.random() * 1e5))
  const y = r * (n - TWOn) / BIGn;

  let a = TWOn + y % (n - FOURn);
	let x = power(a, d, n);

  const NEG_ONEn = n - ONEn;

	if (x == ONEn || x == NEG_ONEn) {
		return true;
  }

	while (d != NEG_ONEn)	{
		x = (x * x) % n;
		d *= TWOn;

		if (x == ONEn) return false;
		if (x == NEG_ONEn) return true;
	}

	return false;
}


function power(x: bigint, y: bigint, p: bigint) {
	let res = ONEn;
	
	x = x % p;
	while (y > ZEROn) {
		if (y & ONEn) {
			res = (res * x) % p;
    }

		y >>= ONEn;
		x = (x * x) % p;
	}
	return res;
}