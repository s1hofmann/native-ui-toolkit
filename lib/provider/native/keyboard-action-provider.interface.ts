import { Key } from "../../key.enum";

/**
 * A KeyboardActionProvider should provide access to a systems keyboard
 */
export interface KeyboardActionProvider {
  /**
   * setKeyboardDelay should allow to configure a delay between key presses
   *
   * @param delay The delay between key presses in milliseconds
   */
  setKeyboardDelay(delay: number): void;

  /**
   * type should allow to type a given text via OS level keyboard events
   *
   * @param input The text to type
   */
  type(input: string): Promise<void>;

  /**
   * Click should allow to press a single key via OS level keyboard event
   *
   * @param keys Array of {@link Key}s to click
   */
  click(...keys: Key[]): Promise<void>;

  /**
   * pressKey should allow to press and hold a key via OS level keyboard event
   *
   * @param keys Array of {@link Key}s to press and hold
   */
  pressKey(...keys: Key[]): Promise<void>;

  /**
   * releaseKey should release a pressed key via OS level keyboard event
   *
   * @param keys Array of {@link Key}s to release
   */
  releaseKey(...keys: Key[]): Promise<void>;
}
