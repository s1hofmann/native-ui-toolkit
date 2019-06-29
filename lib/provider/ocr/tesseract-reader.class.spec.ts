import { join } from "path";
import { ImageReader } from "../opencv/image-reader.class";
import { TesseractReader } from "./tesseract-reader.class";

describe("TesseractReader", () => {
  it("should extract text from an image", async () => {
    // GIVEN
    const config = {
      corePath: join(__dirname, "../../../data/tesseract/src/node/index.js"),
      langPath: join(__dirname, "../../../data/tesseract/lang/"),
      workerPath: join(__dirname, "../../../data/tesseract/src/node/worker.js"),
    };
    const inputImage = await new ImageReader()
      .load(
        join(__dirname, "../../../e2e/assets/ocr.png")
      );
    const expected = `Hello World
from beyond
the Cosmic Void`;

    const SUT = new TesseractReader(config);

    // WHEN
    const result = await SUT.read(inputImage);

    // THEN
    expect(result).toEqual(expected);
  });
});
