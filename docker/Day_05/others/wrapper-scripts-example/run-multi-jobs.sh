#!/bin/bash

# Start the first process
./counting.sh &

# Start the second process
./helping.sh &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?