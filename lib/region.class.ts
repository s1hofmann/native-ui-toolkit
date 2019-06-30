export class Region {
  public static scaled(
    region: Region,
    scaleX: number = 1.0,
    scaleY: number = 1.0,
  ): Region {
    if (scaleX === 0 || scaleY === 0) {
      throw new Error(
        `Scaling to 0. Please check parameters: scaleX: ${scaleX}, scaleY: ${scaleY}`,
      );
    }
    return new Region(
      region.left * scaleX,
      region.top * scaleY,
      region.width * scaleX,
      region.height * scaleY,
    );
  }

  constructor(
    public left: number,
    public top: number,
    public width: number,
    public height: number,
  ) {}

  public area() {
    return this.width * this.height;
  }

  public toString() {
    return `(${this.left}, ${this.top}, ${this.width}, ${this.height})`;
  }
}
