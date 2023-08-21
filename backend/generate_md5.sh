#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <file_path>"
  exit 1
fi

file_path=$1

if [ ! -f "$file_path" ]; then
  echo "Error: File not found: $file_path"
  exit 1
fi

md5sum "$file_path"
