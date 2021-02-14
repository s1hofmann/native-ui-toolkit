import { join } from "path";
import { cwd } from "process";
import { VisionAdapter } from "./adapter/vision.adapter.class";
import { Image } from "./image.class";
import { LocationParameters } from "./locationparameters.class";
import { MatchRequest } from "./match-request.class";
import { MatchResult } from "./match-result.class";
import { Region } from "./region.class";
import { Screen } from "./screen.class";
import { mockPartial } from "sneer";
import { FileType } from "./file-type.enum";

jest.mock("./adapter/native.adapter.class");
jest.mock("./adapter/vision.adapter.class");

const searchRegion = new Region(0, 0, 100, 100);

beforeAll(() => {
    VisionAdapter.prototype.grabScreen = jest.fn(() => {
        return Promise.resolve(new Image(searchRegion.width, searchRegion.height, new ArrayBuffer(0), 3));
    });

    VisionAdapter.prototype.screenSize = jest.fn(() => {
        return Promise.resolve(searchRegion);
    });
});

describe("Screen.", () => {
    it("should resolve with sufficient confidence.", async () => {
        const matchResult = new MatchResult(0.99, searchRegion);

        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        await expect(SUT.findImage({ id: imageId, data: imageData })).resolves.toEqual(matchResult.location);
        const matchRequest = new MatchRequest(
            expect.any(Image),
            imageId,
            imageData,
            searchRegion,
            SUT.config.confidence,
            true);
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(matchRequest);
    });

    it("should call registered hook before resolve", async () => {
        const matchResult = new MatchResult(0.99, searchRegion);
        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });
        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);
        const testCallback = jest.fn(() => Promise.resolve());
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        SUT.on(imageId, testCallback);
        await SUT.findImage({ id: imageId, data: imageData });
        expect(testCallback).toBeCalledTimes(1);
        expect(testCallback).toBeCalledWith(matchResult);
    });

    it("should call multiple registered hooks before resolve", async () => {
        const matchResult = new MatchResult(0.99, searchRegion);
        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });
        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);
        const testCallback = jest.fn(() => Promise.resolve());
        const secondCallback = jest.fn(() => Promise.resolve());
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        SUT.on(imageId, testCallback);
        SUT.on(imageId, secondCallback);
        await SUT.findImage({ id: imageId, data: imageData });
        for (const callback of [testCallback, secondCallback]) {
            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(matchResult);
        }
    });

    it("should reject with insufficient confidence.", async () => {
        const matchResult = new MatchResult(0.8, searchRegion);

        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        await expect(SUT.findImage({ id: imageId, data: imageData }))
            .rejects
            .toEqual(`No match for ${imageId}. Required: ${SUT.config.confidence}, given: ${matchResult.confidence}`);
    });

    it("should reject when search fails.", async () => {
        const rejectionReason = "Search failed.";
        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.reject(rejectionReason);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        await expect(SUT.findImage({ id: imageId, data: imageData }))
            .rejects
            .toEqual(`Searching for ${imageId} failed. Reason: '${rejectionReason}'`);
    });

    it("should override default confidence value with parameter.", async () => {
        const minMatch = 0.8;
        const matchResult = new MatchResult(minMatch, searchRegion);

        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);

        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        const parameters = new LocationParameters(undefined, minMatch);
        await expect(SUT.findImage({ id: imageId, data: imageData }, parameters)).resolves.toEqual(matchResult.location);
        const matchRequest = new MatchRequest(
            expect.any(Image),
            imageId,
            imageData,
            searchRegion,
            minMatch,
            true);
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(matchRequest);
    });

    it("should override default search region with parameter.", async () => {
        // GIVEN
        const customSearchRegion = new Region(10, 10, 90, 90);
        const matchResult = new MatchResult(0.99, searchRegion);
        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });
        const visionAdapterMock = new VisionAdapter();
        const SUT = new Screen(visionAdapterMock);
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        const parameters = new LocationParameters(customSearchRegion);
        const expectedMatchRequest = new MatchRequest(
          expect.any(Image),
          imageId,
          imageData,
          customSearchRegion,
          SUT.config.confidence,
          true);

        // WHEN
        await SUT.findImage({ id: imageId, data: imageData }, parameters);

        // THEN
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(expectedMatchRequest);
    });

    it("should override searchMultipleScales with parameter.", async () => {
        // GIVEN
        const matchResult = new MatchResult(0.99, searchRegion);
        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });
        const visionAdapterMock = new VisionAdapter();
        const SUT = new Screen(visionAdapterMock);
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        const parameters = new LocationParameters(searchRegion, undefined, false);
        const expectedMatchRequest = new MatchRequest(
          expect.any(Image),
          imageId,
          imageData,
          searchRegion,
          SUT.config.confidence,
          false);

        // WHEN
        await SUT.findImage({ id: imageId, data: imageData }, parameters);

        // THEN
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(expectedMatchRequest);
    });

    it("should override both confidence and search region with parameter.", async () => {
        // GIVEN
        const minMatch = 0.8;
        const customSearchRegion = new Region(10, 10, 90, 90);
        const matchResult = new MatchResult(minMatch, searchRegion);
        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });
        const visionAdapterMock = new VisionAdapter();
        const SUT = new Screen(visionAdapterMock);
        const imageId = "test/path/to/image.png";
        const imageData = Buffer.from([]);
        const parameters = new LocationParameters(customSearchRegion, minMatch);
        const expectedMatchRequest = new MatchRequest(
          expect.any(Image),
          imageId,
          imageData,
          customSearchRegion,
          minMatch,
          true);

        // WHEN
        await SUT.findImage({ id: imageId, data: imageData }, parameters);

        // THEN
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(expectedMatchRequest);
    });

    it("should return region to highlight for chaining", async () => {
        // GIVEN
        const highlightRegion = new Region(10, 20, 30, 40);
        VisionAdapter.prototype.highlightScreenRegion = jest.fn();
        const visionAdapterMock = new VisionAdapter();
        const SUT = new Screen(visionAdapterMock);

        // WHEN
        const result = await SUT.highlight(highlightRegion);

        // THEN
        expect(result).toEqual(highlightRegion);
    });

    it("should handle Promises and return region to highlight for chaining", async () => {
        // GIVEN
        const highlightRegion = new Region(10, 20, 30, 40);
        const highlightRegionPromise = new Promise<Region>(res => res(highlightRegion));
        VisionAdapter.prototype.highlightScreenRegion = jest.fn();
        const visionAdapterMock = new VisionAdapter();
        const SUT = new Screen(visionAdapterMock);

        // WHEN
        const result = await SUT.highlight(highlightRegionPromise);

        // THEN
        expect(result).toEqual(highlightRegion);
    });

    it("should add search region offset to result image location", async () => {

        // GIVEN
        const limitedSearchRegion = new Region(100, 200, 300, 400);
        const resultRegion = new Region(50, 100, 150, 200);
        const matchResult = new MatchResult(0.99, resultRegion);

        const expectedMatchRegion = new Region(
            limitedSearchRegion.left + resultRegion.left,
            limitedSearchRegion.top + resultRegion.top,
            resultRegion.width,
            resultRegion.height);

        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });
        const SUT = new Screen(new VisionAdapter());

        // WHEN
        const matchRegion = await SUT.findImage(
            { id: "test/path/to/image.png", data: Buffer.from([]) },
            {
                searchRegion: limitedSearchRegion
            });

        // THEN
        expect(matchRegion).toEqual(expectedMatchRegion);
    })

    describe("capture",() => {
        it("should capture the whole screen and save image", async() => {

            // GIVEN
            const screenshot = mockPartial<Image>({data: "pretty pretty image"});
            VisionAdapter.prototype.grabScreen = jest.fn(() => Promise.resolve(screenshot));
            VisionAdapter.prototype.saveImage = jest.fn();
            const visionAdapterMock = new VisionAdapter();
            const SUT = new Screen(visionAdapterMock);
            const imageName = "foobar.png"
            const expectedImagePath = join(cwd(), imageName)

            // WHEN
            const imagePath = await SUT.capture(imageName)

            // THEN
            expect(imagePath).toBe(expectedImagePath)
            expect(VisionAdapter.prototype.grabScreen).toHaveBeenCalled()
            expect(VisionAdapter.prototype.saveImage).toHaveBeenCalledWith(screenshot,expectedImagePath)
        })

        it("should consider output configuration", async () => {

            // GIVEN
            const visionAdapterMock = new VisionAdapter();
            const SUT = new Screen(visionAdapterMock);
            const imageName = "foobar"
            const filePath = "/path/to/file"
            const prefix = "answer_"
            const postfix = "_42"
            const expectedImagePath = join(filePath, `${prefix}${imageName}${postfix}${FileType.JPG.toString()}`)

            // WHEN
            const imagePath = await SUT.capture(imageName, FileType.JPG, filePath, prefix, postfix)

            // THEN
            expect(imagePath).toBe(expectedImagePath)
        })
    })

    describe("captureRegion", () => {

        it("should capture the specified region of the screen and save image", async () => {
            // GIVEN
            const screenshot = mockPartial<Image>({data: "pretty partial image"});
            const regionToCapture = mockPartial<Region>({top:42, left:9, height: 10, width: 3.14159265359})
            VisionAdapter.prototype.grabScreenRegion = jest.fn(() => Promise.resolve(screenshot));
            VisionAdapter.prototype.saveImage = jest.fn();
            const visionAdapterMock = new VisionAdapter();
            const SUT = new Screen(visionAdapterMock);
            const imageName = "foobar.png"
            const expectedImagePath = join(cwd(), imageName)

            // WHEN
            const imagePath = await SUT.captureRegion(imageName, regionToCapture)

            // THEN
            expect(imagePath).toBe(expectedImagePath)
            expect(VisionAdapter.prototype.grabScreenRegion).toHaveBeenCalledWith(regionToCapture)
            expect(VisionAdapter.prototype.saveImage).toHaveBeenCalledWith(screenshot,expectedImagePath)
        })

        it("should consider output configuration", async () => {

            // GIVEN
            const regionToCapture = mockPartial<Region>({top:42, left:9, height: 10, width: 3.14159265359})
            const visionAdapterMock = new VisionAdapter();
            const SUT = new Screen(visionAdapterMock);
            const imageName = "foobar"
            const filePath = "/path/to/file"
            const prefix = "answer_"
            const postfix = "_42"
            const expectedImagePath = join(filePath, `${prefix}${imageName}${postfix}${FileType.JPG.toString()}`)

            // WHEN
            const imagePath = await SUT.captureRegion(imageName, regionToCapture, FileType.JPG, filePath, prefix, postfix)

            // THEN
            expect(imagePath).toBe(expectedImagePath)
        })
    })
});
