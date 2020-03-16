/**
 * The {@link Image} class represents generic image data
 */
export class Image {
  /**
   * {@link Image} class constructor
   * @param width {@link Image} width in pixels
   * @param height {@link Image} height in pixels
   * @param data Generic {@link Image} data
   * @param channels Amount of {@link Image} channels
   * @param pixelDensity Object containing scale info to work with e.g. Retina display data where the reported display size and pixel size differ (Default: {scaleX: 1.0, scaleY: 1.0})
   */
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly data: any,
    public readonly channels: number,
    public readonly pixelDensity: { scaleX: number; scaleY: number } = {
      scaleX: 1.0,
      scaleY: 1.0,
    },
  ) {
    if (channels <= 0) {
      throw new Error("Channel <= 0");
    }
  }

  /**
   * {@link hasAlphaChannel} return true if an {@link Image} has an additional (fourth) alpha channel
   */
  public get hasAlphaChannel() {
    return this.channels > 3;
  }
}
