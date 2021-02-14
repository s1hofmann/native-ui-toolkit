import { Image } from "./image.class";
import { Region } from "./region.class";

export class MatchRequest {
  constructor(
    public readonly haystack: Image,
    public readonly needleId: string,
    public readonly needleData: Buffer,
    public readonly searchRegion: Region,
    public readonly confidence: number,
    public readonly searchMultipleScales: boolean = true,
  ) {}
}
