import { mouse } from "../../../index";
import { Point } from "../../point.class";
import { toBeAt } from "./toBeAt.function";

const targetPoint = new Point(100, 100);

describe(".toBeAt", () => {
  beforeEach(() => {
    mouse.setPosition(targetPoint);
  });

  it("should succeed when cursor is at right position.", async () => {
    const result = await toBeAt(mouse, targetPoint);
    expect(result.pass).toBeTruthy();
  });

  it("should fail when cursor is at wrong position.", async () => {
    const result = await toBeAt(mouse, new Point(10, 10));
    expect(result.pass).toBeFalsy();
  });
});
