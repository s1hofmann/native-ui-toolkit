import { Region } from "./region.class";

/**
 * {@link LocationParameters} serves as a data class holding location parameters for image search
 */
export class LocationParameters {
  /**
   * {@link LocationParameters} class constructor
   * @param searchRegion Optional {@link Region} to limit the search space to
   * @param confidence Optional confidence value to configure image match confidence
   */
  constructor(public searchRegion?: Region, public confidence?: number) {}
}

/**
 * {@link ImageSearchParameters} serves as a data class holding parameters for image search
 */
export class ImageSearchParameters {
  /**
   * {@link ImageSearchParameters} class constructor
   * @param filename Filename of template image to search for
   */
  constructor(public readonly filename: string) {
  }
}

/**
 * {@link TextSearchParameters} serves as a data class holding parameters for text search
 */
export class TextSearchParameters {
  /**
   * {@link TextSearchParameters} class constructor
   * @param text Text to search for on screen
   * @param language String specifying search language. "eng" would only search for english strings, "eng+deu" would search for text in english and german
   */
  constructor(public readonly text: string, public readonly language: string = "eng") {
  }
}
