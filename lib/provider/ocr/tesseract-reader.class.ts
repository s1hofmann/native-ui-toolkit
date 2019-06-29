import * as Tesseract from "tesseract.js";
import { Image } from "../../image.class";
import { TextReader } from "./text-reader.interface";

export class TesseractReader implements TextReader {

  private tesseractReader: Tesseract.TesseractWorker;

  constructor(private readonly config: {
    workerPath: string,
    langPath: string,
    corePath: string
  }) {
    this.tesseractReader = Tesseract.create(this.config);
  }

  public async read(image: Image): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      this.tesseractReader.recognize(image, {
        lang: "eng"
      })
        .then(result => resolve(result.text.trim()))
        .catch(error => reject(error))
        .finally(() => (this.tesseractReader as any).terminate());
    });
  }
}
