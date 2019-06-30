import { Button } from "../button.enum";
import { Key } from "../key.enum";
import { Point } from "../point.class";
import { ClipboardAction } from "../provider/native/clipboardy-clipboard-action.class";
import { KeyboardAction } from "../provider/native/robotjs-keyboard-action.class";
import { MouseAction } from "../provider/native/robotjs-mouse-action.class";
import { NativeAdapter } from "./native.adapter.class";

jest.mock("../provider/native/clipboardy-clipboard-action.class");
jest.mock("../provider/native/robotjs-mouse-action.class");
jest.mock("../provider/native/robotjs-keyboard-action.class");

describe("NativeAdapter class", () => {

  let clipboardMock = new ClipboardAction();
  let keyboardMock = new KeyboardAction();
  let mouseMock = new MouseAction();
  let SUT: NativeAdapter;

  beforeEach(() => {
    clipboardMock = new ClipboardAction();
    keyboardMock = new KeyboardAction();
    mouseMock = new MouseAction();
    SUT = new NativeAdapter({
      clipboard: clipboardMock,
      keyboard: keyboardMock,
      mouse: mouseMock
    });
  });
  it("should delegate calls to setMouseDelay", async () => {
    // GIVEN
    const delay = 5;

    // WHEN
    await SUT.setMouseDelay(delay);

    // THEN
    expect(mouseMock.setMouseDelay).toBeCalledTimes(1);
    expect(mouseMock.setMouseDelay).toBeCalledWith(delay);
  });

  it("should delegate calls to setMousePosition", async () => {
    // GIVEN
    const newPosition = new Point(10, 10);

    // WHEN
    await SUT.setMousePosition(newPosition);

    // THEN
    expect(mouseMock.setMousePosition).toBeCalledTimes(1);
    expect(mouseMock.setMousePosition).toBeCalledWith(newPosition);
  });

  it("should delegate calls to currentMousePosition", async () => {
    // GIVEN

    // WHEN
    await SUT.currentMousePosition();

    // THEN
    expect(mouseMock.currentMousePosition).toBeCalledTimes(1);
  });

  it("should delegate calls to leftClick", async () => {
    // GIVEN

    // WHEN
    await SUT.leftClick();

    // THEN
    expect(mouseMock.leftClick).toBeCalledTimes(1);
  });

  it("should delegate calls to rightClick", async () => {
    // GIVEN

    // WHEN
    await SUT.rightClick();

    // THEN
    expect(mouseMock.rightClick).toBeCalledTimes(1);
  });

  it("should delegate calls to middleClick", async () => {
    // GIVEN

    // WHEN
    await SUT.middleClick();

    // THEN
    expect(mouseMock.middleClick).toBeCalledTimes(1);
  });

  it("should delegate calls to pressButton", async () => {
    // GIVEN
    const buttonToPress = Button.LEFT;

    // WHEN
    await SUT.pressButton(buttonToPress);

    // THEN
    expect(mouseMock.pressButton).toBeCalledTimes(1);
    expect(mouseMock.pressButton).toBeCalledWith(buttonToPress);
  });

  it("should delegate calls to releaseButton", async () => {
    // GIVEN
    const buttonToRelease = Button.LEFT;

    // WHEN
    await SUT.releaseButton(buttonToRelease);

    // THEN
    expect(mouseMock.releaseButton).toBeCalledTimes(1);
    expect(mouseMock.releaseButton).toBeCalledWith(buttonToRelease);
  });

  it("should delegate calls to pressKey", async () => {
    // GIVEN
    const keyToPress = Key.A;

    // WHEN
    await SUT.pressKey(keyToPress);

    // THEN
    expect(keyboardMock.pressKey).toBeCalledTimes(1);
    expect(keyboardMock.pressKey).toBeCalledWith(keyToPress);
  });

  it("should delegate calls to releaseButton", async () => {
    // GIVEN
    const keyToRelease = Key.A;

    // WHEN
    await SUT.releaseKey(keyToRelease);

    // THEN
    expect(keyboardMock.releaseKey).toBeCalledTimes(1);
    expect(keyboardMock.releaseKey).toBeCalledWith(keyToRelease);
  });

  it("should delegate calls to click", async () => {
    // GIVEN
    const keyToClick = Key.A;

    // WHEN
    await SUT.click(keyToClick);

    // THEN
    expect(keyboardMock.click).toBeCalledTimes(1);
    expect(keyboardMock.click).toBeCalledWith(keyToClick);
  });

  it("should delegate calls to type", async () => {
    // GIVEN
    const stringToType = "testString";

    // WHEN
    await SUT.type(stringToType);

    // THEN
    expect(keyboardMock.type).toBeCalledTimes(1);
    expect(keyboardMock.type).toBeCalledWith(stringToType);
  });

  it("should delegate calls to copy", async () => {
    // GIVEN
    const stringToCopy = "testString";

    // WHEN
    await SUT.copy(stringToCopy);

    // THEN
    expect(clipboardMock.copy).toBeCalledTimes(1);
    expect(clipboardMock.copy).toBeCalledWith(stringToCopy);
  });

  it("should delegate calls to paste", async () => {
    // GIVEN

    // WHEN
    await SUT.paste();

    // THEN
    expect(clipboardMock.paste).toBeCalledTimes(1);
  });
});
