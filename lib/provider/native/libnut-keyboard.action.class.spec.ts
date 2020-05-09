import libnut = require("@nut-tree/libnut");
import { Key } from "../../key.enum";
import { KeyboardAction } from "./libnut-keyboard-action.class";

jest.mock("@nut-tree/libnut");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("libnut keyboard action", () => {
  describe("click", () => {
    it("should forward the keyTap call to libnut for a known key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.click(Key.A);

      // THEN
      expect(libnut.keyTap).toBeCalledTimes(1);
    });

    it("should reject on libnut errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      libnut.keyTap = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.click(Key.A)).rejects.toThrowError("Test error");
    });

    it("should not forward the keyTap call to libnut for an unknown key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.click(Key.Add);

      // THEN
      expect(libnut.keyTap).not.toBeCalled();
    });
  });

  describe("type", () => {
    it("should forward the type call to libnut", () => {
      // GIVEN
      const SUT = new KeyboardAction();
      const payload = "testInput";

      // WHEN
      SUT.type(payload);

      // THEN
      expect(libnut.typeString).toBeCalledTimes(1);
      expect(libnut.typeString).toBeCalledWith(payload);
    });

    it("should reject on libnut errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      libnut.typeString = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.type("foo")).rejects.toThrowError("Test error");
    });
  });

  describe("pressKey", () => {
    it("should forward the pressKey call to libnut for a known key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.pressKey(Key.A);

      // THEN
      expect(libnut.keyToggle).toBeCalledTimes(1);
      expect(libnut.keyToggle).toBeCalledWith(KeyboardAction.keyLookup(Key.A), "down", []);
    });

    it("should treat a list of keys as modifiers + the actual key to press", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.pressKey(Key.LeftControl, Key.A);

      // THEN
      expect(libnut.keyToggle).toBeCalledTimes(1);
      expect(libnut.keyToggle)
        .toBeCalledWith(KeyboardAction.keyLookup(Key.A), "down", [KeyboardAction.keyLookup(Key.LeftControl)]);
    });

    it("should not forward the pressKey call to libnut for an unknown key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.pressKey(Key.Add);

      // THEN
      expect(libnut.keyToggle).not.toBeCalled();
    });

    it("should reject on libnut errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      libnut.keyToggle = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.pressKey(Key.A)).rejects.toThrowError("Test error");
    });
  });

  describe("releaseKey", () => {
    it("should forward the releaseKey call to libnut for a known key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.releaseKey(Key.A);

      // THEN
      expect(libnut.keyToggle).toBeCalledTimes(1);
      expect(libnut.keyToggle).toBeCalledWith(KeyboardAction.keyLookup(Key.A), "up", []);
    });

    it("should treat a list of keys as modifiers + the actual key to release", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.releaseKey(Key.LeftControl, Key.A);

      // THEN
      expect(libnut.keyToggle).toBeCalledTimes(1);
      expect(libnut.keyToggle)
        .toBeCalledWith(KeyboardAction.keyLookup(Key.A), "up", [KeyboardAction.keyLookup(Key.LeftControl)]);
    });

    it("should not forward the releaseKey call to libnut for an unknown key", () => {
      // GIVEN
      const SUT = new KeyboardAction();

      // WHEN
      SUT.releaseKey(Key.Add);

      // THEN
      expect(libnut.keyToggle).not.toBeCalled();
    });

    it("should reject on libnut errors", async () => {
      // GIVEN
      const SUT = new KeyboardAction();
      libnut.keyToggle = jest.fn(() => {
        throw new Error("Test error");
      });

      // WHEN

      // THEN
      expect(SUT.releaseKey(Key.A)).rejects.toThrowError("Test error");
    });
  });
});
