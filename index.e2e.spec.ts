import {
  assert,
  Button,
  centerOf,
  down,
  Key,
  keyboard,
  mouse,
  Region,
  right,
  screen,
  sleep,
  straightTo,
} from "./index";

const openXfceMenu = async () => {
  await mouse.move(straightTo(centerOf(screen.find("menu.png"))));
  await mouse.leftClick();
  await mouse.leftClick();
};

const run = async (cmd: string) => {
  await keyboard.type(Key.LeftAlt, Key.F2);
  await keyboard.type(cmd);
  await keyboard.type(Key.Enter);
};

const calculate = async () => {
  await mouse.move(straightTo(centerOf(screen.find("plus.png"))));
  await mouse.leftClick();
  await mouse.move(straightTo(centerOf(screen.find("one.png"))));
  await mouse.leftClick();
  await mouse.move(straightTo(centerOf(screen.find("zero.png"))));
  await mouse.leftClick();
  await mouse.leftClick();
  await keyboard.type(Key.Enter);
};

const close = async () => {
  await mouse.move(straightTo(centerOf(screen.find("close.png"))));
  await mouse.leftClick();
};

describe("E2E screen test", () => {
  it("should throw on invalid images", async () => {
    jest.setTimeout(30000);
    await expect(screen.find("mouse.png")).rejects.toHaveProperty("message", "Failed to load image from '/home/runner/work/nut.js/nut.js/mouse.png'");
  });
});

describe("E2E demo", () => {
  it("should run without throwing", async () => {
    jest.setTimeout(30000);
    screen.config.resourceDirectory = "./e2e/assets";
    await assert.isVisible("mouse.png");
    await assert.isVisible("desktop.png");
    await openXfceMenu();
    await run("gnome-calculator");
    await sleep(1500);
    await assert.isVisible("calculator.png");
    await keyboard.type("525");
    await calculate();
    await assert.isVisible("result.png");
    await close();
  });
});

describe("E2E drag & drop demo", () => {
  it("should run without throwing", async () => {
    jest.setTimeout(60000);
    screen.config.resourceDirectory = "./e2e/assets";

    const expected = new Region(38, 585, 70, 86);
    const maxDiff = 1;

    await assert.isVisible("trash.png");
    await mouse.move(straightTo(centerOf(screen.find("trash.png"))));
    await mouse.drag(down(500));
    await mouse.move(right(100));
    await mouse.leftClick();
    const dest = await screen.waitFor("moved_trash.png");
    expect(Math.abs(dest.left - expected.left)).toBeLessThanOrEqual(maxDiff);
    expect(Math.abs(dest.top - expected.top)).toBeLessThanOrEqual(maxDiff);
    expect(Math.abs(dest.width - expected.width)).toBeLessThanOrEqual(maxDiff);
    expect(Math.abs(dest.height - expected.height)).toBeLessThanOrEqual(maxDiff);
  });
});

describe("E2E mouse button demo", () => {
  it("should click all mouse buttons without throwing", async () => {
    jest.setTimeout(60000);
    screen.config.resourceDirectory = "./e2e/assets";
    for (const btn of [Button.RIGHT, Button.MIDDLE, Button.LEFT]) {
      await mouse.pressButton(btn);
      await sleep(10);
      await mouse.releaseButton(btn);
    }
  });
});
