import robot = require("@nut-tree/libnut");
import { Key } from "../../key.enum";
import { KeyboardAction } from "./robotjs-keyboard-action.class";

jest.mock("@nut-tree/libnut");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("robotjs keyboard action", () => {
  describe("click", () => {
    it("should forward the keyTap call to robotjs for a known key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.click(Key.A);

      // THEN
      expect(robot.keyTap).toBeCalledTimes(1);
    });

    it("should reject on robotjs errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      robot.keyTap = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.click(Key.A)).rejects.toThrowError("Test error");
    });

    it("should not forward the keyTap call to robotjs for an unknown key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.click(Key.Add);

      // THEN
      expect(robot.keyTap).not.toBeCalled();
    });
  });

  describe("type", () => {
    it("should forward the type call to robotjs", () => {
      // GIVEN
      const SUT = new KeyboardAction();
      const payload = "testInput";

      // WHEN
      SUT.type(payload);

      // THEN
      expect(robot.typeString).toBeCalledTimes(1);
      expect(robot.typeString).toBeCalledWith(payload);
    });

    it("should reject on robotjs errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      robot.typeString = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.type("foo")).rejects.toThrowError("Test error");
    });
  });

  describe("pressKey", () => {
    it("should forward the pressKey call to robotjs for a known key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.pressKey(Key.A);

      // THEN
      expect(robot.keyToggle).toBeCalledTimes(1);
      expect(robot.keyToggle).toBeCalledWith(KeyboardAction.keyLookup(Key.A), "down", []);
    });

    it("should treat a list of keys as modifiers + the actual key to press", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.pressKey(Key.LeftControl, Key.A);

      // THEN
      expect(robot.keyToggle).toBeCalledTimes(1);
      expect(robot.keyToggle)
        .toBeCalledWith(KeyboardAction.keyLookup(Key.A), "down", [KeyboardAction.keyLookup(Key.LeftControl)]);
    });

    it("should not forward the pressKey call to robotjs for an unknown key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.pressKey(Key.Add);

      // THEN
      expect(robot.keyToggle).not.toBeCalled();
    });

    it("should reject on robotjs errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      robot.keyToggle = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.pressKey(Key.A)).rejects.toThrowError("Test error");
    });
  });

  describe("releaseKey", () => {
    it("should forward the releaseKey call to robotjs for a known key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.releaseKey(Key.A);

      // THEN
      expect(robot.keyToggle).toBeCalledTimes(1);
      expect(robot.keyToggle).toBeCalledWith(KeyboardAction.keyLookup(Key.A), "up", []);
    });

    it("should treat a list of keys as modifiers + the actual key to release", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.releaseKey(Key.LeftControl, Key.A);

      // THEN
      expect(robot.keyToggle).toBeCalledTimes(1);
      expect(robot.keyToggle)
        .toBeCalledWith(KeyboardAction.keyLookup(Key.A), "up", [KeyboardAction.keyLookup(Key.LeftControl)]);
    });

    it("should not forward the releaseKey call to robotjs for an unknown key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.releaseKey(Key.Add);

      // THEN
      expect(robot.keyToggle).not.toBeCalled();
    });

    it("should reject on robotjs errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      robot.keyToggle = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.releaseKey(Key.A)).rejects.toThrowError("Test error");
    });
  });
});
