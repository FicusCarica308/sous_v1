#!/bin/bash
# installs mongoDB on a linux(ubuntu) system (xenial)
# > installs mongoDB community server
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# if upon error where gnupg is not installed run below command and then then weget command again
# sudo apt-get install gnupg

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# adjusts ulimit values for mongoDB operations
# ulimit settings (https://docs.mongodb.com/manual/reference/ulimit/)

# to be continued -------

# mongoDB cheatsheet (https://gist.github.com/bradtraversy/f407d642bdc3b31681bc7e56d95485b6)
