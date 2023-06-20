class LightsUp {
  public board: boolean[][] = []
  public state: number = 0
  public static readonly completeState = 2**25 - 1
  private readonly boardSize: number = 5
  
  constructor() {
    const util_arr = Array.from(
      { length: this.boardSize },
      (_, i) => i
    )

    for (const i of util_arr) {
      this.board.push([])
      for (const _ of util_arr) { 
        this.board[i].push(false)
      }
    }
    
    this.state = 0
  }
  
  public flip(x: number, y: number) {
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = x + dr, nc = y + dc
      if (0 <= nr && nr < this.boardSize && 0 <= nc && nc < this.boardSize) {
        this.board[nr][nc] = !this.board[nr][nc]
        this.state ^= 2**(nr*this.boardSize + nc)
      }
    })
  }
  
  public get win() {
    return this.state === LightsUp.completeState
  }
  
  public getBoardSize() { return this.boardSize }
  
}

export { LightsUp }
