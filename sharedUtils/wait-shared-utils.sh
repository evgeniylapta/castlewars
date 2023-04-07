#!/bin/bash

text="Waiting for shared utils"

while [ ! -d "/sharedUtils/dist" ]
do
  echo "$text"
  sleep 1
done

# Database is ready, continue
>&2 echo "Shared utils is ready - continuing"
