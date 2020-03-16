import { Point } from "./point.class";

/**
 * {@link MovementApi} provides helper functions to generate movement paths relative tot he current mouse position
 */
export interface MovementApi {
  /**
   * {@link down} generates a downward movement path
   * @param px Length of the movement path in pixels
   */
  down(px: number): Promise<Point[]>;
  /**
   * {@link left} generates a leftward movement path
   * @param px Length of the movement path in pixels
   */
  left(px: number): Promise<Point[]>;
  /**
   * {@link right} generates a rightward movement path
   * @param px Length of the movement path in pixels
   */
  right(px: number): Promise<Point[]>;
  /**
   * {@link straightTo} generates a straight movement path to a given target {@link Point}
   * @param target The target {@link Point} to move towards
   */
  straightTo(target: Point | Promise<Point>): Promise<Point[]>;
  /**
   * {@link up} generates a upward movement path
   * @param px Length of the movement path in pixels
   */
  up(px: number): Promise<Point[]>;
}
