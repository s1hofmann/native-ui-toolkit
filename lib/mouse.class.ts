import { NativeAdapter } from "./adapter/native.adapter.class";
import { Button } from "./button.enum";
import { linear } from "./movementtype.function";
import { Point } from "./point.class";
import { busyWaitForNanoSeconds, sleep } from "./sleep.function";

/**
 * {@link Mouse} class provides methods to emulate mouse input
 */
export class Mouse {
  /**
   * Config object for {@link Mouse} class
   */
  public config = {
    /**
     * Configures the delay between single mouse events
     */
    autoDelayMs: 100,

    /**
     * Configures the speed in pixels/second for mouse movement
     */
    mouseSpeed: 1000,
  };

  /**
   * {@link Mouse} class constructor
   * @param native {@link NativeAdapter} instance which bundles access to mouse, keyboard and clipboard
   */
  constructor(private native: NativeAdapter) {
    this.native.setMouseDelay(0);
  }

  /**
   * {@link setPosition} instantly moves the mouse cursor to a given {@link Point}
   * @param target {@link Point} to move the cursor to
   */
  public async setPosition(target: Point): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await this.native.setMousePosition(target);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link getPosition} returns a {@link Point} representing the current mouse position
   */
  public getPosition(): Promise<Point> {
    return this.native.currentMousePosition();
  }

  /**
   * {@link move} moves the mouse cursor along a given path of {@link Point}s, according to a movement type
   * @param path Array of {@link Point}s to follow
   * @param movementType Defines the type of mouse movement. Would allow to configured acceleration etc. (Default: {@link linear}, no acceleration)
   */
  public async move(path: Point[] | Promise<Point[]>, movementType = linear): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        const pathSteps = await path;
        const timeSteps = movementType(pathSteps.length, this.config.mouseSpeed);
        for (let idx = 0; idx < pathSteps.length; ++idx) {
          const node = pathSteps[idx];
          const minTime = timeSteps[idx];
          await busyWaitForNanoSeconds(minTime);
          await this.native.setMousePosition(node);
        }
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link leftClick} performs a click with the left mouse button
   */
  public async leftClick(): Promise<Mouse> {
    return new Promise<Mouse>(async resolve => {
      await sleep(this.config.autoDelayMs);
      await this.native.leftClick();
      resolve(this);
    });
  }

  /**
   * {@link rightClick} performs a click with the right mouse button
   */
  public async rightClick(): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await sleep(this.config.autoDelayMs);
        await this.native.rightClick();
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link scrollDown} scrolls down for a given amount of "steps"
   * Please note that the actual scroll distance of a single "step" is OS dependent
   * @param amount The amount of "steps" to scroll
   */
  public async scrollDown(amount: number): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await sleep(this.config.autoDelayMs);
        await this.native.scrollDown(amount);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link scrollUp} scrolls up for a given amount of "steps"
   * Please note that the actual scroll distance of a single "step" is OS dependent
   * @param amount The amount of "steps" to scroll
   */
  public async scrollUp(amount: number): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await sleep(this.config.autoDelayMs);
        await this.native.scrollUp(amount);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link scrollLeft} scrolls left for a given amount of "steps"
   * Please note that the actual scroll distance of a single "step" is OS dependent
   * @param amount The amount of "steps" to scroll
   */
  public async scrollLeft(amount: number): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await sleep(this.config.autoDelayMs);
        await this.native.scrollLeft(amount);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link scrollRight} scrolls right for a given amount of "steps"
   * Please note that the actual scroll distance of a single "step" is OS dependent
   * @param amount The amount of "steps" to scroll
   */
  public async scrollRight(amount: number): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await sleep(this.config.autoDelayMs);
        await this.native.scrollRight(amount);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link drag} drags the mouse along a certain path
   * In summary, {@link drag} presses and holds the left mouse button, moves the mouse and releases the left button
   * @param path The path of {@link Point}s to drag along
   */
  public async drag(path: Point[] | Promise<Point[]>): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await sleep(this.config.autoDelayMs);
        await this.native.pressButton(Button.LEFT);
        await this.move(path);
        await this.native.releaseButton(Button.LEFT);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link pressButton} presses and holds a mouse button
   * @param btn The {@link Button} to press and hold
   */
  public async pressButton(btn: Button): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await this.native.pressButton(btn);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link releaseButton} releases a mouse button previously pressed via {@link pressButton}
   * @param btn The {@link Button} to release
   */
  public async releaseButton(btn: Button): Promise<Mouse> {
    return new Promise<Mouse>(async (resolve, reject) => {
      try {
        await this.native.releaseButton(btn);
        resolve(this);
      } catch (e) {
        reject(e);
      }
    });
  }
}
