import { Button } from "../../button.enum";
import { Point } from "../../point.class";

/**
 * A MouseActionProvider should provide access to a systems mouse input
 */
export interface MouseActionProvider {
  /**
   * setMouseDelay should allow to configure mouse movement speed
   *
   * @param delay The delay in milliseconds
   */
  setMouseDelay(delay: number): void;

  /**
   * setMousePosition should allow to set the mouse cursor position
   *
   * @param p The {@link Point} to which the mouse pointer should be set
   */
  setMousePosition(p: Point): Promise<void>;

  /**
   * currentMousePosition should return the current mouse pointer position
   *
   * @returns The current mouse pointer position
   */
  currentMousePosition(): Promise<Point>;

  /**
   * leftClick should allow to perform a left click via OS event
   */
  leftClick(): Promise<void>;

  /**
   * rightClick should allow to perform a right click via OS event
   */
  rightClick(): Promise<void>;

  /**
   * middleClick should allow to perform a middle click via OS event
   */
  middleClick(): Promise<void>;

  /**
   * scrollUp should allow to perform an upward mouse scroll
   *
   * @param amount The scroll amount
   */
  scrollUp(amount: number): Promise<void>;

  /**
   * scrollDown should allow to perform an downward mouse scroll
   *
   * @param amount The scroll amount
   */
  scrollDown(amount: number): Promise<void>;

  /**
   * scrollLeft should allow to perform a left mouse scroll
   *
   * @param amount The scroll amount
   */
  scrollLeft(amount: number): Promise<void>;

  /**
   * scrollRight should perform a right mouse scroll
   *
   * @param amount The scroll amount
   */
  scrollRight(amount: number): Promise<void>;

  /**
   * pressButton should allow to press and hold a mouse button
   *
   * @param btn The {@link Button} to press and hold
   */
  pressButton(btn: Button): Promise<void>;

  /**
   * releaseButton should allow to release a pressed button
   *
   * @param btn The {@link Button} to release
   */
  releaseButton(btn: Button): Promise<void>;
}
