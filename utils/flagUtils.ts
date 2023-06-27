import flags from "@/data/flags.json";

export default decrypt(flags);

function decrypt(flags: { [key: string]: string }) {
  const origin: { [key: string]: string } = {};

  for (const key in flags) {
    origin[key] = format(swapn(mul(add(flags[key], -4), BigInt(91), BigInt(13)), [[1,2], [2,3], [3,4], [4,5], [1,5], [1,4], [1,3]]));
  }

  return origin;
}

function format(s: string) {
  return `hz4ann_flag_{${s}}`;
}

function add(s: string, n: number) {
  let r = "";
  let i = 1;
  for (const c of s) {
    if (c.charCodeAt(0) > 10000) r += String.fromCharCode(c.charCodeAt(0) + n * i);
    else r += String.fromCharCode(c.charCodeAt(0) + n);
    i++;
  }
  return r;
}

function mul(s: string, n: bigint, e: bigint) {
  let r = "";
  for (const c of s) {
    if (c.charCodeAt(0) > 10000) r += c;
    else r += String.fromCharCode(Number(power(BigInt(c.charCodeAt(0) - ' '.charCodeAt(0)), e) % n) + ' '.charCodeAt(0));
  }
  return r;
}

function power(a: bigint, n: bigint): bigint {
  if (n === BigInt(1)) return a;
  const m = n / BigInt(2);
  return power(a, m) * power(a, n - m);
}

function swapn(s: string, fracs: number[][]) {
  for (const [a, b] of fracs) {
    const mid = s.length - Math.round(s.length * a / b);
    s = reverse(s.substring(mid)) + s.substring(0, mid);
  }
  return s;
}

function reverse(s: string): string {
  if (s.length <= 1) return s;
  const mid = ~~(s.length / 2);
  return reverse(s.substring(mid)) + reverse(s.substring(0, mid));
}