/**
 * A TextReader should provide methods to extract text from images
 *
 * @interface TextReader
 */
import { Image } from "../../image.class";

export interface TextReader {
  /**
   * store will write data to disk
   * @param image Image to read text from
   */
  read(image: Image): Promise<string>;
}
