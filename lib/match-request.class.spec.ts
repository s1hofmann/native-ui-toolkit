import { Image } from "./image.class";
import { MatchRequest } from "./match-request.class";
import { Region } from "./region.class";

describe("MatchRequest", () => {
  it("should default to multi-scale matching", () => {
    const SUT = new MatchRequest(
      new Image(100, 100,
        new ArrayBuffer(0), 3
      ),
      "foo",
      Buffer.from([]),
      new Region(
        0,
        0,
        100,
        100),
      0.99);

    expect(SUT.searchMultipleScales).toBeTruthy();
  });
});
