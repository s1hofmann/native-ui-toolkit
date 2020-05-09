import { Button } from "../button.enum";
import { Key } from "../key.enum";
import { Point } from "../point.class";
import { ClipboardActionProvider } from "../provider/native/clipboard-action-provider.interface";
import { ClipboardAction } from "../provider/native/clipboardy-clipboard-action.class";
import { KeyboardActionProvider } from "../provider/native/keyboard-action-provider.interface";
import { MouseActionProvider } from "../provider/native/mouse-action-provider.interface";
import { KeyboardAction } from "../provider/native/libnut-keyboard-action.class";
import { MouseAction } from "../provider/native/libnut-mouse-action.class";

/**
 * {@link NativeAdapter} serves as an abstraction layer for all OS level interactions.
 *
 * This allows to provide a high level interface for native actions,
 * without having to spread (possibly) multiple dependencies all over the code.
 * All actions which involve the OS are bundled in this adapter.
 */
export class NativeAdapter {
  /**
   * {@link NativeAdapter} class constructor
   * @param clipboard {@link ClipboardActionProvider} instance used to interact with a systems clipboard (Default: {@link ClipboardAction})
   * @param keyboard {@link KeyboardActionProvider} instance used to interact with a systems keybaord (Default: {@link KeyboardAction})
   * @param mouse {@link MouseActionProvider} instance used to interact with a systems mouse (Default: {@link MouseAction})
   */
  constructor(
    private clipboard: ClipboardActionProvider = new ClipboardAction(),
    private keyboard: KeyboardActionProvider = new KeyboardAction(),
    private mouse: MouseActionProvider = new MouseAction(),
  ) {}

  /**
   * {@link setMouseDelay} configures mouse speed for movement
   *
   * @param delay Mouse delay in milliseconds
   */
  public setMouseDelay(delay: number): void {
    this.mouse.setMouseDelay(delay);
  }

  /**
   * {@link setKeyboardDelay} configures keyboard delay between key presses
   *
   * @param delay The keyboard delay in milliseconds
   */
  public setKeyboardDelay(delay: number): void {
    this.keyboard.setKeyboardDelay(delay);
  }

  /**
   * {@link setMousePosition} changes the current mouse cursor position to a given {@link Point}
   *
   * @param p The new cursor position at {@link Point} p
   */
  public setMousePosition(p: Point): Promise<void> {
    return this.mouse.setMousePosition(p);
  }

  /**
   * {@link currentMousePosition} returns the current mouse position
   *
   * @returns Current cursor position at a certain {@link Point}
   */
  public currentMousePosition(): Promise<Point> {
    return this.mouse.currentMousePosition();
  }

  /**
   * {@link leftClick} triggers a native left-click event via OS API
   */
  public leftClick(): Promise<void> {
    return this.mouse.leftClick();
  }

  /**
   * {@link rightClick} triggers a native right-click event via OS API
   */
  public rightClick(): Promise<void> {
    return this.mouse.rightClick();
  }

  /**
   * {@link middleClick} triggers a native middle-click event via OS API
   */
  public middleClick(): Promise<void> {
    return this.mouse.middleClick();
  }

  /**
   * {@link pressButton} presses and holds a mouse {@link Button}
   *
   * @param btn The mouse {@link Button} to press
   */
  public pressButton(btn: Button): Promise<void> {
    return this.mouse.pressButton(btn);
  }

  /**
   * {@link releaseButton} releases a mouse {@link Button} previously clicked via {@link pressButton}
   *
   * @param btn The mouse {@link Button} to release
   */
  public releaseButton(btn: Button): Promise<void> {
    return this.mouse.releaseButton(btn);
  }

  /**
   * {@link type} types a given string via native keyboard events
   *
   * @param input The text to type
   */
  public type(input: string): Promise<void> {
    return this.keyboard.type(input);
  }

  /**
   * {@link click} clicks a {@link Key} via native keyboard event
   *
   * @param keys Array of {@link Key}s to click
   */
  public click(...keys: Key[]): Promise<void> {
    return this.keyboard.click(...keys);
  }

  /**
   * {@link pressKey} presses and holds a given {@link Key}
   *
   * @param keys Array of {@link Key}s to press and hold
   */
  public pressKey(...keys: Key[]): Promise<void> {
    return this.keyboard.pressKey(...keys);
  }

  /**
   * {@link releaseKey} releases a {@link Key} previously presses via {@link pressKey}
   *
   * @param keys Array of {@link Key}s to release
   */
  public releaseKey(...keys: Key[]): Promise<void> {
    return this.keyboard.releaseKey(...keys);
  }

  /**
   * {@link scrollUp} triggers an upwards mouse wheel scroll
   *
   * @param amount The amount of 'ticks' to scroll
   */
  public scrollUp(amount: number): Promise<void> {
    return this.mouse.scrollUp(amount);
  }

  /**
   * {@link scrollDown} triggers a downward mouse wheel scroll
   *
   * @param amount The amount of 'ticks' to scroll
   */
  public scrollDown(amount: number): Promise<void> {
    return this.mouse.scrollDown(amount);
  }

  /**
   * {@link scrollLeft} triggers a left mouse scroll
   *
   * @param amount The amount of 'ticks' to scroll
   */
  public scrollLeft(amount: number): Promise<void> {
    return this.mouse.scrollLeft(amount);
  }

  /**
   * {@link scrollRight} triggers a right mouse scroll
   *
   * @param amount The amount of 'ticks' to scroll
   */
  public scrollRight(amount: number): Promise<void> {
    return this.mouse.scrollRight(amount);
  }

  /**
   * {@link copy} copies a given text to the system clipboard
   *
   * @param text The text to copy
   */
  public copy(text: string): Promise<void> {
    return this.clipboard.copy(text);
  }

  /**
   * {@link paste} pastes the current text on the system clipboard
   *
   * @returns The clipboard text
   */
  public paste(): Promise<string> {
    return this.clipboard.paste();
  }
}
