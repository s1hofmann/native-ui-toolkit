import {LocationParameters} from "./search-parameters.class";
import {Region} from "./region.class";
import {Screen} from "./screen.class";

export class Assert {
    constructor(private screen: Screen) {
    }

    public async isVisible(pathToNeedle: string, searchRegion?: Region, confidence?: number) {
        try {
            await this.screen.find(
                pathToNeedle,
                {searchRegion, confidence} as LocationParameters,
            );
        } catch (err) {
            if (searchRegion !== undefined) {
                throw new Error(
                    `Element '${pathToNeedle}' not found in region ${searchRegion.toString()}`,
                );
            } else {
                throw new Error(`Element '${pathToNeedle}' not found`);
            }
        }
    }

    public async notVisible(pathToNeedle: string, searchRegion?: Region, confidence?: number) {
        try {
            await this.screen.find(
                pathToNeedle,
                {searchRegion, confidence} as LocationParameters,
            );
        } catch (err) {
            return;
        }
        throw new Error(`'${pathToNeedle}' is visible`);
    }
}
