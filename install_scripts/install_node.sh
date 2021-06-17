#!/usr/bin/env bash
# Installs Node.js LTS(v14.x) on Ubuntu(xenial)
# Reference (https://github.com/nodesource/distributions/blob/master/README.md#debinstall)
# Note : if this is a fresh install make sure you npm install in applications folder
# > to load all neccessary dependencies
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
