#!/bin/bash
npm install || exit 1
npm run build || exit 1

ARCHIVE="../aydo_plugin_empty_$1.zip"

rm -r -f ./release
mkdir -p ./release
mkdir -p ./release/plugins
cp ./dist/*.js ./release/plugins
cp ./src/*.json ./release/plugins
cd ./release
rm "$ARCHIVE"
zip -u -r -q "$ARCHIVE" ./plugins

if [ "$2" != "" ]; then
  echo "Copy to server: $2"
  scp "$ARCHIVE" "$2"
fi
