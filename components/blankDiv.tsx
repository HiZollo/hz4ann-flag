interface BlankDivProps {
  height?: string
}
function BlankDiv({ height }: BlankDivProps) {
  return <div style={{ height: height ?? '200px' }} />
}

export { BlankDiv }
