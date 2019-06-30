/**
 * A TextReader should provide methods to extract text from images
 *
 * @interface TextReader
 */
import { Image } from "../../image.class";
import { Language } from "./language.enum";
import { OCRResult } from "./ocr-result.interface";

export interface TextReader {
  readPage(image: Image, language: Language): Promise<string>;
  readWords(image: Image, language: Language): Promise<OCRResult[]>;
}
