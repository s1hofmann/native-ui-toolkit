# nut.js (Native UI Toolkit) [![Build Status](https://travis-ci.com/nut-tree/nut.js.svg?branch=master)](https://travis-ci.com/nut-tree/nut.js) [![Build status](https://ci.appveyor.com/api/projects/status/iohwxc5t46gcuvby/branch/master?svg=true)](https://ci.appveyor.com/project/s1hofmann/nut-js/branch/master) [![SonarCloud badge](https://sonarcloud.io/api/project_badges/measure?project=nut-tree%3Anut.js&metric=alert_status)](https://sonarcloud.io/dashboard?id=nut-tree%3Anut.js) [![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=nut-tree%3Anut.js&metric=coverage)](https://sonarcloud.io/component_measures?id=nut-tree%3Anut.js&metric=coverage) [![Downloads per month](https://img.shields.io/npm/dm/@nut-tree/nut-js)](https://www.npmjs.com/package/@nut-tree/nut-js)
<p align="center">
Native UI testing / automation with node.js
</p>
<br/>
<p align="center">
	<a target="_blank" href="https://github.com/justadudewhohacks/opencv4nodejs">
		<img src="https://img.shields.io/badge/Built_with-opencv4nodejs-C86414.svg?style=flat-square" alt="Built with opencv4nodejs" /></a>
</p>

# About

<p align="center">
    <img src="https://github.com/nut-tree/nut.js/raw/master/.gfx/nut.png" alt="logo" width="200"/>
</p>

`nut.js` is a cross-platform native UI automation / testing tool.

It allows for native UI interactions via keyboard and / or mouse,
but additionally gives you the possibility to navigate the screen based on image matching.

# Sample

The following snippet shows a valid `nut.js` example (on macOS)

```js
"use strict";

const { keyboard, Key, mouse, left, right, up, down, screen } = require("@nut-tree/nut-js");

const square = async () => {
  await mouse.move(right(500));
  await mouse.move(down(500));
  await mouse.move(left(500));
  await mouse.move(up(500));
};

const openSpotlight = async () => {
  await keyboard.pressKey(Key.LeftSuper);
  await keyboard.pressKey(Key.Space);
  await keyboard.releaseKey(Key.Space);
  await keyboard.releaseKey(Key.LeftSuper);
};

describe("Basic test", () => {
  it("Should run a simple test", async () => {
    await square();
    await openSpotlight();
    await keyboard.type("calculator");
    await keyboard.type(Key.Return);
  });
});

```

# Installation

`nut.js` comes with a pre-built version of OpenCV for your respective target platform.
In order to use these pre-compiled bindings, certain runtime conditions have to be met.

## Prerequisites

This section lists runtime requirements for `nut.js` on the respective target platform.
`nut.js` is built and tested against node 10 and later as well as Electron 4 and later, so in order to use `nut.js` please make sure to use one of these versions.

#### Windows

In order to install `nut.js` on Windows, please make sure to have the [Microsoft Visual C++ Redistributable](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads) installed.

#### macOS

On macOS, Xcode command line tools are required.
You can install them by running
```bash
xcode-select --install
```

#### Linux

Depending on your distribution, Linux setups may differ.

In general, `nut.js` requires

- libXtst

Installation on `*buntu` distributions:
```bash
sudo apt-get install libxtst-dev
```

Setups on other distributions might differ.

## Manual build

As a fallback, `nut.js` is able to build all required dependencies by itself.
To do so, some setup is required on the respective target platform.

#### Windows

In order to install `nut.js` on Windows, [Windows Build Tools](https://www.microsoft.com/en-us/download/details.aspx?id=48159) and [Python 2](https://www.python.org/downloads/windows/) are required.
You can either set them up manually, or install them via npm:

```bash
npm install --global windows-build-tools
```

or

```bash
yarn global add windows-build-tools
```

#### macOS

On macOS, Xcode command line tools are required.
You can install them by running
```bash
xcode-select --install
```

#### Linux

Depending on your distribution, Linux setups may differ.

In general, `nut.js` requires

- Python 2
- g++
- make
- libXtst
- libPng

Installation on `*buntu` distributions:
```bash
sudo apt-get install build-essential python libxtst-dev libpng++-dev
```

Setups on other distributions might differ.

For reference, please see:
 
- [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs#how-to-install)
- [robotjs](http://robotjs.io/docs/building)

## Install `nut.js`

Running 

```bash
npm i @nut-tree/nut-js
```

or

```bash
yarn add @nut-tree/nut-js
```

will install `nut.js` and its required dependencies.

### Snapshot releases

`nut.js` also provides snapshot releases which allows to test upcoming features.

Running 

```bash
npm i @nut-tree/nut-js@next
```

or

```bash
yarn add @nut-tree/nut-js@next
```

will install the most recent development release of `nut.js`.

**Attention**: While snapshot releases are great to work with upcoming features before a new stable release, it is still a snapshot release.
Please bear in mind that things might change and / or break on snapshot releases, so it is not recommended using them in production.

### Usage with Electron

`nut.js` in combination with Electron requires bindings built for use with Electron.
`nut.js` does provide such bindings and e.g. [electron-rebuild](https://www.npmjs.com/package/electron-rebuild) makes installation a breeze.

Besides installing `nut.js` via

```bash
npm i @nut-tree/nut-js
```

or

```bash
yarn add @nut-tree/nut-js
```

we also install `electron-rebuild` as a `devDependency`:

```bash
npm i -D electron-rebuild
```

or 

```bash
yarn add -D electron-rebuild
```

Next, we add a `rebuild` script to our `package.json`:

```json
{
    ...
    "scripts": {
        ...
        "start": "electron app.js",
        "rebuild": "electron-rebuild"
    },
    ...,
}
```

Now all we have to do is run `npm run rebuild` and `electron-rebuild` will fetch the appropriate bindings for our Electron version.
Currently `nut.js` provides bindings for all ABI version to work with Electron v4.x up to 8.x

# Examples

[nut-tree/trailmix](https://github.com/nut-tree/trailmix) contains a set of ready to use examples which demo the usage ot nut.js.

# Modules

This list gives an overview on currently implemented and planned functionality.
It's work in progress and will undergo constant modification.

## Clipboard

- [x] Copy text to clipboard
- [x] Paste text from clipboard

## Keyboard

- [x] Support for standard US keyboard layout
- [x] Support for German special characters

## Mouse

- [x] Support for mouse movement
- [x] Support for mouse scroll
- [x] Configurable movement speed
- [x] Mouse drag

## Process

- [ ] Retrieve the region of a process window

## Screen

- [x] findOnScreen
- [x] waitFor
- [x] Hooks to trigger actions based on images
- [x] Highlighting screen regions

## Integration

- [x] Jest
