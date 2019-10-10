import { ImageMatchRequest } from "../image-match-request.class";
import { Image } from "../image.class";
import { MatchResult } from "../match-result.class";
import { ScreenAction } from "../provider/native/robotjs-screen-action.class";
import { ScreenActionProvider } from "../provider/native/screen-action-provider.interface";
import { Language } from "../provider/ocr/language.enum";
import { OCRResult } from "../provider/ocr/ocr-result.interface";
import { TesseractReader } from "../provider/ocr/tesseract-reader.class";
import { TextReader } from "../provider/ocr/text-reader.interface";
import { DataSink } from "../provider/opencv/data-sink.interface";
import { FinderInterface } from "../provider/opencv/finder.interface";
import { ImageWriter } from "../provider/opencv/image-writer.class";
import { TemplateMatchingFinder } from "../provider/opencv/template-matching-finder.class";
import { Region } from "../region.class";

export interface VisionAdapterConfig {
  finder?: FinderInterface;
  screen?: ScreenActionProvider;
  screenReader?: TextReader;
  dataSink?: DataSink;
}

/**
 * VisionAdapter serves as an abstraction layer for all image based interactions.
 *
 * This allows to provide a high level interface for image based actions,
 * without having to spread (possibly) multiple dependencies all over the code.
 * All actions which involve screenshots / images are bundled in this adapter.
 */
export class VisionAdapter {

  private dataSink: DataSink;
  private finder: FinderInterface;
  private screen: ScreenActionProvider;
  private screenReader: TextReader;

  constructor(config?: VisionAdapterConfig) {
    this.dataSink = (config && config.dataSink) || new ImageWriter();
    this.finder = (config && config.finder) || new TemplateMatchingFinder();
    this.screen = (config && config.screen) || new ScreenAction();
    this.screenReader = (config && config.screenReader) || new TesseractReader();
  }

  /**
   * grabScreen will return an Image containing the current screen image
   *
   * @returns {Promise<Image>} Image will contain screenshot data as well as dimensions
   * @memberof VisionAdapter
   */
  public grabScreen(): Promise<Image> {
    return this.screen.grabScreen();
  }

  /**
   * grabScreenRegion essentially does the same as grabScreen, but only returns a specified Region
   *
   * @param {Region} region The screen region we want to grab
   * @returns {Promise<Image>} Image will contain screenshot data of the specified region as well as dimensions
   * @memberof VisionAdapter
   */
  public grabScreenRegion(region: Region): Promise<Image> {
    return this.screen.grabScreenRegion(region);
  }

  /**
   * findOnScreenRegion will search for a given pattern inside a region of an image.
   * If multiple possible occurences are found, the one with the highes probability is returned.
   * For matchProbability < 0.99 the search will be performed on grayscale images.
   *
   * @param {ImageMatchRequest} matchRequest A match request which holds all required matching data
   * @returns {Promise<MatchResult>} MatchResult will contain location and probability of a possible match
   * @memberof VisionAdapter
   */
  public async findOnScreenRegion(
    matchRequest: ImageMatchRequest,
  ): Promise<MatchResult> {
    return new Promise<MatchResult>(async (resolve, reject) => {
      try {
        const matchResult = await this.finder.findMatch(matchRequest);
        resolve(matchResult);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * screenWidth returns the main screen's width as reported by the OS.
   * Please notice that on e.g. Apples Retina display the reported width
   * and the actual pixel size may differ
   *
   * @returns {Promise<number>} The main screen's width as reported by the OS
   * @memberof VisionAdapter
   */
  public screenWidth(): Promise<number> {
    return this.screen.screenWidth();
  }

  /**
   * screenHeight returns the main screen's height as reported by the OS.
   * Please notice that on e.g. Apples Retina display the reported width
   * and the actual pixel size may differ
   *
   * @returns {Promise<number>} The main screen's height as reported by the OS
   * @memberof VisionAdapter
   */
  public screenHeight(): Promise<number> {
    return this.screen.screenHeight();
  }

  /**
   * screenSize returns a Region object with the main screen's size.
   * Please notice that on e.g. Apples Retina display the reported width
   * and the actual pixel size may differ
   *
   * @returns {Promise<Region>} The Region object the size of your main screen
   * @memberof VisionAdapter
   */
  public screenSize(): Promise<Region> {
    return this.screen.screenSize();
  }

  /**
   * saveImage saves an Image to a given path on disk.
   *
   * @param image The Image to store
   * @param path The storage path
   * @memberof VisionAdapter
   */
  public saveImage(image: Image, path: string): Promise<void> {
    return (this.dataSink as ImageWriter).store(image, path);
  }

  /**
   * readText extracts the full text from a given image in a specified language
   * @param image The image which text should be extracted from
   * @param language The language used for text extraction, defaults to english
   * @memberof VisionAdapter
   */
  public readText(image: Image, language: Language = Language.ENG): Promise<string> {
    return this.screenReader.readPage(image, language);
  }

  /**
   * readWords extracts a list of @link OCRResults recognized from an input image
   * @param image The image which text should be extracted from
   * @param language The language used for text extraction, defaults to english
   * @return Promise<OCRResult[]> List of OCRResults holding the word text, its confidence and its bounding box
   * @memberof VisionAdapter
   */
  public readWords(image: Image, language: Language = Language.ENG): Promise<OCRResult[]> {
    return this.screenReader.readWords(image, language);
  }
}
