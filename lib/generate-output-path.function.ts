import { join, parse } from "path";
import { cwd } from "process";
import { FileType } from "./file-type.enum";

/**
 * {@link generateOutputPath} is used to assemble full file path from a filename and various parameters
 * @param filename The base filename
 * @param params A config object which allows to configure {@link FileType}, base path, filename prefix and filename postfix
 */
export const generateOutputPath = (
  filename: string,
  params?: {
    type?: FileType,
    path?: string,
    prefix?: string,
    postfix?: string
  }
) => {
  const name = parse(filename).name;
  const imageType = (params && params.type) ? params.type : FileType.PNG;
  const path = (params && params.path) ? params.path : cwd();
  const prefix = (params && params.prefix) ? params.prefix : "";
  const postfix = (params && params.postfix) ? params.postfix : "";
  return join(path, `${prefix}${name}${postfix}${imageType}`);
};
