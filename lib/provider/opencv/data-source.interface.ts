/**
 * A DataSource should provide methods to load data
 *
 * @interface DataSource
 */
export interface DataSource {
  /**
   * load will load image data from disk
   * @param path Absolute path to output file
   */
  load(path: string): Promise<any>;
  decode(data: Buffer): Promise<any>;
}
