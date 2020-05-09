import * as path from "path";
import {Image} from "../../image.class";
import {MatchRequest} from "../../match-request.class";
import {Region} from "../../region.class";
import {ImageReader} from "./image-reader.class";
import {TemplateMatchingFinder} from "./template-matching-finder.class";

describe("Template-matching finder", () => {
    it("findMatch should return a match when present in image", async () => {
        // GIVEN
        const imageLoader = new ImageReader();
        const SUT = new TemplateMatchingFinder();
        const haystackPath = path.resolve(__dirname, "./__mocks__/mouse.png");
        const needlePath = path.resolve(__dirname, "./__mocks__/needle.png");
        const haystack = await imageLoader.load(haystackPath);
        const needle = await imageLoader.load(needlePath);
        const minConfidence = 0.99;
        const searchRegion = new Region(0, 0, haystack.width, haystack.height);
        const matchRequest = new MatchRequest(haystack, needlePath, searchRegion, minConfidence);
        const expectedResult = new Region(16, 31, needle.width, needle.height);

        // WHEN
        const result = await SUT.findMatch(matchRequest);

        // THEN
        expect(result.confidence).toBeGreaterThanOrEqual(minConfidence);
        expect(result.location).toEqual(expectedResult);
    });

    it("findMatch should return a match within a search region when present in image", async () => {
        // GIVEN
        const imageLoader = new ImageReader();
        const SUT = new TemplateMatchingFinder();
        const haystackPath = path.resolve(__dirname, "./__mocks__/mouse.png");
        const needlePath = path.resolve(__dirname, "./__mocks__/needle.png");
        const haystack = await imageLoader.load(haystackPath);
        const needle = await imageLoader.load(needlePath);
        const minConfidence = 0.99;
        const searchRegion = new Region(10, 20, 140, 100);
        const matchRequest = new MatchRequest(haystack, needlePath, searchRegion, minConfidence);
        const expectedResult = new Region(6, 11, needle.width, needle.height);

        // WHEN
        const result = await SUT.findMatch(matchRequest);

        // THEN
        expect(result.confidence).toBeGreaterThanOrEqual(minConfidence);
        expect(result.location).toEqual(expectedResult);
    });

    it("findMatch should return confidence and location of best match if no match with sufficient confidence is found", async () => {
        // GIVEN
        const imageLoader = new ImageReader();
        const SUT = new TemplateMatchingFinder();
        const haystackPath = path.resolve(__dirname, "./__mocks__/downloads.png");
        const needlePath = path.resolve(__dirname, "./__mocks__/coverage.png");
        const haystack = await imageLoader.load(haystackPath);
        const minConfidence = 0.99;
        const searchRegion = new Region(0, 0, 320, 72);
        const matchRequest = new MatchRequest(haystack, needlePath, searchRegion, minConfidence);
        const expectedRejection = new RegExp(`^No match with required confidence ${minConfidence}. Best match: \\d.\\d* at \\(\\d*, \\d*, \\d*, \\d*\\)$`)

        // WHEN

        // THEN
        await expect(SUT.findMatch(matchRequest))
            .rejects
            .toEqual(
                expect
                    .stringMatching(expectedRejection)
            );
    });

    it("findMatch should throw on invalid image paths", async () => {
        // GIVEN
        const imageLoader = new ImageReader();
        const SUT = new TemplateMatchingFinder();
        const pathToNeedle = path.resolve(__dirname, "./__mocks__/mouse.png");
        const pathToHaystack = "./__mocks__/foo.png";
        const needle = await imageLoader.load(pathToNeedle);
        const minConfidence = 0.99;
        const searchRegion = new Region(0, 0, 100, 100);
        const haystack = new Image(needle.width, needle.height, needle.data, 3);
        const matchRequest = new MatchRequest(haystack, pathToHaystack, searchRegion, minConfidence);

        // WHEN
        const result = SUT.findMatch(matchRequest);

        // THEN
        await expect(result)
            .rejects
            .toThrowError(`Failed to load ${pathToHaystack}. Reason: 'Failed to load image from '${pathToHaystack}''.`);
    });
});
