/**
 * A TextReader should provide methods to extract text from images
 *
 * @interface TextReader
 */
import { Image } from "../../image.class";
import { Language } from "./language.enum";

export interface TextReader {
  /**
   * store will write data to disk
   * @param image Image to read text from
   * @param language Specific language to use for text extraction
   */
  read(image: Image, language: Language): Promise<string>;
}
