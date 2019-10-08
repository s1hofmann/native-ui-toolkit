#!/usr/bin/env bash
set -e

echo $PWD

npm ci
npm run compile
npm test
