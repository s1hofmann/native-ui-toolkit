import * as cv from "opencv4nodejs-prebuilt";
import * as path from "path";
import {Image} from "../../image.class";
import {MatchRequest} from "../../match-request.class";
import {MatchResult} from "../../match-result.class";
import {Region} from "../../region.class";
import {ScaledMatchResult} from "../../scaled-match-result.class";
import {DataSource} from "./data-source.interface";
import {determineScaledSearchRegion} from "./determine-searchregion.function";
import {FinderInterface} from "./finder.interface";
import {ImageReader} from "./image-reader.class";
import {matchImages} from "./match-image.function";
import {scaleImage} from "./scale-image.function";
import {scaleLocation} from "./scale-location.function";
import {fromImageWithAlphaChannel, fromImageWithoutAlphaChannel} from "./image-processor.class";

async function loadNeedle(image: Image): Promise<cv.Mat> {
    if (image.hasAlphaChannel) {
        return fromImageWithAlphaChannel(image);
    }
    return fromImageWithoutAlphaChannel(image);
}

async function loadHaystack(matchRequest: MatchRequest): Promise<cv.Mat> {
    const searchRegion = determineScaledSearchRegion(matchRequest);
    if (matchRequest.haystack.hasAlphaChannel) {
        return fromImageWithAlphaChannel(
            matchRequest.haystack,
            searchRegion,
        );
    } else {
        return fromImageWithoutAlphaChannel(
            matchRequest.haystack,
            searchRegion,
        );
    }
}

function debugImage(image: cv.Mat, filename: string, suffix?: string) {
    const parsedPath = path.parse(filename);
    let fullFilename = parsedPath.name;
    if (suffix) {
        fullFilename = fullFilename + "_" + suffix;
    }
    fullFilename += parsedPath.ext;
    const fullPath = path.join(parsedPath.dir, fullFilename);
    cv.imwriteAsync(fullPath, image);
}

// function debugResult(image: cv.Mat, result: MatchResult, filename: string, suffix?: string) {
//   const roiRect = new cv.Rect(
//     Math.min(Math.max(result.location.left, 0), image.cols),
//     Math.min(Math.max(result.location.top, 0), image.rows),
//     Math.min(result.location.width, image.cols - result.location.left),
//     Math.min(result.location.height, image.rows - result.location.top));
//   debugImage(image.getRegion(roiRect), filename, suffix);
// }

function isValidSearch(needle: cv.Mat, haystack: cv.Mat): boolean {
    return (needle.cols <= haystack.cols) && (needle.rows <= haystack.rows);
}

function createResultForInvalidSearch (currentScale: number) {
    return new ScaledMatchResult(0,
        currentScale,
        new Region(
            0,
            0,
            0,
            0
        ),
        new Error("The provided image sample is larger than the provided search region")
    )
}

export default class TemplateMatchingFinder implements FinderInterface {
    private initialScale = [1.0];
    private scaleSteps = [0.9, 0.8, 0.7, 0.6, 0.5];

    constructor(
        private source: DataSource = new ImageReader(),
    ) {
    }

    public async findMatches(matchRequest: MatchRequest, debug: boolean = false): Promise<ScaledMatchResult[]> {
        let needle: cv.Mat;
        try {
            const needleInput = await this.source.decode(matchRequest.needleData);
            needle = await loadNeedle(needleInput);
        } catch (e) {
            throw new Error(
                `Failed to load ${matchRequest.needleId}. Reason: '${e}'.`,
            );
        }
        if (!needle || needle.empty) {
            throw new Error(
                `Failed to load ${matchRequest.needleId}, got empty image.`,
            );
        }
        const haystack = await loadHaystack(matchRequest);

        if (debug) {
            debugImage(needle, "input_needle.png");
            debugImage(haystack, "input_haystack.png");
        }

        const matchResults = this.initialScale.map(
            async (currentScale) => {
                if (!isValidSearch(needle, haystack)) {
                    return createResultForInvalidSearch(currentScale);
                }
                const matchResult = await matchImages(haystack, needle);
                return new ScaledMatchResult(matchResult.confidence, currentScale, matchResult.location);
            }
        );

        if (matchRequest.searchMultipleScales) {
            matchResults.push(...this.searchMultipleScales(needle, haystack))
        }

        return Promise.all(matchResults).then(results => {
            results.forEach(matchResult => {
                matchResult.location.left /= matchRequest.haystack.pixelDensity.scaleX;
                matchResult.location.width /= matchRequest.haystack.pixelDensity.scaleX;
                matchResult.location.top /= matchRequest.haystack.pixelDensity.scaleY;
                matchResult.location.height /= matchRequest.haystack.pixelDensity.scaleY;
            });
            return results.sort(
                (first, second) => second.confidence - first.confidence,
            );
        });
    }

    public async findMatch(matchRequest: MatchRequest, debug: boolean = false): Promise<MatchResult> {
        const matches = await this.findMatches(matchRequest, debug);
        const potentialMatches = matches
            .filter(match => match.confidence >= matchRequest.confidence);
        if (potentialMatches.length === 0) {
            matches.sort((a, b) => a.confidence - b.confidence);
            const bestMatch = matches.pop();
            if (bestMatch) {
                if(bestMatch.error) {
                    throw bestMatch.error
                }else {
                    throw new Error(`No match with required confidence ${matchRequest.confidence}. Best match: ${bestMatch.confidence} at ${bestMatch.location}`)
                }
            } else {
                throw new Error(`Unable to locate ${matchRequest.needleId}, no match!`);
            }
        }
        return potentialMatches[0];
    }

    private searchMultipleScales(needle: cv.Mat, haystack: cv.Mat) {
        const scaledNeedleResult = this.scaleSteps.map(
            async (currentScale) => {
                const scaledNeedle = await scaleImage(needle, currentScale);
                if (!isValidSearch(scaledNeedle, haystack)) {
                    return createResultForInvalidSearch(currentScale);
                }
                const matchResult = await matchImages(haystack, scaledNeedle);
                return new ScaledMatchResult(
                    matchResult.confidence,
                    currentScale,
                    matchResult.location,
                );
            }
        );
        const scaledHaystackResult = this.scaleSteps.map(
            async (currentScale) => {
                const scaledHaystack = await scaleImage(haystack, currentScale);
                if (!isValidSearch(needle, scaledHaystack)) {
                    return createResultForInvalidSearch(currentScale);
                }
                const matchResult = await matchImages(scaledHaystack, needle);
                return new ScaledMatchResult(
                    matchResult.confidence,
                    currentScale,
                    scaleLocation(
                        matchResult.location,
                        currentScale
                    )
                );
            }
        );
        return [...scaledHaystackResult, ...scaledNeedleResult];
    }
}
