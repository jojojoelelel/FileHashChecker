#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <file_path>"
  exit 1
fi

file_path="$1"

# Calculate and print the MD5 hash (md5sum) of the file
md5sum_value=$(md5sum "$file_path" | awk '{print $1}')
echo "$md5sum_value"