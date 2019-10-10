import * as cv from "opencv4nodejs-prebuilt";
import { Image } from "../../image.class";
import { Region } from "../../region.class";

function scaleROI(roi: Region, scale: { scaleX?: number, scaleY?: number }): Region {
  const scaleX = scale.scaleX || 1.0;
  const scaleY = scale.scaleY || 1.0;
  return new Region(roi.left, roi.top, roi.width * scaleX, roi.height * scaleY);
}

function determineROI(img: Image, roi: Region): cv.Rect {
  return new cv.Rect(
    Math.min(Math.max(roi.left, 0), img.width),
    Math.min(Math.max(roi.top, 0), img.height),
    Math.min(roi.width, img.width - roi.left),
    Math.min(roi.height, img.height - roi.top));
}

export class ImageProcessor {
  /**
   * fromImageWithAlphaChannel should provide a way to create a library specific
   * image with alpha channel from an abstract Image object holding raw data and image dimension
   *
   * @param {Image} img The input Image
   * @param {Region} [roi] An optional Region to specify a ROI
   * @returns {Promise<any>} An image
   * @memberof VisionProviderInterface
   */
  public static async fromImageWithAlphaChannel(
    img: Image,
    roi?: Region,
  ): Promise<cv.Mat> {
    const mat = await new cv.Mat(img.data, img.height, img.width, cv.CV_8UC4).cvtColorAsync(cv.COLOR_BGRA2BGR);
    if (roi) {
      return mat.getRegion(determineROI(img, scaleROI(roi, img.pixelDensity))).copyAsync();
    } else {
      return mat.copyAsync();
    }
  }

  /**
   * fromImageWithoutAlphaChannel should provide a way to create a library specific
   * image without alpha channel from an abstract Image object holding raw data and image dimension
   *
   * @param {Image} img The input Image
   * @param {Region} [roi] An optional Region to specify a ROI
   * @returns {Promise<any>} An image
   * @memberof VisionProviderInterface
   */
  public static async fromImageWithoutAlphaChannel(
    img: Image,
    roi?: Region,
  ): Promise<cv.Mat> {
    const mat = new cv.Mat(img.data, img.height, img.width, cv.CV_8UC3);
    if (roi) {
      return mat.getRegion(determineROI(img, scaleROI(roi, img.pixelDensity))).copyAsync();
    } else {
      return mat.copyAsync();
    }
  }

  /**
   * slice returns a ROI of an input image
   * @param img Input image to slice
   * @param roi Region of interest which will be sliced out
   */
  public static async slice(
    img: Image,
    roi: Region,
  ): Promise<Image> {
    let mat: cv.Mat;
    if (img.hasAlphaChannel) {
      mat = await ImageProcessor.fromImageWithAlphaChannel(img, roi);
    } else {
      mat = await ImageProcessor.fromImageWithoutAlphaChannel(img, roi);
    }
    return new Image(mat.cols, mat.rows, mat.getData(), mat.channels, img.pixelDensity);
  }
}
