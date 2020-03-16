import { NativeAdapter } from "./adapter/native.adapter.class";
import { MovementApi } from "./movement-api.interface";
import { Point } from "./point.class";
import { LineHelper } from "./util/linehelper.class";

export const createMovementApi = (native: NativeAdapter, lineHelper: LineHelper): MovementApi => {
  return ({
    down: async (px: number): Promise<Point[]> => {
      const pos = await native.currentMousePosition();
      return lineHelper.straightLine(pos, new Point(pos.x, pos.y + px));
    },
    left: async (px: number): Promise<Point[]> => {
      const pos = await native.currentMousePosition();
      return lineHelper.straightLine(pos, new Point(pos.x - px, pos.y));
    },
    right: async (px: number): Promise<Point[]> => {
      const pos = await native.currentMousePosition();
      return lineHelper.straightLine(pos, new Point(pos.x + px, pos.y));
    },
    straightTo: async (target: Point | Promise<Point>): Promise<Point[]> => {
      const targetPoint = await target;
      const origin = await native.currentMousePosition();
      return lineHelper.straightLine(origin, targetPoint);
    },
    up: async (px: number): Promise<Point[]> => {
      const pos = await native.currentMousePosition();
      return lineHelper.straightLine(pos, new Point(pos.x, pos.y - px));
    },
  });
};
