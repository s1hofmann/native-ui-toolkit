#!/usr/bin/env bash
set -e

echo $PWD

docker exec nut-ci bash -c "bash $PWD/.build/build.sh ${PWD} ${NODE_VERSION}"
