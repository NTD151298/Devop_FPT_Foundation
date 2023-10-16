#!/bin/bash

set -m

# Start the first process and put it in the background
./counting.sh &

# Start the second process and leave it in the foreground
./helping.sh

# When the second process returns, bring the first process to the foreground
fg %1