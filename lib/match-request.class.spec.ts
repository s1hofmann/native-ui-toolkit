import {ImageMatchRequest, TextMatchRequest} from "./match-request.class";
import {Image} from "./image.class";
import {Region} from "./region.class";

describe("MatchRequest", () => {
    describe("ImageMatchRequest", () => {
        it("should be of kind 'match-image'", () => {
            // GIVEN
            const SUT = new ImageMatchRequest(
                new Image(100, 100,
                    new ArrayBuffer(0), 3
                ),
                "foo",
                new Region(
                    0,
                    0,
                    100,
                    100),
                0.99);

            // WHEN

            // THEN
            expect(SUT.kind).toBe('match-image')
        });

        it("should default to multi-scale matching", () => {
            const SUT = new ImageMatchRequest(
                new Image(100, 100,
                    new ArrayBuffer(0), 3
                ),
                "foo",
                new Region(
                    0,
                    0,
                    100,
                    100),
                0.99);

            expect(SUT.searchMultipleScales).toBeTruthy();
        });
    });

    describe("TextMatchRequest", () => {
        it("should be of kind 'match-text'", () => {
            // GIVEN
            const SUT = new TextMatchRequest(
                new Image(100, 100,
                    new ArrayBuffer(0), 3
                ),
                "foo",
                new Region(
                    0,
                    0,
                    100,
                    100),
                0.99);

            // WHEN

            // THEN
            expect(SUT.kind).toBe('match-text')
        });
    });
});
