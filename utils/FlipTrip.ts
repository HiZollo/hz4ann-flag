class FlipTrip {
  public colors: number;
  public size: number;
  public state: number[];
  public endStatus?: string;

  private perms: string[];

  constructor(colors: number, size: number) {
    if (colors ** size > 1024) {
      throw new Error(`The value of size^colors should not exceed 1024.`);
    }
    if (colors > 10) {
      throw new Error(`The number of colors should not exceed 10.`);
    }

    this.colors = colors;
    this.size = size;
    this.state = Array.from({ length: size }, () => 0);

    this.perms = [this.state.join('')];
  }

  flip(position: number) {
    if (!(0 <= position && position < this.size)) {
      throw new Error('Attempting to flip at an invalid position.');
    }

    this.state[position] = (this.state[position] + 1) % this.colors;
    const permString = this.state.join('');

    if (this.perms.includes(permString)) {
      this.endStatus = 'Lose';
    }

    this.perms.push(permString);
    if (this.perms.length === this.colors ** this.size) {
      this.endStatus = 'Win';
    }
  }
}

export { FlipTrip };