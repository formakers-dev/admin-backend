#!/bin/bash
git checkout $1 2>/dev/null || git checkout -b $1

### start of getting version
VERSION="$(jq -r '.version' ./package.json)"
if [ "$VERSION" == "0.0.0" ]
then
  VERSION="dev"
else
  VERSION="v$VERSION"
fi
echo "add deploy for $VERSION"
### end of getting version

git config --global user.email "appbee1018@gmail.com"
git config --global user.name "AppBee Admin"

cp .gitignore .gitignore_original
### [For only admin-backend] fcm topic api 사용을 위하여...
sed -i '/firebase-service-account.json/d' .gitignore
git add firebase-service-account.json && git commit -m "add deploy for $VERSION"
mv .gitignore_original .gitignore
