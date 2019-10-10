import { mockPartial } from "sneer";
import { ImageMatchRequest } from "../../image-match-request.class";
import { Image } from "../../image.class";
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
    const needlePath = "/path/to/needle";
    const inputSearchRegion = new Region(0, 0, 100, 100);
    const expectedSearchRegion = new Region(0, 0, 150, 200);

    const matchRequest = new ImageMatchRequest(
      imageMock,
      needlePath,
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
      const needlePath = "/path/to/needle";
      const inputSearchRegion = new Region(0, 0, 100, 100);
      const expectedSearchRegion = new Region(0, 0, 100, 100);

      const matchRequest = new ImageMatchRequest(
        imageMock,
        needlePath,
        inputSearchRegion,
        0.99
      );

      // WHEN
      const result = determineScaledSearchRegion(matchRequest);

      // THEN
      expect(result).toEqual(expectedSearchRegion);
    });
});
