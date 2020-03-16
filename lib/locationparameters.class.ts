import { Region } from "./region.class";

/**
 * {@link LocationParameters} serves as a data class holding location parameters for image search
 */
export class LocationParameters {
  /**
   * {@link LocationParameters} class constructor
   * @param searchRegion Optional {@link Region} to limit the search space to
   * @param confidence Optional confidence value to configure image match confidence
   */
  constructor(public searchRegion?: Region, public confidence?: number) {}
}
