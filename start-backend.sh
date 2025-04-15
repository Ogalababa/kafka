#!/bin/bash

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

cd "$HOME/backend"
pm2 start index.js --name backend-server

