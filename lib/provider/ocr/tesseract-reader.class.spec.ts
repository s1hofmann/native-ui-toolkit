import { join } from "path";
import { ImageReader } from "../opencv/image-reader.class";
import { TesseractReader } from "./tesseract-reader.class";

const baseDir = join(__dirname, "../../..");

describe("TesseractReader", () => {
  it("should extract text from an image", async () => {
    // GIVEN
    const config = {
      corePath: join(baseDir, "data/tesseract/src/node/index.js"),
      langPath: join(baseDir, "data/tesseract/lang/"),
      workerPath: join(baseDir, "data/tesseract/src/node/worker.js"),
    };
    const inputImage = await new ImageReader()
      .load(
        join(baseDir, "e2e/assets/npm.png")
      );
    const expected = `Search packages`;

    const SUT = new TesseractReader(config);

    // WHEN
    const result = await SUT.read(inputImage);

    // THEN
    expect(result).toContain(expected);
  });
});
