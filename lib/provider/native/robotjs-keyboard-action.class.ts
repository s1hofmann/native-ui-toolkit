import robot = require("@nut-tree/libnut");
import { Key } from "../../key.enum";
import { KeyboardActionProvider } from "./keyboard-action-provider.interface";

export class KeyboardAction implements KeyboardActionProvider {

  public static KeyLookupMap = new Map<Key, string | null>([
    [Key.A, "a"],
    [Key.B, "b"],
    [Key.C, "c"],
    [Key.D, "d"],
    [Key.E, "e"],
    [Key.F, "f"],
    [Key.G, "g"],
    [Key.H, "h"],
    [Key.I, "i"],
    [Key.J, "j"],
    [Key.K, "k"],
    [Key.L, "l"],
    [Key.M, "m"],
    [Key.N, "n"],
    [Key.O, "o"],
    [Key.P, "p"],
    [Key.Q, "q"],
    [Key.R, "r"],
    [Key.S, "s"],
    [Key.T, "t"],
    [Key.U, "u"],
    [Key.V, "v"],
    [Key.W, "w"],
    [Key.X, "x"],
    [Key.Y, "y"],
    [Key.Z, "z"],

    [Key.F1, "f1"],
    [Key.F2, "f2"],
    [Key.F3, "f3"],
    [Key.F4, "f4"],
    [Key.F5, "f5"],
    [Key.F6, "f6"],
    [Key.F7, "f7"],
    [Key.F8, "f8"],
    [Key.F9, "f9"],
    [Key.F10, "f10"],
    [Key.F11, "f11"],
    [Key.F12, "f12"],

    [Key.Num0, "0"],
    [Key.Num1, "1"],
    [Key.Num2, "2"],
    [Key.Num3, "3"],
    [Key.Num4, "4"],
    [Key.Num5, "5"],
    [Key.Num6, "6"],
    [Key.Num7, "7"],
    [Key.Num8, "8"],
    [Key.Num9, "9"],
    [Key.NumPad0, "numpad_0"],
    [Key.NumPad1, "numpad_1"],
    [Key.NumPad2, "numpad_2"],
    [Key.NumPad3, "numpad_3"],
    [Key.NumPad4, "numpad_4"],
    [Key.NumPad5, "numpad_5"],
    [Key.NumPad6, "numpad_6"],
    [Key.NumPad7, "numpad_7"],
    [Key.NumPad8, "numpad_8"],
    [Key.NumPad9, "numpad_9"],

    [Key.Space, "space"],
    [Key.Escape, "escape"],
    [Key.Tab, "tab"],
    [Key.LeftAlt, "alt"],
    [Key.LeftControl, "control"],
    [Key.RightAlt, "alt"],
    [Key.RightControl, "control"],

    [Key.LeftShift, "shift"],
    [Key.LeftSuper, "command"],
    [Key.RightShift, "space"],
    [Key.RightSuper, "command"],

    [Key.Grave, "~"],
    [Key.Minus, "-"],
    [Key.Equal, "="],
    [Key.Backspace, "backspace"],
    [Key.LeftBracket, "["],
    [Key.RightBracket, "]"],
    [Key.Backslash, "\\"],
    [Key.Semicolon, ";"],
    [Key.Quote, "'"],
    [Key.Return, "enter"],
    [Key.Comma, ","],
    [Key.Period, "."],
    [Key.Slash, "/"],

    [Key.Left, "left"],
    [Key.Up, "up"],
    [Key.Right, "right"],
    [Key.Down, "down"],

    [Key.Print, "printscreen"],
    [Key.Pause, null],
    [Key.Insert, "insert"],
    [Key.Delete, null],
    [Key.Home, "home"],
    [Key.End, "end"],
    [Key.PageUp, "pageup"],
    [Key.PageDown, "pagedown"],

    [Key.Add, null],
    [Key.Subtract, null],
    [Key.Multiply, null],
    [Key.Divide, null],
    [Key.Decimal, null],
    [Key.Enter, "enter"],

    [Key.CapsLock, null],
    [Key.ScrollLock, null],
    [Key.NumLock, null],
  ]);

  public static keyLookup(key: Key): any {
    return this.KeyLookupMap.get(key);
  }

  private static mapModifierKeys(...keys: Key[]): string[] {
    return keys
      .map(modifier => KeyboardAction.keyLookup(modifier))
      .filter(modifierKey => modifierKey != null && modifierKey.length > 1);
  }

  private static key(key: Key, event: "up" | "down", ...modifiers: Key[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const nativeKey = KeyboardAction.keyLookup(key);
        const modifierKeys = this.mapModifierKeys(...modifiers);
        if (nativeKey) {
          robot.keyToggle(nativeKey, event, modifierKeys);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  constructor() {
  }

  public type(input: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        robot.typeString(input);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public click(...keys: Key[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        keys.reverse();
        const [key, ...modifiers] = keys;
        const nativeKey = KeyboardAction.keyLookup(key);
        const modifierKeys = KeyboardAction.mapModifierKeys(...modifiers);
        if (nativeKey) {
          robot.keyTap(nativeKey, modifierKeys);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public pressKey(...keys: Key[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        keys.reverse();
        const [key, ...modifiers] = keys;
        await KeyboardAction.key(key, "down", ...modifiers);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public releaseKey(...keys: Key[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        keys.reverse();
        const [key, ...modifiers] = keys;
        await KeyboardAction.key(key, "up", ...modifiers);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public setKeyboardDelay(delay: number): void {
    robot.setKeyboardDelay(delay);
  }
}
