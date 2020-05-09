import { Image } from "../../image.class";
import { Region } from "../../region.class";

/**
 * A ScreenActionProvider should provide access to a system's main screen
 *
 * @interface ScreenActionProvider
 */
export interface ScreenActionProvider {
  /**
   * grabScreen should return an {@link Image} object containing a screenshot data of a systems
   * main screen as well as its dimensions
   *
   * @returns The {@link Image} object holding screenshot data
   */
  grabScreen(): Promise<Image>;

  /**
   * Returns the same result as grabScreen, but limited to a specified region
   *
   * @param region The {@link Region} to take the screenshot of
   * @returns The {@link Image} object holding screenshot data
   */
  grabScreenRegion(region: Region): Promise<Image>;

  /**
   * Highlights a screen {@link Region} for a given duration by overlaying it with an opaque window
   *
   * @param region The {@link Region} to highlight
   * @param duration The highlight duration
   * @param opacity Overlay opacity
   */
  highlightScreenRegion(region: Region, duration: number, opacity: number): Promise<void>;

  /**
   * screenWidth returns a systems main screen width
   *
   * @returns The screen width
   */
  screenWidth(): Promise<number>;

  /**
   * screenHeight returns a systems main screen height
   *
   * @returns The screen height
   */
  screenHeight(): Promise<number>;

  /**
   * screenSize returns a {@link Region} object the size of a systems main screen
   *
   * @returns The {@link Region} object representing the screen dimensions
   */
  screenSize(): Promise<Region>;
}
