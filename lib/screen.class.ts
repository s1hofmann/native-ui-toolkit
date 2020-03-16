import { join, normalize } from "path";
import { cwd } from "process";
import { VisionAdapter } from "./adapter/vision.adapter.class";
import { FileType } from "./file-type.enum";
import { generateOutputPath } from "./generate-output-path.function";
import { ImageMatchRequest } from "./image-match-request.class";
import { LocationParameters } from "./locationparameters.class";
import { MatchResult } from "./match-result.class";
import { OCRResult } from "./provider/ocr/ocr-result.interface";
import { Region } from "./region.class";
import { timeout } from "./util/poll-action.function";
import { ImageProcessor } from "./provider/opencv/image-processor.class";

export type FindHookCallback = (target: MatchResult) => Promise<void>;

/**
 * {@link Screen} class provides methods to access screen content of a systems main display
 */
export class Screen {

  /**
   * Config object for {@link Screen} class
   */
  public config = {
    /**
     * Configures the required matching percentage for template images to be declared as a match
     */
    confidence: 0.99,

    /**
     * Configures the path from which template images are loaded from
     */
    resourceDirectory: cwd(),
    textConfidence: 0.7,
  };

  /**
   * {@link Screen} class constructor
   * @param vision {@link VisionAdapter} instance which bundles access to screen and / or computer vision related APIs
   * @param findHooks A {@link Map} of {@link FindHookCallback} methods assigned to a template image filename
   */
  constructor(
    private vision: VisionAdapter,
    private findHooks: Map<string, FindHookCallback[]> = new Map<string, FindHookCallback[]>()) {
  }

  /**
   * {@link width} returns the main screen width
   * This refers to the hardware resolution.
   * Screens with higher pixel density (e.g. retina displays in MacBooks) might have a higher width in in actual pixels
   */
  public width() {
    return this.vision.screenWidth();
  }

  /**
   * {@link height} returns the main screen height
   * This refers to the hardware resolution.
   * Screens with higher pixel density (e.g. retina displays in MacBooks) might have a higher height in in actual pixels
   */
  public height() {
    return this.vision.screenHeight();
  }

  /**
   * {@link find} will search for a template image on a systems main screen
   * @param templateImageFilename Filename of the template image, relative to {@link Screen.config.resourceDirectory}
   * @param params {@link LocationParameters} which are used to fine tune search region and / or match confidence
   */
  public async find(
    templateImageFilename: string,
    params?: LocationParameters,
  ): Promise<Region> {
    const minMatch = (params && params.confidence) || this.config.confidence;
    const searchRegion =
      (params && params.searchRegion) || await this.vision.screenSize();

    const fullPathToNeedle = normalize(join(this.config.resourceDirectory, templateImageFilename));

    return new Promise<Region>(async (resolve, reject) => {
      try {
        const screenImage = await this.vision.grabScreen();

        const matchRequest = new ImageMatchRequest(
          screenImage,
          fullPathToNeedle,
          searchRegion,
          minMatch,
        );

        const matchResult = await this.vision.findOnScreenRegion(matchRequest);
        if (matchResult.confidence >= minMatch) {
          const possibleHooks = this.findHooks.get(templateImageFilename) || [];
          for (const hook of possibleHooks) {
            await hook(matchResult);
          }
          resolve(matchResult.location);
        } else {
          reject(
            `No match for ${templateImageFilename}. Required: ${minMatch}, given: ${
              matchResult.confidence
            }`,
          );
        }
      } catch (e) {
        reject(
          `Searching for ${templateImageFilename} failed. Reason: '${e}'`,
        );
      }
    });
  }

  public async findText(
    searchText: string,
    params?: LocationParameters
  ): Promise<Region> {
    const minMatch = (params && params.confidence) || this.config.textConfidence;
    const searchRegion =
      (params && params.searchRegion) || await this.vision.screenSize();
    const currentScreen = await this.vision.grabScreen();
    return new Promise<Region>(async (resolve, reject) => {
      try {
        // const inputImage = await ImageProcessor.threshold(
        // const inputImage = await ImageProcessor.rescale(
        const inputImage = await ImageProcessor.slice(
          currentScreen,
          searchRegion
        );
        // , {x: 2, y: 2});
        // );
        const findings = await this.vision.readWords(
          inputImage
        );
        console.log(findings);
        const filteredResults = findings
          .filter(finding => finding.confidence >= minMatch)
          .filter(finding => finding.text.indexOf(searchText) > -1)
          .sort((finding1: OCRResult, finding2: OCRResult) => finding2.confidence - finding1.confidence);
        if (filteredResults.length < 1) {
          reject(`Failed to detect valid match for ${searchText} with confidence ${minMatch} in ${searchRegion}`);
        } else {
          resolve(filteredResults[0].boundingBox);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async readText(
    target: Region
  ) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const currentScreen = await this.vision.grabScreen();
        const inputImage = await ImageProcessor.slice(
          currentScreen,
          target
        );
        const text = await this.vision.readText(
          inputImage
        );
        if (!text || text.length === 0) {
          reject(`Failed to extract text from ${target}`);
        } else {
          resolve(text);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * {@link waitFor} searches for a template image for a specified duration
   * @param templateImageFilename Filename of the template image, relative to {@link Screen.config.resourceDirectory}
   * @param timeoutMs Timeout in milliseconds after which {@link waitFor} fails
   * @param params {@link LocationParameters} which are used to fine tune search region and / or match confidence
   */
  public async waitFor(
    templateImageFilename: string,
    timeoutMs: number = 5000,
    params?: LocationParameters,
  ): Promise<Region> {
    return timeout(500, timeoutMs, () => this.find(templateImageFilename, params));
  }

  /**
   * {@link on} registeres a callback which is triggered once a certain template image is found
   * @param templateImageFilename Template image to trigger the callback on
   * @param callback The {@link FindHookCallback} function to trigger
   */
  public on(templateImageFilename: string, callback: FindHookCallback) {
    const existingHooks = this.findHooks.get(templateImageFilename) || [];
    this.findHooks.set(templateImageFilename, [...existingHooks, callback]);
  }

  /**
   * {@link capture} captures a screenshot of a systems main display
   * @param fileName Basename for the generated screenshot
   * @param fileFormat The {@link FileType} for the generated screenshot
   * @param filePath The output path for the generated screenshot (Default: {@link cwd})
   * @param fileNamePrefix Filename prefix for the generated screenshot (Default: empty)
   * @param fileNamePostfix Filename postfix for the generated screenshot (Default: empty)
   */
  public async capture(
    fileName: string,
    fileFormat: FileType = FileType.PNG,
    filePath: string = cwd(),
    fileNamePrefix: string = "",
    fileNamePostfix: string = ""): Promise<string> {
    const outputPath = generateOutputPath(fileName, {
      path: filePath,
      postfix: fileNamePostfix,
      prefix: fileNamePrefix,
      type: fileFormat,
    });

    const currentScreen = await this.vision.grabScreen();
    await this.vision.saveImage(currentScreen, outputPath);
    return outputPath;
  }
}
