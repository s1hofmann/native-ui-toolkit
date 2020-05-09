import libnut = require("@nut-tree/libnut");
import { Region } from "../../region.class";
import { ScreenAction } from "./libnut-screen-action.class";

jest.mock("@nut-tree/libnut");

beforeEach(() => {
  jest.resetAllMocks();
});

const screenSize = new Region(0, 0, 100, 100);
const screenShotSize = new Region(0, 0, 200, 200);

describe("libnut screen action", () => {
  describe("screen data", () => {
    it("should reject when no screenshot data is available", async () => {
      // GIVEN
      const SUT = new ScreenAction();

      // WHEN
      const call = await SUT.grabScreen;

      // THEN
      await expect(call()).rejects.toEqual("Unable to fetch screen content.");
      expect(libnut.screen.capture).toBeCalledTimes(1);
    });

    it("should resolve when screenshot data is available", async () => {
      // GIVEN
      const SUT = new ScreenAction();
      libnut.screen.capture = jest.fn(() => ({
          bitsPerPixel: 0,
          byteWidth: 0,
          bytesPerPixel: 0,
          colorAt: jest.fn(),
          height: screenShotSize.height,
          image: new ArrayBuffer(0),
          width: screenShotSize.width,
        })
      );
      libnut.getScreenSize = jest.fn(() => ({
          height: screenSize.height,
          width: screenSize.width,
        })
      );

      // WHEN
      const image = await SUT.grabScreen();

      // THEN
      expect(image.width).toEqual(screenShotSize.width);
      expect(image.height).toEqual(screenShotSize.height);
      expect(image.pixelDensity.scaleX).toEqual(2);
      expect(image.pixelDensity.scaleY).toEqual(2);
      expect(libnut.screen.capture).toBeCalledTimes(1);
    });

    it("should resolve when screenshot data of a screen region is available", async () => {
      // GIVEN
      const screenRegion = new Region(0, 0, 10, 10);
      const SUT = new ScreenAction();
      libnut.screen.capture = jest.fn(() => ({
          bitsPerPixel: 0,
          byteWidth: 0,
          bytesPerPixel: 0,
          colorAt: jest.fn(),
          height: screenShotSize.height,
          image: new ArrayBuffer(0),
          width: screenShotSize.width,
        })
      );

      // WHEN
      const image = await SUT.grabScreenRegion(screenRegion);

      // THEN
      expect(image.width).toEqual(screenShotSize.width);
      expect(image.height).toEqual(screenShotSize.height);
      expect(image.pixelDensity.scaleX).toEqual(20);
      expect(image.pixelDensity.scaleY).toEqual(20);
      expect(libnut.screen.capture).toBeCalledTimes(1);
    });

    it("should reject when no screenshot of a screen region is available", async () => {
      // GIVEN
      const SUT = new ScreenAction();

      // WHEN
      const call = await SUT.grabScreenRegion;
      const screenRegion = new Region(0, 0, 10, 10);

      // THEN
      await expect(call(screenRegion)).rejects.toEqual("Unable to fetch screen content.");
      expect(libnut.screen.capture).toBeCalledTimes(1);
      expect(libnut.screen.capture)
        .toBeCalledWith(screenRegion.left, screenRegion.top, screenRegion.width, screenRegion.height);
    });
  });

  describe("screen size", () => {
    describe("screenWidth", () => {
      it("should determine screen width via libnut", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        libnut.getScreenSize = jest.fn(() => ({width: screenSize.width, height: screenSize.height}));

        // WHEN
        const width = await SUT.screenWidth();

        // THEN
        expect(width).toEqual(screenSize.width);
      });

      it("should reject on libnut errors", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        const error = "Test error";
        libnut.getScreenSize = jest.fn(() => {
          throw new Error(error);
        });

        // WHEN

        // THEN
        expect(SUT.screenWidth()).rejects.toThrowError(error);
      });
    });

    describe("screenWidth", () => {
      it("should determine screen height via libnut", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        libnut.getScreenSize = jest.fn(() => ({width: screenSize.width, height: screenSize.height}));

        // WHEN
        const width = await SUT.screenHeight();

        // THEN
        expect(width).toEqual(screenSize.height);
      });

      it("should reject on libnut errors", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        const error = "Test error";
        libnut.getScreenSize = jest.fn(() => {
          throw new Error(error);
        });

        // WHEN

        // THEN
        expect(SUT.screenHeight()).rejects.toThrowError(error);
      });
    });

    describe("screenWidth", () => {
      it("should determine screen size via libnut", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        libnut.getScreenSize = jest.fn(() => ({width: screenSize.width, height: screenSize.height}));

        // WHEN
        const size = await SUT.screenSize();

        // THEN
        expect(size).toEqual(screenSize);
      });

      it("should reject on libnut errors", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        const error = "Test error";
        libnut.getScreenSize = jest.fn(() => {
          throw new Error(error);
        });

        // WHEN

        // THEN
        expect(SUT.screenSize()).rejects.toThrowError(error);
      });
    });

    describe("highlight", () => {
      it("should highlight a screen region via libnut", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        libnut.screen.highlight = jest.fn(() => {});
        const x = 10;
        const y = 20;
        const w = 30;
        const h = 40;
        const testRegion = new Region(x, y, w, h);
        const highlightDuration = 10;
        const highlightOpacity = 1.0;

        // WHEN
        await SUT.highlightScreenRegion(testRegion, highlightDuration, highlightOpacity);

        // THEN
        expect(libnut.screen.highlight).toBeCalledTimes(1);
        expect(libnut.screen.highlight).toBeCalledWith(x, y, w, h, highlightDuration, highlightOpacity);
      });

      it("should reject on libnut errors", async () => {
        // GIVEN
        const SUT = new ScreenAction();
        const error = "Test error";
        libnut.getScreenSize = jest.fn(() => {
          throw new Error(error);
        });

        // WHEN

        // THEN
        expect(SUT.screenSize()).rejects.toThrowError(error);
      });
    });
  });
});
