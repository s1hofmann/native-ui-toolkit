import { ImageMatchRequest } from "./image-match-request.class";
import { Image } from "./image.class";
import { Region } from "./region.class";

describe("MatchRequest", () => {
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
