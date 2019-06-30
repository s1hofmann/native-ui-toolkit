import { existsSync } from "fs";
import { join } from "path";
import { NativeAdapter } from "./adapter/native.adapter.class";
import { VisionAdapter } from "./adapter/vision.adapter.class";
import { FileType } from "./file-type.enum";
import { centerOf } from "./location.function";
import { TesseractReader } from "./provider/ocr/tesseract-reader.class";
import { Region } from "./region.class";
import { Screen } from "./screen.class";
import { sleep } from "./sleep.function";

describe("Screen.", () => {
  it("should capture the screen", () => {
    // GIVEN
    const visionAdapter = new VisionAdapter();
    const SUT = new Screen(visionAdapter);

    // WHEN
    SUT.capture("asdf", FileType.PNG).then(filename => {
      // THEN
      expect(filename).not.toBeNull();
      sleep(1000).then(() => {
        expect(existsSync(filename)).toBeTruthy();
      });
    });
  });

  it("should capture the screen and save to JPG", () => {
    // GIVEN
    const visionAdapter = new VisionAdapter();
    const SUT = new Screen(visionAdapter);

    // WHEN
    SUT.capture("asdf", FileType.JPG).then(filename => {
      // THEN
      expect(filename).not.toBeNull();
      sleep(1000).then(() => {
        expect(existsSync(filename)).toBeTruthy();
      });
    });
  });

  it("should capture the screen and save file with prefix", () => {
    // GIVEN
    const visionAdapter = new VisionAdapter();
    const SUT = new Screen(visionAdapter);
    const prefix = "foo_";

    // WHEN
    SUT.capture("asdf", FileType.JPG, "./", prefix).then(filename => {
      // THEN
      expect(filename.includes(prefix)).toBeTruthy();
      expect(filename).not.toBeNull();
      sleep(1000).then(() => {
        expect(existsSync(filename)).toBeTruthy();
      });
    });
  });

  it("should capture the screen and save file with postfix", () => {
    // GIVEN
    const visionAdapter = new VisionAdapter();
    const SUT = new Screen(visionAdapter);
    const postfix = "_bar";

    // WHEN
    SUT.capture("asdf", FileType.JPG, "./", "", postfix).then(filename => {
      // THEN
      expect(filename.includes(postfix)).toBeTruthy();
      expect(filename).not.toBeNull();
      sleep(1000).then(() => {
        expect(existsSync(filename)).toBeTruthy();
      });
    });
  });

  it("should capture the screen and save file with pre- and postfix", () => {
    // GIVEN
    const visionAdapter = new VisionAdapter();
    const SUT = new Screen(visionAdapter);
    const filename = "asdf";
    const prefix = "foo_";
    const postfix = "_bar";

    // WHEN
    SUT.capture("asdf", FileType.JPG, "./", prefix, postfix).then(output => {
      // THEN
      expect(output.includes(`${prefix}${filename}${postfix}`)).toBeTruthy();
      expect(output).not.toBeNull();
      sleep(1000).then(() => {
        expect(existsSync(output)).toBeTruthy();
      });
    });
  });

  it("should reject after timeout", async () => {
    // GIVEN
    jest.setTimeout(10000);
    const timeout = 5000;
    const visionAdapter = new VisionAdapter();
    const SUT = new Screen(visionAdapter);
    SUT.config.resourceDirectory = "./e2e/assets";

    // WHEN
    const start = Date.now();
    try {
      await SUT.waitFor("calculator.png", timeout);
    } catch (e) {
      // THEN
      expect(e).toBe(`Action timed out after ${timeout} ms`);
    }
    const end = Date.now();

    // THEN
    expect(end - start).toBeGreaterThanOrEqual(timeout);
  });

  it.skip("should find a single word inside a target region", async () => {
    // GIVEN
    const screenReaderConfig = {
      corePath: join(__dirname, "../data/tesseract/src/node/index.js"),
      langPath: join(__dirname, "../data/tesseract/lang/"),
      workerPath: join(__dirname, "../data/tesseract/src/node/worker.js"),
    };
    const screenReader = new TesseractReader(screenReaderConfig);
    const visionAdapter = new VisionAdapter({
      screenReader
    });
    const nativeAdapter = new NativeAdapter();
    const SUT = new Screen(visionAdapter);

    // WHEN
    const result = await SUT.findText("WebStorm", {searchRegion: new Region(0, 0, 200, 20)});

    // THEN
    await nativeAdapter.setMousePosition(await centerOf(result));
  });

  it.skip("should read the whole text in a region", async () => {
    // GIVEN
    const screenReaderConfig = {
      corePath: join(__dirname, "../data/tesseract/src/node/index.js"),
      langPath: join(__dirname, "../data/tesseract/lang/"),
      workerPath: join(__dirname, "../data/tesseract/src/node/worker.js"),
    };
    const screenReader = new TesseractReader(screenReaderConfig);
    const visionAdapter = new VisionAdapter({
      screenReader
    });
    const SUT = new Screen(visionAdapter);
    const expected = "WebStorm";

    // WHEN
    const result = await SUT.readText(new Region(40, 0, 70, 20));

    // THEN
    expect(result).toEqual(expected);
  });
});
