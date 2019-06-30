import { Region } from "../../region.class";

export interface OCRResult {
  text: string;
  boundingBox: Region;
  confidence: number;
}
