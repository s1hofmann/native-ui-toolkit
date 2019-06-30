import * as Tesseract from "tesseract.js";
import { Image } from "../../image.class";
import { Language } from "./language.enum";
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

  public async read(image: Image, lang: Language = Language.ENG): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      this.tesseractReader.recognize(image, {
        lang: languageMap.get(lang)
      })
        .then(result => resolve(result.text.trim()))
        .catch(error => reject(error))
        .finally(() => this.tesseractReader.terminate());
    });
  }
}
