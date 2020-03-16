/**
 * A ClipboardActionProvider should allow access to the system clipboard
 */
export interface ClipboardActionProvider {
  /**
   * hasText should return whether the system clipboard currently holds text or not
   *
   * @returns True if there's text on the clipboard, false otherwise
   */
  hasText(): Promise<boolean>;

  /**
   * clear should allow to clear the system clipboard
   *
   * @returns True when successfully cleared, false otherwise
   */
  clear(): Promise<boolean>;

  /**
   * copy should allow to copy text to the systems clipboard
   *
   * @param text The text to copy to the clipboard
   */
  copy(text: string): Promise<void>;

  /**
   * paste should allow to paste the current text on the systems clipboard
   *
   * @returns The current clipboard text
   */
  paste(): Promise<string>;
}
