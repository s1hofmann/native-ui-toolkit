import { mouse } from "../../../index";
import { Point } from "../../point.class";
import { Region } from "../../region.class";
import { toBeIn } from "./toBeIn.function";

const targetPoint = new Point(400, 400);

describe(".toBeIn", () => {
  beforeEach(() => {
    mouse.setPosition(targetPoint);
  });

  it("should succeed when cursor is within correct region.", async () => {
    const targetRegion = new Region(350, 350, 100, 100);
    const result = await toBeIn(mouse, targetRegion);
    expect(result.pass).toBeTruthy();
  });

  it("should fail when cursor is outside of search region.", async () => {
    const targetRegion = new Region(0, 0, 100, 100);
    mouse.setPosition(targetPoint);
    const result = await toBeIn(mouse, targetRegion);
    expect(result.pass).toBeFalsy();
  });
});
