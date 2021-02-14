import { mockPartial } from "sneer";
import { Image } from "../../image.class";
import { MatchRequest } from "../../match-request.class";
import { Region } from "../../region.class";
import { determineScaledSearchRegion } from "./determine-searchregion.function";

describe("determineSearchRegion", () => {
  it("should return a search region adopted to pixel density", () => {
    // GIVEN
    const imageMock = mockPartial<Image>({
      pixelDensity: {
        scaleX: 1.5,
        scaleY: 2.0
      }
    });
    const needleId = "/path/to/needle";
    const needleData = Buffer.from([]);
    const inputSearchRegion = new Region(0, 0, 100, 100);
    const expectedSearchRegion = new Region(0, 0, 150, 200);

    const matchRequest = new MatchRequest(
      imageMock,
      needleId,
      needleData,
      inputSearchRegion,
      0.99
    );

    // WHEN
    const result = determineScaledSearchRegion(matchRequest);

    // THEN
    expect(result).toEqual(expectedSearchRegion);
  });

  it.each([[0, 1], [1, 0]])("should not adjust searchregion for factor 0: scaleX: %i scaleY: %i",
    (scaleX: number, scaleY: number) => {
      // GIVEN
      const imageMock = mockPartial<Image>({
        pixelDensity: {
          scaleX,
          scaleY
        }
      });
      const needleId = "/path/to/needle";
      const needleData = Buffer.from([]);
      const inputSearchRegion = new Region(0, 0, 100, 100);
      const expectedSearchRegion = new Region(0, 0, 100, 100);

      const matchRequest = new MatchRequest(
        imageMock,
        needleId,
        needleData,
        inputSearchRegion,
        0.99
      );

      // WHEN
      const result = determineScaledSearchRegion(matchRequest);

      // THEN
      expect(result).toEqual(expectedSearchRegion);
    });
});
