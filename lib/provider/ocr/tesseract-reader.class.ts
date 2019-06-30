import * as Tesseract from "tesseract.js";
import { Image } from "../../image.class";
import { Region } from "../../region.class";
import { Language } from "./language.enum";
import { OCRResult } from "./ocr-result.interface";
import { TextReader } from "./text-reader.interface";

const languageMap = new Map<Language, string>([
  [Language.ENG, "eng"],
  [Language.GER, "deu"]
]);

export interface TesseractReaderConfig {
  workerPath: string;
  langPath: string;
  corePath: string;
}

export class TesseractReader implements TextReader {

  private tesseractReader: Tesseract.TesseractWorker;

  constructor(config?: TesseractReaderConfig) {
    this.tesseractReader = Tesseract.create(config);
  }

  public async readPage(image: Image, lang: Language = Language.ENG): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      this.tesseractReader.recognize(image, {
        lang: languageMap.get(lang)
      })
        .then(result => resolve(result.text.trim()))
        .catch(error => reject(error))
        .finally(() => this.tesseractReader.terminate());
    });
  }

  public async readWords(image: Image, lang: Language = Language.ENG): Promise<OCRResult[]> {
    return new Promise<OCRResult[]>(async (resolve, reject) => {
      this.tesseractReader.recognize(image, {
        lang: languageMap.get(lang)
      })
        .then(result => {
          resolve(result.words.map(word => {
            const bboxRegion = new Region(
              word.bbox.x0 / image.pixelDensity.scaleX,
              word.bbox.y0 / image.pixelDensity.scaleY,
              (word.bbox.x1 - word.bbox.x0) / image.pixelDensity.scaleX,
              (word.bbox.y1 - word.bbox.y0) / image.pixelDensity.scaleY
            );
            return ({
              boundingBox: bboxRegion,
              confidence: word.confidence / 100,
              text: word.text.trim(),
            }) as OCRResult;
          }));
        })
        .catch(error => reject(error))
        .finally(() => this.tesseractReader.terminate());
    });
  }
}
