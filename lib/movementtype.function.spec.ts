import { linear } from "./movementtype.function";

describe("MovementType", () => {
  it("should return a set of linear timesteps, 1000000 nanosecond per step.", () => {
    const expected = [1000000, 1000000, 1000000, 1000000, 1000000, 1000000];
    expect(linear(6, 1000)).toEqual(expected);
  });

  it("should should return a set of linear timesteps, 2000000 nanoseconds per step.", () => {
    const expected = [2000000, 2000000, 2000000, 2000000, 2000000, 2000000];
    expect(linear(6, 500)).toEqual(expected);
  });
});
