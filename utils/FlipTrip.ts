class FlipTrip {
  public colors: number;
  public size: number;
  public states: number[];
  public endStatus?: string;

  private perms: number[];
  private permMaxSize: number;

  constructor(colors: number, size: number) {
    if (colors > 10) {
      throw new Error(`The number of colors should not exceed 10.`);
    }
    if (colors > 100) {
      throw new Error(`The size should not exceed 100.`);
    }

    this.colors = colors;
    this.size = size;
    this.states = Array.from({ length: size }, () => 0);

    this.perms = [size];
    this.permMaxSize = (size + 1) * (size + 2) / 2;
  }

  flip(position: number) {
    if (!(0 <= position && position < this.size)) {
      throw new Error('Attempting to flip at an invalid position.');
    }

    this.states[position] = (this.states[position] + 1) % this.colors;
    const perm = this.states.reduce((acc, cur) => acc + (10 ** cur), 0);

    if (this.perms.includes(perm)) {
      this.endStatus = 'Lose';
    }

    this.perms.push(perm);
    if (this.perms.length === this.permMaxSize) {
      this.endStatus = 'Win';
    }
  }
}

export { FlipTrip };