import { mockPartial } from "sneer";
import { Image } from "../image.class";
import { MatchRequest } from "../match-request.class";
import { ScreenAction } from "../provider/native/robotjs-screen-action.class";
import { Language } from "../provider/ocr/language.enum";
import { TesseractReader } from "../provider/ocr/tesseract-reader.class";
import { TemplateMatchingFinder } from "../provider/opencv/template-matching-finder.class";
import { Region } from "../region.class";
import { VisionAdapter } from "./vision.adapter.class";

jest.mock("../provider/opencv/template-matching-finder.class");
jest.mock("../provider/native/robotjs-screen-action.class");
jest.mock("../provider/ocr/tesseract-reader.class");

describe("VisionAdapter class", () => {
  it("should delegate calls to grabScreen", () => {
    // GIVEN
    const finderMock = new TemplateMatchingFinder();
    const screenMock = new ScreenAction();
    const SUT = new VisionAdapter(finderMock, screenMock);

    // WHEN
    SUT.grabScreen();

    // THEN
    expect(screenMock.grabScreen).toBeCalledTimes(1);
  });

  it("should delegate calls to grabScreenRegion", async () => {
    // GIVEN
    const finderMock = new TemplateMatchingFinder();
    const screenMock = new ScreenAction();
    const SUT = new VisionAdapter(finderMock, screenMock);
    const screenRegion = new Region(0, 0, 100, 100);

    // WHEN
    await SUT.grabScreenRegion(screenRegion);

    // THEN
    expect(screenMock.grabScreenRegion).toBeCalledTimes(1);
    expect(screenMock.grabScreenRegion).toBeCalledWith(screenRegion);
  });

  it("should delegate calls to screenWidth", async () => {
    // GIVEN
    const finderMock = new TemplateMatchingFinder();
    const screenMock = new ScreenAction();
    const SUT = new VisionAdapter(finderMock, screenMock);

    // WHEN
    await SUT.screenWidth();

    // THEN
    expect(screenMock.screenWidth).toBeCalledTimes(1);
  });

  it("should delegate calls to screenHeight", async () => {
    // GIVEN
    const finderMock = new TemplateMatchingFinder();
    const screenMock = new ScreenAction();
    const SUT = new VisionAdapter(finderMock, screenMock);

    // WHEN
    await SUT.screenHeight();

    // THEN
    expect(screenMock.screenHeight).toBeCalledTimes(1);
  });

  it("should delegate calls to screenSize", async () => {
    // GIVEN
    const finderMock = new TemplateMatchingFinder();
    const screenMock = new ScreenAction();
    const SUT = new VisionAdapter(finderMock, screenMock);

    // WHEN
    await SUT.screenSize();

    // THEN
    expect(screenMock.screenSize).toBeCalledTimes(1);
  });

  it("should delegate calls to findImage", async () => {
    // GIVEN
    const finderMock = new TemplateMatchingFinder();
    const SUT = new VisionAdapter(finderMock);
    const request = new MatchRequest(
      new Image(100, 100, new ArrayBuffer(0), 3),
      "foo",
      new Region(0, 0, 100, 100),
      0.99,
      true);

    // WHEN
    await SUT.findOnScreenRegion(request);

    expect(finderMock.findMatch).toBeCalledTimes(1);
    expect(finderMock.findMatch).toBeCalledWith(request);
  });

  describe("OCR", () => {
    it("should delegate calls to readText with default language ENG", async () => {
      // GIVEN
      const finderMock = new TemplateMatchingFinder();
      const screenMock = new ScreenAction();
      const readerMock = new TesseractReader();
      const imageMock = mockPartial<Image>({});
      const SUT = new VisionAdapter(finderMock, screenMock, readerMock);

      // WHEN
      await SUT.readText(imageMock);

      expect(readerMock.readPage).toBeCalledTimes(1);
      expect(readerMock.readPage).toBeCalledWith(imageMock, Language.ENG);
    });

    it.each([
      [Language.ENG],
      [Language.GER]
    ])("should delegate calls to readText with language %s", async (lang: Language) => {
      // GIVEN
      const finderMock = new TemplateMatchingFinder();
      const screenMock = new ScreenAction();
      const readerMock = new TesseractReader();
      const imageMock = mockPartial<Image>({});
      const SUT = new VisionAdapter(finderMock, screenMock, readerMock);

      // WHEN
      await SUT.readText(imageMock, lang);

      expect(readerMock.readPage).toBeCalledTimes(1);
      expect(readerMock.readPage).toBeCalledWith(imageMock, lang);
    });

    it("should delegate calls to readWords with default language ENG", async () => {
      // GIVEN
      const finderMock = new TemplateMatchingFinder();
      const screenMock = new ScreenAction();
      const readerMock = new TesseractReader();
      const imageMock = mockPartial<Image>({});
      const SUT = new VisionAdapter(finderMock, screenMock, readerMock);

      // WHEN
      await SUT.readWords(imageMock);

      expect(readerMock.readWords).toBeCalledTimes(1);
      expect(readerMock.readWords).toBeCalledWith(imageMock, Language.ENG);
    });

    it.each([
      [Language.ENG],
      [Language.GER]
    ])("should delegate calls to readWords with language %s", async (lang: Language) => {
      // GIVEN
      const finderMock = new TemplateMatchingFinder();
      const screenMock = new ScreenAction();
      const readerMock = new TesseractReader();
      const imageMock = mockPartial<Image>({});
      const SUT = new VisionAdapter(finderMock, screenMock, readerMock);

      // WHEN
      await SUT.readWords(imageMock, lang);

      expect(readerMock.readWords).toBeCalledTimes(1);
      expect(readerMock.readWords).toBeCalledWith(imageMock, lang);
    });
  });
});
