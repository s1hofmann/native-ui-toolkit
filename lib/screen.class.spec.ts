import {join} from "path";
import {cwd} from "process";
import {VisionAdapter} from "./adapter/vision.adapter.class";
import {Image} from "./image.class";
import {LocationParameters} from "./locationparameters.class";
import {MatchRequest} from "./match-request.class";
import {MatchResult} from "./match-result.class";
import {Region} from "./region.class";
import {Screen} from "./screen.class";

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
        const imagePath = "test/path/to/image.png";
        await expect(SUT.find(imagePath)).resolves.toEqual(matchResult.location);
        const matchRequest = new MatchRequest(
            expect.any(Image),
            join(cwd(), imagePath),
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
        const imagePath = "test/path/to/image.png";
        SUT.on(imagePath, testCallback);
        await SUT.find(imagePath);
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
        const imagePath = "test/path/to/image.png";
        SUT.on(imagePath, testCallback);
        SUT.on(imagePath, secondCallback);
        await SUT.find(imagePath);
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
        const imagePath = "test/path/to/image.png";
        await expect(SUT.find(imagePath))
            .rejects
            .toEqual(`No match for ${imagePath}. Required: ${SUT.config.confidence}, given: ${matchResult.confidence}`);
    });

    it("should reject when search fails.", async () => {
        const rejectionReason = "Search failed.";
        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.reject(rejectionReason);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);
        const imagePath = "test/path/to/image.png";
        await expect(SUT.find(imagePath))
            .rejects
            .toEqual(`Searching for ${imagePath} failed. Reason: '${rejectionReason}'`);
    });

    it("should override default confidence value with parameter.", async () => {
        const minMatch = 0.8;
        const matchResult = new MatchResult(minMatch, searchRegion);

        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);

        const imagePath = "test/path/to/image.png";
        const parameters = new LocationParameters(undefined, minMatch);
        await expect(SUT.find(imagePath, parameters)).resolves.toEqual(matchResult.location);
        const matchRequest = new MatchRequest(
            expect.any(Image),
            join(cwd(), imagePath),
            searchRegion,
            minMatch,
            true);
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(matchRequest);
    });

    it("should override default search region with parameter.", async () => {
        const customSearchRegion = new Region(10, 10, 90, 90);
        const matchResult = new MatchResult(0.99, searchRegion);

        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);

        const imagePath = "test/path/to/image.png";
        const parameters = new LocationParameters(customSearchRegion);
        await expect(SUT.find(imagePath, parameters)).resolves.toEqual(matchResult.location);
        const matchRequest = new MatchRequest(
            expect.any(Image),
            join(cwd(), imagePath),
            customSearchRegion,
            SUT.config.confidence,
            true);
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(matchRequest);
    });

    it("should override both confidence and search region with parameter.", async () => {
        const minMatch = 0.8;
        const customSearchRegion = new Region(10, 10, 90, 90);
        const matchResult = new MatchResult(minMatch, searchRegion);

        VisionAdapter.prototype.findOnScreenRegion = jest.fn(() => {
            return Promise.resolve(matchResult);
        });

        const visionAdapterMock = new VisionAdapter();

        const SUT = new Screen(visionAdapterMock);

        const imagePath = "test/path/to/image.png";
        const parameters = new LocationParameters(customSearchRegion, minMatch);
        await expect(SUT.find(imagePath, parameters)).resolves.toEqual(matchResult.location);
        const matchRequest = new MatchRequest(
            expect.any(Image),
            join(cwd(), imagePath),
            customSearchRegion,
            minMatch,
            true);
        expect(visionAdapterMock.findOnScreenRegion).toHaveBeenCalledWith(matchRequest);
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

});
