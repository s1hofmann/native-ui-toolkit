declare module "tesseract.js" {

  import { File } from "@babel/types";
  export type ImageLike = string | File | Buffer | { width: number, height: number, data: any };

  export interface WorkerOptions {
    workerPath: string;
    langPath: string;
    corePath: string;
  }

  export function create(options: WorkerOptions): TesseractWorker;

  export class TesseractWorker {
    constructor(options?: WorkerOptions);

    public recognize(image: ImageLike, options?: any): TesseractJob;

    public detect(image: ImageLike, options?: any): TesseractJob;

    public terminate(): void;
  }

  export interface Progress {
    status: string;
    progress: number;
    loaded?: number;
  }

  export interface Block {
    paragraphs: Paragraph;
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    blocktype: string;
    polygon: any;
    page: Page;
    lines: Line[];
    words: Word[];
    symbols: Symbol[];
  }

  export interface Baseline {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    has_baseline: boolean;
  }

  export interface Bbox {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }

  export interface Line {
    words: Word[];
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    paragraph: Paragraph;
    block: Block;
    page: Page;
    symbols: Symbol[];
  }

  export interface Paragraph {
    lines: Line[];
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    is_ltr: boolean;
    block: Block;
    page: Page;
    words: Word[];
    symbols: Symbol[];
  }

  export interface Symbol {
    choices: Choice[];
    image: any;
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    is_superscript: boolean;
    is_subscript: boolean;
    is_dropcap: boolean;
    word: Word;
    line: Line;
    paragraph: Paragraph;
    block: Block;
    page: Page;
  }

  export interface Choice {
    text: string;
    confidence: number;
  }

  export interface Word {
    symbols: Symbol[];
    choices: Choice[];
    text: string;
    confidence: number;
    baseline: Baseline;
    bbox: Bbox;
    is_numeric: boolean;
    in_dictionary: boolean;
    direction: string;
    language: string;
    is_bold: boolean;
    is_italic: boolean;
    is_underlined: boolean;
    is_monospace: boolean;
    is_serif: boolean;
    is_smallcaps: boolean;
    font_size: number;
    font_id: number;
    font_name: string;
    line: Line;
    paragraph: Paragraph;
    block: Block;
    page: Page;
  }

  export interface Page {
    blocks: Block[];
    confidence: number;
    html: string;
    lines: Line[];
    oem: string;
    paragraphs: Paragraph[];
    psm: string;
    symbols: Symbol[];
    text: string;
    version: string;
    words: Word[];
  }

  export interface TesseractJob {
    then: (callback: (result: Page) => void) => TesseractJob;
    progress: (callback: (progress: Progress) => void) => TesseractJob;
    catch: (callback: (error: Error) => void) => TesseractJob;
    finally: (callback: (resultOrError: Error | Page) => void) => TesseractJob;
    error?: (error: Error) => TesseractJob;
  }
}
