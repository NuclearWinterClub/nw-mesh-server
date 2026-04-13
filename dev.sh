#!/bin/bash
# Nuclear Winter — Dev Server Launcher
# Loads .env.dev vars into the shell environment, then starts the server.
# dotenv/dotenvx inside server.js will see these vars already set and won't override them.

set -a  # auto-export all variables
source .env.dev
set +a

node server.js
