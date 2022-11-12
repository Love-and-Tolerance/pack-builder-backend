#!/usr/bin/env bash

git pull
rm -rf addons
./pull.sh
./run.sh
