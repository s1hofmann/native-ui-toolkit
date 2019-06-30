import { join, normalize } from "path";
import { cwd } from "process";
import { VisionAdapter } from "./adapter/vision.adapter.class";
import { FileType } from "./file-type.enum";
import { generateOutputPath } from "./generate-output-path.function";
import { LocationParameters } from "./locationparameters.class";
import { MatchRequest } from "./match-request.class";
import { MatchResult } from "./match-result.class";
import { OCRResult } from "./provider/ocr/ocr-result.interface";
import { Region } from "./region.class";
import { timeout } from "./util/poll-action.function";

export type FindHookCallback = (target: MatchResult) => Promise<void>;

export class Screen {
  public config = {
    confidence: 0.99,
    resourceDirectory: cwd(),
    textConfidence: 0.7,
  };

  constructor(
    private vision: VisionAdapter,
    private findHooks: Map<string, FindHookCallback[]> = new Map<string, FindHookCallback[]>()) {
  }

  public width() {
    return this.vision.screenWidth();
  }

  public height() {
    return this.vision.screenHeight();
  }

  public async find(
    pathToNeedle: string,
    params?: LocationParameters,
  ): Promise<Region> {
    const minMatch = (params && params.confidence) || this.config.confidence;
    const searchRegion =
      (params && params.searchRegion) || await this.vision.screenSize();

    const fullPathToNeedle = normalize(join(this.config.resourceDirectory, pathToNeedle));

    return new Promise<Region>(async (resolve, reject) => {
      try {
        const screenImage = await this.vision.grabScreen();

        const matchRequest = new MatchRequest(
          screenImage,
          fullPathToNeedle,
          searchRegion,
          minMatch,
        );

        const matchResult = await this.vision.findOnScreenRegion(matchRequest);
        if (matchResult.confidence >= minMatch) {
          const possibleHooks = this.findHooks.get(pathToNeedle) || [];
          for (const hook of possibleHooks) {
            await hook(matchResult);
          }
          resolve(matchResult.location);
        } else {
          reject(
            `No match for ${pathToNeedle}. Required: ${minMatch}, given: ${
              matchResult.confidence
              }`,
          );
        }
      } catch (e) {
        reject(
          `Searching for ${pathToNeedle} failed. Reason: '${e}'`,
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
    return new Promise<Region>(async (resolve, reject) => {
      try {
        const currentScreen = await this.vision.grabScreenRegion(searchRegion);
        const findings = await this.vision.readWords(currentScreen);
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
        const currentScreen = await this.vision.grabScreenRegion(target);
        const text = await this.vision.readText(currentScreen);
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

  public async waitFor(
    pathToNeedle: string,
    timeoutMs: number = 5000,
    params?: LocationParameters,
  ): Promise<Region> {
    return timeout(500, timeoutMs, () => this.find(pathToNeedle, params));
  }

  public on(pathToNeedle: string, callback: FindHookCallback) {
    const existingHooks = this.findHooks.get(pathToNeedle) || [];
    this.findHooks.set(pathToNeedle, [...existingHooks, callback]);
  }

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
