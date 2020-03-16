# nut.js change log

All notable changes to this project will be documented in this file.

## 1.3.2

- Enhancement: Revisit mouse speed settings [(#85)](https://github.com/nut-tree/nut.js/issues/85)

## 1.3.1

- Bugfix: Wrong result size for scaled image search [(#68)](https://github.com/nut-tree/nut.js/issues/68)
- Enhancement: Switch from robotjs to libnut [(#86)](https://github.com/nut-tree/nut.js/issues/86)
- Enhancement: Update to OpenCV4 [(#89)](https://github.com/nut-tree/nut.js/issues/89)
- Enhancement: Enable matrix builds [(#13)](https://github.com/nut-tree/nut.js/issues/13)

## 1.3.0

- Enhancement: Enabled prebuilt bindings for OpenCV [(#77)](https://github.com/nut-tree/nut.js/issues/77)

## 1.2.1

- Enhancement: Exported `Button` enum [(#75)](https://github.com/nut-tree/nut.js/issues/75)

## 1.2.0

- Bugfix: Drag & drop gestures were not working on macOS and Windows [(#70)](https://github.com/nut-tree/nut.js/issues/70)
- Enhancement: `mouse` Public API now exposes `pressButton` and `releaseButton` methods [(#69)](https://github.com/nut-tree/nut.js/issues/69)

## 1.1.2

- Bugfix: Clipboard copy calls did not resolve [(#64)](https://github.com/nut-tree/nut.js/issues/64)

## 1.1.1

- Minor version upgrade for OpenCV dependency

## 1.1.0

- Feature: nut.js now comes with a precompiled version of OpenCV [(#63)](https://github.com/nut-tree/nut.js/issues/63)

## 1.0.1

- Bugfix: Check dimensions of ROIs to prevent access violations [(#57)](https://github.com/nut-tree/nut.js/issues/57)

## 1.0.0

- API overhaul [(#53)](https://github.com/nut-tree/nut.js/issues/53)
- `find` hooks [(#51)](https://github.com/nut-tree/nut.js/issues/51)
- `screen.waitFor` [(#49)](https://github.com/nut-tree/nut.js/issues/49)
- Code cleanup [(#47)](https://github.com/nut-tree/nut.js/issues/47)

## 0.1.0-beta.3

- Improved error handling on image search

## 0.1.0-beta.2

- Changed default `screen.config.resourceDirectory` to use `process.cwd()`

## 0.1.0-beta.1

- Enabled pre-built OpenCV bindings via `opencv4nodejs-prebuilt`