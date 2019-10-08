#!/usr/bin/env bash
set -e

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get -y -o Dpkg::Options::="--force-confnew" install docker-ce
docker pull s1hofmann/nut-ci:latest
docker run -it -d --name nut-ci --user $(id -u):$(id -g) -v ${PWD}:${PWD}:rw s1hofmann/nut-ci:latest bash