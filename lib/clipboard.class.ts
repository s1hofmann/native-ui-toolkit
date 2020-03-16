import { NativeAdapter } from "./adapter/native.adapter.class";

/**
 * {@link Clipboard} class gives access to a systems clipboard
 */
export class Clipboard {
  /**
   * {@link Clipboard} class constructor
   * @param nativeAdapter {@link NativeAdapter} instance used to access OS API
   */
  constructor(private nativeAdapter: NativeAdapter) {
  }

  /**
   * {@link copy} copies a given text to the system clipboard
   * @param text The text to copy
   */
  public copy(text: string): Promise<void> {
    return this.nativeAdapter.copy(text);
  }

  /**
   * {@link paste} pastes the current content of the system clipboard (limited to text)
   */
  public paste(): Promise<string> {
    return this.nativeAdapter.paste();
  }
}
