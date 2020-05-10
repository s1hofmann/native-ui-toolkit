import {ImageMatchRequest} from "../match-request.class";
import {Image} from "../image.class";
import {MatchResult} from "../match-result.class";
import {ScreenAction} from "../provider/native/libnut-screen-action.class";
import {ScreenActionProvider} from "../provider/native/screen-action-provider.interface";
import {Language} from "../provider/ocr/language.enum";
import {OCRResult} from "../provider/ocr/ocr-result.interface";
import {TesseractReader} from "../provider/ocr/tesseract-reader.class";
import {TextReader} from "../provider/ocr/text-reader.interface";
import {DataSink} from "../provider/opencv/data-sink.interface";
import {FinderInterface} from "../provider/opencv/finder.interface";
import {ImageWriter} from "../provider/opencv/image-writer.class";
import {TemplateMatchingFinder} from "../provider/opencv/template-matching-finder.class";
import {Region} from "../region.class";

export interface VisionAdapterConfig {
    finder?: FinderInterface;
    screen?: ScreenActionProvider;
    screenReader?: TextReader;
    dataSink?: DataSink;
}

/**
 * {@link VisionAdapter} serves as an abstraction layer for all image based interactions.
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
     * {@link grabScreen} will return an {@link Image} containing the current screen image
     *
     * @returns An {@link Image} which will contain screenshot data as well as dimensions
     */
    public grabScreen(): Promise<Image> {
        return this.screen.grabScreen();
    }

    /**
     * {@link grabScreenRegion} essentially does the same as grabScreen, but only returns a specified {@link Region}
     *
     * @param region The screen {@link Region} we want to grab
     * @returns An {@link Image} which will contain screenshot data of the specified {@link Region} as well as dimensions
     */
    public grabScreenRegion(region: Region): Promise<Image> {
        return this.screen.grabScreenRegion(region);
    }

    /**
     * {@link highlightScreenRegion} highlights a screen {@link Region} for a given duration by overlaying it with an opaque window
     *
     * @param region The {@link Region} to highlight
     * @param duration The highlight duration
     * @param opacity Overlay opacity
     */
    public highlightScreenRegion(region: Region, duration: number, opacity: number): Promise<void> {
        return this.screen.highlightScreenRegion(region, duration, opacity);
    }

    /**
     * {@link findOnScreenRegion} will search for a given pattern inside a {@link Region} of the main screen
     * If multiple possible occurrences are found, the one with the highest probability is returned.
     * For matchProbability < 0.99 the search will be performed on grayscale images.
     *
     * @param {ImageMatchRequest} matchRequest A match request which holds all required matching data
     * @returns {Promise<MatchResult>} MatchResult will contain location and probability of a possible match
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
     * {@link screenWidth} returns the main screens width as reported by the OS.
     * Please notice that on e.g. Apples Retina display the reported width
     * and the actual pixel size may differ
     *
     * @returns The main screens width as reported by the OS
     */
    public screenWidth(): Promise<number> {
        return this.screen.screenWidth();
    }

    /**
     * {@link screenHeight} returns the main screens height as reported by the OS.
     * Please notice that on e.g. Apples Retina display the reported width
     * and the actual pixel size may differ
     *
     * @returns The main screens height as reported by the OS
     */
    public screenHeight(): Promise<number> {
        return this.screen.screenHeight();
    }

    /**
     * {@link screenSize} returns a {@link Region} object with the main screens size.
     * Please note that on e.g. Apples Retina display the reported width
     * and the actual pixel size may differ
     *
     * @returns A {@link Region} object representing the size of a systems main screen
     */
    public screenSize(): Promise<Region> {
        return this.screen.screenSize();
    }

    /**
     * {@link saveImage} saves an {@link Image} to a given path on disk.
     *
     * @param image The {@link Image} to store
     * @param path The path where to store the image
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
        return this.screenReader.readText(image, language);
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
