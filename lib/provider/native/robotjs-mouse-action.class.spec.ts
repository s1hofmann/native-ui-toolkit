import robot = require("@nut-tree/libnut");
import { Button } from "../../button.enum";
import { Point } from "../../point.class";
import { MouseAction } from "./robotjs-mouse-action.class";

jest.mock("@nut-tree/libnut");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("robotjs mouse action", () => {
  describe("leftClick", () => {
    it("should forward leftClick call to robotjs", () => {
      // GIVEN
      const SUT = new MouseAction();

      // WHEN
      SUT.leftClick();

      // THEN
      expect(robot.mouseClick).toBeCalledTimes(1);
      expect(robot.mouseClick).toBeCalledWith("left");
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.mouseClick = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.leftClick()).rejects.toThrowError(error);
    });
  });

  describe("middleClick", () => {
    it("should forward middleClick call to robotjs", () => {
      // GIVEN
      const SUT = new MouseAction();

      // WHEN
      SUT.middleClick();

      // THEN
      expect(robot.mouseClick).toBeCalledTimes(1);
      expect(robot.mouseClick).toBeCalledWith("middle");
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.mouseClick = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.middleClick()).rejects.toThrowError(error);
    });
  });

  describe("rightClick", () => {
    it("should forward rightClick call to robotjs", () => {
      // GIVEN
      const SUT = new MouseAction();

      // WHEN
      SUT.rightClick();

      // THEN
      expect(robot.mouseClick).toBeCalledTimes(1);
      expect(robot.mouseClick).toBeCalledWith("right");
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.mouseClick = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.rightClick()).rejects.toThrowError(error);
    });
  });

  describe("pressButton", () => {
    it("should forward pressButton call to robotjs with state 'down'", () => {
      // GIVEN
      const SUT = new MouseAction();

      // WHEN
      SUT.pressButton(Button.LEFT);

      // THEN
      expect(robot.mouseToggle).toBeCalledTimes(1);
      expect(robot.mouseToggle).toBeCalledWith("down", expect.any(String));
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.mouseToggle = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.pressButton(Button.LEFT)).rejects.toThrowError(error);
    });
  });

  describe("releaseButton", () => {
    it("should forward pressButton call to robotjs with state 'up'", () => {
      // GIVEN
      const SUT = new MouseAction();

      // WHEN
      SUT.releaseButton(Button.LEFT);

      // THEN
      expect(robot.mouseToggle).toBeCalledTimes(1);
      expect(robot.mouseToggle).toBeCalledWith("up", expect.any(String));
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.mouseToggle = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.releaseButton(Button.LEFT)).rejects.toThrowError(error);
    });
  });

  describe("scrollUp", () => {
    it("should forward scrollUp call to robotjs with positive y value", () => {
      // GIVEN
      const SUT = new MouseAction();
      const scrollAmount = 5;

      // WHEN
      SUT.scrollUp(scrollAmount);

      // THEN
      expect(robot.scrollMouse).toBeCalledTimes(1);
      expect(robot.scrollMouse).toBeCalledWith(0, scrollAmount);
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.scrollMouse = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.scrollUp(100)).rejects.toThrowError(error);
    });
  });

  describe("scrollDown", () => {
    it("should forward scrollDown call to robotjs with negative y value", () => {
      // GIVEN
      const SUT = new MouseAction();
      const scrollAmount = 5;

      // WHEN
      SUT.scrollDown(scrollAmount);

      // THEN
      expect(robot.scrollMouse).toBeCalledTimes(1);
      expect(robot.scrollMouse).toBeCalledWith(0, -scrollAmount);
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.scrollMouse = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.scrollDown(100)).rejects.toThrowError(error);
    });
  });

  describe("scrollLeft", () => {
    it("should forward scrollLeft call to robotjs with negative x value", () => {
      // GIVEN
      const SUT = new MouseAction();
      const scrollAmount = 5;

      // WHEN
      SUT.scrollLeft(scrollAmount);

      // THEN
      expect(robot.scrollMouse).toBeCalledTimes(1);
      expect(robot.scrollMouse).toBeCalledWith(-scrollAmount, 0);
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.scrollMouse = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.scrollLeft(100)).rejects.toThrowError(error);
    });
  });

  describe("scrollRight", () => {
    it("should forward scrollRight call to robotjs with negative x value", () => {
      // GIVEN
      const SUT = new MouseAction();
      const scrollAmount = 5;

      // WHEN
      SUT.scrollRight(scrollAmount);

      // THEN
      expect(robot.scrollMouse).toBeCalledTimes(1);
      expect(robot.scrollMouse).toBeCalledWith(scrollAmount, 0);
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.scrollMouse = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.scrollRight(100)).rejects.toThrowError(error);
    });
  });

  describe("currentMousePosition", () => {
    it("should return the current mouse position via robotjs", async () => {
      // GIVEN
      robot.getMousePos = jest.fn(() => ({x: 10, y: 100}));
      const SUT = new MouseAction();

      // WHEN
      const currentPosition = await SUT.currentMousePosition();

      // THEN
      expect(currentPosition.x).toEqual(10);
      expect(currentPosition.y).toEqual(100);
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.getMousePos = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.currentMousePosition()).rejects.toThrowError(error);
    });
  });

  describe("setMousePosition", () => {
    it("should set the current mouse position via robotjs", () => {
      // GIVEN
      const SUT = new MouseAction();

      // WHEN
      SUT.setMousePosition(new Point(10, 100));

      // THEN
      expect(robot.moveMouse).toBeCalledTimes(1);
      expect(robot.moveMouse).toBeCalledWith(10, 100);
    });

    it("should reject on robotjs errors", () => {
      // GIVEN
      const SUT = new MouseAction();
      const error = "Test error";
      robot.moveMouse = jest.fn(() => {
        throw new Error(error);
      });

      // WHEN

      // THEN
      expect(SUT.setMousePosition(new Point(100, 100))).rejects.toThrowError(error);
    });
  });
});
