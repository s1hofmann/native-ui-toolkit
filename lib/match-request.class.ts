import {Image} from "./image.class";
import {Region} from "./region.class";

export type MatchImage = "match-image";
export type MatchText = "match-text";

export type MatchRequestKind = MatchImage | MatchText;

export abstract class MatchRequest {
    abstract kind: MatchRequestKind;
}

export class ImageMatchRequest extends MatchRequest {
    kind: MatchRequestKind = "match-image";

    constructor(
        public readonly haystack: Image,
        public readonly pathToNeedle: string,
        public readonly searchRegion: Region,
        public readonly confidence: number,
        public readonly searchMultipleScales: boolean = true,
    ) {
        super();
    }
}

export class TextMatchRequest extends MatchRequest {
    kind: MatchRequestKind = "match-text";

    constructor(
        public readonly haystack: Image,
        public readonly searchText: string,
        public readonly searchRegion: Region,
        public readonly confidence: number
    ) {
        super();
    }
}
